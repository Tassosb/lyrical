const lyricsData = require('../data/lyrics_no_punctuation.json');

class WordCounter {
  constructor () {
    this.cache = {};
    this.current = {};
  }

  startResults () {
    const results = {};

    for (let i = 1965; i < 2016; i++) {
      results[i] = {count: 0.000001, max: null, total: 0};
    }
    return results;
  }

  count (word, percent = false) {
    // if (!word) return this.startResults();
    this.targets = this.expandTarget(word);

    this.newCount();

    const res = percent ? this.asPercent() : this.asTotals()

    return res;
  }

  expandTarget(word) {
    const targets = [this.removePunctuation(word.toLowerCase())];
    if (word.slice(0, -3).search(/[aeiou]/) >= 0) {
      if (word.slice(-3) === "ing") {
        targets.push(word.slice(0, -1));
      } else {
        targets.push(word + "g");
      }
    }
    return targets;
  }

  removePunctuation (string) {
    let newString = "";
    for (let i = 0; i < string.length; i++) {
      if (string[i] === " " || (65 <= string[i].charCodeAt() && string[i].charCodeAt() <= 122))
      newString += string[i];
    }
    return newString;
  }

  newCount () {
    if (this.cache[this.targets[0]]) return this.cache[this.targets[0]];

    const results = this.startResults();

    lyricsData.forEach((song) => {
      const songWords = song.Lyrics.split(" ");
      const totalWordCount = parseInt(songWords.length);
      const wordCount = this.wordsCount(songWords, this.targets);
      const curr = results[song.Year];

      if (!curr.max || curr.max.count < wordCount) {
        curr.max = {title: song.Song, artist: song.Artist, count: wordCount};
      }

      curr.count += wordCount;
      curr.total += totalWordCount;
    });

    this.cache[this.targets[0]] = results;
    this.current = results;
  }

  asTotals () {
    results = [];
    for (let i = 1965; i < 2016; i++) {
      let yr = this.current[i];
      results.push({year: i, count: yr.count});
    }

    return results;
  }

  asPercent (...targetWords) {
    const results = [];
    for (let i = 1965; i < 2016; i++) {
      let yr = this.current[i];
      results.push({year: i, count: yr.count / yr.total * 100});
    }

    return results;
  }

  wordsCount (words, targets) {
    let count = 0;
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < targets.length; j++) {
        if (targets[j] === words[i]) count++;
      }
    }
    return count;
  }
}

module.exports = WordCounter;
