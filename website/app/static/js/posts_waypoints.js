$(() => {
  let postStats = new PostStats();

  fadeIn("#introduction", "#postStatsViz", 11, 10, 2);
  $("#postStatsDiv1").waypoint(direction => {
    if (direction === "down") {
      postStats.clearGraph();
    }
    postStats.plotSelfPostsAbsolute();
  }, {
    offset: "50%"
  });
  $("#postStatsDiv2").waypoint(() => {
    postStats.plotSelfPostsPercent();
  }, {
    offset: "50%"
  });

  fadeOut("#postCountDiv1", "#postStatsViz", 100, 75, 5);
  fadeIn("#postCountDiv1", "#postCountViz", 100, 75, 5);
  fadeOut("#postCountDiv1", "#postCountDiv1", 26, 25, 1);
  fadeOut("#otherVizzesDiv1", "#postCountVizDiv", 100, 50, 5);
  fadeIn("#otherVizzesDiv1", "#otherVizzes", 100, 50, 5);
  fadeOut("#conclusion", "#otherVizzes", 100, 50, 5)
});


