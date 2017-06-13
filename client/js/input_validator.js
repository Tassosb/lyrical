const { Trie, TrieNode } = require('./trie');

class InputValidator {
  constructor (lyricsData) {
    this.lyricsData = lyricsData;
    window.setTimeout(this.buildTrie.bind(this), 0);
  }

  buildTrie () {
    this.trie = new Trie();
    this.root = this.trie.root;

    this.lyricsData.forEach((song) => {
      const words = Object.keys(song.Lyrics);
      words.forEach((word) => {
        const chars = word.split('');
        let currNode = this.root;
        chars.forEach((c) => {
          currNode = Trie.insert(currNode, c.toLowerCase());
        })
      })
    })
  }

  validate (input) {
    let curr = this.root;

    for (let i = 0, n = input.length; i < n; i++) {
      curr = Trie.validate(curr, input[i].toLowerCase())
      if (!curr) return false;
    }

    return true;
  }
}

module.exports = InputValidator;
