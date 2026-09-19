import { RouterProvider, createBrowserRouter } from "react-router-dom";
import adminRoute from "./routes/adminRoute";
import userRoute from "./routes/userRoute";
import loginRoute from "./routes/loginRoute";
import displayRoute from "./routes/displayRoute";
import NotFoundPage from "./components/NotFound";

const router = createBrowserRouter([
  userRoute,
  adminRoute,
  loginRoute,
  displayRoute,
  { path: "*", element: <NotFoundPage/> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
