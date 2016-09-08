var units = "Widgets";

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function(d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("#vis").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
var sankey = {};
var path = {};
// Set the sankey diagram properties
function resetSankey() {
  sankey = d3sankey()
  .nodeWidth(20)
  .nodePadding(25)
  .size([width, height]);

  path = d3.svg.diagonal()
    .source(function(d) {
      return { "x": d.source.y + d.source.dy / 2, "y": d.source.x + sankey.nodeWidth() / 2 };
    })
    .target(function(d) {
      return { "x": d.target.y + d.target.dy / 2, "y": d.target.x + sankey.nodeWidth() / 2 };
    })
    .projection(function(d) {
      return [d.y, d.x];
    });
}

function relayout() {
  console.log('relayout');
  sankey.relayout();
}

// load the data
var graph = getData(0);
resetSankey();
draw();
function addNode() {
  console.log('adding node');
  var nodeDef = {"node":graph.nodes.length,"name":"node" + (graph.nodes.length + 1)};
  var linkDef = {"source":nodeDef.node - 1,"target":nodeDef.node,"value":10};
  graph.nodes.push(nodeDef);
  graph.links.push(linkDef);
  resetSankey();
  draw();

}
function draw() {
  sankey.nodes(graph.nodes)
    .links(graph.links)
    .layout(1);

  // add in the links
  var link = svg.append("g").selectAll(".link")
    .data(graph.links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", "tan")
    .style("stroke-opacity", ".33")
    .on("mouseover", function() {
      d3.select(this).style("stroke-opacity", ".5")
    })
    .on("mouseout", function() {
      d3.select(this).style("stroke-opacity", ".2")
    })
    .style("stroke-width", function(d) {
      return Math.max(1, Math.sqrt(d.dy));
    })
    .sort(function(a, b) {
      return b.dy - a.dy;
    });

  // add the link titles
  link.append("title")
    .text(function(d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

  // add in the nodes
  var node = svg.append("g").selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .call(d3.behavior.drag()
      .origin(function(d) {
        return d;
      })
      .on("dragstart", function() {
        this.parentNode.appendChild(this);
      })
      .on("drag", dragmove));

  // add the circles for "node4" and "node7"
  node
    .filter(function(d) {
      return (d.name == "node4") || (d.name == "node7");
    })
    .append("circle")
    .attr("cx", sankey.nodeWidth() / 2)
    .attr("cy", function(d) {
      return d.dy / 2;
    })
    .attr("r", function(d) {
      return Math.sqrt(d.dy);
    })
    .style("fill", function(d) {
      return d.color = color(d.name.replace(/ .*/, ""));
    })
    .style("fill-opacity", ".9")
    //.style("shape-rendering", "crispEdges")
    .style("stroke", function(d) {
      return d3.rgb(d.color).darker(2);
    })
    .append("title")
    .text(function(d) {
      return d.name + "\n" + format(d.value);
    });

  // add the rectangles for the rest of the nodes
  node
    .filter(function(d) {
      return !((d.name == "node4") || (d.name == "node7"));
    })
    .append("rect")
    .attr("y", function(d) {
      return d.dy / 2 - Math.sqrt(d.dy) / 2;
    })
    .attr("height", function(d) {
      return Math.sqrt(d.dy);
    })
    .attr("width", sankey.nodeWidth())
    .style("fill", function(d) {
      return d.color = color(d.name.replace(/ .*/, ""));
    })
    .style("fill-opacity", ".9")
    //.style("shape-rendering", "crispEdges")
    .style("stroke", function(d) {
      return d3.rgb(d.color).darker(2);
    })
    .append("title")
    .text(function(d) {
      return d.name + "\n" + format(d.value);
    });

  // add in the title for the nodes
  node.append("text")
    .attr("x", function(d) {
      if ((d.name == "node4") || (d.name == "node7"))
        return -6 + sankey.nodeWidth() / 2 - Math.sqrt(d.dy);
      else
        return -16 + sankey.nodeWidth() / 2;
    })
    .attr("y", function(d) {
      return d.dy / 2;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("text-shadow", "0 1px 0 #fff")
    .attr("transform", null)
    .text(function(d) {
      return d.name;
    })
    .filter(function(d) {
      return d.x < width / 2;
    })
    .attr("x", function(d) {
      if ((d.name == "node4") || (d.name == "node7"))
        return 6 + sankey.nodeWidth() / 2 + Math.sqrt(d.dy);
      else
        return 16 + sankey.nodeWidth() / 2;
    })
    .attr("text-anchor", "start");

    
  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform",
      "translate(" + (
        d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))) + "," + (
        d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  };
}
