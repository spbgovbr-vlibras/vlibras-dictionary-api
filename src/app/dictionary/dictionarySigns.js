import { getIndexedSigns } from '../util/signsIndexer';

const dictionarySigns = async function dictionarySignsController(_req, res, next) {
  try {
    const signsList = await getIndexedSigns();
    res.status(200).json(signsList);
  } catch (error) {
    next(error);
  }
};

export default dictionarySigns;
