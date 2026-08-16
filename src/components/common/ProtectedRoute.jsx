import { Navigate } from "react-router-dom";

import { getCurrentUser } from "../../lib/storage";

export default function ProtectedRoute({ children }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
