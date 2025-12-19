
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
  SUPPORT = 'support',
  USER = 'user'
}

export type UserStatus = 'active' | 'banned' | 'pending' | 'suspended';

export interface RedemptionRecord {
  id: string;
  userId: string;
  username: string;
  code: string;
  reward: string;
  timestamp: string;
  status: 'success' | 'expired' | 'failed';
}

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'icon' | 'background' | 'image' | 'gradient';
  category?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  nickname?: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: UserStatus;
  coins: number;
  lastLogin: string;
  createdAt: string;
  redemptionHistory?: RedemptionRecord[];
}

export interface SiteConfig {
  siteName: string;
  siteLogo: string;
  maintenanceMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundImage?: string;
  footerText: string;
  footerLogo?: string;
  footerLinks?: { label: string; url: string }[];
  footerSocials?: { platform: string; url: string }[];
  footerCta?: { label: string; url: string; show: boolean };
  headerCta?: { label: string; url: string; show: boolean };
  buttonStyle: 'rounded' | 'square' | 'pill';
  headerStyle: 'glass' | 'solid' | 'transparent';
  headerHeight?: string;
  headerSticky?: boolean;
  globalFont?: 'Cairo' | 'Inter' | 'System';
  bodyOverlayOpacity?: number;
  showFooter?: boolean;
  footerLayout?: 'simple' | 'elaborate' | 'centered';
  themePreset?: 'royal' | 'ocean' | 'midnight' | 'emerald' | 'custom';
  securityLevel?: 'standard' | 'high' | 'ultra';
  theme?: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

export interface PageBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  content: string;
  actions: SmartLink[];
  image?: string;
  items?: any[];
  style: {
    paddingY: string;
    textAlign: 'left' | 'center' | 'right';
    isDark?: boolean;
    textColor?: string;
    overlayOpacity?: number;
    backgroundGradient?: string;
    gridCols?: number;
  };
}

export interface Page {
  id: string;
  label: string;
  slug: string;
  isHidden: boolean;
  background: {
    type: 'color' | 'image' | 'gradient';
    value: string;
    overlayOpacity?: number;
    isBlurred?: boolean;
  };
  blocks: PageBlock[];
}

export type ViewState = 'home' | 'login' | 'register' | 'admin_dashboard' | 'user_dashboard' | string;
export type BlockType = 
  | 'hero' 
  | 'video_block' 
  | 'stats_counter' 
  | 'pricing_table' 
  | 'social_links' 
  | 'team_section' 
  | 'features_grid' 
  | 'news_ticker'
  | 'text_image'
  | 'gallery'
  | 'faq'
  | 'divider'
  | 'cta_bar';

export interface SmartLink {
  label: string;
  value: string;
  style: 'solid' | 'outline' | 'royal-gradient' | 'shimmer' | 'primary' | 'link';
  themeColor?: string;
  icon?: string;
  target?: string;
  customBg?: string;
  customTextColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface AnalyticsData {
  totalUsers: number;
  activeNow: number;
  dailyRevenue: number;
  activeSessions: number;
  growthRate: number;
  chartData: { name: string; value: number }[];
}

export interface AdItem {
  id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  type: 'announcement' | 'update' | 'event';
}
