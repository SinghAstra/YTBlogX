import { useContext } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import Loader from "./components/Loader/Loader";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Register from "./components/Register";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticating } = useContext(AuthContext);

  if (isAuthenticating) {
    return <Loader />;
  }

  const routes = createRoutesFromChildren(
    <>
      <Route element={<PublicRoute />}>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
        {/* <Route path="/recovery" element={<Recovery />} /> */}
        {/* <Route path="/reset" element={<Reset />} /> */}
      </Route>
      <Route element={<PrivateRoute />}>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
      </Route>
      {/* <Route path="*" element={<NotFound />} /> */}
    </>
  );

  const router = createBrowserRouter(routes);

  return (
    <RouterProvider router={router}>
      <Toaster />
    </RouterProvider>
  );
}

export default App;
