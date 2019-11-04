const offset = 0; // Jan 1, 2018 was a Monday
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const height = 200;
const width = 1000;
const h = height - margin.top - margin.bottom;
const w = width - margin.left - margin.right;
const cellSize = 15;
const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdayMargin = 40;
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// I'm getting lazy. Just going to hard code this.
const monthLabelOffset = [0, 5, 9, 13, 18, 22, 26, 31, 35, 39, 44, 48];
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]; // no December
const monthMargin = 0;
const absoluteMax = 16100; // Max posts per day
let relativeMin = 0, relativeMax = 0;

// Set up relative filtering
let relativeFiltering = true;
d3.select("#relativeRadio").on("change", () => {
    relativeFiltering = true;
    updateScale()
  });
d3.select("#absoluteRadio")
  .on("change", () => {
    relativeFiltering = false;
    updateScale()
  });

// Scales
let xScale = d3.scaleLinear()
  .domain([0, 52])
  .range([weekdayMargin, w]);
let yScale = d3.scaleLinear()
  .domain([0, 7])
  .range([monthMargin, monthMargin + 7*cellSize]);
let absoluteColorScale = d3.scaleSequential(d3.interpolateOranges)
  .domain([0, absoluteMax]);
let relativeColorScale = d3.scaleSequential(d3.interpolateOranges);

// Main svg
let svg = d3.select("#postCountVisualization")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("width", w)
  .attr("height", h)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let weekdayText = svg.selectAll("text.weekday")
  .data(weekdayLabels)
  .enter()
  .append("text")
  .attr("class", "weekdayLabel")
  .text(d => d)
  .style('font-size', cellSize)
  .style("font-family", "monospace")
  .attr("alignment-baseline", "hanging")
  .attr('x', 0)
  .attr('y', (d,i) => yScale(i+1) + 2);

let monthText = svg.selectAll("text.month")
  .data(monthLabels)
  .enter()
  .append("text")
  .attr("class", "weekdayLabel")
  .text(d => d)
  .style('font-size', cellSize)
  .style("font-family", "monospace")
  .attr('x', (d, i) => xScale(monthLabelOffset[i]) + 5)
  .attr('y', 10);

let tooltip = d3.select('body').append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('background', 'rgba(255, 255, 255, .8)')
  .style('font-size', '12px');

function onCircleMouseOver(d, i) {
  tooltip.transition()
    .duration(200)
    .style('visibility', 'visible');
  let date = new Date((new Date(2018, 0)).setDate(i+1)); // hacky but it works
  let text = '<b>Date: </b>' + monthLabels[date.getMonth()] + ' ' + date.getDate() + ', 2018' + 
    '<br>' + '<b>Number of posts: </b>' + d;
  tooltip.html(text)
    .style('top', (event.pageY - 10) + 'px')
    .style('left', (event.pageX + 12) + 'px');
}

function onCircleMouseMove() {
  tooltip
    .style('top', (event.pageY - 10) + 'px')
    .style('left', (event.pageX + 12) + 'px');
}

function onCircleMouseOut() {
  d3.select(this).transition()
    .duration(200)
    .attr('r', 5);

  tooltip.transition()
    .duration(500)
    .style('visibility', 'hidden');
}

function updateScale() {
  svg.selectAll("rect.cell")
    .attr("fill", d => relativeFiltering ? relativeColorScale(d) : absoluteColorScale(d));
}

function updateData(subreddit, data) {
  d3.select("#postStatus")
    .html(`Showing post density for 
      <a href="https://reddit.com/r/${subreddit}" target="_blank">r/${subreddit}</a>`);

  let cell = svg.selectAll("rect.cell")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("width", cellSize)
    .attr("height", cellSize)
    // .attr("fill", d => absoluteColorScale(d))
    .attr("stroke-width", 1)
    .attr("stroke", "lightgrey")
    .attr("x", (d, i) => xScale(Math.floor(i/7)))
    .attr("y", (d, i) => yScale(i%7 + 1))
    .on('mouseover', (d,i) => {onCircleMouseOver(d,i);})
    .on('mousemove', onCircleMouseMove)
    .on('mouseout', onCircleMouseOut);
  updateScale();

  // Redraw month lines or else the cells cover them. Can probably do this more efficiently by
  // rendering the cells as invisible first but I'm getting lazy.
  svg.selectAll("line.month").remove();
  let day = 0;
  monthLengths.forEach(month => {
    day += month;
    d3.range(0,7).forEach(weekday => {
      let d = day - weekday - 1;
      svg.append("line")
        .attr("class", "month")
        .attr("x1", xScale(Math.floor(d/7)) + cellSize)
        .attr("y1", yScale(d%7 + 1))
        .attr("x2", xScale(Math.floor(d/7)) + cellSize)
        .attr("y2", yScale(d%7 + 2))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round");
    });
    // Add horizontal line if last day of month is not Sunday.
    if (day % 7 !== 0) {
      svg.append("line")
        .attr("class", "month")
        .attr("x1", xScale(Math.floor(day/7)))
        .attr("y1", yScale(day%7 + 1))
        .attr("x2", xScale(Math.floor(day/7)) + cellSize)
        .attr("y2", yScale(day%7 + 1))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round");
    }
  });
}

function date(day){
  let date = new Date(2018, 0);
  return new Date(date.setDate(day));
}

function getPostCounts(subreddit) {
  let statusText = "Getting post counts for '" + subreddit + "'...";
  console.log(statusText); 
  // status.text(statusText); 
  let t = performance.now();
  d3.json("/post_counts/" + subreddit, {method: "GET"})
    .then(json => {
      relativeMin = d3.min(json);
      relativeMax = d3.max(json);
      relativeColorScale.domain([relativeMin, relativeMax]);
      updateData(subreddit, json);
      console.log(json);
      console.log("completed in " + (performance.now() - t) + "ms");
      console.log("relative min post count: " + relativeMin);
      console.log("relative max post count: " + relativeMax);
  });
}

// Update subreddit on button press and enter in text box.
d3.select("#subredditSubmit")
  .on("click", () => {
    let subreddit = d3.select("#subredditInput").property("value");
    if (subreddit.length > 0) {
      getPostCounts(subreddit);
    }
  });
d3.select("#subredditInput")
  .on("keypress", function() {
    let subreddit = d3.select(this).property("value");
    if(subreddit.length > 0 && d3.event.keyCode === 13) {
      getPostCounts(subreddit);
    }
  });

getPostCounts("askreddit");