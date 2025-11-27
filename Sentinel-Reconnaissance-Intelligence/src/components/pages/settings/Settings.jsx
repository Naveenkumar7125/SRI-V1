import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    appName: "Enterprise Dashboard",
    timezone: "UTC-05:00",
    dateFormat: "MM/DD/YYYY",
    language: "en-US",
    maxUsers: 50,
    maintenanceMode: false,

    // Security Settings
    sessionTimeout: 30,
    passwordPolicy: "strong",
    twoFactorAuth: true,
    ipWhitelist: ["192.168.1.0/24"],
    loginAttempts: 5,

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    slackIntegration: false,
    weeklyReports: true,
    securityAlerts: true,
    billingAlerts: false,

    // Data & Storage
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 90,
    exportFormat: "csv",
    storageLimit: 1000,
    compressionEnabled: true,

    // API & Integrations
    apiEnabled: true,
    apiRateLimit: 1000,
    webhookUrl: "",
    slackWebhook: "",
    auditLogs: true,

    // Performance
    cacheEnabled: true,
    cacheDuration: 3600,
    logLevel: "info",
    performanceMode: false,
    cdnEnabled: false,
  });

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    alert("Settings saved successfully");
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to default values?")) {
      setSettings({
        appName: "Enterprise Dashboard",
        timezone: "UTC-05:00",
        dateFormat: "MM/DD/YYYY",
        language: "en-US",
        maxUsers: 50,
        maintenanceMode: false,
        sessionTimeout: 30,
        passwordPolicy: "strong",
        twoFactorAuth: true,
        ipWhitelist: ["192.168.1.0/24"],
        loginAttempts: 5,
        emailNotifications: true,
        pushNotifications: false,
        slackIntegration: false,
        weeklyReports: true,
        securityAlerts: true,
        billingAlerts: false,
        autoBackup: true,
        backupFrequency: "daily",
        retentionPeriod: 90,
        exportFormat: "csv",
        storageLimit: 1000,
        compressionEnabled: true,
        apiEnabled: true,
        apiRateLimit: 1000,
        webhookUrl: "",
        slackWebhook: "",
        auditLogs: true,
        cacheEnabled: true,
        cacheDuration: 3600,
        logLevel: "info",
        performanceMode: false,
        cdnEnabled: false,
      });
      alert("Settings reset to default");
    }
  };

  const renderGeneralSettings = () => (
    <div className="tab-content">
      <div className="settings-group">
        <h3>Application Settings</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Application Name</label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => handleSettingChange("appName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
            >
              <option value="UTC-08:00">Pacific Time (UTC-8)</option>
              <option value="UTC-05:00">Eastern Time (UTC-5)</option>
              <option value="UTC+00:00">GMT (UTC+0)</option>
              <option value="UTC+01:00">CET (UTC+1)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) =>
                handleSettingChange("dateFormat", e.target.value)
              }
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="form-group">
            <label>Language</label>
            <select
              value={settings.language}
              onChange={(e) =>
                handleSettingChange("language", e.target.value)
              }
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
            </select>
          </div>
          <div className="form-group">
            <label>Maximum Users</label>
            <input
              type="number"
              value={settings.maxUsers}
              onChange={(e) =>
                handleSettingChange("maxUsers", parseInt(e.target.value, 10))
              }
              min="1"
              max="10000"
            />
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>System Status</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Maintenance Mode</span>
              <span className="toggle-description">
                Put the system in maintenance mode
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  handleSettingChange("maintenanceMode", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="tab-content">
      <div className="settings-group">
        <h3>Authentication</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                handleSettingChange(
                  "sessionTimeout",
                  parseInt(e.target.value, 10)
                )
              }
              min="5"
              max="480"
            />
          </div>
          <div className="form-group">
            <label>Max Login Attempts</label>
            <input
              type="number"
              value={settings.loginAttempts}
              onChange={(e) =>
                handleSettingChange(
                  "loginAttempts",
                  parseInt(e.target.value, 10)
                )
              }
              min="1"
              max="10"
            />
          </div>
          <div className="form-group">
            <label>Password Policy</label>
            <select
              value={settings.passwordPolicy}
              onChange={(e) =>
                handleSettingChange("passwordPolicy", e.target.value)
              }
            >
              <option value="basic">Basic (6+ characters)</option>
              <option value="medium">Medium (8+ chars, mixed case)</option>
              <option value="strong">Strong (12+ chars, special chars)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Security Features</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Two-Factor Authentication</span>
              <span className="toggle-description">
                Require 2FA for all users
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) =>
                  handleSettingChange("twoFactorAuth", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Audit Logs</span>
              <span className="toggle-description">
                Log all system activities
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.auditLogs}
                onChange={(e) =>
                  handleSettingChange("auditLogs", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>IP Restrictions</h3>
        <div className="form-group full-width">
          <label>IP Whitelist</label>
          <textarea
            value={settings.ipWhitelist.join("\n")}
            onChange={(e) =>
              handleSettingChange("ipWhitelist", e.target.value.split("\n"))
            }
            placeholder="Enter one IP or CIDR per line"
            rows="4"
          />
          <div className="help-text">
            Specify allowed IP addresses in CIDR notation
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="tab-content">
      <div className="settings-group">
        <h3>Notification Channels</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Email Notifications</span>
              <span className="toggle-description">
                Receive system alerts via email
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleSettingChange("emailNotifications", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Push Notifications</span>
              <span className="toggle-description">
                Browser push notifications
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) =>
                  handleSettingChange("pushNotifications", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Slack Integration</span>
              <span className="toggle-description">
                Send alerts to Slack channels
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.slackIntegration}
                onChange={(e) =>
                  handleSettingChange("slackIntegration", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Alert Types</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Security Alerts</span>
              <span className="toggle-description">
                Immediate security notifications
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.securityAlerts}
                onChange={(e) =>
                  handleSettingChange("securityAlerts", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Weekly Reports</span>
              <span className="toggle-description">
                Automated weekly system reports
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) =>
                  handleSettingChange("weeklyReports", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Billing Alerts</span>
              <span className="toggle-description">
                Usage and billing notifications
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.billingAlerts}
                onChange={(e) =>
                  handleSettingChange("billingAlerts", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="tab-content">
      <div className="settings-group">
        <h3>Backup &amp; Recovery</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) =>
                handleSettingChange("backupFrequency", e.target.value)
              }
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Retention Period (days)</label>
            <input
              type="number"
              value={settings.retentionPeriod}
              onChange={(e) =>
                handleSettingChange(
                  "retentionPeriod",
                  parseInt(e.target.value, 10)
                )
              }
              min="1"
              max="365"
            />
          </div>
          <div className="form-group">
            <label>Export Format</label>
            <select
              value={settings.exportFormat}
              onChange={(e) =>
                handleSettingChange("exportFormat", e.target.value)
              }
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div className="form-group">
            <label>Storage Limit (GB)</label>
            <input
              type="number"
              value={settings.storageLimit}
              onChange={(e) =>
                handleSettingChange(
                  "storageLimit",
                  parseInt(e.target.value, 10)
                )
              }
              min="1"
              max="10000"
            />
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Data Management</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Automatic Backups</span>
              <span className="toggle-description">
                Automatically backup system data
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) =>
                  handleSettingChange("autoBackup", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Data Compression</span>
              <span className="toggle-description">
                Compress stored data to save space
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.compressionEnabled}
                onChange={(e) =>
                  handleSettingChange(
                    "compressionEnabled",
                    e.target.checked
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="tab-content">
      <div className="settings-group">
        <h3>API Configuration</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>API Rate Limit (requests/hour)</label>
            <input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) =>
                handleSettingChange(
                  "apiRateLimit",
                  parseInt(e.target.value, 10)
                )
              }
              min="100"
              max="10000"
            />
          </div>
          <div className="form-group full-width">
            <label>Webhook URL</label>
            <input
              type="url"
              value={settings.webhookUrl}
              onChange={(e) =>
                handleSettingChange("webhookUrl", e.target.value)
              }
              placeholder="https://api.example.com/webhook"
            />
          </div>
          <div className="form-group full-width">
            <label>Slack Webhook URL</label>
            <input
              type="url"
              value={settings.slackWebhook}
              onChange={(e) =>
                handleSettingChange("slackWebhook", e.target.value)
              }
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Integration Features</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">API Access</span>
              <span className="toggle-description">
                Enable REST API for integrations
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.apiEnabled}
                onChange={(e) =>
                  handleSettingChange("apiEnabled", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">CDN Enabled</span>
              <span className="toggle-description">
                Use CDN for static assets
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.cdnEnabled}
                onChange={(e) =>
                  handleSettingChange("cdnEnabled", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="tab-content">
      <div className="settings-group">
        <h3>Performance Settings</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Cache Duration (seconds)</label>
            <input
              type="number"
              value={settings.cacheDuration}
              onChange={(e) =>
                handleSettingChange(
                  "cacheDuration",
                  parseInt(e.target.value, 10)
                )
              }
              min="60"
              max="86400"
            />
          </div>
          <div className="form-group">
            <label>Log Level</label>
            <select
              value={settings.logLevel}
              onChange={(e) =>
                handleSettingChange("logLevel", e.target.value)
              }
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Optimization</h3>
        <div className="toggle-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Caching</span>
              <span className="toggle-description">Enable data caching</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.cacheEnabled}
                onChange={(e) =>
                  handleSettingChange("cacheEnabled", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Performance Mode</span>
              <span className="toggle-description">
                Optimize for speed over resources
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.performanceMode}
                onChange={(e) =>
                  handleSettingChange("performanceMode", e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>System Settings</h1>
        <p>Configure your application preferences and system behavior</p>
      </div>

      <div className="settings-tabs">
        <nav className="tabs-nav">
          <button
            className={`tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
          <button
            className={`tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            Data &amp; Storage
          </button>
          <button
            className={`tab ${
              activeTab === "integrations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("integrations")}
          >
            Integrations
          </button>
          <button
            className={`tab ${
              activeTab === "performance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
        </nav>
      </div>

      <div className="settings-content">
        {activeTab === "general" && renderGeneralSettings()}
        {activeTab === "security" && renderSecuritySettings()}
        {activeTab === "notifications" && renderNotificationSettings()}
        {activeTab === "data" && renderDataSettings()}
        {activeTab === "integrations" && renderIntegrationSettings()}
        {activeTab === "performance" && renderPerformanceSettings()}
      </div>

      <div className="settings-footer">
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
