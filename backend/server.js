import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// FIX/DEBUG: Set the path to look for the .env file one level up 
// or wherever your .env file is located. If it's in the 'backend' folder,
// this works. If it's in the root, you might need to adjust the path.
// For now, assume it is in the same directory as server.js.
dotenv.config(); 

const app = express();
app.use(cors());


// X API PROXY

app.get("/api/x", async (req, res) => {
  const query = req.query.q;
  const token = process.env.X_BEARER_TOKEN;

  // DEBUGGING: Check if the token is even loaded
  if (!token) {
    console.error("CRITICAL ERROR: X_BEARER_TOKEN is missing or empty.");
    return res.status(500).json({ error: "X API setup error: Bearer token is not loaded. Did you create and populate the .env file?" });
  }
  
  // Necessary parameters to get user info, metrics, and timestamp
  const xParams = "max_results=20&expansions=author_id&tweet.fields=created_at,public_metrics&user.fields=username,profile_image_url";

  try {
    const response = await axios.get(
      `https://api.x.com/2/tweets/search/recent?query=${query}&${xParams}`,
      {
        headers: {
          // Verify that the token variable is used
          "Authorization": `Bearer ${token}` 
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    // CRITICAL DEBUGGING STEP: Log the actual error from the X API
    console.error("X API Request Failed with status:", error.response ? error.response.status : 'N/A');
    console.error("X API Detail Error Message:", error.response ? error.response.data : error.message);
    
    // Return a 500, but with a message directing them to the console for detail
    res.status(500).json({ error: "X API call failed. Check your backend console (where you ran node server.js) for the detailed API error (e.g., 401 Unauthorized)." });
  }
});


// REDDIT API PROXY (unchanged)

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