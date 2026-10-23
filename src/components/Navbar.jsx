import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg site-navbar">
      <div className="container">
        <Link className="navbar-brand site-navbar__brand" to="/">
          <span className="site-navbar__mark" aria-hidden="true">
            <i className="bi bi-box-seam" />
          </span>
          <span>Delivery Express</span>
        </Link>

        <button
          className="navbar-toggler site-navbar__toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#site-navbar-menu"
          aria-controls="site-navbar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="site-navbar-menu">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link site-navbar__link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link site-navbar__link" to="/#tracking">
                Track package
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link site-navbar__link" to="/login">
                Log in
              </Link>
            </li>
            <li className="nav-item">
              <Link className="site-navbar__cta" to="/signup">
                Get started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
