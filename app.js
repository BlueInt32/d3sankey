var units = "Widgets";

var CONTAINER_WIDTH = 1200,
  CONTAINER_HEIGHT = 600,
  BOX_HEIGHT = 40
BOX_BORDER_RADIUS = BOX_HEIGHT / 2,
  BOX_TEXT_MARGIN_LEFT = 10,
  BOX_SUBTEXT_MARGIN_LEFT = 13,
  NODE_WIDTH = 150,
  NODE_PADDING = 0,
  EXPANDER_RADIUS = 20,
  SHOW_DEBUG_BOX = false;

var MARGINS = {
    TOP: 0,
    RIGHT: 0,
    BOTTOM: 0,
    LEFT: 0
  },
  width = CONTAINER_WIDTH - MARGINS.LEFT - MARGINS.RIGHT,
  height = CONTAINER_HEIGHT - MARGINS.TOP - MARGINS.BOTTOM;

var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function(d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("#vis").append("svg")
  .attr("width", width + MARGINS.LEFT + MARGINS.RIGHT)
  .attr("height", height + MARGINS.TOP + MARGINS.BOTTOM)
  .append("g")
  .attr("transform",
    "translate(" + MARGINS.LEFT + "," + MARGINS.TOP + ")");
var sankey = {};
var path = {};

// Set the sankey diagram properties
function resetSankey() {
  svg.selectAll("svg *").remove();
  sankey = d3sankey()
    .nodeWidth(NODE_WIDTH)
    .nodePadding(NODE_PADDING)
    .size([width, height]);


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
  var nodeDef = {
    "node": graph.nodes.length,
    "name": "node" + (graph.nodes.length + 1)
  };
  var linkDef = {
    "source": nodeDef.node - 1,
    "target": nodeDef.node,
    "value": 10
  };
  graph.nodes.push(nodeDef);
  graph.links.push(linkDef);
  resetSankey();
  draw();
}

function draw() {

  sankey.nodes(graph.nodes)
    .links(graph.links)
    .layout(1);


  //  ╦  ┬┌┐┌┬┌─┌─┐
  //  ║  ││││├┴┐└─┐
  //  ╩═╝┴┘└┘┴ ┴└─┘
  path = d3.svg.diagonal()
    .source(function(d) {
      var xOffset = d.source.type === '_expander' ? EXPANDER_RADIUS + NODE_WIDTH / 2 : NODE_WIDTH;
      return {
        "x": d.source.y + d.source.dy / 2,
        "y": d.source.x + xOffset - 3 
      };
    })
    .target(function(d) {
      var xOffset = d.target.type === '_expander' ? NODE_WIDTH / 2 - EXPANDER_RADIUS  : 0;
      return { 
        "x": d.target.y + d.target.dy / 2,
        "y": d.target.x + xOffset + 3 /* + sankey.nodeWidth() / 2*/
      };
    })
    .projection(function(d) {
      return [d.y, d.x];
    });
  var link = svg.append("g").selectAll(".link")
    .data(graph.links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("stroke-width", function(d) {
      return Math.max(1, Math.sqrt(d.dy));
    })
    // .sort(function(a, b) {
    //   return b.dy - a.dy;
    // })
  ;
  link.append("title")
    .text(function(d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });


  //  ╔╗╔┌─┐┌┬┐┌─┐┌─┐ 
  //  ║║║│ │ ││├┤ └─┐
  //  ╝╚╝└─┘─┴┘└─┘└─┘
  var node = svg.append("g").selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      console.log(d.name, d.x, d.y);
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


  if (SHOW_DEBUG_BOX) {
    node
      .append("rect")
      .style("fill", "none")
      .style("stroke-width", 1)
      .style("stroke", "#F00")
      .attr("width", sankey.nodeWidth())
      .attr("height", function(d) {
        return d.dy;
      });
  }

  //  ╔═╗┬─┐┌─┐┌┬┐┬ ┬┌─┐┌┬┐
  //  ╠═╝├┬┘│ │ │││ ││   │ 
  //  ╩  ┴└─└─┘─┴┘└─┘└─┘ ┴ 

  node
    .filter(function(d) {
      return (d.type !== "_expander");
    })
    .append("rect")
    .attr("y", function(d) {
      return d.dy / 2 - BOX_HEIGHT / 2;
    })
    .attr("height", BOX_HEIGHT)
    .attr("rx", BOX_BORDER_RADIUS)
    .attr("ry", BOX_BORDER_RADIUS)
    .attr("width", sankey.nodeWidth())
    //.style("stroke-width", 3)
    .append("title")
    .text(function(d) {
      return d.name + "\n" + format(d.value);
    });

  node
    .filter(function(d) {
      return (d.type !== "_expander");
    })
    .append("svg:image")
    .attr("xlink:href",  'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png')
    .attr("transform", function(d) {
      return "translate(" + (NODE_WIDTH - 32 - 3) + "," + (d.dy / 2 - BOX_HEIGHT / 2 + 3) +")";
    })
    .attr("height", 32)
    .attr("width",32);


  //  ╔═╗─┐ ┬┌─┐┌─┐┌┐┌┌┬┐┌─┐┬─┐ 
  //  ║╣ ┌┴┬┘├─┘├─┤│││ ││├┤ ├┬┘
  //  ╚═╝┴ └─┴  ┴ ┴┘└┘─┴┘└─┘┴└─
  node
    .filter(function(d) {
      return (d.type === "_expander");
    })
    .append("circle")
    .attr("cx", sankey.nodeWidth() / 2)
    .attr("cy", function(d) {
      return d.dy / 2;
    })
    .attr("r", EXPANDER_RADIUS)
    .append("title")
    .text(function(d) {
      return d.name + "\n" + format(d.value);
    });


  //  ╔╦╗┌─┐─┐ ┬┌┬┐
  //   ║ ├┤ ┌┴┬┘ │ 
  //   ╩ └─┘┴ └─ ┴ 
  node
    .filter(function(d) {
      return d.type !== '_expander';
    })
    .append("text")
    .attr('class', 'title')
    .attr("y", function(d) {
      return d.dy / 2;
    })
    .attr("x", BOX_TEXT_MARGIN_LEFT)
    .text(function(d) {
      return d.name;
    })
    .attr("text-anchor", "start");
  node
    .filter(function(d) {
      return d.type !== '_expander';
    })
    .append("text")
    .attr('class', 'owner')
    .attr("y", function(d) {
      return d.dy / 2;
    })
    .attr("dy", "1em")
    .attr("dx", ".2em")
    .attr("x", BOX_SUBTEXT_MARGIN_LEFT)
    .text(function(d) {
      return d.owner;
    })
    .attr("text-anchor", "start");


  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform",
      "translate(" + (
        d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))) + "," + (
        d.y = Math.min(height - Math.sqrt(d.dy), d3.event.y)) + ")");
    sankey.relayout();
    link.attr("d", path);
  };
}