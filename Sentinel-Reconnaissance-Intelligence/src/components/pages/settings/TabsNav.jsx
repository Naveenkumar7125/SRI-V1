const SettingsTabs = [
  { id: "general", label: "General" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "data", label: "Data & Storage" },
  { id: "integrations", label: "Integrations" },
  { id: "performance", label: "Performance" }
];

const TabsNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="settings-tabs">
      <div className="tabs-nav">
        {SettingsTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabsNav;
