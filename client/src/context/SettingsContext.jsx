import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

const defaultSettings = {
  store_name: 'Taj-e-Konain Gas Burner',
  tagline: 'Quality Gas Stoves, Burners & Kitchen Essentials for Every Home',
  logo_url: '/images/taj-logo.png',
  hero_image: '/images/hero-banner.svg',
  hero_bg_image: '',
  hero_badge_text: 'Pakistani Gas Burner Specialists • Sui Gas & LPG Ready',
  whatsapp_number: '923432833991',
  phone_number: '03432833991',
  email_address: 'contact@tajekonain.com',
  address: 'House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir, Karachi, 75050',
  city: 'Karachi',
  postal_code: '75050',
  google_maps_url: 'https://share.google/31m1BrmEBxjzaiXpg',
  business_hours: 'Monday - Saturday: 9:00 AM - 9:00 PM | Sunday: Closed',
  announcement_bar: '🔥 Fast Nationwide Delivery across Pakistan • Direct WhatsApp Ordering: 03432833991 • Quality Assured',
  hero_headline: 'Quality Gas Stoves & Kitchen Essentials for Every Home',
  hero_subtext: 'Discover reliable gas burners, stylish stoves, and essential kitchen accessories at Taj-e-Konain Gas Burner. Explore our collection and order conveniently through WhatsApp.',
  delivery_notice: 'Delivery charges and courier timelines will be confirmed directly on WhatsApp based on your city and order weight.',
  production_domain: 'https://tajekonain.com',
  meta_title_default: 'Taj-e-Konain Gas Burner | Gas Stoves, Burners & Kitchen Appliances in Pakistan',
  meta_description_default: 'Buy top-quality gas stoves, double burners, stainless steel hobs, commercial burners, regulators, and gas accessories in Pakistan. Order directly on WhatsApp.'
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res && res.success && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('Using default store settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
