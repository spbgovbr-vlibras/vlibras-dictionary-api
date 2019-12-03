import { getIndexedSigns } from '../util/signsIndexer';
import { DEFAULT_DICTIONARY_VERSION } from '../../config/default';

const dictionarySigns = async function dictionarySignsController(req, res, next) {
  try {
    const signsList = await getIndexedSigns(req.query.version || DEFAULT_DICTIONARY_VERSION);
    res.status(200).json(signsList);
  } catch (error) {
    next(error);
  }
};

export default dictionarySigns;
