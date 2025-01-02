import { Link } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './footer.css';

export default function Footer() {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
            <p className="col-md-4 mb-0 text-muted">2024 AtlasNinja</p>

            <ul className="nav justify-content-end">
                <li className="nav-item"><Link to="/" className="nav-link px-2 text-muted">Home</Link ></li>
                <li className="nav-item"><Link to="/about" className="nav-link px-2 text-muted">About</Link ></li>
            </ul>
        </footer>
    );
}