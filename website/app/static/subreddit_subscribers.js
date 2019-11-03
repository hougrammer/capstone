// TODO: make this actually request instead of serve static numbers

let subreddits = [
	{name: "annoucements", subscribers: 46875399},
	{name: "funny", subscribers: 26972540},
	{name: "AskReddit", subscribers: 25025342},
	{name: "gaming", subscribers: 24004227},
	{name: "pics", subscribers: 23084009},
	{name: "science", subscribers: 22628995},
	{name: "worldnews", subscribers: 22413599},
	{name: "aww", subscribers: 22327352},
	{name: "todayilearned", subscribers: 21702372},
	{name: "movies", subscribers: 21702039},
]
$(() => {
	subreddits.forEach((subreddit, i) => {
		$("#subredditTable").append(
			`<tr>
        <td>${i+1}</td>
        <td><a href="http://reddit.com/r/${subreddit.name}">${subreddit.name}</a></td>
        <td>${subreddit.subscribers.toLocaleString()}</td>
      </tr>`
		);
	});
});