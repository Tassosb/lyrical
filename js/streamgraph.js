
const NUM_LAYERS = 20, // number of layers
NUM_SAMPLES = 50; // number of samples per layer

class StreamGraph {
  constructor (options) {
    this.el = options.el;
    this.data = options.data;
    this.width = options.width;
    this.height = options.height;

    this.margin = options.margins || {
      top: 20,
      right: 75,
      bottom: 45,
      left: 50
    };
  }

  draw () {

    const svg = d3.select(this.el).append('svg');
    svg.attr('width',  this.width);
    svg.attr('height', this.height);

    this.createStack();
    this.createLayers();
    this.createScales();
    this.createArea();

    const z = d3.interpolateCool;

    svg.selectAll("path")
    .data(this.layers)
    .enter().append("path")
    .attr("d", this.area)
    .attr("fill", function() { return z(Math.random()); });

    this.plot = svg.append('g')
        .attr('transform','translate('+this.margin.left+','+this.margin.top+')');

    this.addAxes();
  }

  createLayers () {
    this.layers = this.stack(
      d3.transpose(d3.range(NUM_LAYERS).map(() => this.data ))
    );
  }

  createStack () {
    this.stack = d3.stack()
    .keys(d3.range(NUM_LAYERS))
    .offset(d3.stackOffsetWiggle);
  }

  createArea () {
    this.area = d3.area()
    .x((d, i) =>  this.xScale(i))
    .y0((d) => this.yScale(d[0]))
    .y1((d) => this.yScale(d[1]));
  }

  addAxes () {
    const m = this.margin;

    var xAxis = d3.axisBottom()
        .scale(this.xScale);
        // .ticks(d3.time, 1965);

    // var yAxis = d3.axisLeft();
    //     // .scale(this.yScale);
    // //     .orient("left")
    // //     .tickFormat(d3.format("d"));

    this.plot.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + -m.left + "," + (this.height-(m.top+m.bottom)) + ")")
      .call(xAxis);

    // this.plot.append("g")
    //   .attr("class", "y axis")
    //   .call(yAxis);
  }

  createScales () {
    const m = this.margin;
    const stackMax = (layer) => d3.max(layer, function(d) { return d[1]; });
    const stackMin = (layer) => d3.min(layer, function(d) { return d[0]; });

    this.xScale = d3.scaleLinear()
      .domain([0, NUM_SAMPLES - 1])
      .range([m.left, this.width-m.right]);

    this.yScale = d3.scaleLinear()
      .range([this.height-(m.top+m.bottom), 0])
      .domain([d3.min(this.layers, stackMin), d3.max(this.layers, stackMax)])
  }

  setData (newData) {
    this.data = newData;

    this.createLayers();
    this.createScales();

    this.transition();
  }

  transition (data) {
    let layers;

    d3.selectAll("path")
    .data(layers = this.layers)
    .transition()
    .duration(2500)
    .attr("d", this.area);
  }
}

module.exports = StreamGraph;
