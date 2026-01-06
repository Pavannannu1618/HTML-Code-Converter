import React from 'react';
import { FileText } from 'lucide-react';

const FormatSelector = ({ selectedFormat, onFormatSelect }) => {
  const formats = [
    { id: '2rows', title: '2 Rows Format', description: 'Code+Location, Name+Address' },
    { id: '4rows', title: '4 Rows Format', description: 'CSV: Code, Location, Name, Address' },
    { id: 'website', title: 'Website Format', description: 'Name, Address, Name, Website' },
    { id: 'bookpage', title: 'Book Page Format', description: 'Address, Link' },
    { id: 'page20000', title: '20000 Page Format', description: 'Details, Link, Address' },
    { id: 'mdpage', title: 'MD Page Format', description: 'Details, Address, Address' },
    { id: 'page40000', title: '40000 Page Format', description: 'Details, Details, Link' },
    { id: 'adpage', title: 'AD Page Format', description: 'Name, Address, Link' }
  ];

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Select Format Type
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatSelect(format.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedFormat === format.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              <FileText 
                className={selectedFormat === format.id ? 'text-blue-500' : 'text-gray-400'} 
                size={28} 
              />
            </div>
            <h3 className="font-bold text-base mb-1">{format.title}</h3>
            <p className="text-xs text-gray-600">{format.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;