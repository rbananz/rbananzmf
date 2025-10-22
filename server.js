

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.static("."));

app.get("/auth", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  const data = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://www.rbananz.xyz/",
  });

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const token = await tokenRes.json();

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
  });
  const user = await userRes.json();
  res.json(user);
});

app.listen(3000, () => console.log("Server running on port 3000"));
