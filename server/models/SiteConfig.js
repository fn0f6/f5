
const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Age of Hamour' },
  heroSubtitle: { type: String, default: 'Conquer the Seas, Build your Empire.' },
  heroImage: { type: String, default: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80' },
  downloadLink: { type: String, default: '#' },
  primaryColor: { type: String, default: '#EAB308' }, // Gold
  secondaryColor: { type: String, default: '#0F172A' }, // Sea/Navy
  accentColor: { type: String, default: '#78350F' }, // Wood
  announcementBar: { type: String, default: '' },
  maintenanceMode: { type: Boolean, default: false }, // Maintenance Check
  navigation: { type: Array, default: [] }, // Stores NavItem[] for Header
  footerNavigation: { type: Array, default: [] } // Stores NavItem[] for Footer
}, { capped: { size: 1024, max: 1 } }); // Singleton collection

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
