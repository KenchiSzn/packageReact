import { useState } from "react";

const UserSettings = () => {
  const [shipmentAlerts, setShipmentAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your account preferences.</p>
        </div>
      </div>

      <section className="page-panel">
        <h5 className="mb-4">Notification Preferences</h5>

        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="shipmentAlerts"
            checked={shipmentAlerts}
            onChange={(e) => setShipmentAlerts(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="shipmentAlerts">
            Shipment status alerts
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="userEmailAlerts"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="userEmailAlerts">
            Email notifications
          </label>
        </div>

        <p className="small text-secondary mt-4 mb-0">
          Preferences are temporary until a backend settings endpoint is added.
        </p>
      </section>
    </div>
  );
};

export default UserSettings;