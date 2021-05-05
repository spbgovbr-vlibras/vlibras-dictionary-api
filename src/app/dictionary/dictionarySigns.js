const util = require('util');
import { getIndexedSigns } from '../util/signsIndexer';
import { DEFAULT_DICTIONARY_VERSION } from '../../config/default';

const dictionarySigns = async function dictionarySignsController(req, res, next) {
  try {
    console.log("dictionarySigns", (util.inspect(__filename, false, null, true)));
    const signsList = await getIndexedSigns(req.query.version || DEFAULT_DICTIONARY_VERSION);
    // console.log("signsList", (util.inspect(signsList, false, null, true)));
    res.status(200).json(signsList);
  } catch (error) {
    next(error);
  }
};

export default dictionarySigns;
