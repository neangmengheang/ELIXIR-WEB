

import { LanguageDictionary, UserRole, Concern, Policy, ClaimRequest } from './types';

export const TRANSLATIONS: LanguageDictionary = {
  // General
  welcome: { en: "Welcome to ELIXER", km: "សូមស្វាគមន៍មកកាន់ ELIXER" },
  subtitle: { en: "Future of Insurance in Cambodia", km: "អនាគតនៃវិស័យធានារ៉ាប់រងនៅកម្ពុជា" },
  
  // Navigation
  dashboard: { en: "Dashboard", km: "ផ្ទាំងគ្រប់គ្រង" },
  advisor: { en: "AI Advisor", km: "ទីប្រឹក្សា AI" },
  community: { en: "Community", km: "សហគមន៍" },
  claims: { en: "Smart Claims", km: "សំណងឆ្លាតវៃ" },
  concerns: { en: "My Concerns", km: "កង្វល់របស់ខ្ញុំ" },
  settings: { en: "Settings", km: "ការកំណត់" },
  policies: { en: "My Policies", km: "ប័ណ្ណធានារ៉ាប់រងរបស់ខ្ញុំ" },
  managedPolicies: { en: "Product Portfolio", km: "ផលប័ត្រផលិតផល" },
  menu: { en: "Menu", km: "ម៉ឺនុយ" },
  language: { en: "Language", km: "ភាសា" },

  // Advisor
  askAnything: { en: "Ask about Cambodian Insurance...", km: "សួរអំពីការធានារ៉ាប់រង..." },
  alwaysActive: { en: "Always Active", km: "សកម្មជានិច្ច" },
  aiName: { en: "ELIXER AI", km: "អេលីស៊ែរ AI" },
  introMessage: { en: "Hello! I am ELIXER. How can I help you understand your insurance options today?", km: "សួស្តី! ខ្ញុំគឺ ELIXER ។ តើខ្ញុំអាចជួយអ្នកស្វែងយល់ពីការធានារ៉ាប់រងថ្ងៃនេះយ៉ាងដូចម្តេច?" },

  // Community
  postPlaceholder: { en: "Share your experience or ask a question...", km: "ចែករំលែកបទពិសោធន៍ ឬសួរសំណួររបស់អ្នក..." },
  postBtn: { en: "Post", km: "បង្ហោះ" },
  moderationWarning: { en: "Content not related to insurance.", km: "មាតិកាមិនទាក់ទងនឹងការធានារ៉ាប់រង។" },
  forYou: { en: "For You", km: "សម្រាប់អ្នក" },
  saved: { en: "Saved", km: "បានរក្សាទុក" },
  noPosts: { en: "No posts yet", km: "មិនទាន់មានការបង្ហោះនៅឡើយទេ" },
  noSavedPosts: { en: "No saved posts yet", km: "មិនទាន់មានការបង្ហោះដែលបានរក្សាទុកទេ" },
  aiModerated: { en: "AI Moderated", km: "ត្រួតពិនិត្យដោយ AI" },
  newPost: { en: "New Post", km: "ការបង្ហោះថ្មី" },
  cancel: { en: "Cancel", km: "បោះបង់" },

  // Claims
  analyzing: { en: "AI Analyzing...", km: "AI កំពុងវិភាគ..." },
  uploadImage: { en: "Upload Accident/Document Photo", km: "បង្ហោះរូបភាពគ្រោះថ្នាក់/ឯកសារ" },
  claimAssessment: { en: "Claim Assessment", km: "ការវាយតម្លៃសំណង" },
  approved: { en: "Likely Approved", km: "ទំនងជាត្រូវបានអនុម័ត" },
  rejected: { en: "Review Needed", km: "ត្រូវការការត្រួតពិនិត្យ" },
  tapToUpload: { en: "Tap to Upload", km: "ចុចដើម្បីបង្ហោះ" },
  submitClaim: { en: "Submit Claim", km: "ដាក់ស្នើការទាមទារ" },
  newClaim: { en: "New Claim", km: "ការទាមទារថ្មី" },
  status: { en: "Status", km: "ស្ថានភាព" },
  confidence: { en: "Confidence", km: "ទំនុកចិត្ត" },
  payout: { en: "Payout", km: "ការទូទាត់" },
  aiReasoning: { en: "AI Assessment", km: "ការវាយតម្លៃ AI" },
  acceptPayout: { en: "Accept Payout via QR", km: "ទទួលយកការទូទាត់តាម QR" },
  takePhotoText: { en: "Take a clear photo of the damage to vehicle or document.", km: "ថតរូបភាពឱ្យច្បាស់អំពីការខូចខាតយានយន្ត ឬឯកសារ។" },

  // Policies (New)
  myPolicies: { en: "My Policies", km: "ប័ណ្ណរបស់ខ្ញុំ" },
  addPolicy: { en: "Add Policy", km: "បន្ថែមប័ណ្ណ" },
  addManually: { en: "Add Manually", km: "បញ្ចូលដោយដៃ" },
  createPolicy: { en: "Create New Policy", km: "បង្កើតប័ណ្ណថ្មី" },
  scanPolicy: { en: "Scan Card", km: "ស្កេនប័ណ្ណ" },
  extractingData: { en: "Extracting Data...", km: "កំពុងស្រង់ទិន្នន័យ..." },
  policyDetails: { en: "Policy Details", km: "ព័ត៌មានលម្អិតប័ណ្ណ" },
  provider: { en: "Provider", km: "ក្រុមហ៊ុន" },
  policyNo: { en: "Policy No.", km: "លេខប័ណ្ណ" },
  expires: { en: "Expires", km: "ផុតកំណត់" },
  coverage: { en: "Coverage", km: "ការការពារ" },
  savePolicy: { en: "Save Policy", km: "រក្សាទុកប័ណ្ណ" },
  scanInstructions: { en: "Take a photo of your insurance card. AI will fill in the details.", km: "ថតរូបប័ណ្ណធានារ៉ាប់រងរបស់អ្នក។ AI នឹងបំពេញព័ត៌មានដោយស្វ័យប្រវត្តិ។" },
  verifyDetails: { en: "Verify & Edit Details", km: "ពិនិត្យ និងកែសម្រួល" },
  editPolicy: { en: "Edit Policy", km: "កែសម្រួលប័ណ្ណ" },
  deletePolicy: { en: "Delete", km: "លុបចោល" },
  setAsDefault: { en: "Show on Dashboard", km: "បង្ហាញលើផ្ទាំងគ្រប់គ្រង" },
  defaultPolicy: { en: "Default", km: "លំនាំដើម" },
  holderName: { en: "Holder Name", km: "ឈ្មោះម្ចាស់ប័ណ្ណ" },
  confirmDelete: { en: "Are you sure you want to delete this policy?", km: "តើអ្នកប្រាកដថាចង់លុបប័ណ្ណនេះទេ?" },

  // Dashboard
  hello: { en: "Hello", km: "សួស្តី" },
  active: { en: "ACTIVE", km: "សកម្ម" },
  totalCoverage: { en: "Total Coverage", km: "ការការពារសរុប" },
  policyNumber: { en: "Policy Number", km: "លេខប័ណ្ណសន្យារ៉ាប់រង" },
  highSafety: { en: "High Safety", km: "សុវត្ថិភាពខ្ពស់" },
  quickActions: { en: "Quick Actions", km: "សកម្មភាពរហ័ស" },
  latestPolicies: { en: "Latest Policies", km: "ប័ណ្ណធានារ៉ាប់រងថ្មីៗ" },
  featuredPolicies: { en: "Featured Policies", km: "ប័ណ្ណធានារ៉ាប់រងពិសេស" },
  all: { en: "All", km: "ទាំងអស់" },
  recentClaims: { en: "Recent Claims", km: "ការទាមទារសំណងថ្មីៗ" },
  incomingConcerns: { en: "Incoming Concerns", km: "កង្វល់ដែលចូលមក" },
  riskScore: { en: "Risk Score", km: "ពិន្ទុហានិភ័យ" },
  manageProducts: { en: "Manage Products", km: "គ្រប់គ្រងផលិតផល" },
  
  // Dashboard Items
  actionClaim: { en: "Claim", km: "ទាមទារ" },
  actionChat: { en: "Chat", km: "ជជែក" },
  actionPolicies: { en: "Policies", km: "ប័ណ្ណ" },
  actionMore: { en: "More", km: "ផ្សេងៗ" },

  view: { en: "View", km: "មើល" },
  today: { en: "Today", km: "ថ្ងៃនេះ" },
  yesterday: { en: "Yesterday", km: "ម្សិលមិញ" },
  daysAgo: { en: "days ago", km: "ថ្ងៃមុន" },

  // Concerns (New)
  concernTitle: { en: "My Concerns", km: "កង្វល់របស់ខ្ញុំ" },
  concernSubtitle: { en: "Tell us your worries, we find the solution.", km: "ប្រាប់យើងពីកង្វល់របស់អ្នក យើងនឹងស្វែងរកដំណោះស្រាយ។" },
  marketTitle: { en: "Marketplace of Concerns", km: "ទីផ្សារកង្វល់" },
  marketSubtitle: { en: "Propose solutions to potential customers.", km: "ស្នើដំណោះស្រាយជូនអតិថិជនសក្តានុពល។" },
  addConcern: { en: "Add Concern", km: "បន្ថែមកង្វល់" },
  aiSuggestion: { en: "AI Suggestion", km: "ការណែនាំពី AI" },
  clickToStart: { en: "Click to start", km: "ចុចដើម្បីចាប់ផ្តើម" },
  whatWorriesYou: { en: "What worries you about this?", km: "តើអ្នកព្រួយបារម្ភអ្វីខ្លះអំពីរឿងនេះ?" },
  describeWorry: { en: "Describe your situation...", km: "ពណ៌នាអំពីស្ថានភាពរបស់អ្នក..." },
  analyzeAndSave: { en: "Analyze & Save", km: "វិភាគ និងរក្សាទុក" },
  anonymousUser: { en: "Anonymous User", km: "អ្នកប្រើប្រាស់អនាមិក" },
  proposeSolution: { en: "Propose Solution", km: "ស្នើដំណោះស្រាយ" },
  proposalsReceived: { en: "Proposals", km: "សំណើដែលទទួលបាន" },
  waitingForProposals: { en: "Matching with insurers...", km: "កំពុងផ្គូផ្គងជាមួយក្រុមហ៊ុនធានារ៉ាប់រង..." },
  openStatus: { en: "Open", km: "បើក" },
  solvedStatus: { en: "Solved", km: "ដោះស្រាយរួច" },
  pendingVerification: { en: "Pending Verification", km: "រង់ចាំការត្រួតពិនិត្យ" },
  verifiedStatus: { en: "Verified Deal", km: "បានត្រួតពិនិត្យ" },
  topicsHeader: { en: "What is on your mind?", km: "តើអ្នកកំពុងគិតអ្វី?" },
  regenerateTopics: { en: "Regenerate Ideas", km: "បង្កើតគំនិតថ្មី" },
  summarizeAndRecord: { en: "Summarize & Record", km: "សង្ខេប និងកត់ត្រា" },
  topicHistory: { en: "Your Path", km: "ជម្រើសរបស់អ្នក" },
  generating: { en: "Generating...", km: "កំពុងបង្កើត..." },
  drafting: { en: "Drafting...", km: "កំពុងសរសេរព្រាង..." },
  restart: { en: "Restart", km: "ចាប់ផ្តើមឡើងវិញ" },
  
  // Concerns Interaction
  discuss: { en: "Discussion", km: "ការពិភាក្សា" },
  reply: { en: "Reply", km: "ឆ្លើយតប" },
  writeComment: { en: "Write your proposal or comment...", km: "សរសេរសំណើ ឬមតិយោបល់របស់អ្នក..." },
  acceptDeal: { en: "Accept Deal", km: "ទទួលយកសំណើ" },
  verifyDeal: { en: "Verify Deal (Admin)", km: "ត្រួតពិនិត្យ (Admin)" },
  contactInfo: { en: "Contact Info", km: "ព័ត៌មានទំនាក់ទំនង" },
  dealAccepted: { en: "Deal Accepted!", km: "សំណើត្រូវបានទទួលយក!" },
  adminAction: { en: "Admin Action Needed", km: "ត្រូវការសកម្មភាពពី Admin" },

  // Settings
  switchRole: { en: "Switch Role", km: "ប្តូរតួនាទី" },
  currentUserRole: { en: "Current Role", km: "តួនាទីបច្ចុប្បន្ន" },
  selectRole: { en: "Select a Role to Simulate", km: "ជ្រើសរើសតួនាទីដើម្បីសាកល្បង" },
  appSettings: { en: "App Settings", km: "ការកំណត់កម្មវិធី" },
};

