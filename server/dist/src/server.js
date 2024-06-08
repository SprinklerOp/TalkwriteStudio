"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./index"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const document_service_1 = __importDefault(require("./services/document.service"));
const socket_events_enum_1 = __importDefault(require("./types/enums/socket-events-enum"));
const port = 8080;
// Create an HTTP server using the Express app
const server = http_1.default.createServer(index_1.default);
// Set up Socket.IO with CORS configuration
const io = new socket_io_1.Server(server, {
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
    const accessToken = socket.handshake.query.accessToken;
    const documentId = socket.handshake.query.documentId;
    // Disconnect if accessToken or documentId is missing
    if (!accessToken || !documentId)
        return socket.disconnect();
    else {
        // Verify the accessToken using the "access_token" secret
        jsonwebtoken_1.default.verify(accessToken, "access_token", (err, decoded) => {
            // Extract user information from the decoded token
            const { id, email } = decoded;
            // Set the username on the socket
            socket.username = email;
            // Find the document by its ID and owner ID
            document_service_1.default
                .findDocumentById(parseInt(documentId), parseInt(id))
                .then((document) => __awaiter(void 0, void 0, void 0, function* () {
                // Disconnect if the document is not found
                if (document === null)
                    return socket.disconnect();
                // Join the Socket.IO room corresponding to the documentId
                socket.join(documentId);
                // Fetch connected sockets in the room and update current users
                io.in(documentId)
                    .fetchSockets()
                    .then((clients) => {
                    io.sockets.in(documentId).emit(socket_events_enum_1.default.CURRENT_USERS_UPDATE, clients.map((client) => client.username));
                });
                // Listen for SEND_CHANGES event and broadcast changes to others in the room
                socket.on(socket_events_enum_1.default.SEND_CHANGES, (rawDraftContentState) => {
                    socket.broadcast
                        .to(documentId)
                        .emit(socket_events_enum_1.default.RECEIVE_CHANGES, rawDraftContentState);
                });
                // Listen for disconnect event and update current users on disconnect
                socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
                    socket.leave(documentId);
                    socket.disconnect();
                    // Fetch connected sockets in the room and update current users
                    io.in(documentId)
                        .fetchSockets()
                        .then((clients) => {
                        io.sockets.in(documentId).emit(socket_events_enum_1.default.CURRENT_USERS_UPDATE, clients.map((client) => client.username));
                    });
                }));
            }))
                .catch((error) => {
                console.log(error);
                return socket.disconnect();
            });
        });
    }
});
