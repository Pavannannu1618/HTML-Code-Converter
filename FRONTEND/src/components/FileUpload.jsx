import React from 'react';
import { Upload, Check } from 'lucide-react';

const FileUpload = ({ fileName, onFileUpload }) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Upload File
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="mx-auto text-gray-400 mb-3" size={48} />
        <input
          type="file"
          accept=".txt,.csv"
          onChange={onFileUpload}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <span className="text-blue-600 font-semibold hover:underline">
            Choose a file
          </span>
          <span className="text-gray-600"> or drag and drop</span>
        </label>
        <p className="text-sm text-gray-500 mt-2">TXT or CSV files</p>
        {fileName && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <Check size={20} className="mr-2" />
            <span className="font-medium">{fileName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;