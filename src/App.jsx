import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layouts/Layout";
import DashBord from "./Pages/DashBord";


import { Toaster } from "sonner";
import AddCategory from "./Pages/Category/AddCategory";
import ListCategory from "./Pages/Category/ListCategory";
import EditCategory from "./Pages/Category/EditCategory";
import Login from "./Pages/Auth/Login";
import ProtectedRoute from "./Pages/ProtectRoute/ProtectRoute";
import Profile from "./Pages/Auth/Profile";
import AddProduct from "./Pages/Product/AddProduct";
import ListProduct from "./Pages/Product/ListProduct";
import EditProduct from "./Pages/Product/EditProduct";
import ListEnquiry from "./Pages/Contact/ListEnquiry";
import HomeImage from "./Pages/Home/HomeImage";
import Video from "./Pages/Home/Video";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

function App() {
  const appRouter = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },


    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/profile", element: <Profile /> },
        { path: "dashboard", element: <DashBord /> },
        { path: "video", element: <Video /> },
        { path: "image", element: <HomeImage /> },


        {
          name: "Category",
          children: [
            {
              path: "addcategory",
              element: <AddCategory />,
            },
            {
              path: "listcategory",
              element: <ListCategory />,
            },
            {
              path: "editcategory/:id",
              element: <EditCategory />,
            },
          ],
        },

        {
          name: "Product",
          children: [
            {
              path: "addproduct",
              element: <AddProduct />,
            },
            {
              path: "listproduct",
              element: <ListProduct />,
            },
            {
              path: "editproduct/:id",
              element: <EditProduct />,
            },
          ],
        },

        {
          name: "Contact Us",
          children: [
            {
              path: "enquiry",
              element: <ListEnquiry />,
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
