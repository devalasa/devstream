import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());


// X API PROXY

app.get("/api/x", async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get(
      `https://api.x.com/2/tweets/search/recent?query=${query}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.X_BEARER_TOKEN}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "X API error" });
  }
});


// REDDIT API PROXY

app.get("/api/reddit", async (req, res) => {
  try {
    const query = req.query.q;

    const response = await axios.get(
      `https://www.reddit.com/search.json?q=${query}&limit=20`,
      {
        headers: {
          "User-Agent": "DevStreamProject/1.0"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Reddit Error:", err.message);
    res.status(500).json({ error: "Failed to fetch from Reddit" });
  }
});


app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
