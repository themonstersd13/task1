import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, payload);
      auth.setAuth(data.token, data.user);
      setMessage(`${mode === "login" ? "Logged in" : "Registered"} successfully`);
      navigate("/dashboard", { replace: true });
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#fef3c7_0%,transparent_40%),radial-gradient(circle_at_85%_10%,#bfdbfe_0%,transparent_40%),#f8fafc] px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/80 shadow-xl backdrop-blur-sm">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <section>
            <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700">
              Primetrade Assignment UI
            </p>
            <h1 className="mt-4 text-4xl font-black text-slate-900">Secure Access Portal</h1>
            <p className="mt-4 text-slate-600">
              Authenticate with JWT and continue to your protected dashboard to perform task CRUD operations.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li>• Registration and login</li>
              <li>• Role-aware secure API calls</li>
              <li>• Live feedback from backend responses</li>
            </ul>
          </section>

          <section>
            <div className="mb-5 flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                className={`w-1/2 rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "login" ? "bg-slate-900 text-white" : "text-slate-600"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`w-1/2 rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "register" ? "bg-slate-900 text-white" : "text-slate-600"
                }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "register" && (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-amber-400 transition focus:ring"
                    placeholder="Your full name"
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-amber-400 transition focus:ring"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-amber-400 transition focus:ring"
                  placeholder="At least 8 characters"
                  required
                />
              </label>

              {error && <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}
              {message && <p className="rounded-xl bg-green-100 px-3 py-2 text-sm text-green-700">{message}</p>}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
