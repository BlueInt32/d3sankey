console.log('is this thing on?');

import d3 from 'd3';
import * as d3sankey from 'd3-sankey';
import data from 'data';

console.log(d3);
console.log(d3sankey);
///

var units = "supply chains";
var vm = {};
var CONTAINER_WIDTH = 1200,
  CONTAINER_HEIGHT = 600,
  BOX_HEIGHT = 40,
  BOX_BORDER_RADIUS = BOX_HEIGHT / 2,
  BOX_TEXT_MARGIN_LEFT = 10,
  BOX_SUBTEXT_MARGIN_LEFT = 13,
  NODE_WIDTH = 150,
  NODE_PADDING = 0,
  EXPANDER_RADIUS = 20,
  SHOW_DEBUG_BOX = false;

var MARGINS = {
    TOP: 5,
    RIGHT: 5,
    BOTTOM: 5,
    LEFT: 5
  },
  width = CONTAINER_WIDTH - MARGINS.LEFT - MARGINS.RIGHT,
  height = CONTAINER_HEIGHT - MARGINS.TOP - MARGINS.BOTTOM;

vm.svg = {};
vm.container = {};
vm.sankey = {};
vm.pathTemplate = {};
vm.graphData = getData(0);
vm.drag = d3.behavior.drag()
  .origin(function(d) {
    return d;
  })
  .on("dragstart", dragstarted)
  .on("drag", dragging)
  .on("dragend", dragended);

var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function(d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scale.category20();
var zoom = d3.behavior.zoom()
  .scaleExtent([.3, 10])
  .on("zoom", zoomed);

createSvgContainer();
resetSankey();
draw();

function createSvgContainer() {
  // append the svg canvas to the page
  vm.svg = d3.select("#vis").append("svg")
    .attr("width", width + MARGINS.LEFT + MARGINS.RIGHT)
    .attr("height", height + MARGINS.TOP + MARGINS.BOTTOM)
    .append("g")
    .attr("transform",
      "translate(" + MARGINS.LEFT + "," + MARGINS.TOP + ")")
    .call(zoom);
  var rect = vm.svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

  vm.container = vm.svg.append("g");
}

function zoomed() {
  vm.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}


function addSankeyNode() {
  console.log('adding node');
  var nodeDef = {
    "node": vm.graphData.nodes.length,
    "name": "node" + (vm.graphData.nodes.length + 1)
  };
  var linkDef = {
    "source": nodeDef.node - 1,
    "target": nodeDef.node,
    "value": 10
  };
  vm.graphData.nodes.push(nodeDef);
  vm.graphData.links.push(linkDef);
  resetSankey();
  draw();
}

function draw() {

  vm.sankey.nodes(vm.graphData.nodes)
    .links(vm.graphData.links)
    .layout(1);

  drawConnections();
  drawNodes();

  function drawConnections() {
    buildPathTemplates();
    drawLinks();

    function buildPathTemplates() {
      vm.pathTemplate = d3.svg.diagonal()
        .source(function(d) {
          var xOffset = d.source.type === '_expander' ? EXPANDER_RADIUS + NODE_WIDTH / 2 : NODE_WIDTH;
          return {
            "x": d.source.y + d.source.dy / 2,
            "y": d.source.x + xOffset - 3
          };
        })
        .target(function(d) {
          var xOffset = d.target.type === '_expander' ? NODE_WIDTH / 2 - EXPANDER_RADIUS : 0;
          return {
            "x": d.target.y + d.target.dy / 2,
            "y": d.target.x + xOffset + 3
          };
        })
        .projection(function(d) {
          return [d.y, d.x];
        });
    }

    function drawLinks() {
      vm.link = vm.container.append("g").selectAll(".link")
        .data(vm.graphData.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", vm.pathTemplate)
        .style("stroke-width", function(d) {
          return Math.max(1, Math.sqrt(d.dy));
        });
      vm.link.append("title")
        .text(function(d) {
          return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });
    }
  }

  function drawNodes() {
    putNodesInPlace();
    drawDebugBoxes();
    drawProductBoxes();
    drawProductIcons();
    drawExpanderBoxes();
    drawProductTexts();

    function putNodesInPlace() {
      vm.node = vm.container.append("g").selectAll(".node")
        .data(vm.graphData.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          console.log(d.name, d.x, d.y);
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(vm.drag);
    }

    function drawDebugBoxes() {
      if (SHOW_DEBUG_BOX) {
        vm.node
          .append("rect")
          .style("fill", "none")
          .style("stroke-width", 1)
          .style("stroke", "#F00")
          .attr("width", NODE_WIDTH)
          .attr("height", function(d) {
            return d.dy;
          });
      }
    }

    function drawProductBoxes() {
      vm.node
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
        .attr("width", NODE_WIDTH)
        .append("title")
        .text(function(d) {
          return d.name + "\n" + format(d.value);
        });
    }

    function drawProductIcons() {
      vm.node
        .filter(function(d) {
          return (d.type !== "_expander");
        })
        .append("svg:image")
        .attr("xlink:href", 'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png')
        .attr("transform", function(d) {
          return "translate(" + (NODE_WIDTH - 32 - 3) + "," + (d.dy / 2 - BOX_HEIGHT / 2 + 3) + ")";
        })
        .attr("height", 32)
        .attr("width", 32);
    }

    function drawExpanderBoxes() {
      vm.node
        .filter(function(d) {
          return (d.type === "_expander");
        })
        .append("circle")
        .attr("cx", NODE_WIDTH / 2)
        .attr("cy", function(d) {
          return d.dy / 2;
        })
        .attr("r", EXPANDER_RADIUS)
        .append("title")
        .text(function(d) {
          return d.name + "\n" + format(d.value);
        });
    }

    function drawProductTexts() {
      drawProductName();
      drawProductCompany();

      function drawProductName() {
        vm.node
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
      }

      function drawProductCompany() {
        vm.node
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
      }
    }
  }
}

function resetSankey() {
  // remove all svg, start clean
  vm.container.selectAll("svg *").remove();
  // Set the sankey diagram properties
  vm.sankey = d3sankey.sankey()
    .nodeWidth(NODE_WIDTH)
    .nodePadding(NODE_PADDING)
    .size([width, height]);
}



function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragging(d) {
  //debugger;
  //d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
  d3.select(this).attr("transform",
    "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");
  vm.sankey.relayout();
  vm.link.attr("d", vm.pathTemplate);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}