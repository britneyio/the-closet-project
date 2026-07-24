import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { login } from "shared/store/authSlice";
import { AuthShell } from "./AuthShell";
import { AuthCard } from "./AuthCard";
import { Button, Field } from "../../ui";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) void navigate("/closet");
  };

  return (
    <AuthShell>
      <AuthCard onSubmit={(event) => void onSubmit(event)} aria-label="Sign in">
        <h1>Welcome back</h1>
        <p className="sub">Sign in to your closet.</p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <Field>
          <span className="label">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field>
          <span className="label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <Button type="submit" $block disabled={status === "loading"}>
          {status === "loading" ? "Signing in…" : "Sign in"}
        </Button>
        <p className="switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
