class ImageComments {
  constructor(data) {
    this.data = data
    this.best = d3.maxIndex(data, d => +d.score)
    this.worst = d3.minIndex(data, d => +d.score)
    $("#seeAnother").click(() => { ImageComments.randomRow(data); });

    // For plotting
    this.margin = { top: 50, right: 50, bottom: 50, left: 100 };
    this.height = 500;
    this.width = 600;
    this.h = this.height - this.margin.top - this.margin.bottom;
    this.w = this.width - this.margin.left - this.margin.right;
    this.svg0 = d3.select("#imageCommentsPlot")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    this.svg = this.svg0.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    this.xAxis = this.svg.append("g").attr("id", "xAxis")
      .attr("transform", `translate(0,${this.h})`);
    this.svg
      .append("text")
      .attr("transform", `translate(${this.w / 2},${this.h + 40})`)
      .style("text-anchor", "middle")
      .text("Score");
    this.yAxis = this.svg.append("g").attr("id", "yAxis");
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -this.h / 2)
      .style("text-anchor", "middle")
      .text("Count");

    let counter = {};
    data.forEach(d => {
      let score = +d.score
      if (!(score in counter)) {
        counter[score] = 0;
      }
      counter[score]++;
    });
    this.counts = Object.keys(counter).map(k => { return {score: +k, count: counter[k]}; });
    console.log(this.counts);
    let minScore = d3.min(this.counts, d => +d.score)
    let maxScore = d3.max(this.counts, d => +d.score)
    this.xScale = d3.scaleBand()
      .domain(d3.range(minScore, maxScore+1))
      .range([0, this.w])
      .padding(.05);
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.counts, d => d.count)])
      .range([this.h, 0])
      .nice();
  }
  fillTable() {
    this.data.forEach(d => {
    $("#commentTable").append(
        `<tr>
          <td><img src=${d.url}></td>
          <td>${d.comment}</td>
          <td>${d.score}</td>
        </tr>`
      );
    });
  }
  static randomRow(data) {
    let i = Math.floor(Math.random() * data.length);
    $("#commentRow").html(
      `<td><img src=${data[i].url}></td>
      <td>${data[i].comment}</td>
      <td>${data[i].score}</td>`
    );
  }
  bestRow() {
    $("#commentRow").html(
      `<td><img src=${this.data[this.best].url}></td>
      <td>${this.data[this.best].comment}</td>
      <td>${this.data[this.best].score}</td>`
    );
  }
  worstRow() {
    $("#commentRow").html(
      `<td><img src=${this.data[this.worst].url}></td>
      <td>${this.data[this.worst].comment}</td>
      <td>${this.data[this.worst].score}</td>`
    );
  }

  clearChart() {
    // this.svg.remove();
    // this.svg = this.svg0.append("g")
    //   .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    // this.xAxis = this.svg.append("g").attr("id", "xAxis")
    //   .attr("transform", `translate(0,${this.h})`)
    // this.yAxis = this.svg.append("g").attr("id", "yAxis")
    // d3.select("#postStatsTitle").text("");
    this.svg.selectAll("rect").remove();
  }
  updateRects() {
    let rects = this.svg.selectAll("rect").data(this.counts);
    rects.exit()
      .transition()
      .duration(400)
      .attr("height", 0)
      .attr("y", this.h)
      .remove();
    return rects.enter()
      .append("rect")
      .merge(rects);
  }
  updateAxes() {
    let duration = 400;
    this.xAxis
      .transition()
      .duration(duration)
      .call(d3.axisBottom(this.xScale));
    this.yAxis
      .transition()
      .duration(duration)
      .call(d3.axisLeft(this.yScale));
  }
  plotChart() {
    this.updateAxes();
    this.updateRects()
      .style("fill", "rgb(249, 105, 76)")
      .attr("x", d => this.xScale(d.score))
      .attr("y", d => this.yScale(d.count))
      .attr("width", this.xScale.bandwidth)
      .transition()
      .delay((d, i) => 100 * i)
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("height", d => this.h - this.yScale(d.count));
  }
}