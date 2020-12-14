import fs from 'fs';
import path from 'path';
import axios from 'axios';
import env from '../../config/environments/environment';
import Trie from './Trie';
import { VALIDATION_VALUES } from '../../config/validation';
import { SIGNS_INDEXER_ERROR } from '../../config/error';

const JSONPrefixTrees = {};

const retrieveLocalSignsList = async function retrieveLocalDictionarySignsList(version) {
  const signsListFilePath = path.join(env.LOCAL_DICTIONARY_REPOSITORY, `${version}.json`);
  try {
    await fs.promises.access(signsListFilePath, fs.R_OK);
    const signsListFileData = await fs.promises.readFile(signsListFilePath, 'utf-8');
    const signsList = JSON.parse(signsListFileData);

    if (Array.isArray(signsList) && signsList.length > 0) {
      return signsList;
    }

    return [];
  } catch (error) {
    return [];
  }
};

const retrieveSignsList = async function retrieveDictionarySignsList(version) {
  const signsListURL = new URL(`/api/signs?version=${version}`, env.DICTIONARY_REPOSITORY_URL);
  try {
    const response = await axios.get(
      signsListURL.href,
      { transformResponse: [(data) => JSON.parse(data)] },
    );

    if (response && response.data) {
      fs.mkdir(env.LOCAL_DICTIONARY_REPOSITORY, { recursive: true }, (err) => {
        if (!err) {
          fs.writeFile(
            path.join(env.LOCAL_DICTIONARY_REPOSITORY, `${version}.json`),
            JSON.stringify(response.data), () => { },
          );
        }
      });
      return response.data;
    }

    return retrieveLocalSignsList(version);
  } catch (error) {
    return retrieveLocalSignsList(version);
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
