import * as d3 from "d3"
// response status
const status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}
// json response
const json = response => {
  return response.json()
}
// make SVG responsive
const makeResponsive = (svg) => {
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width"), 10),
    height = parseInt(svg.style("height"), 10),
    aspect = width / height,
    resize = () => {
      const targetWidth = parseInt(container.style("width"), 10)
      svg.attr("width", targetWidth)
      svg.attr("height", Math.round(targetWidth / aspect))
    }
  svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize)
  d3.select(window).on("resize." + container.attr("id"), resize)
}
// make the graph
const makeGraph = data => {
  const w = 1280;
  const h = 600;
  const padding = 60;
  const div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  const xScale = d3
    .scaleLinear()
    .domain([data[data.length - 1].Seconds + 5, data[0].Seconds - 15])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleLinear()
    .domain([d3.max(data, d => d.Place) + 5, 0])
    .range([h - padding, padding]);
  const svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Seconds))
    .attr("cy", d => yScale(d.Place))
    .attr("r", d => 5)
    .attr("class", d => d.Doping !== "" ? "doping" : "")
    // add mouse tooltip
    .on("mouseover", function (d) {
      div
        .transition()
        .duration(200)
        .style("opacity", 1);
      div
        .html(
          `<strong>Name:  <span class="color">${
          d.Name
          }</span></strong><br/><strong>Place:  <span class="color">${
          d.Place
          }</span></strong><br/><strong>Time:  <span class="color">${
          d.Time
          }</span></strong><br/><strong>Year:  <span class="color">${
          d.Year
          }</span></strong><br/><br/><br/>${d.Doping}`
        )
        .style("left", d.Seconds > 2300 ? d3.event.pageX + "px" : (d3.event.pageX - 150) + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
  // add touch tooltip
  svg
    .selectAll("circle")
    .data(data)
    .on("touchstart", function (d) {
      d3.event.preventDefault();
      div
        .transition()
        .duration(200)
        .style("opacity", 1);
      div
        .html(
          `<strong>Name:  <span class="color">${
          d.Name
          }</span></strong><br/><strong>Place:  <span class="color">${
          d.Place
          }</span></strong><br/><strong>Time:  <span class="color">${
          d.Time
          }</span></strong><br/><strong>Year:  <span class="color">${
          d.Year
          }</span></strong><br/><br/><br/>${d.Doping}`
        )
        .style("left", d.Seconds > 2300 ? d3.touch[0] + "px" : (d3.touch[0] - 150) + "px")
        .style("top", d3.touch[1] - 28 + "px");
    })
    .on("touchend", function (d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.Name)
    .attr("x", d => xScale(d.Seconds) + 6)
    .attr("y", d => yScale(d.Place) + 5)
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  // text label for the x axis
  svg
    .append("text")
    .attr("transform", "translate(" + w / 2 + " ," + (h - 10) + ")")
    .style("text-anchor", "middle")
    .attr("class", "doping")
    .text("Time completed (in seconds)");
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);
  // text label for the y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", padding / 2)
    .attr("x", 0 - h / 2)
    .style("text-anchor", "middle")
    .attr("class", "doping")
    .text("Place");
  makeResponsive(svg);
};
export { status, json, makeGraph }