import { useState } from "react";

const Settings = () => {
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your driver preferences.</p>
        </div>
      </div>

      <section className="page-panel">
        <h5 className="mb-4">Delivery Preferences</h5>

        <div className="form-check form-switch mb-4">
          <input className="form-check-input" type="checkbox"
            id="assignmentAlerts" checked={assignmentAlerts}
            onChange={(e) => setAssignmentAlerts(e.target.checked)} />
          <label className="form-check-label" htmlFor="assignmentAlerts">
            New delivery assignment alerts
          </label>
        </div>

        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox"
            id="statusAlerts" checked={statusAlerts}
            onChange={(e) => setStatusAlerts(e.target.checked)} />
          <label className="form-check-label" htmlFor="statusAlerts">
            Delivery status alerts
          </label>
        </div>

        <p className="small text-secondary mt-4 mb-0">
          These settings are temporary until a settings API is added.
        </p>
      </section>
    </div>
  );
};

export default Settings;