$(() => {

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const height = 600;
const width = 650;
const h = height - margin.top - margin.bottom;
const w = width - margin.left - margin.right;
const minRadius = 100;
const maxRadius = 250;
const circleRadius = 10; // Radius of a single circle

// Scales
let xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, w])
  .nice();
let yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, h])
  .nice();
let maxPercent = .4;
let colorScale = d3.scaleSequential(d3.interpolateReds)
  .domain([0, maxPercent]);

// Main svg
let svg0 = d3.select("#subredditVisualization")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
let svg = svg0.append("g")
  // .attr("width", w)
  // .attr("height", h)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Status text
let status = svg.append("text")
  .attr("class", "status")
  .attr("x", xScale(.1))
  .attr("y", yScale(.1));

function update(subreddit, data) {
  if (data.length === 0) {
    status.text("Embedding not found for subreddit '" + subreddit + "'");
    return;
  }
  let root = [data[0]];
  let leaves = data.slice(1);
  let r = 150; // main 
  let theta = 2*Math.PI / leaves.length
  let center = {x: xScale(0.5), y: yScale(0.5)}; // Center of main plot

  let rScale = d3.scaleLinear()
    .domain([d3.min(leaves, d => d.distance), d3.max(leaves, d => d.distance)])
    .range([minRadius, maxRadius]);

  function leafX(d, i) {
    return center.x + rScale(d.distance) * Math.cos(theta * i);
  }
  function leafY(d, i) {
    return center.y + rScale(d.distance) * Math.sin(theta * i);
  }
  function onLeafClick(d, selection) {
    svg.selectAll("text").remove();
    svg.selectAll("line").remove();

    selection.classed("leaf", false).classed("root", true);
    svg.select("circle.root").remove();
    svg.selectAll("circle.leaf").remove();

    selection
      .transition()
      .duration(400)
      .attr("cx", center.x)
      .attr("cy", center.y);

    d3.timeout(() => {
      // selection.remove(); // Because else the lines appear on top of the root
      getSimilarSubreddits(d.subreddit);
    }, 400);
  }

  svg.selectAll("line")
    .data(leaves)
    .enter()
    .append("line")
    .attr("stroke-width", 2)
    .attr("stroke", "lightgrey")
    .attr("x1", center.x)
    .attr("y1", center.y)
    .attr("x2", center.x)
    .attr("y2", center.y)
    .transition()
    .duration((d,i) => 100*(i+1))
    .attr("x2", (d, i) => leafX(d, i))
    .attr("y2", (d, i) => leafY(d, i));

  svg.selectAll('circle.root')
    .data(root)
    .enter()
    .append("circle")
    .attr("class", "root")
    .attr('stroke', 'black')
    .attr('fill', colorScale(maxPercent / 2))
    .attr('r', circleRadius)
    .attr('cx', center.x)
    .attr('cy', center.y)
    .on("mouseover", function(){ d3.select(this).style('cursor', 'pointer'); })
    .on('click', d => { window.open("https://reddit.com/r/" + d.subreddit, "_blank"); });

  let rootText = svg.selectAll("text.root").data(root);
  // Update existing
  rootText.text(d => d.subreddit);
  // Initial population
  rootText.enter()
    .append("text")
    .attr("class", "root")
    .text(d => d.subreddit)
    .style('font-size', 10)
    .attr('x', xScale(.5) + circleRadius)
    .attr('y', yScale(.5) + circleRadius);
  
  svg.selectAll("circle.leaf")
    .data(leaves)
    .enter()
    .append("circle")
    .attr("class", "leaf")
    .attr('stroke', 'black')
    .attr('fill', colorScale(maxPercent / 2))
    .attr("cx", center.x)
    .attr("cy", center.y)
    .on("mouseover", function(){ d3.select(this).style('cursor', 'pointer'); })
    .on("click", function(d) { onLeafClick(d, d3.select(this)); })
    .transition()
    .duration((d,i) => 100*(i+1))
    .attr('r', circleRadius)
    .attr('cx', (d, i) => leafX(d, i))
    .attr('cy', (d, i) => leafY(d, i));

  // let leafText = svg.selectAll("text.leaf").data(leaves);
  d3.timeout(() => {
    svg.selectAll("text.subreddit").data(leaves)
      .enter()
      .append("text")
      .attr("class", "subreddit")
      .text(d => d.subreddit)
      .style('font-size', 10)
      .attr('x', (d, i) => leafX(d, i) + circleRadius)
      .attr('y', (d, i) => leafY(d, i) + circleRadius);
    svg.selectAll("text.distance").data(leaves)
      .enter()
      .append("text")
      .attr("class", "distance")
      .text(d => "distance: " + d.distance.toFixed(3))
      .style('font-size', 10)
      .attr('x', (d, i) => leafX(d, i) + circleRadius)
      .attr('y', (d, i) => leafY(d, i) + circleRadius)
      .attr("dy", 10);
  }, 100*(leaves.length));
}

function getSimilarSubreddits(subreddit) {
  let statusText = "Getting closest subreddits to '" + subreddit + "'...";
  console.log(statusText); 
  status.text(statusText); 
  let t = performance.now();
  d3.json("/closest_subreddits/" + subreddit, {method: "GET"})
    .then(json => {
      svg.selectAll("circle").remove();
      svg.selectAll("text").remove();
      svg.selectAll("line").remove();
      update(subreddit, json);
      console.log(json);
      console.log("completed in " + (performance.now() - t) + "ms");
      status.text("");
  });
}

// Update subreddit on button press and enter in text box.
d3.select("#subredditSubmit")
  .on("click", () => {
    let subreddit = d3.select("#subredditInput").property("value");
    if (subreddit.length > 0) {
      getSimilarSubreddits(subreddit);
    }
  });
d3.select("#subredditInput")
  .on("keypress", function() {
    let subreddit = d3.select(this).property("value");
    if(subreddit.length > 0 && d3.event.keyCode === 13) {
      getSimilarSubreddits(subreddit);
    }
  });

getSimilarSubreddits("askreddit");

// Waypoints
$("#embeddingsDiv1").waypoint((direction) => {
  if (direction === "down") {
    $("#subredditTableDiv").addClass("hidden");
  } else {
    $("subredditVisualizationDiv").addClass("hidden");
  }
}, {
  offset: "90%"
})

$("#embeddingsDiv2").waypoint((direction) => {
  if (direction === "down") {
    $("#subredditVisualizationDiv").removeClass("hidden");
  }
}, {
  offset: "90%"
})

});