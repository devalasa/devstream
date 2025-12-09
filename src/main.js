import redditService from "./api/redditService.js";
import xService from "./api/xService.mjs";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryButtons = document.querySelectorAll(".category");
// New DOM element for the theme toggle
const themeToggleBtn = document.getElementById("themeToggle"); 
const body = document.body;

// Global state
let globalCombinedResults = [];
let activeFilter = 'all'; 

// --- 1. Bookmarks Utility Module (LocalStorage) ---

const bookmarkService = {
    STORAGE_KEY: 'devstream_bookmarks',

    getSavedPosts() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error retrieving bookmarks from localStorage", e);
            return [];
        }
    },

    isBookmarked(uniqueId) {
        return this.getSavedPosts().some(post => post.uniqueId === uniqueId);
    },

    toggleBookmark(post) {
        let savedPosts = this.getSavedPosts();
        
        // Ensure post has a unique ID before saving
        if (!post.uniqueId) {
            console.error("Post is missing a uniqueId for saving.");
            return;
        }

        const index = savedPosts.findIndex(p => p.uniqueId === post.uniqueId);

        if (index > -1) {
            // Remove post
            savedPosts.splice(index, 1);
        } else {
            // Add post
            savedPosts.push(post);
        }

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedPosts));
            return savedPosts;
        } catch (e) {
            console.error("Error saving bookmarks to localStorage", e);
        }
    }
};

// --- Helper Functions (Renderer) ---

function renderPostCard(post) {
    // Create a robust unique ID for the post using platform and URL
    const uniqueId = btoa(post.platform + post.url); 
    // Add uniqueId to post object for save/unsave tracking
    post.uniqueId = uniqueId; 

    // Check if the post is currently saved
    const isSaved = bookmarkService.isBookmarked(uniqueId);

    const card = document.createElement('a');
    card.className = 'card';
    card.href = post.url;
    card.target = '_blank';
    card.dataset.uniqueId = uniqueId; // Attach unique ID to the card element

    // The button logic now determines the icon and class based on save status
    const bookmarkIcon = `
        <button class="bookmark-btn ${isSaved ? 'saved' : ''}" 
                data-id="${uniqueId}" 
                data-platform="${post.platform}">
            ${isSaved ? '✅ Saved' : '⭐ Save'}
        </button>
    `;
    
    const thumbnail = post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default'
        ? `<img src="${post.thumbnail}" alt="${post.platform} thumbnail" class="thumbnail">`
        : '';
    
    const meta = post.platform === 'reddit' 
        ? `r/${post.subreddit} • ${post.ups} upvotes`
        : `@${post.user} • ${post.likes} likes • ${new Date(post.timestamp).toLocaleDateString()}`;

    const title = post.platform === 'reddit' ? post.title : post.text;
    const bodyText = post.platform === 'reddit' ? '' : title.substring(0, 150) + '...';

    card.innerHTML = `
        ${thumbnail}
        <div class="card-content">
            <div class="card-meta">Platform: ${post.platform.toUpperCase()} | ${meta}</div>
            <div class="card-title">${title}</div>
            <p>${bodyText}</p>
        </div>
        ${bookmarkIcon}
    `;

    resultsContainer.appendChild(card);
}

function filterAndRender() {
    resultsContainer.innerHTML = ''; 
    let filteredPosts = globalCombinedResults;

    // Filter logic
    if (activeFilter !== 'all' && activeFilter !== 'bookmarks') {
        filteredPosts = globalCombinedResults.filter(post => post.platform === activeFilter);
    } 
    // Logic to show only bookmarks
    else if (activeFilter === 'bookmarks') {
        // When viewing bookmarks, get the data directly from localStorage
        filteredPosts = bookmarkService.getSavedPosts();
    }
    
    if (filteredPosts.length === 0) {
        resultsContainer.innerHTML = `<p style='text-align: center; color: var(--text-muted);'>No results found for ${activeFilter === 'bookmarks' ? 'your bookmarks' : 'this query or filter'}.</p>`;
        return;
    }

    // Sort posts by popularity (ups/likes)
    filteredPosts.sort((a, b) => (b.likes || b.ups || 0) - (a.likes || a.ups || 0));

    filteredPosts.forEach(renderPostCard);
}


// --- Main Search Logic ---

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // If active filter is 'bookmarks', just re-render the saved list
    if (activeFilter === 'bookmarks') {
        filterAndRender();
        return;
    }

    resultsContainer.innerHTML = "<p style='text-align: center; color: var(--accent);'>Loading results from X and Reddit...</p>";

    try {
        const [redditResults, xResults] = await Promise.all([
            redditService.searchReddit(query),
            xService.searchX(query)
        ]);

        // Merge results, the uniqueId is generated inside renderPostCard
        globalCombinedResults = [...redditResults, ...xResults];
        
        filterAndRender();

    } catch (error) {
        console.error("API Aggregation Error:", error);
        resultsContainer.innerHTML = `
            <p style='text-align: center; color: var(--highlight);'>
                Failed to load content. Please ensure your backend is running and check the console.
            </p>
        `;
    }
}


// --- Event Listeners and Handlers ---

// 1. Platform Filters Logic
filterButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const source = e.target.dataset.source;
        
        // Remove 'active' class from all, add to clicked button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Set new active filter and re-render
        activeFilter = source;
        filterAndRender();
    });
});

// 2. Topic Categories Logic
categoryButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const query = e.target.textContent;
        searchInput.value = query; // Set the search box to the category name
        
        // Reset filter to 'all' when performing a new search
        activeFilter = 'all'; 
        document.querySelector('.filter-btn[data-source="all"]').classList.add('active');

        handleSearch();
    });
});

// 3. Bookmark Event Delegation
resultsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.bookmark-btn');
    if (!button) return;

    // Prevent the anchor tag (card) from navigating when the button is clicked
    e.preventDefault(); 
    e.stopPropagation();

    const uniqueId = button.dataset.id;
    
    // Find the original post object from the globally fetched results
    // We search both the current feed and saved posts for flexibility
    const postToSave = globalCombinedResults.find(post => post.uniqueId === uniqueId) || bookmarkService.getSavedPosts().find(post => post.uniqueId === uniqueId);
    
    if (postToSave) {
        bookmarkService.toggleBookmark(postToSave);
        
        // Update the button appearance immediately after toggling
        button.classList.toggle('saved');
        
        if (bookmarkService.isBookmarked(uniqueId)) {
            button.innerHTML = '✅ Saved';
        } else {
            button.innerHTML = '⭐ Save';
        }

        // If the user is currently viewing the 'bookmarks' feed, re-render it
        if (activeFilter === 'bookmarks') {
             filterAndRender();
        }
    }
});

// 4. Search Bar Listeners
searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});


// --- UI Theme Toggle Logic ---
const THEME_STORAGE_KEY = 'devstream_theme';

function applyTheme(isLight) {
    if (isLight) {
        body.classList.add('light-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌑 Dark Mode';
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
    } else {
        body.classList.remove('light-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light Mode';
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    }
}

// Check for saved preference on load
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const prefersLight = (savedTheme === 'light') || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches);

// Apply initial theme
applyTheme(prefersLight);

// Add event listener to the toggle button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // Toggle the theme state
        const isCurrentlyLight = body.classList.contains('light-theme');
        applyTheme(!isCurrentlyLight);
    });
}


// --- Initial Load ---

window.onload = () => {
    const defaultQuery = "web development";
    searchInput.value = defaultQuery;
    
    // Set 'All' filter button as active on load
    document.querySelector('.filter-btn[data-source="all"]').classList.add('active'); 

    handleSearch();
};