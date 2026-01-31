import React, { useState } from 'react';

const OutputDisplay = ({ outputHTML, onCopy, onDownload }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  if (!outputHTML) return null;

  const recordCount = (outputHTML.match(/<doctypehtml/g) || []).length;

  const handleCopy = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onDownload();
  };

  const handleTabClick = (tab, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveTab(tab);
  };

  return (
    <div style={{ marginTop: '32px' }} className="animate-fade-in-up">
      {/* Success Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        borderRadius: '16px 16px 0 0',
        border: '2px solid #86efac',
        borderBottom: 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
          }}>
            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#065f46',
              margin: 0,
              lineHeight: 1.3
            }}>
              ✨ Conversion Complete!
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#047857',
              margin: 0,
              lineHeight: 1.3
            }}>
              Successfully processed {recordCount} records
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: copied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
              color: copied ? 'white' : '#374151',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
          >
            {copied ? (
              <>
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Copied!</span>
              </>
            ) : (
              <>
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px'
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Download Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '8px',
        background: '#f9fafb',
        border: '2px solid #e5e7eb',
        borderTop: 'none'
      }}>
        <button
          type="button"
          onClick={(e) => handleTabClick('html', e)}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'html' 
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
              : 'white',
            color: activeTab === 'html' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeTab === 'html' ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          HTML Output
        </button>
        <button
          type="button"
          onClick={(e) => handleTabClick('preview', e)}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'preview' 
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
              : 'white',
            color: activeTab === 'preview' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeTab === 'preview' ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
      </div>

      {/* Content Area */}
      <div style={{
        background: 'white',
        border: '2px solid #e5e7eb',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden'
      }}>
        {activeTab === 'html' ? (
          <div style={{
            padding: '0',
            maxHeight: '500px',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Line Numbers Background */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '50px',
              background: '#f3f4f6',
              borderRight: '2px solid #e5e7eb',
              userSelect: 'none',
              pointerEvents: 'none'
            }}>
              {outputHTML.split('\n').map((_, index) => (
                <div key={index} style={{
                  padding: '0 8px',
                  fontSize: '12px',
                  color: '#9ca3af',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  lineHeight: '1.5',
                  height: '22px'
                }}>
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <pre style={{
              margin: 0,
              padding: '16px 16px 16px 66px',
              background: '#1f2937',
              color: '#10b981',
              fontSize: '13px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {outputHTML}
            </pre>
          </div>
        ) : (
          <div style={{
            padding: '24px',
            maxHeight: '500px',
            overflow: 'auto',
            background: '#fafafa'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
                HTML Preview
              </h4>
              <div 
                dangerouslySetInnerHTML={{ __html: outputHTML }} 
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-around',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#3b82f6',
            margin: 0
          }}>
            {recordCount}
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0
          }}>
            Records
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#8b5cf6',
            margin: 0
          }}>
            {outputHTML.split('\n').length}
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0
          }}>
            Lines
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#10b981',
            margin: 0
          }}>
            {Math.round(outputHTML.length / 1024)}KB
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0
          }}>
            Size
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay;