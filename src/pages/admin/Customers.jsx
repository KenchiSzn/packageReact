import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const Customers = () => {
  const cookies = new Cookies();
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get(
          "http://localhost:5008/api/v1/users?role=user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCustomers(response.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load customers.");
      }
    };

    loadCustomers();
  }, []);

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.firstname} ${user.lastname}? Existing packages will be kept and this customer's references will be cleared.`,
    );
    if (!confirmed) return;

    setDeletingId(user._id);
    setError("");
    try {
      const token = cookies.get("token");
      await axios.delete(`http://localhost:5008/api/v1/users/${user._id}`,
         {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setCustomers((current) =>
        current.filter((item) => item._id !== user._id),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete customer.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Customers</h2>
          <p>View registered customers.</p>
        </div>
        <span className="page-status">{customers.length} customers</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="page-panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>
                    {user.firstname} {user.lastname}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || "Not provided"}</td>
                  <td>
                    <span className="page-status">{user.role}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={deletingId === user._id}
                      onClick={() => handleDelete(user)}
                      aria-label={`Delete customer ${user.firstname} ${user.lastname}`}
                    >
                      {deletingId === user._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!customers.length && !error && (
          <div className="page-empty">No customers to display.</div>
        )}
      </section>
    </div>
  );
};

export default Customers;
