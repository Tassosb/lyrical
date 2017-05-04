const WordCounter = require('./js/word_counter.js');
const StreamGraph = require('./js/streamgraph.js');

const wc = new WordCounter();
const sg = new StreamGraph({
  data: wc.count("baby", true),
  el: document.getElementById('graph'),
  width: 960,
  height: 500
});

sg.draw();

const submit = document.querySelector("form.search");
submit.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector("input[name=search]");
  const counts = wc.count(input.value, true);
  sg.setData(counts);

  const message = `"${wc.targets.join("\", \"")}"`
  document.querySelector("strong.search-terms").innerText = message
});
