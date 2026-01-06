src/
├── App.jsx                          (Main component)
├── components/
│   ├── FormatSelector.jsx          (Format selection buttons)
│   ├── FileUpload.jsx              (File upload component)
│   ├── OutputDisplay.jsx           (HTML output display)
│   └── ConversionButton.jsx        (Convert button)
├── utils/
│   ├── punctuationRules.js         (All punctuation logic)
│   ├── csvParser.js                (CSV parsing logic)
│   ├── entityDetector.js           (Company name detection)
│   └── formatProcessors/
│       ├── twoRowsProcessor.js     (2 Rows format)
│       ├── fourRowsProcessor.js    (4 Rows format)
│       ├── websiteProcessor.js     (Website format)
│       ├── bookPageProcessor.js    (Book Page format)
│       ├── page20000Processor.js   (20000 Page format)
│       ├── mdPageProcessor.js      (MD Page format)
│       ├── page40000Processor.js   (40000 Page format)
│       └── adPageProcessor.js      (AD Page format)
└── constants/
    └── entities.js                 (Entity list)