export const ROLES_LIST = [
  UserRole.GENERAL_USER,
  UserRole.INSURANCE_COMPANY,
  UserRole.BROKER,
  UserRole.AGENT,
  UserRole.REGULATOR,
  UserRole.STUDENT,
  UserRole.ADMIN
];

export const AI_CONCERN_TOPICS = [
  { id: 't1', text: { en: "Flood affecting my shop", km: "ទឹកជំនន់ប៉ះពាល់ដល់ហាងរបស់ខ្ញុំ" }, icon: "🌧️" },
  { id: 't2', text: { en: "Traffic accident costs", km: "ថ្លៃចំណាយពេលមានគ្រោះថ្នាក់ចរាចរណ៍" }, icon: "🚗" },
  { id: 't3', text: { en: "Health issues for elderly parents", km: "បញ្ហាសុខភាពរបស់ឪពុកម្តាយចាស់ជរា" }, icon: "🏥" },
  { id: 't4', text: { en: "Losing job unexpectedly", km: "បាត់បង់ការងារដោយមិនបានរំពឹងទុក" }, icon: "💼" },
  { id: 't5', text: { en: "Crop failure due to drought", km: "ការខូចខាតដំណាំដោយសារគ្រោះរាំងស្ងួត" }, icon: "🌾" },
];

