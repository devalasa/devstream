Project Proposal for DevStream: A Developer Community Content Aggregator
(Uses X API + Reddit API)
1. Overview
DevStream is a web application that aggregates trending, relevant, and educational content for software developers from two major platforms: X (Twitter) and Reddit.
Problem Being Solved
Developers often struggle to keep up with tech news, tutorials, documentation updates, and community discussions because information is scattered across many platforms. Switching between multiple apps wastes time, and good content can easily be missed.
Motivation
As a developer, staying updated is important, but it’s difficult to keep track of everything. I want to build a platform that gathers real-time developer content in ONE place, filters out noise, and presents only the most useful posts. This will help developers learn faster, stay updated, and focus on what matters.
2. Target Audience
The target audience includes:
•	Software developers (beginners to senior)
•	Tech enthusiasts
•	Computer science students
•	Developers preparing for interviews
•	Open-source contributors
•	People who want quick updates without scrolling endlessly
The application will serve anyone who wants curated, real-time, high-quality tech content from developer communities.
3. Major Functions 
1. Search Aggregated Content
Users can type keywords like “JavaScript”, “AI”, “Web3”, “React”, etc.
The system searches both X and Reddit at the same time.
2. Trending Feed
Displays top trending dev topics using X trending API + Reddit hot posts.
3. Combined Results View
Merges X posts and Reddit posts into a single unified feed.
4. Platform Filters
Users can filter results by:
•	X only
•	Reddit only
•	Both sources
5. Topic Categories
Categories like:
•	Web Development
•	AI / Machine Learning
•	Mobile Development
•	Cybersecurity
•	Cloud / DevOps
•	Programming Languages
Each category loads curated posts from both APIs.
6. Save / Bookmark Posts
Users can store saved posts locally (LocalStorage or backend option) to read later.
7. Dark Mode / Light Mode
User interface toggles between UI themes.
8. Developer Profile Recommendations
Suggests relevant developers to follow on X and top subreddits to join.
4. Wireframes 
Both Desktop and Mobile view
 
 
5. External Data
APIs to Use
•	X API
For:
•	Recent tweets by keyword
•	Trending developer topics
•	Developer accounts to follow
Data Needed:
tweet text, username, profile image, timestamp, likes/retweets.
•	Reddit API
For:
•	Hot posts, new posts, or search results from dev subreddits like r/webdev, r/programming, r/learnjavascript.
Data Needed:
post title, subreddit name, upvotes, thumbnail image, permalink.
Stored Data
•	Saved/bookmarked posts
•	User theme preference
•	Search history (optional)
6. Module List (Major Components)
Frontend Modules
1.	API Service Module
o	Fetch data from X
o	Fetch data from Reddit
2.	Search Module
o	Handles user input
o	Combines results
3.	Feed Renderer Module
o	Builds UI cards for posts
o	Handles filtering
4.	Category Module
o	Loads predefined topics
5.	Bookmarks Module
o	Save/delete locally
o	Display saved posts
6.	UI Theme Module
o	Dark/light mode
7.	Router Module
o	Handles navigation between pages
8.	Utility Module
•	Helper functions
•	LocalStorage wrapper
7. Graphic Identity
Color Scheme
•	Primary: #1E1E1E (Dark Gray)
•	Accent: #0078FF (Blue)
•	Secondary: #F5F5F5 (Light Gray)
•	Highlight: #FFB800 (Yellow)
Typography
•	Headings: Inter Bold
•	Body: Inter Regular
•	Monospace for code: JetBrains Mono
UI Style
•	Rounded corners (8–12px)
•	Card drop shadows
•	Clean, minimal, developer-friendly
App Icon Idea
 
8. Timeline (Weeks 5–7)
Week 5
•	Finish wireframes
•	Build basic HTML/CSS structure
•	Create API service modules
•	Test API connections (X + Reddit)
Week 6
•	Build search system
•	Build unified results feed
•	Create filters + categories
•	Dark mode toggle
•	Start bookmark system
Week 7
•	Complete bookmarks page
•	Add UX polish (loading states, animations)
•	Mobile responsiveness
•	Testing + debugging
•	Final project deployment
9. Project Planning (Trello Board)
This is my Trello Board that outlines all the tasks that will aid me in the completion of this project
