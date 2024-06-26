import { useContext } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Register from "./components/Register/Register";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import VerifyOTP from "./components/VerifyOTP/VerifyOTP";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";

function App() {
  const { isAuthenticating } = useContext(AuthContext);

  if (isAuthenticating) {
    return <Loader />;
  }

  const routes = createRoutesFromChildren(
    <>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      {/* <Route path="*" element={<NotFound />} /> */}
    </>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
