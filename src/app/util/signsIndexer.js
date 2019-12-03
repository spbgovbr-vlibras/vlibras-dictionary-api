import axios from 'axios';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';
import Trie from './Trie';
import { VALIDATION_VALUES } from '../../config/validation';
import { SIGNS_INDEXER_ERROR } from '../../config/error';

const JSONPrefixTrees = {};

const retrieveSignsList = async function retrieveDictionarySignsList(version) {
  const signsListURL = new URL(`${version}/signs.txt`, env.DICTIONARY_REPOSITORY_URL);
  try {
    const response = await axios.get(signsListURL.href, { responseType: 'stream' });
    const localSignsListPath = path.join(env.LOCAL_DICTIONARY_REPOSITORY, signsListURL.pathname);

    await fs.promises.mkdir(path.dirname(localSignsListPath), { recursive: true });

    const streamWriter = fs.createWriteStream(localSignsListPath);
    response.data.pipe(streamWriter);

    return new Promise((resolve, reject) => {
      streamWriter.on('finish', () => {
        resolve(localSignsListPath);
      });
      streamWriter.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const buildPrefixTree = function buildJSONPrefixTree(signsListFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(signsListFile, 'utf8', (error, data) => {
      if (error) {
        return reject(error.message);
      }

      const prefixTree = new Trie();
      const signsList = data.split('\n');

      for (let i = 0; i < signsList.length; i += 1) {
        prefixTree.addWord(signsList[i]);
      }

      const JSONPrefixTree = prefixTree.toJSON();
      return resolve(JSONPrefixTree);
    });
  });
};

const indexSigns = async function indexDictionarySigns() {
  try {
    const { dictionaryVersions } = VALIDATION_VALUES;

    const signsListRequests = [];
    for (let i = 0; i < dictionaryVersions.length; i += 1) {
      signsListRequests.push(retrieveSignsList(dictionaryVersions[i]));
    }

    const signsListFiles = await Promise.all(signsListRequests);

    const prefixTreesList = [];
    for (let i = 0; i < signsListFiles.length; i += 1) {
      prefixTreesList.push(buildPrefixTree(signsListFiles[i]));
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