export const MOCK_POSTS = [
  {
    id: '1',
    author: 'Sophea Chan',
    role: UserRole.AGENT,
    content: 'Automobile insurance in Phnom Penh is becoming essential. Make sure you check the parametric clauses for flood damage!',
    likes: 12,
    comments: [
      {
        id: 'c1',
        author: 'Visal',
        role: UserRole.GENERAL_USER,
        content: 'Is flood coverage standard now?',
        timestamp: new Date()
      },
      {
        id: 'c2',
        author: 'Sophea Chan',
        role: UserRole.AGENT,
        content: 'Not always, you have to request the add-on specifically for older policies.',
        timestamp: new Date()
      }
    ],
    timestamp: new Date(),
    tags: ['Auto', 'Flood'],
    bookmarked: false
  },
  {
    id: '2',
    author: 'Dara Kim',
    role: UserRole.STUDENT,
    content: 'Can someone explain the difference between Life and Term insurance under the new Cambodian regulations?',
    likes: 5,
    comments: [
       {
        id: 'c3',
        author: 'Bopha',
        role: UserRole.BROKER,
        content: 'Term is for a specific period, Life covers you until death. The new regulation requires clearer terms in Khmer.',
        timestamp: new Date()
      }
    ],
    timestamp: new Date(),
    tags: ['Life', 'Education'],
    bookmarked: true
  }
];

