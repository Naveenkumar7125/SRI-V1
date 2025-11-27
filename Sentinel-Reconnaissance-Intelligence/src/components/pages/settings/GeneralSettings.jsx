import SectionCard from "../SectionCard";
import FormField from "../FormField";
import ToggleItem from "../ToggleItem";

const GeneralSettings = () => {
  return (
    <div className="tab-content">

      <SectionCard title="Application Settings">
        <div className="settings-grid">

          <FormField label="Application Name">
            <input type="text" placeholder="Enter name..." />
          </FormField>

          <FormField label="Timezone">
            <select>
              <option>UTC-05:00</option>
              <option>UTC+00:00</option>
            </select>
          </FormField>

        </div>
      </SectionCard>

      <SectionCard title="System Control">
        <ToggleItem 
          label="Maintenance Mode"
          description="Enable or disable maintenance mode"
          checked={false}
        />
      </SectionCard>

    </div>
  );
};

export default GeneralSettings;
