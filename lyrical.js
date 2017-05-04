const WordCounter = require('./js/word_counter.js');
const StreamGraph = require('./js/streamgraph.js');

const wc = new WordCounter();

const percentEl = document.getElementById("percent");
const countEl = document.getElementById("count");
const toggleInclude = document.querySelector(".toggle-include");

if (wc.percent) {
  percentEl.classList.add('selected');
} else {
  countEl.classList.add('selected');
}

if (wc.includeMax) {
  toggleInclude.classList.add('including');
}

const sg = new StreamGraph({
  data: wc.count("baby", true),
  el: document.getElementById('graph'),
  width: 960,
  height: 500,
  percent: wc.percent
});


sg.draw();

const submit = document.querySelector("form.search");
submit.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector("input[name=search]");
  const counts = wc.count(input.value, true);
  sg.setData(counts);

  const message = `"${wc.targets.join("\", \"")}"`;
  document.querySelector("strong.search-terms").innerText = message;
});

toggleInclude.addEventListener('click', (e) => {
  e.preventDefault();
  wc.toggleIncludeMax();
  toggleInclude.classList.toggle('including');
  sg.setData(wc.count());
});


percentEl.addEventListener('click', (e) => {
  wc.percent = true;
  percentEl.classList.add('selected');
  countEl.classList.remove('selected');
  sg.percent = true;
  sg.setData(wc.count());
});

countEl.addEventListener('click', (e) => {
  wc.percent = false;
  percentEl.classList.remove('selected');
  countEl.classList.add('selected');
  sg.percent = false;
  sg.setData(wc.count());
});
