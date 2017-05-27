class StreamGraph {
  constructor (options) {
    Object.assign(this, options, StreamGraph.DEFAULTS);
    this.percent = options.percent;
  }

  draw () {
    d3.select('div.loader').remove();
    const svg = d3.select(this.el).append('svg');
    svg.attr('width',  this.width);
    svg.attr('height', this.height);

    this.createStack();
    this.createLayers();
    this.createScales();
    this.createArea();

    const popUp = d3.select('#graph').append('div')
      .attr('class', 'pop-up')
      .style('position', 'absolute')
      .style('width', '45px')
      .style('height', '45px')
      .style('top', 0)
      .style('opacity', 0)
      .style('background', 'white')
      .style('transition', 'opacity 0.5s')
      .text('HI')

    const z = d3.interpolateCool;

    const width = this.width,
          m = this.margin,
          that = this;

    svg.selectAll("path")
      .data(this.layers)
      .enter().append("path")
      .attr("d", this.area)
      .attr("fill", function() { return z(Math.random()); })
      .on('mouseover', function(d) {
        popUp.style('opacity', 1)
      })
      .on('mousemove', function(d) {
        const mousex = d3.mouse(this)[0],
              realWidth = width - m.left - m.right - 15,
              i = Math.floor(((mousex - m.left) / realWidth) * 51),
              data = d[i].data;
              
        popUp
          .style('left', mousex+'px')
          .html(`<ul><li>Year: ${data.year}<li><li>Data: ${data.count}</li></ul>`)
      })
      .on('mouseleave', function(d) {
        popUp.style('opacity', 0)
      })

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

  //private methods

  transition (data) {
    d3.selectAll("path")
    .data(this.layers)
    .transition()
    .duration(2500)
    .attr("d", this.area);
  }

  addAxes () {
    d3.selectAll('g.axis, text.label').remove();
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
    .text((this.percent ? "%" : "#"));

    this.plot.append("text")
    .attr("class", "x axis label")
    .attr("x", ((this.width-m.right) / 2))
    .attr("y", (this.height - 25))
    .text(("year"));
  }

  createLayers () {
    const layerData = d3.transpose(
      d3.range(StreamGraph.NUM_LAYERS).map(() => this.data)
    );
    this.layers = this.stack(this.data);
  }

  getCounts() {
    return this.data.map((d) => d.count );
  }

  getYears() {
    if (this.years === undefined) this.years = this.data.map((d) => d.year );
    return this.years;
  }

  createStack () {
    this.stack = d3.stack()
    .keys(['count'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);
    // .value(d3.range(StreamGraph.NUM_LAYERS).map(() => 'count'))
    // .keys(this.getYears())
  }

  createArea () {
    this.area = d3.area()
    .curve(d3.curveCatmullRom.alpha(0.5))
    .x((d, i) =>  this.xScale(i))
    .y0((d) => this.yScale(d[0]))
    .y1((d) => this.yScale(d[1]));
  }

  createAxes () {
    const m = this.margin,
          yrs = this.getYears(),
          counts = this.getCounts();

    const xAxisScale = d3.scaleLinear()
      .domain([yrs[0], yrs[yrs.length - 1]])
      .range([m.left, this.width-m.right - 15]);

    this.xAxis = d3.axisBottom()
      .scale(xAxisScale)
      .ticks(10, "f")
      .tickSizeOuter([0]);

    let max = d3.max(counts);
    if (max < StreamGraph.MIN_TOLERANCE) { max = 0; }
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
    if (max < StreamGraph.MIN_TOLERANCE) { max = 0; min = 0; }

    this.yScale = d3.scaleLinear()
      .range([this.height-(m.top+m.bottom), 0])
      .domain([min, max]);
  }
}

StreamGraph.NUM_LAYERS = 20;
StreamGraph.MIN_TOLERANCE = 0.00001;
StreamGraph.DEFAULTS = {
  margin: {
    top: 20,
    right: 75,
    bottom: 45,
    left: 65
  }
};

module.exports = StreamGraph;
