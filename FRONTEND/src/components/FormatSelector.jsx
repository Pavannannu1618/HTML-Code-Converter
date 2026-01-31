import React from 'react';

const FormatSelector = ({ selectedFormat, onFormatSelect }) => {
  const formats = [
    { 
      id: '2rows', 
      name: '2 Rows Format', 
      description: 'Code+Location, Name+Address',
      icon: '📄',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: '4rows', 
      name: '4 Rows Format', 
      description: 'Code, Location, Name, Address',
      icon: '📋',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'doubledouble', 
      name: 'Double Double Format', 
      description: 'Two sets of Name+Address pairs',
      icon: '🔄',
      badge: 'NEW',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'website', 
      name: 'Website Link Format', 
      description: 'Company info with website links',
      icon: '🌐',
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'bookpage', 
      name: 'Book Page Format', 
      description: 'Formatted for book layouts',
      icon: '📖',
      color: 'from-amber-500 to-orange-500'
    },
    { 
      id: 'page20000', 
      name: 'Page 20000 Format', 
      description: 'Specific page 20000 structure',
      icon: '📃',
      color: 'from-teal-500 to-cyan-500'
    },
    { 
      id: 'mdpage', 
      name: 'MD Page Format', 
      description: 'Maryland page format',
      icon: '📝',
      color: 'from-rose-500 to-pink-500'
    },
    { 
      id: 'page40000', 
      name: 'Page 40000 Format', 
      description: 'Specific page 40000 structure',
      icon: '📄',
      color: 'from-violet-500 to-purple-500'
    },
    { 
      id: 'adpage', 
      name: 'AD Page Format', 
      description: 'Advertisement page format',
      icon: '📰',
      color: 'from-sky-500 to-blue-500'
    },
    { 
      id: 'page30000', 
      name: 'Page 30000 Format', 
      description: 'Specific page 30000 structure',
      icon: '📑',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 'aformat', 
      name: 'A Format', 
      description: 'Format A structure',
      icon: '🅰️',
      color: 'from-red-500 to-orange-500'
    },
    { 
      id: 'bformat', 
      name: 'B/C Format', 
      description: 'Format B and C combined',
      icon: '🅱️',
      color: 'from-yellow-500 to-amber-500'
    },
    { 
      id: 'bwformat', 
      name: 'BW/NW Format', 
      description: 'Black/White and New/West formats',
      icon: '⚫',
      color: 'from-gray-500 to-slate-500'
    },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg style={{ width: '20px', height: '20px', color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Select Format
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {formats.map(format => (
          <button
            key={format.id}
            onClick={() => onFormatSelect(format.id)}
            style={{
              position: 'relative',
              padding: '20px',
              borderRadius: '16px',
              border: selectedFormat === format.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
              background: selectedFormat === format.id ? '#eff6ff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              boxShadow: selectedFormat === format.id 
                ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' 
                : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transform: selectedFormat === format.id ? 'translateY(-2px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedFormat !== format.id) {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedFormat !== format.id) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            {/* NEW Badge */}
            {format.badge && (
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'linear-gradient(to right, #10b981, #059669)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '9999px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {format.badge}
              </span>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              {/* Icon */}
              <div style={{
                fontSize: '32px',
                flexShrink: 0,
                lineHeight: 1
              }}>
                {format.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: selectedFormat === format.id ? '#1e40af' : '#1f2937',
                  marginBottom: '4px',
                  lineHeight: 1.3
                }}>
                  {format.name}
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: selectedFormat === format.id ? '#3b82f6' : '#6b7280',
                  lineHeight: 1.4,
                  margin: 0
                }}>
                  {format.description}
                </p>
              </div>

              {/* Checkmark */}
              {selectedFormat === format.id && (
                <div style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{ width: '14px', height: '14px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;