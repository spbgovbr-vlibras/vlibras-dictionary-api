import axios from 'axios';
import env from '../../config/environments/environment';
import Trie from './Trie';
import { VALIDATION_VALUES } from '../../config/validation';
import { SIGNS_INDEXER_ERROR } from '../../config/error';

const JSONPrefixTrees = {};

const retrieveSignsList = async function retrieveDictionarySignsList(version) {
  const signsListURL = new URL(`/api/signs?version=${version}`, env.DICTIONARY_REPOSITORY_URL);
  try {
    const response = await axios.get(
      signsListURL.href,
      { transformResponse: [(data) => JSON.parse(data)] },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const buildPrefixTree = function buildJSONPrefixTree(signsList) {
  return new Promise((resolve, _reject) => {
    const prefixTree = new Trie();

    for (let i = 0; i < signsList.length; i += 1) {
      prefixTree.addWord(signsList[i]);
    }

    const JSONPrefixTree = prefixTree.toJSON();
    return resolve(JSONPrefixTree);
  });
};

const indexSigns = async function indexDictionarySigns() {
  try {
    const { dictionaryVersions } = VALIDATION_VALUES;

    const signsListRequests = [];
    for (let i = 0; i < dictionaryVersions.length; i += 1) {
      signsListRequests.push(retrieveSignsList(dictionaryVersions[i]));
    }

    const signsLists = await Promise.all(signsListRequests);

    const prefixTreesList = [];
    for (let i = 0; i < signsLists.length; i += 1) {
      prefixTreesList.push(buildPrefixTree(signsLists[i]));
    }

    const prefixTreesObjects = await Promise.all(prefixTreesList);

    dictionaryVersions.forEach((key, index) => {
      JSONPrefixTrees[key] = prefixTreesObjects[index];
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getIndexedSigns = function getIndexedDictionarySigns(version) {
  return new Promise((resolve, reject) => {
    if (!JSONPrefixTrees[version]) {
      return reject(new Error(SIGNS_INDEXER_ERROR.trieNotBuilt));
    }
    return resolve(JSONPrefixTrees[version]);
  });
};

export {
  indexSigns,
  getIndexedSigns,
};
