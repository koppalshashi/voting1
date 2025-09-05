const API_URL = "https://voting1-5r3l.onrender.com"; // Change if backend is hosted online

/* =======================
   REGISTER USER
======================= */
async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  alert(data.message);

  if (data.message === "Registration successful") {
    window.location.href = "login.html";
  }
}

/* =======================
   LOGIN USER
======================= */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
      window.location.href = "results.html";
    } else {
      window.location.href = "vote.html";
    }
  } else {
    alert(data.message || "Login failed");
  }
}

/* =======================
   CAST A VOTE (VOTER ONLY)
======================= */
async function castVote(candidate) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    return;
  }

  const res = await fetch(`${API_URL}/vote`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ candidate })
  });

  const data = await res.json();
  alert(data.message);
}

/* =======================
   LOAD RESULTS (ADMIN ONLY)
======================= */
async function loadResults() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    alert("Access denied: Admins only");
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(`${API_URL}/results`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    alert("Failed to load results");
    return;
  }

  const ctx = document.getElementById("voteChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d._id),
      datasets: [{
        label: "# of Votes",
        data: data.map(d => d.count),
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f"]
      }]
    }
  });
}

/* =======================
   LOGOUT
======================= */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

