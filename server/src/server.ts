import http from "http";
import app from "./index";
import { Server } from "socket.io";
import jwt, { VerifyErrors } from "jsonwebtoken";
import documentService from "./services/document.service";
import SocketEvent from "./types/enums/socket-events-enum";

const port = 8080;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  // Retrieve accessToken and documentId from the handshake query
  const accessToken = socket.handshake.query.accessToken as string | undefined;
  const documentId = socket.handshake.query.documentId as string | undefined;

  // Disconnect if accessToken or documentId is missing
  if (!accessToken || !documentId) return socket.disconnect();
  else {
    // Verify the accessToken using the "access_token" secret
    jwt.verify(
      accessToken,
      "access_token",
      (err: VerifyErrors | null, decoded: unknown) => {
        // Extract user information from the decoded token
        const { id, email } = decoded as RequestUser;

        // Set the username on the socket
        (socket as any).username = email;

        // Find the document by its ID and owner ID
        documentService
          .findDocumentById(parseInt(documentId), parseInt(id))
          .then(async (document) => {
            // Disconnect if the document is not found
            if (document === null) return socket.disconnect();

            // Join the Socket.IO room corresponding to the documentId
            socket.join(documentId);

            // Fetch connected sockets in the room and update current users
            io.in(documentId)
              .fetchSockets()
              .then((clients) => {
                io.sockets.in(documentId).emit(
                  SocketEvent.CURRENT_USERS_UPDATE,
                  clients.map((client) => (client as any).username)
                );
              });

            // Listen for SEND_CHANGES event and broadcast changes to others in the room
            socket.on(SocketEvent.SEND_CHANGES, (rawDraftContentState) => {
              socket.broadcast
                .to(documentId)
                .emit(SocketEvent.RECEIVE_CHANGES, rawDraftContentState);
            });

            // Listen for disconnect event and update current users on disconnect
            socket.on("disconnect", async () => {
              socket.leave(documentId);
              socket.disconnect();

              // Fetch connected sockets in the room and update current users
              io.in(documentId)
                .fetchSockets()
                .then((clients) => {
                  io.sockets.in(documentId).emit(
                    SocketEvent.CURRENT_USERS_UPDATE,
                    clients.map((client) => (client as any).username)
                  );
                });
            });
          })
          .catch((error) => {
            console.log(error);
            return socket.disconnect();
          });
      }
    );
  }
});
