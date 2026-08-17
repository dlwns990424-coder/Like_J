import { HashRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import ScrollToTop from "../components/common/ScrollToTop";

import Landing from "../pages/landing/Landing";
import Login from "../pages/login/Login";
import SignUp from "../pages/signUp/SignUp";
import Home from "../pages/home/Home";
import TripCreate from "../pages/tripCreate/TripCreate";
import TripDetail from "../pages/tripDetail/TripDetail";
import Map from "../pages/map/Map";

export default function Router() {
  return (
    <HashRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trip-create"
          element={
            <ProtectedRoute>
              <TripCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trip/:id"
          element={
            <ProtectedRoute>
              <TripDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
