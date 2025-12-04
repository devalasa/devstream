import redditService from "./api/redditService.js";
import xService from "./api/xService.mjs";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");

// --- Helper Functions ---

function renderPostCard(post) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = post.url;
    card.target = '_blank'; // Open links in a new tab

    const thumbnail = post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default'
        ? `<img src="${post.thumbnail}" alt="${post.platform} thumbnail" class="thumbnail">`
        : '';
    
    const meta = post.platform === 'reddit' 
        ? `r/${post.subreddit} • ${post.ups} upvotes`
        : `@${post.user} • ${post.likes} likes • ${new Date(post.timestamp).toLocaleDateString()}`;

    const title = post.platform === 'reddit' ? post.title : post.text;
    const bodyText = post.platform === 'reddit' ? '' : title.substring(0, 150) + '...'; // Show snippet for X posts

    card.innerHTML = `
        ${thumbnail}
        <div class="card-content">
            <div class="card-meta">Platform: ${post.platform.toUpperCase()} | ${meta}</div>
            <div class="card-title">${title}</div>
            <p>${bodyText}</p>
        </div>
    `;

    resultsContainer.appendChild(card);
}

function renderPosts(posts) {
    resultsContainer.innerHTML = ''; // Clear existing results

    if (posts.length === 0) {
        resultsContainer.innerHTML = "<p style='text-align: center; color: #f5f5f570;'>No results found. Try a different query.</p>";
        return;
    }

    // Sort posts by a common metric (e.g., likes or upvotes) 
    // For simplicity, we'll use a basic sort here.
    posts.sort((a, b) => (b.likes || b.ups || 0) - (a.likes || a.ups || 0));

    posts.forEach(renderPostCard);
}


// --- Main Search Logic ---

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = "<p style='text-align: center; color: var(--accent);'>Loading results from X and Reddit...</p>";

    try {
        // Use Promise.all to fetch data from both APIs concurrently
        const [redditResults, xResults] = await Promise.all([
            redditService.searchReddit(query),
            xService.searchX(query)
        ]);

        // Combine and flatten the results array
        const combinedResults = [...redditResults, ...xResults];
        
        console.log("Combined Results:", combinedResults);
        
        renderPosts(combinedResults);

    } catch (error) {
        console.error("API Aggregation Error:", error);
        resultsContainer.innerHTML = `
            <p style='text-align: center; color: #FFB800;'>
                Failed to load content. Please check your backend console for errors. 
                (If you see a 429 error, wait 15 minutes and try again).
            </p>
        `;
    }
}

// --- Event Listeners ---

searchBtn.addEventListener("click", handleSearch);

// Also allow searching by pressing Enter in the input field
searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initial load suggestion (e.g., to run a default search for trending feed)
window.onload = () => {
    // We can now safely run a default query on load, 
    // but users should be careful about the rate limit.
    searchInput.value = "web development";
    handleSearch();
};