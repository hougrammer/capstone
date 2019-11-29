// Probably don't need D3 for this, but it's already loaded so might as well use it.
d3.select("#scoreSubmit")
  .on("click", () => {
    let json = JSON.stringify({
      title: d3.select("#titleInput").property("value"),
      hour: d3.select("#hourInput").property("value"),
      minute: d3.select("#minuteInput").property("value"),
      weekday: d3.select("#weekdayInput").property("value"),
      date: d3.select("#dateInput").property("value")
    });
    d3.select("#scoreResult").text("Waiting for score response for...");
    console.log("Waiting for score response for...");
    console.log(json);

    let t = performance.now();
    d3.json('/score_post', {
      method: "POST",
      body: json,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(json => {
      d3.select("#scoreResult")
        .text(
          `Your post has a score of ${(100*json.score).toFixed(5)}%
          chance of doing well on AskReddit.`);
    });
  });