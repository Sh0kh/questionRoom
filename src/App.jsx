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
  const role = localStorage.getItem("role");

  // Замените 'FWENFDEWST' на разрешенное значение роли
  if (role === "FWENFDEWST") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          {/* Главные маршруты */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/warning" element={<ErrorPage />} />
          </Route>

          {/* Административные маршруты */}
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

          {/* Перенаправление для всех остальных маршрутов */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
