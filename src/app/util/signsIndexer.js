const util = require('util');
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
    console.log("retrieveLocalSignsList", (util.inspect(__filename, false, null, true)));
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
    console.log("retrieveSignsList", (util.inspect(__filename, false, null, true)));
    console.log("signsListURL", (util.inspect(signsListURL, false, null, true)));

    const response = await axios.get(
      signsListURL.href,
      { transformResponse: [(data) => JSON.parse(data)] },
    );
    console.log("response", (util.inspect(response, false, null, true)));
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
    console.log("indexSigns", (util.inspect(__filename, false, null, true)));
    const { dictionaryVersions } = VALIDATION_VALUES;

    console.log("dictionaryVersions", (util.inspect(dictionaryVersions, false, null, true)));
    const signsListRequests = [];
    for (let i = 0; i < dictionaryVersions.length; i += 1) {
      signsListRequests.push(retrieveSignsList(dictionaryVersions[i]));
    }
    // console.log("signsListRequests", (util.inspect(signsListRequests, false, null, true)));

    const signsLists = await Promise.all(signsListRequests);
    // console.log("signsLists", (util.inspect(signsLists, false, null, true)));

    const prefixTreesList = [];
    for (let i = 0; i < signsLists.length; i += 1) {
      prefixTreesList.push(buildPrefixTree(signsLists[i]));
    }
    // console.log("prefixTreesList", (util.inspect(prefixTreesList, false, null, true)));

    const prefixTreesObjects = await Promise.all(prefixTreesList);
    // console.log("prefixTreesObjects", (util.inspect(prefixTreesObjects, false, null, true)));

    dictionaryVersions.forEach((key, index) => {
      JSONPrefixTrees[key] = prefixTreesObjects[index];
    });
  } catch (error) {
    // console.log("indexSigns::error", (util.inspect(error, false, null, true)));
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