export const MOCK_CONCERNS: Concern[] = [
  {
    id: 'c1',
    userId: 'current-user',
    userContact: { phone: "012 345 678", email: "user@elixer.kh" },
    category: 'SME / Flood',
    originalText: 'I have a small coffee shop in Tuol Kork. Every rainy season, water rises 20cm. I am afraid my machines will break.',
    aiSummary: 'Business Interruption & Property Damage due to Seasonal Flooding (SME Package)',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    status: 'OPEN',
    comments: []
  },
  {
    id: 'c2',
    userId: 'u2', // Different user
    userContact: { phone: "099 888 777", email: "mom@family.kh" },
    category: 'Health / Family',
    originalText: 'My mother is 65 years old. She has diabetes. I want to make sure if she goes to hospital, I can pay.',
    aiSummary: 'Senior Health Coverage with Pre-existing Condition Waiver (Critical Illness)',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    status: 'OPEN',
    comments: [
      {
        id: 'p1',
        authorName: 'Sophea Chan',
        authorRole: UserRole.AGENT,
        authorId: 'agent1',
        content: 'We have a "Silver Care" plan specifically for seniors 60+ covering diabetes maintenance.',
        timestamp: new Date(),
        isProposal: true
      }
    ]
  }
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'p1',
    provider: 'Forte Insurance',
    policyNumber: 'AUTO-2024-8829',
    type: 'Automobile',
    coverageAmount: '$50,000.00',
    expiryDate: new Date('2025-12-31'),
    holderName: 'Sophea Chan',
    status: 'ACTIVE',
    colorTheme: 'from-[#0f172a] via-[#1e293b] to-[#334155]', // Dark Blue
    isDefault: true
  },
  {
    id: 'p2',
    provider: 'Caminco',
    policyNumber: 'HLTH-9921-002',
    type: 'Health & Life',
    coverageAmount: '$10,000.00',
    expiryDate: new Date('2024-10-15'),
    holderName: 'Sophea Chan',
    status: 'ACTIVE',
    colorTheme: 'from-emerald-600 via-emerald-700 to-teal-800', // Green
    isDefault: false
  },
  {
    id: 'p3',
    provider: 'People & Partners',
    policyNumber: 'PROP-7738-01',
    type: 'Property Fire',
    coverageAmount: '$120,000.00',
    expiryDate: new Date('2026-01-20'),
    holderName: 'Sophea Chan',
    status: 'ACTIVE',
    colorTheme: 'from-amber-600 via-amber-700 to-orange-800', // Orange
    isDefault: false
  }
];

