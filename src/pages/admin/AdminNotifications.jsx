const AdminNotifications = () => (
  <div className="page-container">
    <div className="page-heading">
      <div>
        <h2>Notifications</h2>
        <p>Stay informed about package and delivery activity.</p>
      </div>
    </div>
    <section className="page-panel">
      <div className="page-empty">
        <i className="bi bi-bell"></i>
        <h5>No notifications available</h5>
        <p>A notifications API is required to display saved alerts.</p>
      </div>
    </section>
  </div>
);

export default AdminNotifications;