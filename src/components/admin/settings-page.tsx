// src/pages/admin/SettingsPage.tsx
// Admin settings page for system configuration

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import './settings-page.css';

interface Settings {
  store: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: {
    provider: string;
    smtpHost: string;
    smtpPort: number;
    senderEmail: string;
    senderName: string;
  };
  shipping: {
    method: string;
    cost: number;
    freeShippingThreshold: number;
    estimatedDays: number;
  };
  payment: {
    provider: string;
    currency: string;
    taxRate: number;
  };
  general: {
    siteName: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
}

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('store');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [settings, setSettings] = useState<Settings>({
    store: {
      name: 'Tech Store',
      email: 'info@techstore.com',
      phone: '1-800-123-4567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    email: {
      provider: 'SMTP',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      senderEmail: 'noreply@techstore.com',
      senderName: 'Tech Store',
    },
    shipping: {
      method: 'Standard',
      cost: 10.0,
      freeShippingThreshold: 100.0,
      estimatedDays: 5,
    },
    payment: {
      provider: 'Stripe',
      currency: 'USD',
      taxRate: 8.0,
    },
    general: {
      siteName: 'Tech Store',
      timezone: 'America/New_York',
      language: 'en',
      maintenanceMode: false,
    },
  });

  // Mock load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPageLoading(false);
      } catch (err) {
        setToast({ type: 'error', message: 'Failed to load settings' });
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (section: keyof Settings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setToast({ type: 'success', message: 'Settings saved successfully' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setToast({ type: 'success', message: 'Settings reset to defaults' });
    }
  };

  return (
    <AdminLayout currentPage="settings">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Configure your store and system settings</p>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading settings...</p>
          </div>
        ) : (
          <div className="settings-container">
            {/* Tabs */}
            <div className="settings-tabs">
              <button
                className={`tab ${activeTab === 'store' ? 'active' : ''}`}
                onClick={() => setActiveTab('store')}
              >
                Store Settings
              </button>
              <button
                className={`tab ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                Email Configuration
              </button>
              <button
                className={`tab ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Delivery
              </button>
              <button
                className={`tab ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
              >
                Payment & Tax
              </button>
              <button
                className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General Settings
              </button>
            </div>

            {/* Settings Content */}
            <div className="settings-content">
              {/* Store Settings */}
              {activeTab === 'store' && (
                <div className="tab-content">
                  <h2>Store Information</h2>
                  <p className="section-description">Manage your store's basic information and contact details</p>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Store Name *</label>
                      <input
                        type="text"
                        value={settings.store.name}
                        onChange={(e) => handleInputChange('store', 'name', e.target.value)}
                        placeholder="e.g., Tech Store"
                      />
                    </div>

                    <div className="form-group">
                      <label>Store Email *</label>
                      <input
                        type="email"
                        value={settings.store.email}
                        onChange={(e) => handleInputChange('store', 'email', e.target.value)}
                        placeholder="info@techstore.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>Store Phone *</label>
                      <input
                        type="tel"
                        value={settings.store.phone}
                        onChange={(e) => handleInputChange('store', 'phone', e.target.value)}
                        placeholder="1-800-123-4567"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Street Address *</label>
                      <input
                        type="text"
                        value={settings.store.address}
                        onChange={(e) => handleInputChange('store', 'address', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={settings.store.city}
                        onChange={(e) => handleInputChange('store', 'city', e.target.value)}
                        placeholder="New York"
                      />
                    </div>

                    <div className="form-group">
                      <label>State/Province *</label>
                      <input
                        type="text"
                        value={settings.store.state}
                        onChange={(e) => handleInputChange('store', 'state', e.target.value)}
                        placeholder="NY"
                      />
                    </div>

                    <div className="form-group">
                      <label>ZIP/Postal Code *</label>
                      <input
                        type="text"
                        value={settings.store.zipCode}
                        onChange={(e) => handleInputChange('store', 'zipCode', e.target.value)}
                        placeholder="10001"
                      />
                    </div>

                    <div className="form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        value={settings.store.country}
                        onChange={(e) => handleInputChange('store', 'country', e.target.value)}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Configuration */}
              {activeTab === 'email' && (
                <div className="tab-content">
                  <h2>Email Configuration</h2>
                  <p className="section-description">Configure SMTP settings for transactional emails</p>

                  <div className="info-box">
                    <AlertCircle size={16} />
                    <span>Configure your email provider to send transactional emails like order confirmations</span>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email Provider *</label>
                      <select
                        value={settings.email.provider}
                        onChange={(e) => handleInputChange('email', 'provider', e.target.value)}
                      >
                        <option value="SMTP">SMTP</option>
                        <option value="SendGrid">SendGrid</option>
                        <option value="Mailgun">Mailgun</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>SMTP Host *</label>
                      <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>SMTP Port *</label>
                      <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>

                    <div className="form-group">
                      <label>Sender Email *</label>
                      <input
                        type="email"
                        value={settings.email.senderEmail}
                        onChange={(e) => handleInputChange('email', 'senderEmail', e.target.value)}
                        placeholder="noreply@techstore.com"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Sender Name *</label>
                      <input
                        type="text"
                        value={settings.email.senderName}
                        onChange={(e) => handleInputChange('email', 'senderName', e.target.value)}
                        placeholder="Tech Store"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeTab === 'shipping' && (
                <div className="tab-content">
                  <h2>Shipping & Delivery</h2>
                  <p className="section-description">Configure shipping methods and rates</p>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Shipping Method *</label>
                      <select
                        value={settings.shipping.method}
                        onChange={(e) => handleInputChange('shipping', 'method', e.target.value)}
                      >
                        <option value="Standard">Standard Shipping</option>
                        <option value="Express">Express Shipping</option>
                        <option value="Overnight">Overnight Shipping</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Shipping Cost ($) *</label>
                      <input
                        type="number"
                        value={settings.shipping.cost}
                        onChange={(e) => handleInputChange('shipping', 'cost', parseFloat(e.target.value))}
                        placeholder="10.00"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Free Shipping Threshold ($) *</label>
                      <input
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                        placeholder="100.00"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Estimated Delivery Days *</label>
                      <input
                        type="number"
                        value={settings.shipping.estimatedDays}
                        onChange={(e) => handleInputChange('shipping', 'estimatedDays', parseInt(e.target.value))}
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="tab-content">
                  <h2>Payment & Tax</h2>
                  <p className="section-description">Configure payment methods and tax settings</p>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Payment Provider *</label>
                      <select
                        value={settings.payment.provider}
                        onChange={(e) => handleInputChange('payment', 'provider', e.target.value)}
                      >
                        <option value="Stripe">Stripe</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Square">Square</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Currency *</label>
                      <select
                        value={settings.payment.currency}
                        onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Tax Rate (%) *</label>
                      <input
                        type="number"
                        value={settings.payment.taxRate}
                        onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
                        placeholder="8.0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="tab-content">
                  <h2>General Settings</h2>
                  <p className="section-description">Configure general system settings</p>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Site Name *</label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                        placeholder="Tech Store"
                      />
                    </div>

                    <div className="form-group">
                      <label>Timezone *</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Language *</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={settings.general.maintenanceMode}
                          onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                        />
                        Enable Maintenance Mode
                      </label>
                      <p className="help-text">Disable access to your store while you make updates</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="settings-footer">
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset to Default
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
