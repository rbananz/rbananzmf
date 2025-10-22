const loginBtn = document.getElementById('login-btn');
const avatar = document.getElementById('avatar');
const username = document.getElementById('username');
const contactBtn = document.getElementById('contact-btn');

// OAuth URL (yours)
const CLIENT_ID = "1401327058717638667";
const REDIRECT_URI = "https://www.rbananz.xyz/";
const API_URL = "https://discord.com/api/oauth2/token";

function getCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// Discord login redirect
loginBtn.onclick = () => {
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify%20email`;
};

// If redirected with ?code=...
(async () => {
  const code = getCode();
  if (!code) return;

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: "", // not needed because we’ll use backend proxy
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    scope: "identify email"
  });

  const res = await fetch("/exchange", { // our backend endpoint
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const data = await res.json();
  if (data.username) {
    avatar.src = data.avatar;
    avatar.style.display = "inline";
    username.textContent = data.username;
    loginBtn.style.display = "none";
  }
})();

// Commission button
contactBtn.onclick = async () => {
  const message = prompt("Describe your commission request:");
  if (!message) return alert("Cancelled.");

  const user = username.textContent || "Guest";

  const res = await fetch("/commission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, message })
  });

  if (res.ok) alert("✅ Commission sent!");
  else alert("❌ Failed to send.");
};
