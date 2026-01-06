import React from 'react';

const ConversionButton = ({ 
  fileContent, 
  processing, 
  onConvert 
}) => {
  if (!fileContent) {
    return (
      <div className="mb-8 text-center">
        <p className="text-orange-600 font-medium">
          ⚠️ File uploaded but content not loaded
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <button
        onClick={onConvert}
        disabled={processing}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Convert to HTML'}
      </button>
      <p className="text-sm text-green-600 mt-2">
        ✓ File loaded - {fileContent.split('\n').length} lines
      </p>
    </div>
  );
};

export default ConversionButton;