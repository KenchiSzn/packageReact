import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import Cookies from "universal-cookie";


const CreatePackage = () => {
    const navigate = useNavigate();
    const cookies = new Cookies()

    const [formData, setFormData] = useState({
        sender: "",
        receiver: "",
        origin: "",
        destination: "",
        packageType: "other",
        weight: "",
        currentLocation: "",
        status: "Order Created",
        estimatedDelivery: "",
        assignedDriver: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {

            const token = cookies.get("token");

            const payload = {
                sender: formData.sender.trim(),
                receiver: formData.receiver.trim(),
                origin: formData.origin.trim(),
                destination: formData.destination.trim(),
                packageType: formData.packageType,
                weight: Number(formData.weight),
                status: formData.status,
                currentLocation: formData.currentLocation.trim() || undefined,
                estimatedDelivery: formData.estimatedDelivery || undefined,
                assignedDriver: formData.assignedDriver.trim() || undefined,
            };

            const response = await axios.post(
                "http://localhost:5008/api/v1/packages/createpackage",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccess(
                response.data.message || "Package created successfully!"
            );
            setFormData({
                sender: "",
                receiver: "",
                origin: "",
                destination: "",
                packageType: "other",
                weight: "",
                currentLocation: "",
                status: "order_created",
                estimatedDelivery: "",
                assignedDriver: "",
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create package. Please check the details and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluID py-4 px-3 px-md-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Create Package</h2>
                    <p className="text-secondary mb-0">
                        Register a shipment and assign its delivery details.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-3 p-md-4 p-lg-5">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            <i className="bi bi-check-circle me-2"></i>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Package information */}
                        <div className="mb-4">
                            <h5 className="fw-bold mb-1">Package Information</h5>
                            <p className="text-secondary small">
                                Enter the shipment IDentification and package details.
                            </p>
                            <hr />
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Package Type *
                                </label>
                                <select
                                    name="packageType"
                                    className="form-select"
                                    value={formData.packageType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="document">Document</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="food">Food</option>
                                    <option value="fragile">Fragile</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Weight (kg) *
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    className="form-control"
                                    placeholder="e.g. 2.5"
                                    min="0.01"
                                    step="0.01"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Initial Status
                                </label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value=""></option>
                                    <option value="order_created">Order Created</option>
                                    <option value="picked_up">Picked Up</option>
                                    <option value="processing">Processing</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="arrived_at_distribution_center">
                                        Arrived at Distribution Center
                                    </option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        {/* Sender and receiver */}
                        <div className="mt-5 mb-4">
                            <h5 className="fw-bold mb-1">Sender & Receiver</h5>
                            <p className="text-secondary small">
                                Enter the  user IDs of the sender and receiver.
                            </p>
                            <hr />
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Sender User ID *
                                </label>
                                <input
                                    type="text"
                                    name="sender"
                                    className="form-control"
                                    placeholder="Enter sender's ID"
                                    value={formData.sender}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Receiver User ID *
                                </label>
                                <input
                                    type="text"
                                    name="receiver"
                                    className="form-control"
                                    placeholder="Enter receiver's  ID"
                                    value={formData.receiver}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        {/* Delivery details */}
                        <div className="mt-5 mb-4">
                            <h5 className="fw-bold mb-1">Delivery Details</h5>
                            <p className="text-secondary small">
                                Specify where the package is going and its delivery schedule.
                            </p>
                            <hr />
                        </div>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Origin *
                                </label>
                                <input
                                    type="text"
                                    name="origin"
                                    className="form-control"
                                    placeholder="e.g. Osogbo, Osun State"
                                    value={formData.origin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Destination *
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    className="form-control"
                                    placeholder="e.g. Ikeja, Lagos State"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Current Location
                                </label>
                                <input
                                    type="text"
                                    name="currentLocation"
                                    className="form-control"
                                    placeholder="Current package location"
                                    value={formData.currentLocation}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Estimated Delivery
                                </label>
                                <input
                                    type="date"
                                    name="estimatedDelivery"
                                    className="form-control"
                                    min={new Date().toLocaleDateString("en-CA")}
                                    value={formData.estimatedDelivery}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Assigned Driver User ID
                                </label>
                                <input
                                    type="text"
                                    name="assignedDriver"
                                    className="form-control"
                                    placeholder="Optional: enter driver's  ID"
                                    value={formData.assignedDriver}
                                    onChange={handleChange}
                                />
                                <small className="text-secondary">
                                    Leave empty if a driver has not been assigned.
                                </small>
                            </div>
                        </div>

                        <hr className="my-5" />

                        <div className="d-flex flex-column flex-sm-row justify-content-end gap-3">
                            <button
                                type="button"
                                className="btn btn-light border px-4"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Creating Package...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Create Package
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePackage