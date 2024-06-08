import { EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Import Draft.js styles
import { useContext } from 'react';
import { EditorContext } from '../../../contexts/editor-context';
import IconButton from '../../atoms/icon-button/icon-button';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/outline';
import FontSelect from '../../atoms/font-select/font-select';
import { useNavigate } from 'react-router-dom';

const EditorToolbar = () => {
  let history = useNavigate();
  const {
    editorState,
    setEditorState,
    startVoiceRecognition,
    stopVoiceRecognition,
  } = useContext(EditorContext);

  const handleUndoBtnClick = () => {
    setEditorState(EditorState.undo(editorState));
  };

  const handleRedoBtnClick = () => {
    setEditorState(EditorState.redo(editorState));
  };

  const handleStartVoiceRecognition = () => {
    history('/speech');
  };

  const handleStopVoiceRecognition = () => {
    stopVoiceRecognition();
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className="w-full h-9 px-3 py-1 flex-shrink-0 flex items-center">
      <IconButton
        onClick={handleUndoBtnClick}
        icon={<ArrowLeftIcon className="h-4 w-4" />}
        tooltip="Undo"
      />
      <IconButton
        onClick={handleRedoBtnClick}
        icon={<ArrowRightIcon className="h-4 w-4" />}
        tooltip="Redo"
      />
      <div className="h-5 border-1 border-1-gray-300 mx-2"></div>
      <button
        onClick={() => toggleInlineStyle('BOLD')}
        className="mr-2 px-2 py-1 bg-gray-200 rounded"
      >
        <b>B</b>
      </button>
      <button
        onClick={() => toggleInlineStyle('ITALIC')}
        className="mr-2 px-2 py-1 bg-gray-200 rounded"
      >
        <i>I</i>
      </button>
      <button
        onClick={() => toggleInlineStyle('UNDERLINE')}
        className="mr-2 px-2 py-1 bg-gray-200 rounded"
      >
        <u>U</u>
      </button>
      <button
        onClick={() => toggleBlockType('unordered-list-item')}
        className="mr-2 px-2 py-1 bg-gray-200 rounded"
      >
        <ul>
          <li>•</li>
        </ul>
      </button>
      <button
        onClick={() => toggleBlockType('ordered-list-item')}
        className="mr-2 px-2 py-1 bg-gray-200 rounded"
      >
        <ol>
          <li>1.</li>
        </ol>
      </button>
      <FontSelect />
      <button onClick={handleStartVoiceRecognition} className="ml-4">
        <MicrophoneIcon className="h-4 w-4" />
      </button>
      <button onClick={handleStopVoiceRecognition} className="ml-2">
        <StopIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EditorToolbar;
