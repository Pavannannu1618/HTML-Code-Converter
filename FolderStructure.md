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




  'China', 'china', 'CHINA', 
  'BOX', 'Box', 'box', 
  'window', 'Window', 'WINDOW',
  'Google', 'google', 'GOOGLE', 
  'Microsoft', 'microsoft', 'MICROSOFT',
  'Amazon', 'amazon', 'AMAZON', 
  'Facebook', 'facebook', 'FACEBOOK',
  'Twitter', 'twitter', 'TWITTER', 
  'LinkedIn', 'linkedin', 'LINKEDIN',
  'Dia', 'dia', 'DIA', 
  'Villa', 'villa', 'VILLA', 
  'List', 'list', 'LIST',
  'This', 'this', 'THIS', 
  'Styles', 'styles', 'STYLES', 
  'File', 'file', 'FILE',
  'Document', 'document', 'DOCUMENT', 
  'GoogleeAccounts', 'googleaccounts', 'GOOGLEACCOUNTS',
  'Account', 'account', 'ACCOUNT', 
  'GoogleServices', 'googleservices', 'GOOGLESERVICES',
  'Services', 'services', 'SERVICES', 
  'Admin', 'admin', 'ADMIN', 
  'Console', 'console', 'CONSOLE',
  'Support', 'support', 'SUPPORT', 
  'Help', 'help', 'HELP', 
  'Center', 'center', 'CENTER', 
  'prototype', 'Prototype', 'PROTOTYPE',
  'Example', 'example', 'EXAMPLE', 
  'menu', 'Menu', 'MENU', 
  'button', 'Button', 'BUTTON',
  'click', 'Click', 'CLICK', 
  'select', 'Select', 'SELECT', 
  'option', 'Option', 'OPTION',
  'webcache', 'Webcache', 'WEBCACHE', 
  'available', 'Available', 'AVAILABLE', 
  'sit', 'Sit', 'SIT',
  'cool', 'Cool', 'COOL', 
  'tool', 'Tool', 'TOOL', 
  'page', 'Page', 'PAGE', 
  'Shenzhen', 'shenzhen', 'SHENZHEN',
  'mcafee', 'Mcafee', 'MCAFEE', 
  'lany', 'Lany', 'LANY', 
  'press', 'Press', 'PRESS',
  'release', 'Release', 'RELEASE', 
  'valley', 'Valley', 'VALLEY', 
  'rod', 'Rod', 'ROD', 
  'Cap', 'cap', 'CAP',
  'cloud', 'Cloud', 'CLOUD', 
  'Unavailable', 'unavailable', 'UNAVAILABLE', 
  'googleUsercontent', 'GoogleUsercontent', 'GOOGLEUSERCONTENT',
  'Road', 'road', 'ROAD', 
  'Slice', 'slice', 'SLICE', 
  'aparatus', 'Aparatus', 'APARATUS', 
  'apara', 'Apara', 'APARA', 
  'combined', 'Combined', 'COMBINED', 
  'comb', 'Comb', 'COMB',
  'configuration', 'Configuration', 'CONFIGURATION', 
  'thustonia', 'Thustonia', 'THUSTONIA', 
  'CORPORATION', 'Corporation', 'corporation', 
  'Incorporated', 'incorporated', 'INCORPORATED',
  'Limited', 'limited', 'LIMITED', 
  'technologies', 'Technologies', 'TECHNOLOGIES', 
  'technology', 'Technology', 'TECHNOLOGY', 
  'systems', 'Systems', 'SYSTEMS', 
  'system', 'System', 'SYSTEM',
  'solutions', 'Solutions', 'SOLUTIONS', 
  'solution', 'Solution', 'SOLUTION', 
  'international', 'International', 'INTERNATIONAL', 
  'internationally', 'Internationally', 'INTERNATIONALLY',
  'partners', 'Partners', 'PARTNERS', 
  'partner', 'Partner', 'PARTNER', 
  'associates', 'Associates', 'ASSOCIATES', 
  'associate', 'Associate', 'ASSOCIATE',
  'holdings', 'Holdings', 'HOLDINGS', 
  'holding', 'Holding', 'HOLDING', 
  'enterprises', 'Enterprises', 'ENTERPRISES', 
  'enterprise', 'Enterprise', 'ENTERPRISE',
  'ventures', 'Ventures', 'VENTURES', 
  'venture', 'Venture', 'VENTURE', 
  'global', 'Global', 'GLOBAL', 
  'globals', 'Globals', 'GLOBALS',
  'universal', 'Universal', 'UNIVERSAL', 
  'universally', 'Universally', 'UNIVERSALLY', 
  'networks', 'Networks', 'NETWORKS', 
  'network', 'Network', 'NETWORK', 
  'technologic', 'Technologic', 'TECHNOLOGIC', 
  'technologically', 'Technologically', 'TECHNOLOGICALLY',
  'Marketing', 'marketing', 'MARKETING',
  'new', 'New', 'NEW', 
  'old', 'Old', 'OLD',
  'next', 'Next', 'NEXT',
  'Promise', 'promise', 'PROMISE',
  'brothers', 'Brothers', 'BROTHERS',
  'brother', 'Brother', 'BROTHER'