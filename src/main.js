// import redditService from "./api/redditService.js";
// import xService from "./api/xService.mjs";

// async function testAPIs() {
//   console.log("Testing Reddit...");
//   // console.log(await redditService.searchReddit("javascript"));

//   console.log("Testing X...");
//   console.log(await xService.searchX("javascript"));
// }

// testAPIs();
async function fetchData(query) {
  const reddit = await fetch(`http://localhost:3000/api/reddit?q=${query}`).then(r => r.json());
  const x = await fetch(`http://localhost:3000/api/x?q=${query}`).then(r => r.json());

  console.log({ reddit, x });
}

fetchData("javascript");

