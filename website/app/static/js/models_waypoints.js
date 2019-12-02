$(() => {
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
});
