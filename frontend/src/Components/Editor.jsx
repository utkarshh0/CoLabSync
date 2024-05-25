import { useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { csharp } from '@replit/codemirror-lang-csharp';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { CODE_SNIPPETS } from './constants';
import { executeCode } from '../../../backend/api';
import PropTypes from 'prop-types';

const extensions = {
  javascript: [javascript({ jsx: true })],
  cpp: [cpp()],
  java: [java()],
  python: [python()],
  csharp: [csharp()],
  php: [php()]
};

export default function Editor({ socketRef, roomId, value, setValue }) {
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("Run the code...");
  const ignoreChange = useRef(false);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
  };

  const handleRun = async () => {
    if (!value.trim()) return;
    setOutput("Please Wait...");
    const res = await executeCode(language, value);
    setOutput(res);
  };

  const handleChange = (newValue) => {
    if (ignoreChange.current) {
      ignoreChange.current = false;
      return;
    }
    
    setValue(newValue);
    
    socketRef.current.emit('change', roomId, newValue);
 };


  return (
    <div className='h-full'>
      <div className='editor h-4/6 bg-[#1A1B26] overflow-scroll scrollbar-hidden'>
        <div className='flex justify-between'>
          <select
            className='bg-main text-textL p-2 m-2 rounded-md'
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">Javascript</option>
            <option value="java">Java</option>
            <option value="cpp">Cpp</option>
            <option value="python">Python</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
          </select>

          <button onClick={handleRun} className='bg-main text-textL w-20 h-10 border-2 border-main hover:border-slate-200 m-2 rounded-md'>
            Run
          </button>
        </div>

        <CodeMirror
          value={value}
          height="60%"
          theme={tokyoNight}
          extensions={extensions[language]}
          onChange={handleChange}
        />
      </div>

      <div className="output h-2/6 border-4 border-slate-700 p-4 text-slate-400 overflow-y-scroll">
        {output}
      </div>
    </div>
  );
}

Editor.propTypes = {
  socketRef: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};
