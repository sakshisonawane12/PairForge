import { useState } from 'react';

export default function FileTabs({ files, activeFile, onSelect, onAdd, onDelete }) {
    const [showNewFile, setShowNewFile] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const getFileIcon = (fileName) => {
        if (fileName.endsWith('.py'))  return '🐍';
        if (fileName.endsWith('.js'))  return '🟨';
        if (fileName.endsWith('.java')) return '☕';
        if (fileName.endsWith('.cpp')) return '⚙️';
        if (fileName.endsWith('.ts'))  return '🔷';
        if (fileName.endsWith('.go'))  return '🐹';
        return '📄';
    };

    const getLanguageFromFileName = (fileName) => {
        if (fileName.endsWith('.py'))   return 'python';
        if (fileName.endsWith('.js'))   return 'javascript';
        if (fileName.endsWith('.java')) return 'java';
        if (fileName.endsWith('.cpp'))  return 'cpp';
        if (fileName.endsWith('.ts'))   return 'typescript';
        if (fileName.endsWith('.go'))   return 'go';
        return 'javascript';
    };

    const handleAddFile = (e) => {
        e.preventDefault();
        if (newFileName.trim()) {
            onAdd(newFileName.trim(),
                getLanguageFromFileName(newFileName.trim()));
            setNewFileName('');
            setShowNewFile(false);
        }
    };

    return (
        <div className="bg-[#161b22] border-b border-[#30363d] flex items-center overflow-x-auto">
            {files.map((file) => (
                <div key={file.id}
                     className={`flex items-center gap-1 px-3 py-2 text-xs cursor-pointer border-r border-[#30363d] whitespace-nowrap group ${
                         activeFile?.id === file.id
                             ? 'bg-[#0d1117] text-white border-t-2 border-t-[#238636]'
                             : 'text-gray-400 hover:text-white hover:bg-[#0d1117]'
                     }`}
                     onClick={() => onSelect(file)}>
                    <span>{getFileIcon(file.fileName)}</span>
                    <span>{file.fileName}</span>
                    {files.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(file.fileName);
                            }}
                            className="ml-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400">
                            ✕
                        </button>
                    )}
                </div>
            ))}

            {showNewFile ? (
                <form onSubmit={handleAddFile}
                      className="flex items-center px-2">
                    <input
                        autoFocus
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="filename.py"
                        className="bg-[#0d1117] border border-[#238636] rounded px-2 py-1 text-white text-xs w-28 focus:outline-none"
                        onBlur={() => {
                            if (!newFileName) setShowNewFile(false);
                        }}
                    />
                    <button type="submit"
                            className="ml-1 text-green-400 text-xs">✓</button>
                    <button type="button"
                            onClick={() => setShowNewFile(false)}
                            className="ml-1 text-red-400 text-xs">✕</button>
                </form>
            ) : (
                <button
                    onClick={() => setShowNewFile(true)}
                    className="px-3 py-2 text-gray-500 hover:text-white text-xs whitespace-nowrap">
                    + New File
                </button>
            )}
        </div>
    );
}