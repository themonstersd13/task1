import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.items);
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message ?? "Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.post("/tasks", { title, description, status });
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setMessage("Task created successfully");
      await fetchTasks();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message ?? "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, next: TaskStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: next });
      await fetchTasks();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message ?? "Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setMessage("Task deleted successfully");
      await fetchTasks();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message ?? "Failed to delete task");
    }
  };

  const logout = () => {
    auth.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(120deg,#0f172a_0%,#1d4ed8_55%,#f59e0b_100%)] p-6 md:p-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur-sm md:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Protected Dashboard</p>
            <h1 className="text-3xl font-black text-slate-900">Task Control Center</h1>
            <p className="mt-1 text-sm text-slate-600">
              Signed in as {auth.user?.name} ({auth.user?.role})
            </p>
          </div>
          <button onClick={logout} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Logout
          </button>
        </header>

        <section className="mt-8 grid gap-8 md:grid-cols-[360px_1fr]">
          <form onSubmit={createTask} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Create Task</h2>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring"
              required
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description"
              className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TaskStatus)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800 disabled:bg-blue-300"
            >
              {loading ? "Saving..." : "Create Task"}
            </button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Your Tasks</h2>
            {error && <p className="mb-3 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}
            {message && <p className="mb-3 rounded-xl bg-green-100 px-3 py-2 text-sm text-green-700">{message}</p>}

            <div className="space-y-3">
              {tasks.map((task) => (
                <article key={task.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      {task.description && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{task.status}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold"
                    >
                      Mark IN_PROGRESS
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, "DONE")}
                      className="rounded-lg border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                    >
                      Mark DONE
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks yet. Create your first one.</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
