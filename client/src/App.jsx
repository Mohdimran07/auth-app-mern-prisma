import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import EmailVerification from "./pages/EmailVerification";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Dashboard from "./pages/Dashboard";
import Toast from "./components/toast";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/" element={<Dashboard />} />
    </Route>
  )
);

function App() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500 flex items-center justify-center relative overflow-hidden">
      <RouterProvider router={router} />
    </div>
    <Toast />
    </>
  );
}

export default App;
