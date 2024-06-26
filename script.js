// Set dimensions and margins for the graph
const margin = { top: 20, right: 30, bottom: 30, left: 40 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Append the svg object to the div called 'chart'
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("tabindex", "0") // Make SVG focusable
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let data = [
  { time: new Date(2024, 0, 1, 6, 0), speed: 25 },
  { time: new Date(2024, 0, 1, 12, 0), speed: 50 },
  { time: new Date(2024, 0, 1, 18, 0), speed: 25 },
  { time: new Date(2024, 0, 1, 19, 0), speed: 5 },
];

// X axis
const x = d3.scaleTime()
  .domain([new Date(2024, 0, 1, 0, 0), new Date(2024, 0, 1, 23, 59)]) // Covering the full day from 00:00 to 23:59
  .range([0, width]);

const xAxis = d3.axisBottom(x)
  .tickFormat(d3.timeFormat("%H:%M"))
  .ticks(d3.timeHour.every(1));

svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis) // Linear

// Y & secondary y axis
const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

svg.append("g").call(d3.axisLeft(y)); // primary Y

svg
  .append("g")
  .attr("transform", `translate(${width},0)`)
  .call(d3.axisRight(y)); // secondary Y

// Horizontal grid lines
const yGrid = d3
  .axisLeft(y)
  .tickSize(-width)
  .tickFormat("") // No tick labels
  .ticks(10); // Adjust number of ticks based on your scale

svg.append("g").attr("class", "grid").call(yGrid);

// Vertical grid lines
const xGrid = d3
  .axisBottom(x)
  .tickSize(-height)
  .tickFormat("") // No tick labels
  .ticks(24); // Adjust number of ticks based on your scale

svg
  .append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0,${height})`)
  .call(xGrid);

// Add a line
const line = d3
  .line()
  .x((d) => x(d.time))
  .y((d) => y(d.speed))
  .curve(d3.curveStepAfter);
line.curveType = d3.curveStepAfter;

const path = svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", line);

const xAxisStep = 15;  // Define steps width on the x-axis
const yAxisStep = 5; // Define steps width on the y-axis

function snapToGrid(x, y) {
    // Find the nearest x and y values on the grid
    const snappedX = Math.round(x / xAxisStep) * xAxisStep;
    const snappedY = Math.round(y / yAxisStep) * yAxisStep;
    return [snappedX, snappedY];
}

function interpolateY(x1, y1, x2, y2, x) {
  // Ensure that x1 is less than x2 for correct interpolation calculation; Not necessary, but better to check
  if (x1 > x2) {
    // If not, swap x1 and x2, as well as y1 and y2 to maintain correct gradient direction
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
  }
  return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
}

function updateLineAndPoints() {
  let sortedData = data.sort((a, b) => a.time - b.time);

  let extendedFirstPointTime = new Date(2024, 0, 1, 0, 0);
  let extendedLastPointTime = new Date(2024, 0, 1, 23, 59);

  let extendedFirstPointSpeed;
  let extendedLastPointSpeed;
  if (line.curveType == d3.curveStepAfter) {
    extendedFirstPointSpeed = sortedData[sortedData.length - 1].speed;
    extendedLastPointSpeed = sortedData[0].speed;
  } else {
    extendedFirstPointSpeed = interpolateY(sortedData[sortedData.length - 1].time.getTime() - 86400000, sortedData[sortedData.length - 1].speed, sortedData[0].time.getTime(), sortedData[0].speed, extendedFirstPointTime.getTime(), "true");
    extendedLastPointSpeed = interpolateY(sortedData[0].time.getTime() + 86400000, sortedData[0].speed, sortedData[sortedData.length - 1].time.getTime(), sortedData[sortedData.length - 1].speed, extendedLastPointTime.getTime(), "false");
  }
  
  const extendedData = [
    { time: extendedFirstPointTime, speed: extendedFirstPointSpeed },
    ...sortedData,
    { time: extendedLastPointTime, speed: extendedLastPointSpeed }
  ];

  path.datum(extendedData).attr("d", line);

  const circles = svg.selectAll("circle").data(data);

  circles
    .enter()
    .append("circle")
    .merge(circles)
    .attr("r", 5)
    .attr("cx", (d) => x(d.time))
    .attr("cy", (d) => y(d.speed))
    .style("cursor", "pointer")
    .style("fill", "orange")
    .attr("tabindex", "0")
    .on("focus", function () {
      d3.select(this).style("stroke", "black").style("stroke-width", "2px");
    })
    .on("blur", function () {
      d3.select(this).style("stroke", "none");
    })
    .call(
      d3.drag().on("drag", function (event, draggedPoint) {
        const newX = new Date(Math.round(x.invert(event.x).getTime() / (xAxisStep * 60000)) * (xAxisStep * 60000));
        const newY = Math.min(100, Math.max(0, Math.round(y.invert(event.y) / yAxisStep) * yAxisStep));
        const index = data.indexOf(draggedPoint);
        const prevPointTime = index > 0 ? data[index - 1].time.getTime() : new Date(2024, 0, 1, 0, 0).getTime();
        const nextPointTime = index < data.length - 1 ? data[index + 1].time.getTime() : new Date(2024, 0, 1, 23, 59).getTime();
        if (newX.getTime() >= prevPointTime && newX.getTime() <= nextPointTime) {
          draggedPoint.time = newX;
          draggedPoint.speed = newY;
          d3.select(this)
            .attr("cx", x(draggedPoint.time))
            .attr("cy", y(draggedPoint.speed));
          updateLineAndPoints();
        }
      })
    );
  circles.exit().remove();
}

// Add the ability to delete points
d3.select("svg").on("keydown", (event) => {
  if (event.key === "Delete") {
    const index = data.findIndex(
      (d) => d === d3.select(document.activeElement).datum()
    );
    if (index > -1) {
      data.splice(index, 1);
      updateLineAndPoints();
    }
  }
});

// Add the ability to create new points by double-clicking
svg.on("dblclick", (event) => {
  const coords = d3.pointer(event, svg.node());
  const time = new Date(Math.round(x.invert(coords[0]).getTime() / (xAxisStep * 60000)) * (xAxisStep * 60000));
  const speed = Math.round(y.invert(coords[1]) / yAxisStep) * yAxisStep;

  // Check if the time slot is already taken
  if (data.some((point) => Math.abs(point.time.getTime() - time.getTime()) < 60000)) { // 1 minute tolerance
    console.log(
      "A point already exists at this time. Please choose another time."
    );
    return; // Early return to prevent adding the point
  }

  data.push({ time, speed });
  data.sort((a, b) => a.time - b.time); // Keep data sorted by time
  updateLineAndPoints();
});

// Initial rendering of the points
updateLineAndPoints();
