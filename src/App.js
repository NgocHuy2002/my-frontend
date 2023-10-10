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

const info = JSON.parse(localStorage.getItem("user"));
let userRole = info ? JSON.parse(localStorage.getItem("user")).role : null;
const ProtectedRoute = ({ element, requiredRole }) => {
  // Check if the user has the required role
  if (localStorage.getItem("user") !== null) {
    if (JSON.parse(localStorage.getItem("user")).role === requiredRole) {
      return element;
    } else {
      console.log(JSON.parse(localStorage.getItem("user")).role);
      // Redirect to a 404 page if the user doesn't have permission
      return <Navigate to="/404" />;
    }
  } else {
    return <Navigate to={"/"} />;
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
            <ProtectedRoute element={<FormSanPham />} requiredRole="user" />
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedRoute
              element={<DanhSachSanPham />}
              requiredRole="user"
            />
          }
        />
        <Route
          path="/contract"
          element={
            <ProtectedRoute
              element={<DanhSachHopDong />}
              requiredRole="user"
            />
          }
        />
        <Route
          path="/company"
          element={
            <ProtectedRoute element={<TrungTam />} requiredRole="user" />
          }
        />
        <Route
          path="/check"
          element={
            <ProtectedRoute element={<KiemDuyet />} requiredRole="admin" />
          }
        />
         <Route
          path="/phieu"
          element={
            <ProtectedRoute element={<PhieuKiemDinh />} requiredRole="admin" />
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
