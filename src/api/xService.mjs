const xService = {
  async searchX(query) {
    const url = `https://api.x.com/2/tweets/search/recent?query=${query}&max_results=20`;

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer YOUR_X_API_KEY`
      }
    });

    const data = await res.json();

    return data.data.map(tweet => ({
      platform: "x",
      text: tweet.text,
      user: tweet.author_id,
      id: tweet.id,
      url: `https://x.com/i/status/${tweet.id}`
    }));
  }
};

export default xService;
