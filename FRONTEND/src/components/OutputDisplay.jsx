import React from 'react';

const OutputDisplay = ({ 
  outputHTML, 
  onCopy, 
  onDownload 
}) => {
  if (!outputHTML) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          HTML Output
        </label>
        <div className="space-x-3">
          <button
            onClick={onCopy}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Copy HTML
          </button>
          <button
            onClick={onDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Download for Excel
          </button>
        </div>
      </div>
      <textarea
        value={outputHTML}
        readOnly
        className="w-full h-96 p-4 border-2 border-gray-300 rounded-xl font-mono text-sm bg-gray-50 focus:outline-none focus:border-blue-400"
      />
    </div>
  );
};

export default OutputDisplay;