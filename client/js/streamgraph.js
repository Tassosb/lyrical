class StreamGraph {
  constructor (options) {
    Object.assign(this, options, StreamGraph.DEFAULTS);
    this.props = {percent: options.percent};
  }

  static createPopUpHTML ({year, dataType, count, unit}) {
    return `<ul>
              <li>Year: ${year}<li>
              <li>${dataType}: ${count + unit}</li>
            </ul>`
  }

  draw () {
    d3.select('div.loader').remove();
    this.svg = d3.select(this.el).append('svg');
    this.svg.attr('width',  this.width);
    this.svg.attr('height', this.height);

    this.createStack();
    this.createLayers();
    this.createScales();
    this.createArea();
    this.createPopUp();
    this.createSightLines();

    this.drawPaths();

    this.plot = this.svg.append('g')
      .attr('transform','translate(0,'+this.margin.top+')');

    this.addAxes();
  }

  drawPaths () {
    const z = d3.interpolateCool;

    const width = this.width,
          m = this.margin,
          props = this.props,
          popUp = this.popUp,
          sightLine = this.sightLine,
          sightY = this.sightY;

    this.svg.selectAll("path")
      .data(this.layers)
      .enter().append("path")
      .attr("d", this.area)
      .attr("fill", function() { return z(Math.random()); })
      .on('mouseover', function(d) {
        popUp.style('opacity', 1);
        [sightLine, sightY].forEach(
          (el) => el.style('visibility', 'visible')
        );
      })
      .on('mousemove', function(d) {
        const mouse = d3.mouse(this),
              mousex = mouse[0],
              mousey = mouse[1],
              realWidth = width - m.left - m.right - 15,
              i = Math.floor(((mousex - m.left) / realWidth) * 51),
              data = d[i].data,
              isPercent = props.percent;

        let {count} = data;

        if (isPercent) {
          count = count < 0.00001 ? "< .00001" :
                  Math.round(count*10000)/10000;
        } else {
          count = Math.round(count);
        }

        const popUpOptions = {
          year: data.year,
          dataType: isPercent ? "Percent" : "Count",
          unit: isPercent ? "%" : "",
          count
        }

        popUp.style('left', mousex+2+'px')
             .html(StreamGraph.createPopUpHTML(popUpOptions))

        sightLine.style('top', mousey+2+'px');
        sightY.style('left', mousex+2+'px');
      })
      .on('mouseleave', function(d) {
        popUp.style('opacity', 0);
        sightLine.style('visibility', 'hidden');
        sightY.style('visibility', 'hidden');
      })
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
    .text((this.props.percent ? "%" : "#"));

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

  createPopUp () {
    this.popUp = d3.select('#graph').append('div')
      .attr('class', 'pop-up')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background', 'white')
  }

  createSightLines () {
    const m = this.margin,
          graph = d3.select('#graph');

    this.sightLine = graph.append('div')
      .style('position', 'absolute')
      .style('width', this.width-m.left-m.right-15+'px')
      .style('left', m.left+'px')
      .style('height', '1px')
      .style('background-color', 'black')
      .style('visibility', 'hidden');

    this.sightY = graph.append('div')
      .style('position', 'absolute')
      .style('width', 1+'px')
      .style('height', this.height-m.bottom+'px')
      .style('bottom', m.bottom+'px')
      .style('background-color', 'black')
      .style('visibility', 'hidden');
  }

  createStack () {
    this.stack = d3.stack()
    .keys(['count'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);
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
    const graphHeight = this.height - m.bottom - m.top;
    const yAxisScale = d3.scaleLinear()
      .domain([0, max])
      .range([this.height / 2, 40])

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
