import React from 'react';

const ConversionButton = ({ fileContent, processing, onConvert }) => {
  const lineCount = fileContent ? fileContent.split('\n').filter(line => line.trim()).length : 0;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* File Info Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #86efac',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
          }}>
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#065f46',
              margin: 0,
              lineHeight: 1.3
            }}>
              ✓ File loaded successfully
            </p>
            <p style={{
              fontSize: '13px',
              color: '#047857',
              margin: 0,
              lineHeight: 1.3
            }}>
              {lineCount} lines ready to process
            </p>
          </div>
        </div>
        
        {/* Lines Badge */}
        <div style={{
          padding: '8px 16px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #86efac',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {lineCount}
          </span>
          <span style={{
            fontSize: '12px',
            color: '#6b7280',
            marginLeft: '4px'
          }}>
            lines
          </span>
        </div>
      </div>

      {/* Convert Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!processing && fileContent) {
            onConvert();
          }
        }}
        disabled={processing || !fileContent}
        style={{
          width: '100%',
          padding: '20px',
          background: processing 
            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: processing ? 'not-allowed' : 'pointer',
          boxShadow: processing 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            : '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          transform: processing ? 'none' : 'translateY(0)'
        }}
        onMouseEnter={(e) => {
          if (!processing && fileContent) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(59, 130, 246, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (!processing && fileContent) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.4)';
          }
        }}
      >
        {/* Animated gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: processing ? 'translateX(-100%)' : 'translateX(100%)',
          animation: processing ? 'shimmer 1.5s infinite' : 'none'
        }}></div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          {processing ? (
            <>
              <div className="spinner" style={{
                width: '24px',
                height: '24px',
                borderWidth: '3px',
                borderColor: 'white',
                borderTopColor: 'transparent'
              }}></div>
              <span>Processing {lineCount} records...</span>
            </>
          ) : (
            <>
              <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Convert to HTML</span>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </div>
      </button>

      {/* Processing Steps (shown when processing) */}
      {processing && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '12px',
          border: '1px solid #bae6fd'
        }} className="animate-fade-in">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div className="spinner" style={{
              width: '16px',
              height: '16px',
              borderWidth: '2px',
              borderColor: '#3b82f6',
              borderTopColor: 'transparent'
            }}></div>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#0369a1'
            }}>
              Processing your data...
            </span>
          </div>
          <div style={{ paddingLeft: '28px' }}>
            <p style={{
              fontSize: '13px',
              color: '#0c4a6e',
              margin: '4px 0',
              lineHeight: 1.5
            }}>
              ✓ Cleaning CSV data
            </p>
            <p style={{
              fontSize: '13px',
              color: '#0c4a6e',
              margin: '4px 0',
              lineHeight: 1.5
            }}>
              ✓ Applying punctuation rules
            </p>
            <p style={{
              fontSize: '13px',
              color: '#0c4a6e',
              margin: '4px 0',
              lineHeight: 1.5
            }}>
              ⏳ Generating HTML output...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionButton;