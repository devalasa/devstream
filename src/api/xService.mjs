const xService = {
  async searchX(query) {
    // 1. CORRECT: Single fetch call to your backend proxy
    const res = await fetch(`http://localhost:3000/api/x?q=${query}`);
    const data = await res.json();

    if (data.error || !data.data) {
        console.error("X Service Error:", data.error);
        return []; 
    }

    // 2. Data Normalization: Map users from the 'includes' array
    const usersMap = new Map();
    if (data.includes && data.includes.users) {
        data.includes.users.forEach(user => {
            usersMap.set(user.id, user);
        });
    }

    // 3. Data Mapping: Return the unified object structure
    return data.data.map(tweet => {
      const user = usersMap.get(tweet.author_id);
      
      return {
        platform: "x",
        text: tweet.text,
        // Using user data from the map
        user: user ? user.username : 'Unknown User',
        profile_image_url: user ? user.profile_image_url : null,
        // Using public metrics
        likes: tweet.public_metrics ? tweet.public_metrics.like_count : 0,
        retweets: tweet.public_metrics ? tweet.public_metrics.retweet_count : 0,
        timestamp: tweet.created_at,
        url: `https://x.com/i/status/${tweet.id}`
      };
    });
  }
};

export default xService;