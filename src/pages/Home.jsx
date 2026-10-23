import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5008/api/v1/packages/trackpackage/${trackingId.trim()}`,
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to track package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero-Section */}
            <section className="home-hero">
              <div className="hero-section text-center">
              <div className="container">
                <div className="row justify-content-center align-items-center">
                  <div className="col-lg-8 col-md-10 col-12">
                    <h1 className="hero-title">Delivery Express</h1>
                    <p className="hero-subtitle">
                      Explore ways to become more efficient, see printing
                      offers, solutions, insights and inspiration for your small
                      business.
                    </p>
                    <form id="tracking" className="tracking-form" onSubmit={handleTrack}>
                      <input
                        type="text"
                        name="trackingId"
                        className="tracking-input"
                        placeholder="TRACKING ID"
                        value={trackingId}
                        aria-label="Tracking ID"
                        required
                        onChange={(e) => setTrackingId(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="tracking-button"
                        disabled={loading}
                      >
                        {loading ? "Tracking" : "Track Package"}
                      </button>
                    </form>

                    {error && (
                      <div className="alert alert-danger mt-3" role="alert">
                        {error}
                      </div>
                    )}

                    {result && (
                      <section
                        className="tracking-result"
                        aria-label="Package tracking result"
                        aria-live="polite"
                      >
                        <div className="tracking-result__header">
                          <div>
                            <p className="tracking-result__eyebrow">
                              Tracking number
                            </p>
                            <h2 className="tracking-result__number">
                              {result.package.trackingNumber}
                            </h2>
                          </div>
                          <span className="tracking-result__status">
                            {result.package.status.replaceAll("_", " ")}
                          </span>
                        </div>

                        <div className="tracking-result__details">
                          <div className="tracking-result__detail">
                            <span>Current location</span>
                            <strong>
                              {result.package.currentLocation || "—"}
                            </strong>
                          </div>
                          <div className="tracking-result__detail">
                            <span>Origin</span>
                            <strong>{result.package.origin}</strong>
                          </div>
                          <div className="tracking-result__detail">
                            <span>Destination</span>
                            <strong>{result.package.destination}</strong>
                          </div>
                        </div>

                        <div className="tracking-result__history">
                          <h3>Tracking history</h3>
                          {result.history.length > 0 ? (
                            <ol className="tracking-timeline">
                              {result.history.map((h) => (
                                <li
                                  className="tracking-timeline__item"
                                  key={h._id}
                                >
                                  <time dateTime={h.createdAt}>
                                    {new Date(h.createdAt).toLocaleString()}
                                  </time>
                                  <strong>
                                    {h.status.replaceAll("_", " ")}
                                  </strong>
                                  <span>{h.location}</span>
                                  {h.description && <p>{h.description}</p>}
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="tracking-result__empty">
                              No tracking updates have been added yet.
                            </p>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </section>

      {/*  */}

      <div className="services">
        <div className="container p-0">
          <div className="row g-3">
            <div className="col-lg-4 col-md-4 col-12">
              <div className="service-box">
                <span className="service-number">01</span>
                <div className="icon-box">
                  <i className="bi bi-truck"></i>
                </div>
                <h3 className="fw-bold">Express Delivery</h3>
                <p>
                  Optimized routes and dedicated fleet ensure your cargo arrives
                  on time, every single time.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="service-box">
                <span className="service-number">02</span>

                <div className="icon-box">
                  <i className="bi bi-shield-fill"></i>
                </div>

                <h3 className="fw-bold">Secure Transport</h3>

                <p>
                  Advanced tracking and security protocols keep your valuable
                  goods safe during transit.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="service-box">
                <span className="service-number">03</span>
                <div className="icon-box">
                  <i className="bi bi-globe-americas"></i>
                </div>
                <h3 className="fw-bold">Global Network</h3>
                <p>
                  Connected with major ports and hubs worldwide for seamless
                  international trade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  */}

      <section className="services-heading">
        <div className="container">
          <div className="offer text-center">
            <div className="d-flex gap-5 justify-content-center align-items-center">
              <div className="dash"></div>
              <p className="label-text">WHAT WE OFFER</p>
              <div className="dash"></div>
            </div>
            <h1 className="services-title">Our Premium Logistics Services</h1>
            <p className="services-description">
              Comprehensive transportation solutions tailored to meet your
              specific business requirements
            </p>
          </div>
          <div className="row g-4">
            {/* Service-Ocean */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="service-image">
                  <img src="./src/assets/ocean.jpg" alt="Ocean Freight" />
                  <div className="service-icon">
                    <i className="bi bi-ship-fill"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 fw-bold ">OCEAN FREIGHT</h3>
                  <p className="mb-4 lead fs-5">
                    Comprehensive sea freight services for FCL and LCL shipments
                    to global destinations with competitive rates.
                  </p>
                  <a href="#" className="learn-more">
                    LEARN MORE
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Service-Airplane */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="service-image">
                  <img src="./src/assets/air.jpg" alt="Air Cargo" />
                  <div className="service-icon">
                    <i className="bi bi-airplane-fill"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 fw-bold ">AIR CARGO</h3>
                  <p className="mb-4 lead fs-5">
                    Expedited air transport solutions for time-sensitive and
                    high-value goods with priority handling.
                  </p>
                  <a href="#" className="learn-more">
                    LEARN MORE
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
            {/* Service-Truck */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="service-image">
                  <img src="./src/assets/truck.jpg" alt="Land Transport" />
                  <div className="service-icon">
                    <i className="bi bi-truck"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 fw-bold ">LAND TRANSPORT</h3>
                  <p className="mb-4 lead fs-5">
                    Flexible trucking and rail options for domestic and
                    cross-border distribution with real-time tracking.
                  </p>
                  <a href="#" className="learn-more">
                    LEARN MORE
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Warehosuing */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="service-image">
                  <img src="./src/assets/warehouse.jpg" alt="Warehouse" />
                  <div className="service-icon">
                    <i className="bi bi-building-fill"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 fw-bold ">Warehousing</h3>
                  <p className="mb-4 lead fs-5">
                    State-of-the-art storage facilities with inventory
                    management and distribution services.
                  </p>
                  <a href="#" className="learn-more">
                    LEARN MORE
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Customs */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="service-image">
                  <img src="./src/assets/customs.jpg" alt="Air Cargo" />
                  <div className="service-icon">
                    <i className="bi bi-shield-fill"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 fw-bold ">CUSTOMS CLEARING</h3>
                  <p className="mb-4 lead fs-5">
                    Expert assistance with documentation and regulatory
                    compliance for international shipments.
                  </p>
                  <a href="#" className="learn-more">
                    LEARN MORE
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Cargo */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="service-card h-100">
                <div className="service-image">
                  <img src="./src/assets/cargoes.jpg" alt="Air Cargo" />
                  <div className="service-icon">
                    <i className="bi bi-box-fill"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 fw-bold ">SPECIAL CARGO</h3>
                  <p className="mb-4 lead fs-5">
                    Specialized handling for oversized, hazardous, and
                    temperature-controlled cargo shipments.
                  </p>
                  <a href="#" className="learn-more">
                    LEARN MORE
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}

      <section className="timeline-demo">
        <div className="container">
          <div className="timeline-heading text-center">
            <p className="label-text">HOW IT WORKS</p>
            <h2>From pickup to delivery</h2>
            <p>
              A simple, transparent process keeps every shipment moving with
              confidence.
            </p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="main-timeline">
                {/* Timeline-1-right */}
                <div className="timeline">
                  <div className="timeline-icon">
                    <span>1</span>
                  </div>
                  <div className="timeline-content right">
                    <h2 className="title">Order Placement:</h2>
                    <p className="description">
                      Customers submit orders online or through phone,
                      specifying pickup, delivery details, and cargo type
                      initiating the process.
                    </p>
                  </div>
                </div>

                {/* Timeline-2-left */}
                <div className="timeline">
                  <div className="timeline-icon">
                    <span>2</span>
                  </div>
                  <div className="timeline-content left">
                    <h2 className="title">Route Planning:</h2>
                    <p className="description">
                      Utilizing advanced software, optimal routes are determined
                      considering factors like distance, traffic, and delivery
                      priorities.
                    </p>
                  </div>
                </div>

                {/* Timeline-3-right */}
                <div className="timeline">
                  <div className="timeline-icon">
                    <span>3</span>
                  </div>
                  <div className="timeline-content right">
                    <h2 className="title">Transportation:</h2>
                    <p className="description">
                      Goods are loaded into appropriate vehicles and dispatched,
                      ensuring proper handling, safety, and adherence to
                      delivery schedules.
                    </p>
                  </div>
                </div>

                {/* Timeline-4-left */}
                <div className="timeline">
                  <div className="timeline-icon">
                    <span>4</span>
                  </div>
                  <div className="timeline-content left">
                    <h2 className="title">Tracking and Monitoring:</h2>
                    <p className="description">
                      Real-time tracking systems monitor progress, providing
                      updates to customers and enabling proactive management of
                      any issues.
                    </p>
                  </div>
                </div>

                {/* Timeline-5-right */}

                <div className="timeline">
                  <div className="timeline-icon">
                    <span>5</span>
                  </div>
                  <div className="timeline-content right">
                    <h2 className="title">Tracking and Monitoring:</h2>
                    <p className="description">
                      Real-time tracking systems monitor progress, providing
                      updates to customers and enabling proactive management of
                      any issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked */}

      <section className="Frequently-asked">
        <div className="container">
          <div className="row justify-content-center align-items-start g-5">
            <div className="col-12 col-md-5">
              <div className="faq-intro">
                <h6>Everything You Need to Know</h6>
                <h2>
                  Frequently Asked
                  <br />
                  Questions
                </h2>
                <p>
                  Find quick answers to common questions about our shipping,
                  tracking, and cargo services.
                </p>
              </div>
            </div>
            {/* Accordion */}
            <div className="col-12 col-md-7">
              <div
                className="accordion accordion-flush custom-faq"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      How often should I check my shipment status?
                    </button>
                  </h2>

                  <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      We recommend checking your shipment status every 24-48
                      hours for international freight. Our real-time tracking
                      system updates automatically at every major checkpoint.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      What should I do if my cargo is delayed?
                    </button>
                  </h2>

                  <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      Delays can happen due to weather or customs. If your
                      tracking shows a delay, please contact our 24/7 support
                      team immediately. We will investigate and provide you with
                      an updated delivery schedule.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseThree"
                      aria-expanded="false"
                      aria-controls="flush-collapseThree"
                    >
                      Do you offer specialized services for fragile items?
                    </button>
                  </h2>
                  <div
                    id="flush-collapseThree"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      Yes, we have specialized packaging and handling protocols
                      for fragile and high-value items. Please mention this when
                      requesting a quote so we can arrange the appropriate care.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseFour"
                      aria-expanded="false"
                      aria-controls="flush-collapseFour"
                    >
                      What are my options for international shipping?
                    </button>
                  </h2>
                  <div
                    id="flush-collapseFour"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      We offer Air Freight for speed, Ocean Freight for
                      cost-effectiveness, and Multimodal Transport for a balance
                      of both. We can help you choose the best option based on
                      your budget and timeline.
                    </div>
                  </div>
                </div>
                {/* Question 5 */}
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseFive"
                      aria-expanded="false"
                      aria-controls="flush-collapseFive"
                    >
                      Is cargo insurance mandatory?
                    </button>
                  </h2>
                  <div
                    id="flush-collapseFive"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      While not legally mandatory for all shipments, we strongly
                      advise it. Carrier liability is often limited, so our
                      comprehensive insurance ensures you are fully covered
                      against unforeseen events.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
