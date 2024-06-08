import {
  EditorState,
  Editor,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
} from "draft-js";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FONTS } from "../components/atoms/font-select";
import { DocumentContext } from "./document-context";
import { ToastContext } from "./toast-context";
import useAuth from "../hooks/use-auth";
import SocketEvent from "../types/enums/socket-events-enum";
import DocumentInterface from "../types/interfaces/document";
import { io } from "socket.io-client";
import { BASE_URL } from "../services/api";
import { v4 as uuidv4 } from 'uuid';

// Import necessary modules and dependencies
interface EditorContextInterface {
  // Define the structure of the Editor Context
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  socket: null | MutableRefObject<any>;
  documentRendered: boolean;
  setDocumentRendered: Dispatch<SetStateAction<boolean>>;
  editorRef: null | MutableRefObject<null | Editor>;
  handleEditorChange: (editorState: EditorState) => void;
  focusEditor: () => void;
  currentFont: string;
  setCurrentFont: Dispatch<SetStateAction<string>>;
  startVoiceRecognition: () => void;
  stopVoiceRecognition: () => void;
  handleTranscript: (transcript: string) => void;
}

// Define default values for the Editor Context
const defaultValues: EditorContextInterface = {
  editorState: EditorState.createEmpty(),
  setEditorState: () => {},
  socket: null,
  documentRendered: false,
  setDocumentRendered: () => {},
  editorRef: null,
  handleEditorChange: () => {},
  focusEditor: () => {},
  currentFont: FONTS[0],
  setCurrentFont: () => {},
  startVoiceRecognition: () => {},
  stopVoiceRecognition: () => {},
  handleTranscript: () => {},
};

// Create the Editor Context
export const EditorContext = createContext<EditorContextInterface>(
  defaultValues
);

// Define the structure for the Editor Provider
interface EditorProviderInterface {
  children: JSX.Element;
}

// Set default save time and save interval variables
const DEFAULT_SAVE_TIME = 1500;
let saveInterval: null | NodeJS.Timeout = null;

// Implement the Editor Provider component
export const EditorProvider = ({ children }: EditorProviderInterface) => {
  // State and refs for managing editor-related functionalities
  const [editorState, setEditorState] = useState(
    defaultValues.editorState
  );
  const socket = useRef<any>(defaultValues.socket);
  const [documentRendered, setDocumentRendered] = useState(
    defaultValues.documentRendered
  );
  const editorRef = useRef<null | Editor>(defaultValues.editorRef);
  const [currentFont, setCurrentFont] = useState(
    defaultValues.currentFont
  );

  // Context and authentication hooks
  const {
    document,
    setCurrentUsers,
    setSaving,
    setDocument,
    saveDocument,
  } = useContext(DocumentContext);
  const { error } = useContext(ToastContext);
  const { accessToken } = useAuth();

  const {
    transcript,
  } = useSpeechRecognition();

  // Voice recognition functions
  // const startVoiceRecognition = () => {
  //   SpeechRecognition.startListening();
  //   handleTranscript(transcript);
  // };
  const [ listening, setListening ] = useState<boolean>(false);

  

  const startVoiceRecognition = () => {
    SpeechRecognition.startListening({ continuous: true });
    // Handle the transcript
    if (transcript) {
      console.log("Transcript:", transcript);
      handleTranscript(transcript); 
    }
  };
  
  

  const stopVoiceRecognition = () => {
    setListening(false);
    SpeechRecognition.stopListening();
  };

  const handleTranscript = (transcript: string) => {
    console.log("Handleeeeeeeeeeeee");
    const contentState = convertToRaw(editorState.getCurrentContent());
    const selectionState = editorState.getSelection();
  
    // Generate a unique key using UUID
    const uniqueKey = uuidv4();
  
    // Create a new ContentState with the transcript appended
    const newContentState = convertFromRaw({
      ...contentState,
      blocks: [
        ...contentState.blocks,
        {
          text: transcript,
          type: "unstyled",
          key: uniqueKey,
          data: {},
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
        },
      ],
    });

    
  
    // Create a new EditorState with the updated ContentState
    const newEditorState = EditorState.createWithContent(
      newContentState,
      null
    );
  
    // Set the selection back to where it was
    const newSelectionState = selectionState.merge({
      anchorKey: selectionState.getAnchorKey(),
      anchorOffset: selectionState.getAnchorOffset(),
      focusKey: selectionState.getFocusKey(),
      focusOffset: selectionState.getFocusOffset(),
      isBackward: false,
    });
  
    setEditorState(
      EditorState.forceSelection(newEditorState, newSelectionState)
    );
  };

  // Focus on the editor
  const focusEditor = () => {
    if (editorRef === null || editorRef.current === null) return;
    editorRef.current.focus();
  };

  // Send Changes function
  const handleEditorChange = (editorState: EditorState) => {
    // Move the selection to the end of the content
    setEditorState(EditorState.moveSelectionToEnd(editorState));

    // Emit changes via socket
    if (socket === null) return;
    const content = convertToRaw(editorState.getCurrentContent());
    socket.current.emit(SocketEvent.SEND_CHANGES, content);

    // Update the document and initiate saving

    const text = listening ? transcript : JSON.stringify(content)

    const updatedDocument = {
      ...document,
      content: text,
    } as DocumentInterface;
    setDocument(updatedDocument);

    // Check for content changes and start saving
    if (
      document === null ||
      JSON.stringify(content) === document.content
    )
      return;
    setSaving(true);

    // Clear previous save interval and set a new one
    if (saveInterval !== null) {
      clearInterval(saveInterval);
    }

    saveInterval = setInterval(async () => {
      await saveDocument(updatedDocument);
      if (saveInterval) clearInterval(saveInterval);
    }, DEFAULT_SAVE_TIME);
  };

  // Load document content on initial render
  useEffect(() => {
    if (
      documentRendered ||
      document === null ||
      document.content === null
    )
      return;

    // Parse and set the content
    try {
      const contentState = convertFromRaw(
        JSON.parse(document.content) as RawDraftContentState
      );
      const newEditorState = EditorState.createWithContent(
        contentState
      );
      setEditorState(
        EditorState.moveSelectionToEnd(newEditorState)
      );
    } catch {
      // Handle error when loading document
      error("Error when loading document.");
    } finally {
      setDocumentRendered(true);
    }
  }, [document]);

  // Connect to Socket on document change
  useEffect(() => {
    if (
      document === null ||
      accessToken === null ||
      socket === null ||
      (socket.current !== null && socket.current.connected)
    )
      return;

    // Connect to Socket with documentId and accessToken
    socket.current = io(BASE_URL, {
      query: { documentId: document.id, accessToken },
    }).connect();
  }, [document, socket, accessToken]);

  // Disconnect Socket on component unmount
  useEffect(() => {
    return () => {
      socket?.current?.disconnect();
    };
  }, []);

  // Receive Changes from Socket
  useEffect(() => {
    if (socket.current === null) return;

    const handler = (
      rawDraftContentState: RawDraftContentState
    ) => {
      const contentState = convertFromRaw(
        rawDraftContentState
      );
      const newEditorState = EditorState.createWithContent(
        contentState
      );
      setEditorState(
        EditorState.moveSelectionToEnd(newEditorState)
      );
    };

    socket.current.on(SocketEvent.RECEIVE_CHANGES, handler);

    return () => {
      socket.current.off(SocketEvent.RECEIVE_CHANGES, handler);
    };
  }, [socket.current]);

  // Update current users on Socket event
  useEffect(() => {
    if (socket.current === null) return;

    const handler = (currentUsers: Array<string>) => {
      setCurrentUsers(new Set<string>(currentUsers));
    };

    socket.current.on(
      SocketEvent.CURRENT_USERS_UPDATE,
      handler
    );

    return () => {
      socket.current.off(
        SocketEvent.CURRENT_USERS_UPDATE,
        handler
      );
    };
  }, [socket.current]);

  // Provide the Editor Context with required values
  return (
    <EditorContext.Provider
      value={{
        editorState,
        socket,
        documentRendered,
        setDocumentRendered,
        editorRef,
        currentFont,
        setEditorState,
        setCurrentFont,
        focusEditor,
        handleEditorChange,
        startVoiceRecognition,
        stopVoiceRecognition,
        handleTranscript,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
