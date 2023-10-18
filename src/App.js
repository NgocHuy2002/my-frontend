import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import LoginScreen from "./Screen/Login/login.js";
import HomeScreen from "./Screen/Home/home.js";
import DanhSachSanPham from "./Screen/DS_SanPham/index.js";
import DanhSachHopDong from "./Screen/DS_DaGui/index.js";
import TrungTam from "./Screen/TrungTam/index.js";
import Home from "./Screen/Home/home.js";
import FormSanPham from "./Screen/SanPham";
import KiemDuyet from "./Screen/KiemDuyet";
import NotFound from "./Screen/404_Screen";
import GenerateKey from "./Screen/TestFolder/Generate";
import { useEffect } from "react";
import PhieuKiemDinh from "./Screen/TaoPhieuKiemDinh";
import Info from "./Screen/Login/info";

const info = JSON.parse(localStorage.getItem("user"));
// let userRole = info ? JSON.parse(localStorage.getItem("user")).role : null;
const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  // Check if the user is logged in
  if (localStorage.getItem("user") !== null) {
    const userRole = JSON.parse(localStorage.getItem("user")).role;
    // Check if the user's role is in the requiredRoles array
    if (requiredRoles.includes(userRole)) {
      return element;
    } else {
      console.log(JSON.parse(localStorage.getItem("user")).role);
      // Redirect to a 404 page if the user doesn't have permission
      return <Navigate to="/404" />;
    }
  } else {
    // Redirect to the login page if the user is not logged in
    return <Navigate to="/" />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
      </Routes>
      <Home>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute element={<FormSanPham />} requiredRoles={["user"]} />
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute
                element={<Info />}
                requiredRoles={["user", "admin"]}
              />
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute
                element={<DanhSachSanPham />}
                requiredRoles={["user"]}
              />
            }
          />
          <Route
            path="/contract"
            element={
              <ProtectedRoute
                element={<DanhSachHopDong />}
                requiredRoles={["user"]}
              />
            }
          />
          <Route
            path="/company"
            element={
              <ProtectedRoute element={<TrungTam />} requiredRoles={["user"]} />
            }
          />
          <Route
            path="/check"
            element={
              <ProtectedRoute element={<KiemDuyet />} requiredRoles={["admin"]} />
            }
          />
          <Route
            path="/phieu"
            element={
              <ProtectedRoute
                element={<PhieuKiemDinh />}
                requiredRoles={["admin"]}
              />
            }
          />
        </Routes>
        <Routes>
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </Home>
    </Router>
  );
}

export default App;
