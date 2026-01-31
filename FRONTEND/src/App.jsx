import React, { useState, useEffect } from 'react';
import Login from './auth/Login.jsx';
import FormatSelector from './components/FormatSelector';
import FileUpload from './components/FileUpload';
import ConversionButton from './components/ConversionButton';
import OutputDisplay from './components/OutputDisplay';
import Toast from './components/Toast';

// Import format processors - ALL 13 FORMATS
import { process2RowsFormat } from './utils/formatProcessors/twoRowsProcessor';
import { process4RowsFormat } from './utils/formatProcessors/fourRowsProcessor';
import { processWebsiteFormat } from './utils/formatProcessors/websiteProcessor';
import { processBookPageFormat } from './utils/formatProcessors/bookPageProcessor';
import { processPage20000Format } from './utils/formatProcessors/page20000Processor';
import { processMDPageFormat } from './utils/formatProcessors/mdPageProcessor';
import { processPage40000Format } from './utils/formatProcessors/page40000Processor';
import { processADPageFormat } from './utils/formatProcessors/adPageProcessor';
import { processPage30000Format } from './utils/formatProcessors/page30000Processor';
import { processAFormat } from './utils/formatProcessors/aFormatProcessor';
import { processBCFormat } from './utils/formatProcessors/bcFormatProcessor';
import { processBWNWFormat } from './utils/formatProcessors/bwnwFormatProcessor';
import { processDoubleDoubleFormat } from './utils/formatProcessors/doubleDoubleProcessor';
import { cleanCSVForFormat } from './utils/csvCleaner.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [selectedFormat, setSelectedFormat] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [outputHTML, setOutputHTML] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // CHECK AUTHENTICATION ON MOUNT
  useEffect(() => {
    const authLocal = localStorage.getItem('isAuthenticated');
    const authSession = sessionStorage.getItem('isAuthenticated');
    const emailLocal = localStorage.getItem('userEmail');
    const emailSession = sessionStorage.getItem('userEmail');

    if (authLocal === 'true' || authSession === 'true') {
      setIsAuthenticated(true);
      setUserEmail(emailLocal || emailSession || '');
    }

    setIsCheckingAuth(false);
  }, []);

  // TOAST HELPER
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // AUTHENTICATION HANDLERS
  const handleLoginSuccess = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    
    setIsAuthenticated(false);
    setUserEmail('');
    setSelectedFormat('');
    setFileContent('');
    setOutputHTML('');
    setOutputData([]);
    setFileName('');
    
    showToast('👋 Logged out successfully!', 'info');
  };

  // FILE UPLOAD HANDLER
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    
    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        showToast('📁 File uploaded successfully!', 'success');
      };
      reader.readAsText(file);
    } else {
      showToast('❌ Please upload CSV or TXT files only', 'error');
    }
  };

  // PROCESS CONTENT - ALL 13 FORMATS
  const processContent = () => {
    if (!fileContent || !selectedFormat) return;
    
    setProcessing(true);
    
    setTimeout(() => {
      const cleanedContent = cleanCSVForFormat(fileContent, selectedFormat);
      const lines = cleanedContent.split('\n').filter(line => line.trim());
      
      let result;

      switch (selectedFormat) {
        case '2rows':
          result = process2RowsFormat(lines);
          break;
        case '4rows':
          result = process4RowsFormat(lines);
          break;
        case 'website':
          result = processWebsiteFormat(lines);
          break;
        case 'bookpage':
          result = processBookPageFormat(lines);
          break;
        case 'page20000':
          result = processPage20000Format(lines);
          break;
        case 'mdpage':
          result = processMDPageFormat(lines);
          break;
        case 'page40000':
          result = processPage40000Format(lines);
          break;
        case 'adpage':
          result = processADPageFormat(lines);
          break;
        case 'page30000':
          result = processPage30000Format(lines);
          break;
        case 'aformat':
          result = processAFormat(lines);
          break;
        case 'bformat':
          result = processBCFormat(lines);
          break;
        case 'bwformat':
          result = processBWNWFormat(lines);
          break;
        case 'doubledouble':
          result = processDoubleDoubleFormat(lines);
          break;
        default:
          result = { htmlOutput: '', dataArray: [] };
      }

      if (result) {
        setOutputHTML(result.htmlOutput);
        setOutputData(result.dataArray);
        showToast(`✨ Successfully processed ${result.dataArray.length} records!`, 'success');
      }
      
      setProcessing(false);
    }, 500);
  };

  // COPY TO CLIPBOARD
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputHTML);
    showToast('📋 HTML copied to clipboard!', 'success');
  };

  // DOWNLOAD AS EXCEL
  const downloadExcel = () => {
    let csv = '';
    
    if (outputData.length > 0) {
      const headers = Object.keys(outputData[0]);
      csv += headers.join('\t') + '\n';
      
      outputData.forEach(row => {
        const values = headers.map(header => {
          let value = row[header] || '';
          value = value.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\s+/g, ' ').trim();
          value = value.replace(/"/g, '""');
          return `"${value}"`;
        });
        csv += values.join('\t') + '\n';
      });
    }
    
    const blob = new Blob([csv], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${selectedFormat}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('💾 Excel file downloaded successfully!', 'success');
  };

  // LOADING STATE
  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: '4px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // MAIN APPLICATION
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative'
    }}>
      {/* Animated Background Blobs */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div className="animate-blob" style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'rgba(147, 51, 234, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          mixBlendMode: 'multiply'
        }}></div>
        <div className="animate-blob animation-delay-2000" style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'rgba(59, 130, 246, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          mixBlendMode: 'multiply'
        }}></div>
        <div className="animate-blob animation-delay-4000" style={{
          position: 'absolute',
          top: '10rem',
          left: '10rem',
          width: '20rem',
          height: '20rem',
          background: 'rgba(236, 72, 153, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          mixBlendMode: 'multiply'
        }}></div>
      </div>

      {/* Toast Notification */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />

      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  HTML Code Formatter
                </h1>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    marginRight: '8px'
                  }} className="animate-pulse"></span>
                  {userEmail}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 3H4a1 1 0 00-1 1v12a1 1 0 001 1h5M13 7l4 4m0 0l-4 4m4-4H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }} className="animate-fade-in">
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'black',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Transform Your Data Into{' '}
              <span style={{
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block'
              }}>
                Beautiful HTML
              </span>
            </h2>
            <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '800px', margin: '0 auto' }}>
              Professional data conversion with intelligent formatting ✨
            </p>
          </div>

          {/* Main Card */}
          <div className="card" style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            padding: '32px',
            marginBottom: '32px'
          }}>
            {/* Info Banner */}
            <div style={{
              marginBottom: '32px',
              padding: '24px',
              background: 'linear-gradient(to right, #eff6ff, #f5f3ff)',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '12px',
              display: 'flex',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#3b82f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#1e3a8a', marginBottom: '8px', fontWeight: 'bold' }}>
                  📊 <strong>Total Formats:</strong> 13 formats
                  <span className="badge-new" style={{ marginLeft: '16px', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px' }}>
                    ✅ ALL ACTIVE
                  </span>
                </p>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  <strong>💡 Pro Tip:</strong> All dots (.) are converted to <code>&#8901;</code> (dot code). 
                  You can manually change to <code>&#39;</code> (fullstop) if needed.
                </p>
              </div>
            </div>

            {/* Format Selection */}
            <FormatSelector 
              selectedFormat={selectedFormat}
              onFormatSelect={setSelectedFormat}
            />

            {/* File Upload */}
            {selectedFormat && (
              <div className="animate-fade-in-up">
                <FileUpload 
                  fileName={fileName}
                  onFileUpload={handleFileUpload}
                />
              </div>
            )}

            {/* Conversion Button */}
            {selectedFormat && fileName && (
              <div className="animate-fade-in-up animation-delay-200">
                <ConversionButton
                  fileContent={fileContent}
                  processing={processing}
                  onConvert={processContent}
                />
              </div>
            )}

            {/* Output Display */}
            {outputHTML && (
              <div className="animate-fade-in-up animation-delay-400">
                <OutputDisplay
                  outputHTML={outputHTML}
                  onCopy={copyToClipboard}
                  onDownload={downloadExcel}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', color: '#6b7280' }} className="animate-fade-in-up animation-delay-600">
            <p style={{ fontSize: '14px' }}>
              Made with <span style={{ color: '#ef4444' }} className="animate-pulse">❤️</span> by Your Team • © 2026 HTML Code Formatter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;