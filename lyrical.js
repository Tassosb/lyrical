const WordCounter = require('./js/word_counter.js');
const StreamGrapher = require('./js/streamgrapher.js');

const sg = new StreamGrapher();
const wc = new WordCounter();

sg.render(wc.getCounts("baby", true));
const submit = document.querySelector("form.search");

submit.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector("input[name=search]");
  const counts = wc.getCounts(input.value, true);
  console.log(counts);
  sg.transition(counts);
});
