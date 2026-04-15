const API_BASE = "https://prime-trade-ai-seven.vercel.app/";

const logs = document.getElementById("logs");
const profileEl = document.getElementById("profile");
const tasksEl = document.getElementById("tasks");

let accessToken = localStorage.getItem("token") || null;

const setToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

const log = (message, payload) => {
  const timestamp = new Date().toLocaleTimeString();
  let next = `[${timestamp}] ${message}`;
  if (payload) {
    next += `\n${JSON.stringify(payload, null, 2)}`;
  }
  logs.textContent = `${next}\n\n${logs.textContent}`;
};

const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = accessToken;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    // Format validation errors
    if (data.errors && Array.isArray(data.errors)) {
      const errorDetails = data.errors.map(e => `${e.path}: ${e.message}`).join("\n");
      throw new Error(`${data.message}\n${errorDetails}`);
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
};

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  try {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setToken(data.data.token);
    log("Registered successfully", data);
  } catch (error) {
    log(`Register failed: ${error.message}`);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setToken(data.data.token);
    log("Login successful", data);
  } catch (error) {
    log(`Login failed: ${error.message}`);
  }
});

document.getElementById("loadProfile").addEventListener("click", async () => {
  try {
    const data = await request("/auth/me");
    profileEl.textContent = JSON.stringify(data.data, null, 2);
    log("Loaded profile");
  } catch (error) {
    log(`Load profile failed: ${error.message}`);
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  setToken(null);
  profileEl.textContent = "";
  tasksEl.innerHTML = "";
  log("Logged out - token cleared");
});

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  try {
    const data = await request("/tasks", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    log("Task created", data);
    e.currentTarget.reset();
    document.getElementById("loadTasks").click();
  } catch (error) {
    log(`Create task failed: ${error.message}`);
  }
});

document.getElementById("loadTasks").addEventListener("click", async () => {
  try {
    const data = await request("/tasks");
    tasksEl.innerHTML = "";

    data.data.forEach((task) => {
      const item = document.createElement("div");
      item.className = "task-item";
      item.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description || ""}</p>
        <small>Status: ${task.status}</small><br />
        <small>ID: ${task._id}</small><br />
        <button data-id="${task._id}" class="done-btn">Mark Done</button>
        <button data-id="${task._id}" class="delete-btn">Delete</button>
      `;
      tasksEl.appendChild(item);
    });

    document.querySelectorAll(".done-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await request(`/tasks/${btn.dataset.id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "done" }),
          });
          log(`Updated task ${btn.dataset.id} to done`);
          document.getElementById("loadTasks").click();
        } catch (error) {
          log(`Update task failed: ${error.message}`);
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await request(`/tasks/${btn.dataset.id}`, { method: "DELETE" });
          log(`Deleted task ${btn.dataset.id}`);
          document.getElementById("loadTasks").click();
        } catch (error) {
          log(`Delete task failed: ${error.message}`);
        }
      });
    });
  } catch (error) {
    log(`Load tasks failed: ${error.message}`);
  }
});
