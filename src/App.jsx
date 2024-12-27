import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminModule from "./Pages/AdminModule";
import AdminCourse from "./Pages/AdminCourse";
import AdminStudent from "./Pages/AdminStudent";
import AdminQuiz from "./Pages/AdminQuiz";
import QuestionCreate from "./Components/AdminQuiz/QuestionCreate";
import ErrorPage from "./Pages/ErrorPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");  // Check for token

  // Redirect to login page if no token is found
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Main Route */}
        <Route path="/" element={<AppLayout />}>
          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/warning" element={<ErrorPage />} />
          </Route>

          {/* Admin Routes - Protected */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="admin/module" element={<AdminModule />} />
            <Route path="admin/course" element={<AdminCourse />} />
            <Route path="admin/student" element={<AdminStudent />} />
            <Route path="admin/quiz" element={<AdminQuiz />} />
            <Route path="admin/quiz/create/:ID" element={<QuestionCreate />} />
          </Route>

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
