const clientId = "1401327058717638667";
const redirectUri = "https://www.rbananz.xyz/";
const userSection = document.getElementById("userSection");
const loginBtn = document.getElementById("loginBtn");

// Save and load from localStorage
async function fetchUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  const user = await res.json();
  localStorage.setItem("discord_user", JSON.stringify(user));
  return user;
}

function showUser(user) {
  loginBtn.style.display = "none";
  const img = document.createElement("img");
  img.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
  img.className = "w-10 h-10 rounded-full border-2 border-purple-400";
  const name = document.createElement("span");
  name.textContent = user.username;
  userSection.appendChild(img);
  userSection.appendChild(name);
}

// On page load
window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const savedUser = localStorage.getItem("discord_user");

  if (savedUser) {
    showUser(JSON.parse(savedUser));
    return;
  }

  if (code) {
    try {
      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: "YOUR_CLIENT_SECRET_HERE",
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      });

      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        const user = await fetchUser(tokenData.access_token);
        showUser(user);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

// Login redirect
loginBtn.addEventListener("click", () => {
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+email`;
});
