// const lyricsData = require('../data/compressed_data.json');
// const lyricsData = [{"Song":"here", "Artist":"Alessia","Year":2015, "Lyrics":{"i":25, "guess":1}}]
const axios = require('axios');

const WordCounter = require('./word_counter.js');
const StreamGraph = require('./streamgraph.js');
const InputValidator = require('./input_validator.js');

class App {
  constructor () {
    axios.get('http://localhost:3000/counts')
    .then((err, data) => {
      this.setup(data);
    })
  }

  setup (lyricsData) {
    this.counter = new WordCounter(lyricsData);
    this.selectElements();
    this.setupButtons();
    this.validator = new InputValidator(lyricsData);

    this.setupGraph();
    this.bindEvents();
  }

  setupGraph () {
    this.graph = new StreamGraph({
      data: this.counter.count("baby", true),
      el: document.getElementById('graph'),
      width: 960,
      height: 500,
      percent: this.counter.percent
    });
    this.graph.draw();
  }

  setupButtons () {
    if (this.counter.percent) {
      this.percentEl.classList.add('selected');
    } else {
      this.countEl.classList.add('selected');
    }

    if (this.counter.includeMax) {
      this.toggleInclude.classList.add('including');
    }
  }

  selectElements () {
    this.percentEl = document.getElementById("percent");
    this.countEl = document.getElementById("count");
    this.toggleInclude = document.querySelector(".toggle-include");
    this.input = document.querySelector("input[name=search]");
    this.submit = document.querySelector("form.search");
  }

  handleInputChange (e) {
    const text = this.input.value

    const exists = this.validator.validate(text);
    if (!exists) {
      this.input.classList.add('invalid');
    } else {
      this.input.classList.remove('invalid');
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    const counts = this.counter.count(this.input.value, true);
    this.graph.setData(counts);

    const message = `"${this.counter.targets.join("\", \"")}"`;
    document.querySelector("strong.search-terms").innerText = message;
  }

  togglePercent (bool) {
    return (e) => {
      this.counter.percent = bool;
      this.graph.props.percent = bool;
      if (bool) {
        this.percentEl.classList.add('selected');
        this.countEl.classList.remove('selected');
      } else {
        this.percentEl.classList.remove('selected');
        this.countEl.classList.add('selected');
      }
      this.graph.setData(this.counter.count());
    }
  }

  handleToggleInclude (e) {
    e.preventDefault();
    this.counter.toggleIncludeMax();
    this.toggleInclude.classList.toggle('including');
    this.graph.setData(this.counter.count());
  }

  bindEvents () {
    this.input.addEventListener('keyup', this.handleInputChange.bind(this));
    this.submit.addEventListener('submit', this.handleSubmit.bind(this));
    this.toggleInclude.addEventListener('click', this.handleToggleInclude.bind(this));
    this.percentEl.addEventListener('click', this.togglePercent(true).bind(this));
    this.countEl.addEventListener('click', this.togglePercent(false).bind(this));
  }
}

module.exports = App;
