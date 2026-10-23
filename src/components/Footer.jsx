const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a className="footer-brand__name" href="/" aria-label="Delivery Express home">
              <span className="footer-logo">
                <i className="bi bi-box-seam" />
              </span>
              <span>Delivery Express</span>
            </a>
            <p className="footer-brand__tagline">
              Fast, secure, global logistics.
            </p>
          </div>

          <nav className="footer-column" aria-label="Quick links">
            <h2 className="footer-heading">Quick Links</h2>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Our Fleet</a>
              <a href="#">Our Services</a>
              <a href="#">Track Shipment</a>
              <a href="#">News & Blog</a>
              <a href="#">Contact</a>
            </div>
          </nav>

          <nav className="footer-column" aria-label="Services">
            <h2 className="footer-heading">Services</h2>
            <div className="footer-links">
              <a href="#">Ocean Freight</a>
              <a href="#">Air Cargo</a>
              <a href="#">Land Transport</a>
              <a href="#">Warehousing</a>
              <a href="#">Customs Clearance</a>
            </div>
          </nav>

          <div className="footer-column footer-contact">
            <h2 className="footer-heading">Get in Touch</h2>
            <a href="mailto:support@deliveryexpress.com">
              <i className="bi bi-envelope" aria-hidden="true" />
              <span>support@deliveryexpress.com</span>
            </a>
            <a href="tel:+18005550142">
              <i className="bi bi-telephone" aria-hidden="true" />
              <span>+1 (800) 555-0142</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Delivery Express. All rights reserved.</p>
          <p>Fast, secure, and delivered with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
