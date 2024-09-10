import * as d3 from "https://esm.sh/d3";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

document.addEventListener('DOMContentLoaded', function() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const dataset = data.data;
      const w = 1200;
      const h = 500;
      const padding = 60;

      const svg = d3.select("#bar-graph")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

      const parseDate = d3.timeParse("%Y-%m-%d");
      const formatYear = d3.timeFormat("%Y");

      const dates = dataset.map(d => parseDate(d[0]));
      const gdpValues = dataset.map(d => d[1]);

      const xScale = d3.scaleTime()
                       .domain([d3.min(dates), d3.max(dates)])
                       .range([padding, w - padding]);

      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(gdpValues)])
                       .nice()
                       .range([h - padding, padding]);

      svg.selectAll("rect")
         .data(dataset)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("data-date", d => d[0])
         .attr("data-gdp", d => d[1])
         .attr("x", d => xScale(parseDate(d[0])))
         .attr("y", d => yScale(d[1]))
         .attr("width", (w - 2 * padding) / dataset.length) 
         .attr("height", d => h - padding - yScale(d[1]))
         .attr("fill", "green");

      const xAxis = d3.axisBottom(xScale)
                      .tickFormat(d => formatYear(d))  
                      .tickSize(5);

      const yAxis = d3.axisLeft(yScale)
                      .ticks(5)
                      .tickSize(-w + 2 * padding);

      svg.append("g")
         .attr("id", "y-axis")
         .attr("class", "y-axis")
         .attr("transform", `translate(${padding}, 0)`)
         .call(yAxis);

      svg.append("g")
         .attr("id", "x-axis")
         .attr("class", "x-axis")
         .attr("transform", `translate(0, ${h - padding})`)
         .call(xAxis);
    
      svg.append("text")
         .attr("class", "y-axis-label")
         .attr("text-anchor", "middle")
         .attr("transform", `translate(${padding / 4}, ${h / 2}) rotate(-90)`)
         .text("GDP (in billions)");

      svg.append("text")
         .attr("class", "x-axis-label")
         .attr("text-anchor", "middle")
         .attr("transform", `translate(${w / 2}, ${h - padding / 2 + 20})`)
         .text("Year");

      const tooltip = d3.select("body").append("div")
                        .attr("id", "tooltip")
                        .style("position", "absolute")
                        .style("opacity", 0)
                        .style("pointer-events", "none")
                        .style("background", "lightgray")
                        .style("padding", "5px")
                        .style("border-radius", "3px");

      svg.selectAll("rect")
         .on("mouseover", function(event, d) {
           tooltip.transition().duration(200).style("opacity", 1);
           tooltip.html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
                  .attr("data-date", d[0])
                  .style("left", (event.pageX + 5) + "px")
                  .style("top", (event.pageY - 28) + "px");
         })
         .on("mouseout", function() {
           tooltip.transition().duration(500).style("opacity", 0);
         });
    });
});