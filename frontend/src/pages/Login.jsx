import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveToken } from "../services/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.token;
      saveToken(token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full" value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
        <input className="w-full" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button className="btn" type="submit">Login</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}

