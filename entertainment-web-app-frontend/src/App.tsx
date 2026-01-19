import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import TVSeriesPage from "./pages/TVSeriesPage";
import BookmarkedPage from "./pages/BookmarkedPage";
import { Toaster } from "react-hot-toast";
import VideoPlayer from "./ui/VideoPlayer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import PersistLogin from "./ui/PersistLogin";
import { RootState } from "./services/api/store";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const { mode } = useSelector((state: RootState) => state.theme);

  useEffect(
    function () {
      const root = window.document.documentElement;

      const isDark = mode === "dark";

      root.classList.remove(isDark ? "light" : "dark");
      root.classList.add(mode);

      localStorage.setItem("theme", mode);
    },
    [mode]
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="movies" element={<MoviesPage />} />
            <Route path="tvseries" element={<TVSeriesPage />} />
            <Route path="bookmarked" element={<BookmarkedPage />} />
            <Route path="videos/:videoID" element={<VideoPlayer />} />
          </Route>
        </Route>

        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Routes>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 2000 },
          error: { duration: 2000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#172554",
            color: "#F1F0E8",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
