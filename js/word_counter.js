const lyricsData = require('../data/lyrics_no_punctuation.json');

class WordCounter {
  constructor () {
    this.cache = {};
    this.currentResults = {};
  }

  startResults () {
    const results = {};

    for (let i = 1965; i < 2016; i++) {
      results[i] = {count: 0, max: null, total: 0};
    }
    return results;
  }

  getCounts (word, asPercent = false) {
    const targets = this.expandTarget(word);
    if (asPercent) return this.asPercent(...targets);

    this.currentResults = this.allCounts(...targets);
    return this.currentResults;
  }

  expandTarget(word) {
    const targets = [this.removePunctuation(word.toLowerCase())];
    if (word.slice(0, -3).search(/[aeiou]/)) {
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

  allCounts (...targetWords) {
    if (this.cache[targetWords[0]]) return this.cache[targetWords[0]];

    const results = this.startResults();

    lyricsData.forEach((song) => {
      const songWords = song.Lyrics.split(" ");
      const totalWordCount = parseInt(songWords.length);
      const wordCount = this.wordsCount(songWords, targetWords);
      const curr = results[song.Year];

      if (!curr.max || curr.max.count < wordCount) {
        curr.max = {title: song.Song, artist: song.Artist, count: wordCount};
      }

      curr.count += wordCount;
      curr.total += totalWordCount;
    });

    this.cache[targetWords[0]] = results;
    return results;
  }

  asPercent (...targetWords) {
    const results = this.allCounts(...targetWords);

    const output = [];
    for (let i = 1965; i < 2016; i++) {
      output.push(results[i].count / results[i].total * 100);
    }

    return output;
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
