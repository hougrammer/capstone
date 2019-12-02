class PostStats {
  constructor() {
    this.margin = { top: 50, right: 50, bottom: 50, left: 100 };
    this.height = 500;
    this.width = 500;
    this.h = this.height - this.margin.top - this.margin.bottom;
    this.w = this.width - this.margin.left - this.margin.right;
    this.svg0 = d3.select("#postStatsViz")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    this.svg = this.svg0.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    this.xAxis = this.svg.append("g").attr("id", "xAxis")
      .attr("transform", `translate(0,${this.h})`)
    this.yAxis = this.svg.append("g").attr("id", "yAxis")
  }

  clearGraph() {
    this.svg.remove();
    this.svg = this.svg0.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    this.xAxis = this.svg.append("g").attr("id", "xAxis")
      .attr("transform", `translate(0,${this.h})`)
    this.yAxis = this.svg.append("g").attr("id", "yAxis")
    d3.select("#postStatsTitle").text("");
  }

  updateAxes(xScale, yScale) {
    let duration = 400;
    this.xAxis
      .transition()
      .duration(duration)
      .call(d3.axisBottom(xScale));
    this.yAxis
      .transition()
      .duration(duration)
      .call(d3.axisLeft(yScale));
  }

  onMouseOver(html) {
    d3.select("#tooltip")
      .html(html)
      .style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 12) + 'px')
      .transition()
      .duration(200)
      .style('visibility', 'visible');
  }
  onMouseMove() {
    d3.select("#tooltip")
      .style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 12) + 'px');
  }
  onMouseOut() {
    d3.select("#tooltip")
      .transition()
      .duration(500)
      .style('visibility', 'hidden');
  }

  plotSelfPostsAbsolute() {
    d3.json("/data/self_posts.json").then(data => {
      let xScale = d3.scaleBand()
        .domain([false, true])
        .range([0, this.w])
        .padding(.05);
      let yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => +d.total))])
        .range([this.h, 0])
        .nice();
      this.updateAxes(xScale, yScale);

      d3.select("#postStatsTitle").text("Self Posts");

      let rects = this.svg.selectAll("rect").data(data);
      rects.exit().remove();
      rects.enter()
        .append("rect")
        .merge(rects)
        .style("fill", "rgb(249, 105, 76)")
        .attr("x", d => xScale(d.is_self))
        .attr("width", xScale.bandwidth)
        .on('mouseover', d => {
          let html = `<strong>Self Post: </strong> ${d.is_self}<br>
            <strong>Total: </strong> ${(+d.total).toLocaleString()}`
          this.onMouseOver(html);
        })
        .on('mousemove', this.onMouseMove)
        .on('mouseout', this.onMouseOut)
        .transition()
        .delay((d, i) => 100 * i)
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("y", d => yScale(d.total))
        .attr("height", d => this.h-yScale(d.total));    
    });
  }

  plotSelfPostsPercent() {
    d3.json("/data/self_posts.json").then(data => {
      let totalSum = d3.sum(data, d => d.total);
      let xScale = d3.scaleBand()
        .domain([false, true])
        .range([0, this.w])
        .padding(.05);
      let yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([this.h, 0])
        .nice();
      this.updateAxes(xScale, yScale);

      d3.select("#postStatsTitle")
        .text("Self Posts");

      let rects = this.svg.selectAll("rect").data(data);
      rects.exit().remove();
      rects.enter()
        .append("rect")
        .merge(rects)
        .style("fill", "rgb(249, 105, 76)")
        .attr("x", d => xScale(d.is_self))
        .attr("width", xScale.bandwidth)
        .on('mouseover', d => {
          let html = `<strong>Self Post: </strong> ${d.is_self}<br>
            <strong>Total: </strong> ${(+d.total / totalSum).toLocaleString()}`
          console.log(html);
          this.onMouseOver(html);
        })
        .on('mousemove', this.onMouseMove)
        .on('mouseout', this.onMouseOut)
        .transition()
        .delay((d, i) => 100 * i)
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("y", d => yScale(d.total / totalSum))
        .attr("height", d => this.h-yScale(d.total / totalSum));
    });
  }
}