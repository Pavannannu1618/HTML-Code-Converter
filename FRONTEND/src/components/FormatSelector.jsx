import React from 'react';

/**
 * FormatSelector Component
 * 
 * Displays all available format options (12 formats total)
 * Groups formats for better organization
 */
const FormatSelector = ({ selectedFormat, onFormatSelect }) => {
  // Format groups for better organization
  const formatGroups = {
    'Standard Formats': [
      { id: 'bookpage', name: 'Book Page', description: '4 fields: Name, Address, Extra, Link' },
      { id: '2rows', name: '2 Rows', description: '2 fields per record' },
      { id: '4rows', name: '4 Rows', description: '4 fields per record' },
      { id: 'website', name: 'Website', description: '4 fields: Name1, Address, Name2, Website' }
    ],
    'Page Formats': [
      { id: 'page20000', name: '20000 Page', description: '3 fields: Details, Link, Address' },
      { id: 'page30000', name: '30000 Page', description: 'NEW - To be configured' },
      { id: 'page40000', name: '40000 Page', description: '3 fields: 2 Details + Link' },
      { id: 'mdpage', name: 'MD Page', description: '3 fields with spacing' },
      { id: 'adpage', name: 'AD Page', description: '3 fields: Name, Address, Link' }
    ],
    'Letter Formats': [
      { id: 'aformat', name: 'A Format', description: 'NEW - To be configured' },
      { id: 'bformat', name: 'B and C Format', description: 'NEW - To be configured' },
      { id: 'bwformat', name: 'BW and NW Format', description: 'NEW - To be configured' }
    ]
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select Format Type
      </h2>
      
      {Object.entries(formatGroups).map(([groupName, formats]) => (
        <div key={groupName} className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
            {groupName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => onFormatSelect(format.id)}
                className={`
                  relative p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }
                  ${format.description.includes('NEW') ? 'opacity-75' : ''}
                `}
              >
                {format.description.includes('NEW') && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white bg-green-500 rounded">
                    NEW
                  </span>
                )}
                <div className="font-semibold text-gray-800 mb-1">
                  {format.name}
                </div>
                <div className="text-sm text-gray-600">
                  {format.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedFormat && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {
              Object.values(formatGroups)
                .flat()
                .find(f => f.id === selectedFormat)?.name
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default FormatSelector;