$(() => {

d3.csv("/data/image_comments.csv").then(data => {
  let imageComments = new ImageComments(data);
  imageComments.fillTable();
});


});  // End $()