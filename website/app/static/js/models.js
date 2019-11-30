$(() => {
d3.select("#scoreSubmit")
  .on("click", () => {
    let title = d3.select("#titleInput").property("value");
    if (title.length === 0) {
      d3.select("#scoreResult").text("Malformed or empty title.");
      return;
    }

    let time = d3.select("#timeInput").property("value").split(":");
    let hour = +time[0]
    let minute = +time[1]
    if (time.length !== 2 || isNaN(hour) || isNaN(minute)) {
      d3.select("#scoreResult").text("Malformed or empty time.");
      return;
    }
    
    let date = new Date(d3.select("#dateInput").property("value"));
    if (date == "Invalid Date") {
      d3.select("#scoreResult").text("Invalid Date");
      return
    }
    let first = new Date(date.getFullYear(), 0, 1);
    let day = Math.round(((date - first) / 1000 / 60 / 60 / 24) + .5, 0);

    let json = JSON.stringify({
      title: title,
      hour: hour,
      minute: minute,
      weekday: date.getDay(),
      date: day
    });
    d3.select("#scoreResult").text("Waiting for score response...");
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

// Waypoints
// fade() defined in fade.js

// $("#postScorerDiv1").waypoint((direction) => {
//   $("#postScorerInputs").css("visibility", direction === "down" ? "visible" : "hidden");
//   $("#postScorerInputs").css("opacity", direction === "down" ? 1 : 0);
// });
fadeIn("#postScorerDiv1", "#postScorerInputs", 26, 25, 2);
fadeIn("#postScorerDiv2", "#titleInputDiv", 100, 50, 5);
fadeIn("#postScorerDiv3", "#timeInputDiv", 100, 50, 5);
fadeIn("#postScorerDiv4", "#dateInputDiv", 100, 50, 5);
fadeIn("#postScorerDiv5", "#scorePostDiv", 100, 50, 5);
fadeOut("#imageCaptionDiv1", "#postScorerInputs", 90, 50, 5);
// $("#imageCaptionDiv1").waypoint((direction) => {
//   $("#postScorerInputs").css("visibility", direction === "up" ? "visible" : "hidden");
//   $("#imageExamples").css("visibility", direction === "down" ? "visible" : "hidden");
// });
fadeIn("#imageCaptionDiv2", "#imageExamples", 100, 50, 5);
fadeOut("#imageCaptionDiv2", "#imageExamples", 25, 0, 5);
// $("#imageCaptionDiv3").waypoint((direction) => {
//   $("#imageExamples").css("visibility", direction === "down" ? "visible" : "hidden");
//   $("#imageUploadDiv").css("visibility", direction === "up" ? "visible" : "hidden");
// });
fadeIn("#imageCaptionDiv3", "#imageUploadDiv", 90, 50, 5);

fadeOut("#conclusion", "#imageUploadDiv", 100, 60, 5);
// $("#conclusion").waypoint((direction) => {
//   $("#imageUploadDiv").css("visibility", direction === "up" ? "visible" : "hidden");
// }, {
//   offset: "50%"
// });

}); // end $()
