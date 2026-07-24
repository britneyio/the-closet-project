import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "shared/store/hooks";
import { bootstrapAuth } from "shared/store/authSlice";
import { fetchCsrf } from "shared/api/endpoints";
import AppLayout from "../features/layout/AppLayout";
import RequireAuth from "../features/auth/RequireAuth";
import HomePage from "../features/home/HomePage";
import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import ClosetPage from "../features/closet/ClosetPage";
import OutfitsPage from "../features/outfits/OutfitsPage";
import CreatorPage from "../features/creator/CreatorPage";
import StylistPage from "../features/stylist/StylistPage";
import ProfilePage from "../features/profile/ProfilePage";
import NotificationsPage from "../features/notifications/NotificationsPage";
import NotFoundPage from "../features/misc/NotFoundPage";

export default function App() {
  const dispatch = useAppDispatch();
  const [booted, setBooted] = useState(false);

  // Prime the CSRF cookie (needed before any POST), then restore any existing
  // session before deciding what the route guard shows.
  useEffect(() => {
    void fetchCsrf().catch(() => undefined);
    void dispatch(bootstrapAuth()).finally(() => setBooted(true));
  }, [dispatch]);

  if (!booted) return null;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/closet" element={<ClosetPage />} />
        <Route path="/outfits" element={<OutfitsPage />} />
        <Route path="/creator" element={<CreatorPage />} />
        <Route path="/stylist" element={<StylistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
