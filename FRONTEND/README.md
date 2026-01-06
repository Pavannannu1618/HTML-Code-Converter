# Company Data HTML Converter

A React application to convert company data into HTML format with proper punctuation codes.

## Features

- ✅ 8 Different Format Types
- ✅ Automatic Punctuation Conversion (20 rules)
- ✅ Entity Detection for Company Names
- ✅ CSV/TXT File Upload
- ✅ Excel Export
- ✅ Clean, Modular Code Structure

## Formats Supported

1. **2 Rows Format** - Code+Location, Name+Address
2. **4 Rows Format** - CSV with 4 columns
3. **Website Format** - Name, Address, Name, Website
4. **Book Page Format** - Address, Link
5. **20000 Page Format** - Details, Link, Address
6. **MD Page Format** - Details, Address, Address
7. **40000 Page Format** - Details, Details, Link
8. **AD Page Format** - Name, Address, Link

## Installation
```bash
npm install
```

## Run Development Server
```bash
npm run dev
```

## Build for Production
```bash
npm run build
```

## Project Structure
```
src/
├── App.jsx                          # Main application
├── components/                      # React components
│   ├── FormatSelector.jsx
│   ├── FileUpload.jsx
│   ├── OutputDisplay.jsx
│   └── ConversionButton.jsx
├── utils/                           # Utility functions
│   ├── punctuationRules.js
│   ├── csvParser.js
│   ├── entityDetector.js
│   └── formatProcessors/            # Format-specific processors
│       ├── twoRowsProcessor.js
│       ├── fourRowsProcessor.js
│       ├── websiteProcessor.js
│       ├── bookPageProcessor.js
│       ├── page20000Processor.js
│       ├── mdPageProcessor.js
│       ├── page40000Processor.js
│       └── adPageProcessor.js
└── constants/
    └── entities.js                  # Company entity list
```

## Usage

1. Select a format type
2. Upload CSV or TXT file
3. Click "Convert to HTML"
4. Copy or download the output

## Notes

- All dots (.) are converted to `&#8901;` (dot code)
- Dots between numbers are converted to `&#69;` (decimal)
- Ampersand (&) is left as-is (not converted)
- Triple quotes `"""` in CSV add `&ldquo;` and `&rdquo;` in output 