
const NUM_LAYERS = 20, // number of layers
NUM_SAMPLES = 50, // number of samples per layer
k = 10; // number of bumps per layer

// const counts = wordCounter.asPercent("baby");

class StreamGrapher {
  constructor () {
    this.svg = d3.select("svg");
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");
    this.stack = d3.stack().keys(d3.range(NUM_LAYERS)).offset(d3.stackOffsetWiggle);
  }

  render (data) {
    let n = NUM_LAYERS;

    this.layers = this.stack(d3.transpose(d3.range(n).map(function() { return data; })));

    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    var x = d3.scaleLinear()
    .domain([0, NUM_SAMPLES - 1])
    .range([0, width]);

    var y = d3.scaleLinear()
    .domain([d3.min(this.layers, stackMin), d3.max(this.layers, stackMax)])
    .range([height, 0]);

    var z = d3.interpolateCool;

    var area = d3.area()
    .x(function(d, i) { return x(i); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

    svg.selectAll("path")
    .data(this.layers)
    .enter().append("path")
    .attr("d", area)
    .attr("fill", function() { return z(Math.random()); });

    function stackMax(layer) {
      return d3.max(layer, function(d) { return d[1]; });
    }

    function stackMin(layer) {
      return d3.min(layer, function(d) { return d[0]; });
    }
  }

  transition (data) {
    var layers, layers1;
    this.layers = this.stack(d3.transpose(d3.range(NUM_LAYERS).map(function() { return data; })));
    var x = d3.scaleLinear()
    .domain([0, NUM_SAMPLES - 1])
    .range([0, this.width]);

    var y = d3.scaleLinear()
    .domain([d3.min(this.layers, stackMin), d3.max(this.layers, stackMax)])
    .range([this.height, 0]);

    var z = d3.interpolateCool;

    function stackMax(layer) {
      return d3.max(layer, function(d) { return d[1]; });
    }

    function stackMin(layer) {
      return d3.min(layer, function(d) { return d[0]; });
    }

    const area = d3.area()
      .x(function(d, i) { return x(i); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); });

    d3.selectAll("path")
    .data(layers = this.layers)
    .transition()
    .duration(2500)
    .attr("d", area);
  }
}


// Inspired by Lee Byron’s test data generator.

function bumps(n, m) {
  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
  for (i = 0; i < m; ++i) bump(a, n);
  return a;
}

function bump(a, n) {
  var x = 1 / (0.1 + Math.random()),
  y = 2 * Math.random() - 0.5,
  z = 10 / (0.1 + Math.random());
  for (var i = 0; i < n; i++) {
    var w = (i / n - y) * z;
    a[i] += x * Math.exp(-w * w);
  }
}

module.exports = StreamGrapher;
