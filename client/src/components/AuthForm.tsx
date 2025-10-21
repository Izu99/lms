"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthProps = {
  type: "login" | "register";
};

export default function AuthForm({ type }: AuthProps) {
  const [data, setData] = useState({ username: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (
      type === "register" &&
      data.password !== confirmPassword
    ) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const url =
        type === "login"
          ? "http://localhost:5000/api/login"
          : "http://localhost:5000/api/auth/register";
      const reqData = { username: data.username, password: data.password };
      await axios.post(url, reqData);
      window.location.href = "/";
    } catch (e: any) {
      setError(e.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-sm mx-auto p-6 border rounded bg-card shadow"
    >
      <h2 className="text-2xl font-bold mb-2">
        {type === "login" ? "Login" : "Register"}
      </h2>
      <Input
        name="username"
        placeholder="Username"
        value={data.username}
        onChange={(e) =>
          setData({ ...data, username: e.target.value })
        }
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
        required
      />
      {type === "register" && (
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          required
        />
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Processing..."
          : type === "login"
          ? "Login"
          : "Register"}
      </Button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
