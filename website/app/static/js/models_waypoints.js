$(() => {
  fadeIn("#postScorerDiv1", "#postScorerInputs", 26, 25, 2);
  fadeIn("#postScorerDiv2", "#titleInputDiv", 100, 50, 5);
  fadeIn("#postScorerDiv3", "#timeInputDiv", 100, 50, 5);
  fadeIn("#postScorerDiv4", "#dateInputDiv", 100, 50, 5);
  fadeIn("#postScorerDiv5", "#scorePostDiv", 100, 50, 5);

  fadeOut("#imageCaptionDiv1", "#postScorerInputs", 90, 50, 5);
  fadeIn("#imageCaptionDiv2", "#imageExamples", 100, 50, 5);
  fadeOut("#imageCaptionDiv2", "#imageExamples", 25, 0, 5);
  fadeIn("#imageCaptionDiv3", "#imageUploadDiv", 90, 50, 5);

  fadeOut("#imageCommentsDiv1", "#imageUploadDiv", 90, 50, 5);
  fadeIn("#imageCommentsDiv1", "#imageComments", 100, 50, 5);

  d3.csv("/data/image_comments.csv").then(data => {
    let imageComments = new ImageComments(data);
    ImageComments.randomRow(data);
    fadeOut("#imageCommentsDiv2" ,"#seeAnother", 100, 50, 5);
    $("#imageCommentsDiv2").waypoint(() => {
      imageComments.bestRow();
    }, {
      offset: "50%"
    });
    $("#imageCommentsDiv3").waypoint(() => {
      imageComments.worstRow();
    }, {
      offset: "50%"
    });
    fadeOut("#imageCommentsDiv4", "#imageComments", 100, 60, 5);
    fadeIn("#imageCommentsDiv4", "#imageCommentsPlot", 100, 50, 5);
    $("#imageCommentsDiv4").waypoint(direction => {
      if (direction == "down") {
        imageComments.clearChart();
        imageComments.plotChart();
      }
    }, {
      offset: "60%"
    });
  });

  fadeOut("#conclusion", "#imageCommentsPlot", 100, 60, 5);
});
