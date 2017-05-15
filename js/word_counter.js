const lyricsData = require('../data/compressed_data.json');
const removePunctuation = require('./util/remove_punctuation.js');

class WordCounter {
  constructor () {
    this.cache = {};
    this.current = {};
    this.includeMax = false;
    this.percent = true;
  }

  count (word) {
    if (word) this.targets = this.expandTarget(word);
    this.current = this.newCount();

    return this.output();
  }

  toggleIncludeMax () {
    this.includeMax = !this.includeMax;
  }

  output () {
    const results = [];

    for (let i = 1965; i < 2016; i++) {
      let yr = this.current[i],
          count = yr.count;

      if (!this.includeMax) count -= yr.max.count;
      if (this.percent) count /= (yr.total / 100);

      results.push({year: i, count});
    }

    return results;
  }

  //private methods

  startResults () {
    const results = {};

    for (let i = 1965; i < 2016; i++) {
      results[i] = {count: 0.0000001, max: null, total: 0};
    }
    return results;
  }

  expandTarget(word) {
    const targets = [removePunctuation(word.toLowerCase())];
    if (word.slice(0, -3).search(/[aeiou]/) >= 0) {
      if (word.slice(-3) === "ing")
        targets.push(word.slice(0, -1));
    }
    return targets;
  }

  newCount () {
    if (this.cache[this.targets[0]])
      return this.cache[this.targets[0]];

    const results = this.startResults();

    lyricsData.forEach((song) => {
      const wordCounts = this.getWordCounts(song.Lyrics),
            curr = results[song.Year];

      curr.total = 0;
      if (!curr.max || curr.max.count < wordCounts[0]) {
        curr.max = {
          title: song.Song,
          artist: song.Artist,
          count: wordCounts[0]};
      }

      curr.count += wordCounts[0];
      curr.total += wordCounts[1];
    });

    this.cache[this.targets[0]] = results;
    return results;
  }

  getWordCounts (words) {
    let total = 0,
        count = 0;

    Object.keys(words).forEach((wrd) => {
      total += words[wrd];
      for (let i = 0; i < this.targets.length; i++) {
        if (this.targets[i] === wrd) count += words[wrd];
      }
    });
    return [count, total];
  }
}

module.exports = WordCounter;
