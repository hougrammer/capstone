class PostStats {
  constructor() {
    this.margin = { top: 50, right: 50, bottom: 50, left: 100 };
    this.height = 500;
    this.width = 600;
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

  updateRects(data) {
    let rects = this.svg.selectAll("rect").data(data);
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

      this.updateRects(data)
        .style("fill", "rgb(249, 105, 76)")
        
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
        .attr("x", d => xScale(d.is_self))
        .attr("y", d => yScale(d.total))
        .attr("width", xScale.bandwidth)
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

      this.updateRects(data)
        .style("fill", "rgb(249, 105, 76)")
        .on('mouseover', d => {
          let html = `<strong>Self Post: </strong> ${d.is_self}<br>
            <strong>Total: </strong> ${(+d.total / totalSum).toLocaleString()}`
          this.onMouseOver(html);
        })
        .on('mousemove', this.onMouseMove)
        .on('mouseout', this.onMouseOut)
        .transition()
        .delay((d, i) => 100 * i)
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("x", d => xScale(d.is_self))
        .attr("y", d => yScale(d.total / totalSum))
        .attr("width", xScale.bandwidth)
        .attr("height", d => this.h-yScale(d.total / totalSum));
    });
  }

  plotOverallAverageScore() {
    d3.json("/data/post_score_hour.json").then(data => {
      let avgScore = d3.mean(data, d => +d.avg_score);
      let maxScore = d3.max(data, d => +d.avg_score);
      let xScale = d3.scaleBand()
        .domain(["Average Score"])
        .range([0, this.w])
        .padding(.05);
      let yScale = d3.scaleLinear()
        .domain([0, maxScore])
        .range([this.h, 0])
        .nice();
      this.updateAxes(xScale, yScale);

      d3.select("#postStatsTitle")
        .text("Average Score");

      this.updateRects([avgScore])
        .style("fill", "rgb(249, 105, 76)")
        
        .on('mouseover', d => {
          let html = `<strong>Average Score: </strong> ${avgScore.toFixed(2)}`
          this.onMouseOver(html);
        })
        .on('mousemove', this.onMouseMove)
        .on('mouseout', this.onMouseOut)
        .transition()
        .delay((d, i) => 100 * i)
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("x", d => xScale("Average Score"))
        .attr("y", d => yScale(avgScore))
        .attr("width", xScale.bandwidth)
        .attr("height", d => this.h-yScale(avgScore));
    });
  }

  plotAverageScoreByHour() {
    d3.json("/data/post_score_hour.json").then(data => {
      let maxScore = d3.max(data, d => +d.avg_score);
      let xScale = d3.scaleBand()
        .domain(d3.range(0, 24))
        .range([0, this.w])
        .padding(.05);
      let yScale = d3.scaleLinear()
        .domain([0, maxScore])
        .range([this.h, 0])
        .nice();
      this.updateAxes(xScale, yScale);

      d3.select("#postStatsTitle")
        .text("Average Score");

      this.updateRects(data)
        .style("fill", "rgb(249, 105, 76)")
        .on('mouseover', d => {
          let html = `<strong>Hour: </strong> ${d.hour}<br>
            <strong>Average Score: </strong> ${(+d.avg_score).toFixed(2)}<br>`
          this.onMouseOver(html);
        })
        .on('mousemove', this.onMouseMove)
        .on('mouseout', this.onMouseOut)
        .transition()
        .delay((d, i) => 10 * i)
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("x", d => xScale(+d.hour))
        .attr("y", d => yScale(+d.avg_score))
        .attr("width", xScale.bandwidth)
        .attr("height", d => this.h-yScale(+d.avg_score));
    });
  }

  plotAverageScoreByDay() {
    d3.json("/data/post_score_dayofweek.json").then(data => {
      let maxScore = d3.max(data, d => +d.avg_score);
      let xScale = d3.scaleBand()
        .domain(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
        .range([0, this.w])
        .padding(.05);
      let yScale = d3.scaleLinear()
        .domain([0, maxScore])
        .range([this.h, 0])
        .nice();
      this.updateAxes(xScale, yScale);

      d3.select("#postStatsTitle")
        .text("Average Score");

      this.updateRects(data)
        .style("fill", "rgb(249, 105, 76)")
        .on('mouseover', d => {
          let html = `<strong>Day: </strong> ${d.day}<br>
            <strong>Average Score: </strong> ${(+d.avg_score).toFixed(2)}<br>`
          this.onMouseOver(html);
        })
        .on('mousemove', this.onMouseMove)
        .on('mouseout', this.onMouseOut)
        .transition()
        .delay((d, i) => 10 * i)
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("x", d => xScale(d.day))
        .attr("y", d => yScale(+d.avg_score))
        .attr("width", xScale.bandwidth)
        .attr("height", d => this.h-yScale(+d.avg_score));
    });
  }
}