const redditService = {
  async searchReddit(query) {
    const url = `https://www.reddit.com/search.json?q=${query}&limit=20`;

    const res = await fetch(url);
    const data = await res.json();

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
