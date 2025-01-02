import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ChoroplethMap from './map/ChoroplethMap';
import About from './About';
import Footer from './footer/Footer';
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <ChoroplethMap />
            <Footer />
        </>,
    },
    {
        path: "/about",
        element: <>
            <About />
            <Footer />
        </>,
    },
    {
        path: "*",
        element: <>
            <ChoroplethMap />
            <Footer />
        </>,
    }
]);

// Render the app with RouterProvider and pass the router object
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
