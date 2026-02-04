
export enum UserRole {
  GENERAL_USER = 'General User',
  INSURANCE_COMPANY = 'Insurance Company',
  BROKER = 'Broker',
  AGENT = 'Agent',
  STUDENT = 'Student',
  REGULATOR = 'Regulator',
  ADMIN = 'Admin'
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ADVISOR = 'ADVISOR',
  COMMUNITY = 'COMMUNITY',
  CLAIMS = 'CLAIMS',
  CONCERNS = 'CONCERNS',
  SETTINGS = 'SETTINGS',
  POLICIES = 'POLICIES'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  timestamp: Date;
}

export interface SocialPost {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  tags: string[];
  bookmarked?: boolean;
}

export interface Proposal {
  id: string;
  agentName: string;
  company: string;
  solution: string;
  timestamp: Date;
}

export interface ConcernComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorId: string; // To match with current user for permissions
  content: string;
  timestamp: Date;
  isProposal: boolean;
}

export interface Concern {
  id: string;
  userId: string; // To identify owner
  userContact?: { phone: string; email: string }; // Hidden until verified
  category: string;
  originalText: string;
  aiSummary: string; // The professional summary
  timestamp: Date;
  status: 'OPEN' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'SOLVED';
  comments: ConcernComment[];
  acceptedCommentId?: string; // ID of the accepted deal
}

export interface Policy {
  id: string;
  provider: string; // e.g. Forte, Caminco
  policyNumber: string;
  type: string; // Auto, Health, Life
  coverageAmount: string;
  expiryDate: Date;
  holderName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  colorTheme: string; // CSS class for gradient
  isDefault?: boolean; // Determines if this is the card shown on dashboard
}

export interface ClaimRequest {
  id: string;
  policyId: string;
  policyHolder: string;
  type: string;
  amount: string;
  riskScore: 'Low' | 'Medium' | 'High';
  timestamp: Date;
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
}

export interface ClaimResult {
  approved: boolean;
  confidence: number;
  estimatedPayout: string;
  reasoning: string;
}

export interface LanguageDictionary {
  [key: string]: {
    en: string;
    km: string;
  };
}