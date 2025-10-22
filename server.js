import express from "express";
import fetch from "node-fetch";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("."));
app.use(session({ secret: "shadowspire", resave: false, saveUninitialized: true }));

// Discord OAuth2
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.get("/login", (req, res) => {
  const redirect = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(redirect);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect("/");

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      scope: "identify"
    })
  });
  const tokenData = await tokenRes.json();

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userRes.json();

  req.session.user = {
    username: user.username,
    id: user.id,
    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
  };

  res.redirect("/");
});

app.get("/user", (req, res) => {
  res.json(req.session.user || {});
});

app.post("/contact", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not logged in" });

  const { message } = req.body;

  await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bot ${BOT_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "💼 New Commission Request",
        color: 5763719,
        description: `**From:** ${user.username}\n**ID:** ${user.id}\n**Message:**\n${message}`,
        thumbnail: { url: user.avatar }
      }]
    })
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("🌐 Portfolio running on http://localhost:3000"));
