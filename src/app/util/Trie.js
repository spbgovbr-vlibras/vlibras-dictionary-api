const Node = function NodeObject() {
  this.children = new Map();
  this.isEnd = false;
};

const Trie = function TrieObject() {
  this.root = new Node();
};

Trie.prototype.addWord = function addNewWord(word, node = this.root) {
  if (word.length === 0) {
    node.isEnd = true;
    return;
  }

  if (!node.children.has(word[0])) {
    node.children.set(word[0], new Node());
    setImmediate(() => {
      this.addWord(word.substr(1), node.children.get(word[0]));
    });
  } else {
    setImmediate(() => {
      this.addWord(word.substr(1), node.children.get(word[0]));
    });
  }
};

Trie.prototype.toJSON = function convertTrieToJSON() {
  const trieObject = { children: {}, end: false };

  const search = function searchFunction(node, jsonNode) {
    jsonNode.end = node.isEnd;
    for (const key of node.children.keys()) {
      jsonNode.children[key] = { children: {}, end: false };
      setImmediate(() => {
        search(node.children.get(key), jsonNode.children[key]);
      });
    }
  };

  search(this.root, trieObject);
  return { root: trieObject };
};

export default Trie;
