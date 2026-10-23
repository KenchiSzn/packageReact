import { useState } from "react";

const AdminSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deliveryAlerts, setDeliveryAlerts] = useState(true);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your dashboard preferences.</p>
        </div>
      </div>

      <section className="page-panel">
        <h5 className="mb-4">Notification Preferences</h5>

        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="emailAlerts"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="emailAlerts">
            Email notifications
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="deliveryAlerts"
            checked={deliveryAlerts}
            onChange={(e) => setDeliveryAlerts(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="deliveryAlerts">
            Delivery status alerts
          </label>
        </div>

        <p className="text-secondary small mt-4 mb-0">
          These preferences are currently stored in component state only.
          Add a settings endpoint to persist them in MongoDB.
        </p>
      </section>
    </div>
  );
};

export default AdminSettings;