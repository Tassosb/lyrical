class Trie {
  constructor () {
    this.root = new TrieNode(null);
  }

  static validate(node, value) {
    let match = node.children[value];
    return match || null;
  }

  static insert (node, value) {
    return node.addChild(value);
  }
}

class TrieNode {
  constructor (value) {
    this.value = value;
    this.children = {};
  }

  addChild (value) {
    if (this.children[value]) return this.children[value];
    const newNode = new TrieNode(value);
    this.children[value] = newNode;
    return newNode;
  }
}

module.exports = {Trie, TrieNode};
