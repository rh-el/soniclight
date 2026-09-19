import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import "../index.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { homeLoader, redirectIfLoggedInLoader } from "./loaders";

const router = createBrowserRouter([
	{
		path: "/:username/home",
		loader: homeLoader,
		element: <Home />,
	},
	{
		path: "/login",
		loader: redirectIfLoggedInLoader,
		element: <Login />,
	},
	{
		path: "/signup",
		loader: redirectIfLoggedInLoader,
		element: <Signup />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
