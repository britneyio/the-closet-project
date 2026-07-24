import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { logout } from "shared/store/authSlice";
import { selectUnreadCount } from "shared/store/notificationsSlice";
import { IconButton } from "../../ui";

const color = tokens.color;

const TABS = [
  { to: "/closet", label: "Closet" },
  { to: "/outfits", label: "Outfits" },
  { to: "/creator", label: "Creator" },
  { to: "/stylist", label: "Stylist" },
];

/** Authenticated shell: brand + account on top, primary nav that sits in the
    header on desktop and becomes a fixed bottom tab bar on phones. */
export default function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const unread = useAppSelector(selectUnreadCount);

  const initial = (user?.username || user?.email || "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await dispatch(logout());
    void navigate("/");
  };

  return (
    <Shell>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header>
        <Brand to="/closet">
          The Closet <b>Project</b>
        </Brand>
        <DesktopNav aria-label="Primary" data-tour="nav">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              data-tour={`nav-${tab.label.toLowerCase()}`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {tab.label}
            </NavLink>
          ))}
        </DesktopNav>
        <Spacer />
        <IconButton as={NavLink} to="/notifications" data-tour="notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <span aria-hidden>♪</span>
          {unread > 0 && <Badge>{unread}</Badge>}
        </IconButton>
        <Avatar to="/profile" data-tour="profile" aria-label="Profile">
          {initial}
        </Avatar>
        <LogoutBtn type="button" onClick={() => void handleLogout()}>
          Sign out
        </LogoutBtn>
      </Header>

      <Main id="main">
        <Outlet />
      </Main>

      <BottomNav aria-label="Primary">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => (isActive ? "active" : "")}>
            {tab.label}
          </NavLink>
        ))}
      </BottomNav>
    </Shell>
  );
}

const Shell = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  .skip {
    position: absolute;
    left: -9999px;
    top: 0;
    background: ${color.textStrong};
    color: #fff;
    padding: 10px 16px;
    z-index: 200;
  }
  .skip:focus {
    left: 12px;
    top: 12px;
  }
`;
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 68px;
  padding: 0 24px;
  background: ${color.background};
  border-bottom: 1px solid ${color.border};
  @media (max-width: 700px) {
    padding: 0 16px;
    gap: 12px;
  }
`;
const Brand = styled(NavLink)`
  font-family: ${tokens.font.heading};
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  white-space: nowrap;
  b {
    color: ${color.primary};
  }
`;
const DesktopNav = styled.nav`
  display: flex;
  gap: 22px;
  a {
    font-size: 14px;
    text-decoration: none;
    color: ${color.textSoft};
    padding: 6px 0;
    border-bottom: 2px solid transparent;
  }
  a.active {
    color: ${color.textStrong};
    border-color: ${color.primary};
  }
  @media (max-width: 700px) {
    display: none;
  }
`;
const Spacer = styled.div`
  flex: 1;
`;
const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: ${color.primary};
  color: #fff;
  font-family: ${tokens.font.mono};
  font-size: 9px;
  display: grid;
  place-items: center;
`;
const Avatar = styled(NavLink)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${color.textStrong};
  color: #fff;
  display: grid;
  place-items: center;
  font-family: ${tokens.font.heading};
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  flex: none;
`;
const LogoutBtn = styled.button`
  border: 0;
  background: none;
  color: ${color.textSoft};
  font-size: 13px;
  cursor: pointer;
  &:hover {
    color: ${color.primary};
  }
  @media (max-width: 700px) {
    display: none;
  }
`;
const Main = styled.main`
  flex: 1;
  min-height: 0;
  @media (max-width: 700px) {
    padding-bottom: 68px; /* clear the bottom tab bar */
  }
`;
const BottomNav = styled.nav`
  display: none;
  @media (max-width: 700px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 60;
    background: ${color.background};
    border-top: 1px solid ${color.border};
    a {
      flex: 1;
      text-align: center;
      padding: 12px 0 16px;
      font-family: ${tokens.font.mono};
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: ${color.textSoft};
      text-decoration: none;
    }
    a.active {
      color: ${color.primary};
    }
  }
`;
