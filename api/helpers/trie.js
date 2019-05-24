let Node = function() {
	this.children = new Map();
	this.isEnd = false;
};

let Trie = function() {
	this.root = new Node();
};

Trie.prototype.addWord = function(word, node=this.root) {
	if (word.length === 0) {
		node.isEnd = true;
		return;
	}

	if (!node.children.has(word[0])) {
		node.children.set(word[0], new Node());
		return this.addWord(word.substr(1), node.children.get(word[0]));
	}

	return this.addWord(word.substr(1), node.children.get(word[0]));
}

Trie.prototype.toJSON = function() {
	let trieObject = { children: {}, end: false	};
	
    const search = function(node, jsonNode) {
		jsonNode.end = node.isEnd;

		for (const key of node.children.keys()) {
			jsonNode.children[key] = { children: {}, end: false	};
			search(node.children.get(key), jsonNode.children[key]);
		}
    };

	search(this.root, trieObject);
	return { 'root': trieObject };
};

let jsonPrefixTree;

const buildTrie = function buildPrefixTree(signsList) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(signsList)) {
			return reject('Invalid type of signsList');
		}

		let prefixTree = new Trie();

		for (let i = 0; i < signsList.length; i++) {
			prefixTree.addWord(signsList[i]);
		}

		jsonPrefixTree = prefixTree.toJSON();
		resolve();
	});
};

const getTrie = function getPrefixTree() {
	return new Promise((resolve, reject) => {
		if (jsonPrefixTree === undefined) {
			return reject('Prefix tree not built');
		}
		
		resolve(jsonPrefixTree);
	}); 	
};

export { buildTrie, getTrie };