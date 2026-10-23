const Notifications = () => (
  <div className="page-container">
    <div className="page-heading">
      <div>
        <h2>Notifications</h2>
        <p>View new delivery assignments and shipment alerts.</p>
      </div>
    </div>
    <section className="page-panel">
      <div className="page-empty">
        <i className="bi bi-bell"></i>
        <h5>No notifications available</h5>
        <p>A notification API is needed to load and save driver alerts.</p>
      </div>
    </section>
  </div>
);

export default Notifications;