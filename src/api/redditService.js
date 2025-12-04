const redditService = {
  async searchReddit(query) {
    // 1. CORRECT: Single fetch call to your backend proxy
    const res = await fetch(`http://localhost:3000/api/reddit?q=${query}`);
    const data = await res.json();

    // The rest of the mapping logic is correct for Reddit data structure
    return data.data.children.map(post => ({
      platform: "reddit",
      title: post.data.title,
      subreddit: post.data.subreddit,
      ups: post.data.ups,
      url: "https://reddit.com" + post.data.permalink,
      thumbnail: post.data.thumbnail,
    }));
  }
};

export default redditService;