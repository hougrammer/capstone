function fadeIn(scrollingDiv, fadingDiv, start, end, steps) {
  let step = (end - start) / steps;
  let scale = d3.scaleLinear().domain([start, end]).range([0, 1]);
  d3.range(start, end+step, step).forEach((offset) => {
    $(scrollingDiv).waypoint((direction) => {
      if (offset == start) {
        $(fadingDiv).css("visibility", direction == "down" ? "visible" : "hidden");
      }
      $(fadingDiv).css("opacity", scale(offset));
    }, {
      offset: `${offset}%`
    });
  })
}

// In case I forget to change any of the old functions to `fadeIn()`
function fade(scrollingDiv, fadingDiv, start, end, steps) {
  fadeIn(scrollingDiv, fadingDiv, start, end, steps);
}

function fadeOut(scrollingDiv, fadingDiv, start, end, steps) {
  let step = (end - start) / steps;
  let scale = d3.scaleLinear().domain([start, end]).range([1, 0]);
  d3.range(start, end+step, step).forEach((offset) => {
    $(scrollingDiv).waypoint((direction) => {
      if (offset == end) {
        $(fadingDiv).css("visibility", direction == "down" ? "hidden" : "visible");
      }
      $(fadingDiv).css("opacity", scale(offset));
    }, {
      offset: `${offset}%`
    });
  })
}