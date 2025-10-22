import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("."));

const CLIENT_ID = "1401327058717638667";
const CLIENT_SECRET = process.env.CLIENT_SECRET; // keep in env (not on GitHub)
const REDIRECT_URI = "https://www.rbananz.xyz/";
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Exchange code for user data
app.post("/exchange", async (req, res) => {
  const params = new URLSearchParams(req.body);
  const code = params.get("code");
  if (!code) return res.json({ error: "No code" });

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      scope: "identify email"
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return res.json({ error: "Failed to get token" });

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userRes.json();

  res.json({
    username: user.username + "#" + user.discriminator,
    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
  });
});

// Commission webhook sender
app.post("/commission", async (req, res) => {
  const { user, message } = req.body;
  if (!message) return res.status(400).json({ error: "No message" });

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "🎨 New Commission Request",
        color: 7506394,
        fields: [
          { name: "From", value: user, inline: false },
          { name: "Message", value: message, inline: false }
        ],
        timestamp: new Date()
      }]
    })
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("🚀 Running on port 3000"));
