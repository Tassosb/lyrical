const NUM_LAYERS = 20,
      MIN_TOLERANCE = 0.00001;

class StreamGraph {
  constructor (options) {
    this.el = options.el;
    this.data = options.data;
    this.width = options.width;
    this.height = options.height;

    this.margin = options.margin || {
      top: 20,
      right: 75,
      bottom: 45,
      left: 65
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
      .attr('transform','translate(0,'+this.margin.top+')');

    this.addAxes();
  }

  setData (newData) {
    this.data = newData;

    this.createLayers();
    this.createScales();
    this.addAxes();

    this.transition();
  }

  transition (data) {
    d3.selectAll("path")
    .data(this.layers)
    .transition()
    .duration(2500)
    .attr("d", this.area);
  }

  addAxes () {
    d3.selectAll('g.axis').remove();
    this.createAxes();

    const m = this.margin;
    this.plot.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + (this.height-(m.top+m.bottom)) + ")")
    .call(this.xAxis);

    this.plot.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + m.left + "," + (-m.bottom-8) + ")")
    .call(this.yAxis);

    this.plot.append("text")
    .attr("class", "y axis label")
    .attr("x", 0)
    .attr("y", (this.height-(m.top+m.bottom)) / 4)
    .text("%");
  }

  createLayers () {
    const counts = this.data.map((d) => d.count );
    this.layers = this.stack(
      d3.transpose(d3.range(NUM_LAYERS).map(() => counts ))
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

  createAxes () {
    const m = this.margin,
          yrs = this.data.map((d) => d.year),
          counts = this.data.map((d) => d.count );

    const xAxisScale = d3.scaleLinear()
      .domain([yrs[0], yrs[yrs.length - 1]])
      .range([m.left, this.width-m.right - 15]);

    this.xAxis = d3.axisBottom()
      .scale(xAxisScale)
      .ticks(10, "f")
      .tickSizeOuter([0]);

    let max = d3.max(counts);
    if (max < MIN_TOLERANCE) { max = 0; }
    const yAxisScale = d3.scaleLinear()
      .domain([0, max])
      .range([this.height / 2, m.bottom]);

    this.yAxis = d3.axisLeft()
      .scale(yAxisScale)
      .ticks(10)
      .tickSizeOuter([0]);
  }

  createScales () {
    const m = this.margin;
    let stackMax = (layer) => d3.max(layer, function(d) { return d[1]; });
    let stackMin = (layer) => d3.min(layer, function(d) { return d[0]; });

    this.xScale = d3.scaleLinear()
      .domain([0, +this.data.length])
      .range([m.left, this.width - m.right]);

    let max = d3.max(this.layers, stackMax);
    let min = d3.min(this.layers, stackMin);
    if (max < MIN_TOLERANCE) { max = 0; min = 0; }

    this.yScale = d3.scaleLinear()
      .range([this.height-(m.top+m.bottom), 0])
      .domain([min, max]);
  }
}

module.exports = StreamGraph;
