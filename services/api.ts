
import { User, UserRole, UserStatus, SiteConfig, AnalyticsData, Page, AdItem, Asset } from '../types';

const DB_KEYS = {
  USERS: 'ah_secure_users_v11',
  CONFIG: 'ah_secure_config_v11',
  PAGES: 'ah_secure_pages_v11',
  SESSION: 'ah_secure_session_v11',
  ADS: 'ah_secure_ads_v11',
  ASSETS: 'ah_secure_assets_v11'
};

const mockHash = (str: string) => btoa(`salt_${str}_pepper`);

class VirtualDB {
  static get(key: string) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error reading from DB", e);
      return null;
    }
  }
  static set(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error writing to DB", e);
    }
  }
}

const initDB = () => {
  if (!VirtualDB.get(DB_KEYS.USERS)) {
    VirtualDB.set(DB_KEYS.USERS, [{
      id: 'admin_1',
      username: 'admin',
      displayName: 'القبطان الأعلى',
      email: 'admin@hamour.com',
      password: mockHash('admin123'),
      role: UserRole.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=fbbf24&color=000',
      status: 'active',
      coins: 999999,
      createdAt: new Date().toISOString()
    }]);
  }

  if (!VirtualDB.get(DB_KEYS.CONFIG)) {
    VirtualDB.set(DB_KEYS.CONFIG, {
      siteName: 'Age of Hamour',
      siteLogo: 'https://ui-avatars.com/api/?name=Hamour&background=fbbf24&color=000',
      maintenanceMode: false,
      primaryColor: '#fbbf24',
      secondaryColor: '#4f46e5',
      accentColor: '#f97316',
      buttonStyle: 'rounded',
      headerStyle: 'glass',
      headerHeight: '100',
      headerSticky: true,
      globalFont: 'Cairo',
      showFooter: true,
      footerLayout: 'elaborate',
      bodyOverlayOpacity: 0.5,
      securityLevel: 'high',
      footerText: 'إمبراطورية الهامور - نظام الأمان المتكامل والتحكم المطلق في البحار الرقمية.',
      footerLogo: 'https://ui-avatars.com/api/?name=Hamour&background=fbbf24&color=000',
      footerLinks: [
        { label: 'الرئيسية', url: '/' },
        { label: 'الأخبار', url: '/news' },
        { label: 'الدعم الفني', url: '/support' }
      ],
      footerSocials: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' }
      ],
      footerCta: { label: 'انضم لأسطولنا', url: '/register', show: true },
      headerCta: { label: 'دخول المنصة', url: '/login', show: true }
    });
  }

  if (!VirtualDB.get(DB_KEYS.PAGES) || VirtualDB.get(DB_KEYS.PAGES).length === 0) {
    VirtualDB.set(DB_KEYS.PAGES, [{
      id: 'home', 
      label: 'الرئيسية', 
      slug: 'home', 
      isHidden: false,
      background: { type: 'color', value: '#020617', overlayOpacity: 0.5 },
      blocks: [
        { 
          id: 'hero_home', 
          type: 'hero', 
          title: 'عصر الهامور', 
          subtitle: 'إمبراطورية البحار الرقمية', 
          content: 'ابدأ رحلتك كقبطان بسيط وكن أسطورة البحار في أقوى منصة إدارة متكاملة.', 
          image: '',
          style: { 
            paddingY: '24', 
            textAlign: 'center', 
            overlayOpacity: 0.5,
            backgroundGradient: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)'
          }, 
          actions: [
            { label: 'ابدأ الآن', value: '/register', style: 'royal-gradient', size: 'lg', icon: 'play' },
            { label: 'Share', value: '#share', style: 'solid', size: 'lg', icon: 'share' },
            { label: 'طلب ديمو', value: '#contact', style: 'outline', size: 'lg', themeColor: 'primary' }
          ] 
        }
      ]
    }]);
  }

  if (!VirtualDB.get(DB_KEYS.ASSETS)) {
    VirtualDB.set(DB_KEYS.ASSETS, [
      { id: 'ast_1', name: 'Royal Gold Gradient', type: 'gradient', url: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' },
      { id: 'ast_2', name: 'Deep Sea Background', type: 'image', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070' }
    ]);
  }
};

initDB();

export const api = {
  auth: {
    login: async (email: string, password?: string) => {
      await new Promise(r => setTimeout(r, 800));
      const users = VirtualDB.get(DB_KEYS.USERS) || [];
      const user = users.find((u: any) => u.email === email);
      if (!user) throw new Error('المستخدم غير موجود');
      if (password && user.password !== mockHash(password)) throw new Error('كلمة المرور خاطئة');
      const token = `jwt_${Math.random()}`;
      VirtualDB.set(DB_KEYS.SESSION, { user, token });
      return { user, token };
    },
    register: async (username: string, email: string, password?: string) => {
      const users = VirtualDB.get(DB_KEYS.USERS) || [];
      const newUser = { id: Date.now().toString(), username, displayName: username, email, password: mockHash(password || ''), role: UserRole.USER, status: 'active', coins: 100, createdAt: new Date().toISOString(), avatar: `https://ui-avatars.com/api/?name=${username}` };
      users.push(newUser);
      VirtualDB.set(DB_KEYS.USERS, users);
      return { user: newUser, token: 'jwt_new' };
    },
    getCurrentUser: () => VirtualDB.get(DB_KEYS.SESSION)?.user || null,
    logout: () => localStorage.removeItem(DB_KEYS.SESSION)
  },

  admin: {
    getUsers: async (): Promise<User[]> => VirtualDB.get(DB_KEYS.USERS) || [],
    updateUserStatus: async (id: string, status: UserStatus) => {
      const users = VirtualDB.get(DB_KEYS.USERS) || [];
      const updated = users.map((u: any) => u.id === id ? { ...u, status } : u);
      VirtualDB.set(DB_KEYS.USERS, updated);
    },
    getAnalytics: async (): Promise<AnalyticsData> => ({
      totalUsers: (VirtualDB.get(DB_KEYS.USERS) || []).length,
      activeNow: Math.floor(Math.random() * 20) + 15,
      dailyRevenue: 12400,
      activeSessions: 342,
      growthRate: 15,
      chartData: [{ name: 'S', value: 40 }, { name: 'M', value: 70 }, { name: 'T', value: 50 }, { name: 'W', value: 90 }]
    }),
    getAssets: async (): Promise<Asset[]> => VirtualDB.get(DB_KEYS.ASSETS) || [],
    saveAsset: async (asset: Asset) => {
      const assets = VirtualDB.get(DB_KEYS.ASSETS) || [];
      VirtualDB.set(DB_KEYS.ASSETS, [...assets, asset]);
    },
    deleteAsset: async (id: string) => {
      const assets = VirtualDB.get(DB_KEYS.ASSETS) || [];
      VirtualDB.set(DB_KEYS.ASSETS, assets.filter((a: any) => a.id !== id));
    },
    exportData: () => {
      const data = {
        users: VirtualDB.get(DB_KEYS.USERS),
        config: VirtualDB.get(DB_KEYS.CONFIG),
        pages: VirtualDB.get(DB_KEYS.PAGES),
        assets: VirtualDB.get(DB_KEYS.ASSETS),
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hamour_core_dump_${Date.now()}.json`;
      a.click();
    }
  },

  getPages: async (): Promise<Page[]> => VirtualDB.get(DB_KEYS.PAGES) || [],
  savePage: async (p: any) => {
    const pages = VirtualDB.get(DB_KEYS.PAGES) || [];
    const idx = pages.findIndex((x: any) => x.id === p.id);
    const updated = idx > -1 ? pages.map((x: any) => x.id === p.id ? p : x) : [...pages, p];
    VirtualDB.set(DB_KEYS.PAGES, updated);
  },

  getSiteConfig: async (): Promise<SiteConfig> => VirtualDB.get(DB_KEYS.CONFIG),
  updateSiteConfig: async (c: Partial<SiteConfig>) => {
    const current = await api.getSiteConfig();
    VirtualDB.set(DB_KEYS.CONFIG, { ...current, ...c });
  },
  getAds: async (): Promise<AdItem[]> => VirtualDB.get(DB_KEYS.ADS) || []
};

export const updateUserProfile = async (id: string, updates: any) => {
  const users = VirtualDB.get(DB_KEYS.USERS) || [];
  const updated = users.map((u: any) => u.id === id ? { ...u, ...updates } : u);
  VirtualDB.set(DB_KEYS.USERS, updated);
};
