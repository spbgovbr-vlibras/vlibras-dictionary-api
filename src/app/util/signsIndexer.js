import axios from 'axios';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';
import Trie from './Trie';
import { SIGNS_INDEXER_ERROR } from '../../config/error';

let JSONPrefixTree;

const retrieveSignsList = async function retrieveDictionarySignsList() {
  const signsListURL = new URL(env.MAIN_SIGNS_LIST_PATH, env.MAIN_DICTIONARY_DNS);
  try {
    const response = await axios.get(signsListURL.href, { responseType: 'stream' });
    const localSignsListPath = path.join(env.DICTIONARY_DIR, signsListURL.pathname);
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
    throw new Error(error);
  }
};

const indexSigns = async function indexDictionarySigns() {
  try {
    const signsListFile = await retrieveSignsList();
    fs.readFile(signsListFile, 'utf8', (error, data) => {
      if (error) {
        throw new Error(error);
      }

      const prefixTree = new Trie();
      const signsList = data.split('\n');

      for (let i = 0; i < signsList.length; i += 1) {
        prefixTree.addWord(signsList[i]);
      }

      JSONPrefixTree = prefixTree.toJSON();
      return undefined;
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getIndexedSigns = function getIndexedDictionarySigns() {
  return new Promise((resolve, reject) => {
    if (JSONPrefixTree === undefined) {
      return reject(new Error(SIGNS_INDEXER_ERROR.trieNotBuilt));
    }
    return resolve(JSONPrefixTree);
  });
};

export {
  indexSigns,
  getIndexedSigns,
};