export const MOCK_CLAIM_REQUESTS: ClaimRequest[] = [
    { id: 'cr1', policyId: 'POL-001', policyHolder: 'Visal Bong', type: 'Auto Accident', amount: '$450.00', riskScore: 'Low', timestamp: new Date(), status: 'PENDING' },
    { id: 'cr2', policyId: 'POL-882', policyHolder: 'Srey Mao', type: 'Health / Hospital', amount: '$1,200.00', riskScore: 'Medium', timestamp: new Date(), status: 'REVIEWING' },
    { id: 'cr3', policyId: 'POL-993', policyHolder: 'John Doe', type: 'Property Damage', amount: '$3,500.00', riskScore: 'High', timestamp: new Date(), status: 'PENDING' },
];

export const MOCK_MARKET_PRODUCTS: Policy[] = [
    {
        id: 'mp1',
        provider: 'Forte Insurance',
        policyNumber: 'SME-PROTECT',
        type: 'Business / SME',
        coverageAmount: 'Up to $100k',
        expiryDate: new Date('2025-12-31'),
        holderName: 'Market Product',
        status: 'ACTIVE', // Available
        colorTheme: 'from-blue-600 via-blue-700 to-indigo-800',
        isDefault: false
    },
    {
        id: 'mp2',
        provider: 'Caminco',
        policyNumber: 'MOTO-PLUS',
        type: 'Motorcycle',
        coverageAmount: '$5,000',
        expiryDate: new Date('2025-12-31'),
        holderName: 'Market Product',
        status: 'ACTIVE',
        colorTheme: 'from-red-600 via-red-700 to-pink-800',
        isDefault: false
    },
    {
        id: 'mp3',
        provider: 'Prudential',
        policyNumber: 'LIFE-SECURE',
        type: 'Life Insurance',
        coverageAmount: '$50,000',
        expiryDate: new Date('2030-01-01'),
        holderName: 'Market Product',
        status: 'ACTIVE',
        colorTheme: 'from-emerald-600 via-emerald-700 to-teal-800',
        isDefault: false
    }
];