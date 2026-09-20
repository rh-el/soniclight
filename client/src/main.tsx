import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import "../index.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Draw from "./pages/Draw";
import Layout from "./pages/Layout";
import Admin from "./pages/Admin";
import {
	adminDrawingLoader,
	adminLoader,
	drawLoader,
	homeLoader,
	redirectIfLoggedInLoader,
} from "./loaders";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/:username/home",
				loader: homeLoader,
				element: <Home />,
			},
			{
				path: "/:username/gallery",
				loader: adminLoader,
				element: <Admin />,
			},
		],
	},
	{
		path: "/admin/drawing/:drawid",
		loader: adminDrawingLoader,
		element: <Draw readOnly />,
	},
	{
		path: "/:username/draw/:drawid",
		loader: drawLoader,
		element: <Draw />,
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
