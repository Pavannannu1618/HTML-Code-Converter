

import React, { useState, useEffect } from 'react';
import Login from './auth/Login.jsx';
import FormatSelector from './components/FormatSelector';
import FileUpload from './components/FileUpload';
import ConversionButton from './components/ConversionButton';
import OutputDisplay from './components/OutputDisplay';

// Import format processors
import { process2RowsFormat } from './utils/formatProcessors/twoRowsProcessor';
import { process4RowsFormat } from './utils/formatProcessors/fourRowsProcessor';
import { processWebsiteFormat } from './utils/formatProcessors/websiteProcessor';
import { processBookPageFormat } from './utils/formatProcessors/bookPageProcessor';
import { processPage20000Format } from './utils/formatProcessors/page20000Processor';
import { processMDPageFormat } from './utils/formatProcessors/mdPageProcessor';
import { processPage40000Format } from './utils/formatProcessors/page40000Processor';
import { processADPageFormat } from './utils/formatProcessors/adPageProcessor';
import { cleanCSVForFormat } from './utils/csvCleaner.js';

const App = () => {
  // ============================================================================
  // AUTHENTICATION STATE
  // ============================================================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ============================================================================
  // EXISTING STATE
  // ============================================================================
  const [selectedFormat, setSelectedFormat] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [outputHTML, setOutputHTML] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);

  // ============================================================================
  // CHECK AUTHENTICATION ON MOUNT
  // ============================================================================
  useEffect(() => {
    // Check if user is already authenticated
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

  // ============================================================================
  // AUTHENTICATION HANDLERS
  // ============================================================================
  const handleLoginSuccess = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    
    // Clear application state
    setIsAuthenticated(false);
    setUserEmail('');
    setSelectedFormat('');
    setFileContent('');
    setOutputHTML('');
    setOutputData([]);
    setFileName('');
  };

  // ============================================================================
  // EXISTING HANDLERS
  // ============================================================================

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    
    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload CSV or TXT files only');
    }
  };

  // Process content based on selected format
  const processContent = () => {
    if (!fileContent || !selectedFormat) return;
    
    setProcessing(true);
    
    setTimeout(() => {
      // Clean CSV content first (removes Excel metadata)
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
        default:
          result = { htmlOutput: '', dataArray: [] };
      }

      if (result) {
        setOutputHTML(result.htmlOutput);
        setOutputData(result.dataArray);
      }
      
      setProcessing(false);
    }, 500);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputHTML);
    alert('HTML copied to clipboard!');
  };

  // Download as Excel-compatible file
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
  };

  // ============================================================================
  // RENDER - LOADING STATE
  // ============================================================================
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER - LOGIN PAGE
  // ============================================================================
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // ============================================================================
  // RENDER - AUTHENTICATED APP (YOUR EXISTING UI)
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Logout */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HTML Code Formatter</h1>
                <p className="text-sm text-gray-500">Logged in as: {userEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M9 3H4a1 1 0 00-1 1v12a1 1 0 001 1h5M13 7l4 4m0 0l-4 4m4-4H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Your Existing App */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Company Data HTML Converter
              </h2>
              <p className="text-gray-600">
                Convert company data to HTML format with proper punctuation codes
              </p>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All dots (.) are converted to &#8901; (dot code). 
                  You can manually change to &#39; (fullstop) if needed. 
                  Ampersand (&) is left as-is (not converted).
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
              <FileUpload 
                fileName={fileName}
                onFileUpload={handleFileUpload}
              />
            )}

            {/* Conversion Button */}
            {selectedFormat && fileName && (
              <ConversionButton
                fileContent={fileContent}
                processing={processing}
                onConvert={processContent}
              />
            )}

            {/* Output Display */}
            <OutputDisplay
              outputHTML={outputHTML}
              onCopy={copyToClipboard}
              onDownload={downloadExcel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;