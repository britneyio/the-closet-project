import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { getProfile, updateProfile, changePassword, deleteAccount } from "shared/api/endpoints";
import { errorMessage } from "shared/errors";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { logout, signedOut } from "shared/store/authSlice";
import type { UserProfile } from "shared/domain";
import Modal from "../../ui/Modal";
import { Button, Field, Heading } from "../../ui";

const color = tokens.color;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState<null | "password" | "location" | "delete">(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [locationDraft, setLocationDraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err) => toast.error(errorMessage(err)));
  }, []);

  const toggle = async (
    key: "email_recommendations" | "email_updates" | "remove_background"
  ) => {
    if (!profile) return;
    const next = { ...profile, [key]: !profile[key] };
    setProfile(next); // optimistic
    try {
      await updateProfile({ [key]: next[key] });
    } catch (err) {
      setProfile(profile); // revert
      toast.error(errorMessage(err));
    }
  };

  const handleSignOut = async () => {
    await dispatch(logout());
    void navigate("/");
  };

  const closeModal = () => {
    setEditing(null);
    setCurrentPassword("");
    setNewPassword("");
  };

  const openLocation = () => {
    setLocationDraft(profile?.location ?? "");
    setEditing("location");
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated.");
      closeModal();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submitLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const updated = await updateProfile({ location: locationDraft });
      setProfile(updated);
      toast.success("Location saved.");
      closeModal();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submitDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await deleteAccount(currentPassword);
      // The server session is gone; reset client auth synchronously and leave.
      dispatch(signedOut());
      void navigate("/");
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  const initial = (user?.username || user?.email || "?").charAt(0).toUpperCase();

  return (
    <Wrap>
      <Head>
        <div className="av">{initial}</div>
        <div>
          <Heading>{user?.username ?? "Your profile"}</Heading>
          <p>{user?.email}</p>
        </div>
      </Head>

      <Group>Account</Group>
      <List>
        <Row>
          <div>
            <div className="t">Email</div>
            <div className="s">{user?.email}</div>
          </div>
        </Row>
        <Row as="button" type="button" onClick={() => setEditing("password")}>
          <div>
            <div className="t">Password</div>
            <div className="s">Change your password</div>
          </div>
          <span aria-hidden>›</span>
        </Row>
        <Row as="button" type="button" onClick={openLocation}>
          <div>
            <div className="t">Location</div>
            <div className="s">{profile?.location || "For weather-aware suggestions"}</div>
          </div>
          <span aria-hidden>›</span>
        </Row>
      </List>

      <Group>Preferences</Group>
      <List>
        <Row as="label">
          <div>
            <div className="t">Remove photo backgrounds</div>
            <div className="s">Clean up item photos automatically on upload</div>
          </div>
          <Switch
            role="switch"
            aria-checked={!!profile?.remove_background}
            $on={!!profile?.remove_background}
            onClick={() => void toggle("remove_background")}
            type="button"
          />
        </Row>
      </List>

      <Group>Notifications</Group>
      <List>
        <Row as="label">
          <div>
            <div className="t">Outfit recommendations</div>
          </div>
          <Switch
            role="switch"
            aria-checked={!!profile?.email_recommendations}
            $on={!!profile?.email_recommendations}
            onClick={() => void toggle("email_recommendations")}
            type="button"
          />
        </Row>
        <Row as="label">
          <div>
            <div className="t">Product updates</div>
          </div>
          <Switch
            role="switch"
            aria-checked={!!profile?.email_updates}
            $on={!!profile?.email_updates}
            onClick={() => void toggle("email_updates")}
            type="button"
          />
        </Row>
      </List>

      <Group>Account actions</Group>
      <List>
        <Row as="button" onClick={() => void handleSignOut()}>
          <div className="t">Sign out</div>
          <span aria-hidden>›</span>
        </Row>
        <Row as="button" type="button" $danger onClick={() => setEditing("delete")}>
          <div>
            <div className="t">Delete account</div>
            <div className="s">Permanently removes your closet</div>
          </div>
          <span aria-hidden>›</span>
        </Row>
      </List>

      <Modal
        open={editing !== null}
        onClose={closeModal}
        title={
          editing === "password"
            ? "Change password"
            : editing === "location"
              ? "Update location"
              : "Delete account"
        }
      >
        {editing === "password" && (
          <ModalForm onSubmit={(event) => void submitPassword(event)}>
            <Field>
              <span className="label">Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </Field>
            <Field>
              <span className="label">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" $block disabled={busy}>
              {busy ? "Saving…" : "Update password"}
            </Button>
          </ModalForm>
        )}

        {editing === "location" && (
          <ModalForm onSubmit={(event) => void submitLocation(event)}>
            <Field>
              <span className="label">Location</span>
              <input
                value={locationDraft}
                placeholder="City, country"
                onChange={(event) => setLocationDraft(event.target.value)}
              />
            </Field>
            <Button type="submit" $block disabled={busy}>
              {busy ? "Saving…" : "Save location"}
            </Button>
          </ModalForm>
        )}

        {editing === "delete" && (
          <ModalForm onSubmit={(event) => void submitDelete(event)}>
            <Warn>
              This permanently deletes your account, closet, and outfits. This cannot be undone.
            </Warn>
            <Field>
              <span className="label">Confirm your password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" $variant="danger" $block disabled={busy}>
              {busy ? "Deleting…" : "Delete my account"}
            </Button>
          </ModalForm>
        )}
      </Modal>
    </Wrap>
  );
}

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Warn = styled.p`
  margin: 0;
  color: ${color.danger};
  font-size: 14px;
  line-height: 1.4;
`;

const Wrap = styled.div`
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 20px 60px;
`;
const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  .av {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${color.textStrong};
    color: #fff;
    display: grid;
    place-items: center;
    font-family: ${tokens.font.heading};
    font-weight: 700;
    font-size: 24px;
  }
  p {
    margin: 4px 0 0;
    color: ${color.textSoft};
    font-size: 14px;
  }
`;
const Group = styled.h3`
  font-family: ${tokens.font.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${color.textSoft};
  margin: 26px 2px 8px;
`;
const List = styled.div`
  border: 1px solid ${color.border};
  border-radius: 14px;
  overflow: hidden;
`;
const Row = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid ${color.border};
  background: ${color.background};
  width: 100%;
  text-align: left;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  cursor: default;
  &:is(button) {
    cursor: pointer;
  }
  &:is(button):hover {
    background: ${color.surface};
  }
  &:last-child {
    border-bottom: 0;
  }
  .t {
    font-size: 14px;
    color: ${(props) => (props.$danger ? color.danger : color.textStrong)};
  }
  .s {
    font-size: 12px;
    color: ${color.textSoft};
    margin-top: 2px;
  }
  span {
    color: ${color.textSoft};
    font-size: 18px;
  }
`;
const Switch = styled.button<{ $on: boolean }>`
  width: 42px;
  height: 24px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  position: relative;
  background: ${(props) => (props.$on ? color.primary : color.border)};
  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$on ? "20px" : "2px")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.15s;
  }
`;
