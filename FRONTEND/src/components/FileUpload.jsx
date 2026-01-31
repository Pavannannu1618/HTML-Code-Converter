import React, { useState } from 'react';

const FileUpload = ({ fileName, onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const mockEvent = {
        target: {
          files: files
        }
      };
      onFileUpload(mockEvent);
    }
  };

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Upload File
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          border: isDragging ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          background: isDragging 
            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' 
            : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {/* Animated Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
          pointerEvents: 'none'
        }}></div>

        {/* Upload Icon */}
        <div style={{
          position: 'relative',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: isDragging 
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
              : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            borderRadius: '50%',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <svg 
              style={{ 
                width: '40px', 
                height: '40px', 
                color: 'white',
                transform: isDragging ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'transform 0.3s ease'
              }} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
        </div>

        {/* File Selected or Upload Prompt */}
        {fileName ? (
          <div style={{ position: 'relative' }}>
            {/* Success State */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: '12px',
              marginBottom: '12px',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#065f46'
              }}>
                {fileName}
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Click to change file
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Upload Prompt */}
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {isDragging ? '🎯 Drop your file here!' : '📁 Choose a file or drag and drop'}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              TXT or CSV files only
            </p>
            
            {/* File Types */}
            <div style={{
              display: 'inline-flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{
                padding: '6px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280'
              }}>
                .CSV
              </span>
              <span style={{
                padding: '6px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280'
              }}>
                .TXT
              </span>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          id="fileInput"
          type="file"
          accept=".csv,.txt"
          onChange={onFileUpload}
          style={{ display: 'none' }}
        />

        {/* Decorative Corner Elements */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderRight: 'none',
          borderBottom: 'none',
          borderRadius: '8px 0 0 0',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderLeft: 'none',
          borderBottom: 'none',
          borderRadius: '0 8px 0 0',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderRight: 'none',
          borderTop: 'none',
          borderRadius: '0 0 0 8px',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderLeft: 'none',
          borderTop: 'none',
          borderRadius: '0 0 8px 0',
          opacity: 0.5
        }}></div>
      </div>

      {/* Helper Text */}
      <p style={{
        fontSize: '13px',
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Maximum file size: 10MB
      </p>
    </div>
  );
};

export default FileUpload;