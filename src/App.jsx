// src/App.jsx
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layouts/Layout";
import DashBord from "./Pages/DashBord";
import { Toaster } from "sonner";

import AddCategory from "./Pages/Category/AddCategory";
import ListCategory from "./Pages/Category/ListCategory";
import EditCategory from "./Pages/Category/EditCategory";

import Login from "./Pages/Auth/Login";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import Profile from "./Pages/Auth/Profile";

import AddProduct from "./Pages/Product/AddProduct";
import ListProduct from "./Pages/Product/ListProduct";
import EditProduct from "./Pages/Product/EditProduct";

import ListEnquiry from "./Pages/Contact/ListEnquiry";
import HomeImage from "./Pages/Home/HomeImage";
import Video from "./Pages/Home/Video";

import ProtectedRoute from "./Pages/ProtectRoute/ProtectRoute";

function App() {
  const appRouter = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },

    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DashBord /> },
        { path: "profile", element: <Profile /> },
        { path: "video", element: <Video /> },
        { path: "image", element: <HomeImage /> },

        {
          name: "Category",
          children: [
            {
              path: "addcategory",
              element: (
                <ProtectedRoute adminOnly>
                  <AddCategory />
                </ProtectedRoute>
              ),
            },
            {
              path: "listcategory",
              element: (
                <ProtectedRoute adminOnly>
                  <ListCategory />
                </ProtectedRoute>
              ),
            },
            {
              path: "editcategory/:id",
              element: (
                <ProtectedRoute adminOnly>
                  <EditCategory />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          name: "Product",
          children: [
            {
              path: "addproduct",
              element: (
                <ProtectedRoute adminOnly>
                  <AddProduct />
                </ProtectedRoute>
              ),
            },
            {
              path: "listproduct",
              element: (
                <ProtectedRoute adminOnly>
                  <ListProduct />
                </ProtectedRoute>
              ),
            },
            {
              path: "editproduct/:id",
              element: (
                <ProtectedRoute adminOnly>
                  <EditProduct />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          name: "Contact Us",
          children: [
            {
              path: "enquiry",
              element: (
                <ProtectedRoute>
                  <ListEnquiry />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
