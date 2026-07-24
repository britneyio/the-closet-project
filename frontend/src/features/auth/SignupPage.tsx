import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { signup } from "shared/store/authSlice";
import { AuthShell } from "./AuthShell";
import { AuthCard } from "./AuthCard";
import { Button, Field } from "../../ui";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await dispatch(signup({ email, username, password }));
    if (signup.fulfilled.match(result)) void navigate("/closet");
  };

  return (
    <AuthShell>
      <AuthCard onSubmit={(event) => void onSubmit(event)} aria-label="Create account">
        <h1>Create your closet</h1>
        <p className="sub">Free to start. Your wardrobe stays private.</p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <Field>
          <span className="label">Email</span>
          <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>
        <Field>
          <span className="label">Username</span>
          <input
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Field>
        <Field>
          <span className="label">Password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <Button type="submit" $block disabled={status === "loading"}>
          {status === "loading" ? "Creating…" : "Start free"}
        </Button>
        <p className="switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
