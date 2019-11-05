import env from '../../config/environments/environment';
import { indexerError } from './debugger';
import { indexSigns } from './signsIndexer';

const signsIndexerBot = async function dictionarySignsIndexerBot() {
  try {
    await indexSigns();
    setInterval(async () => {
      try {
        await indexSigns();
      } catch (error) {
        indexerError(error.message);
      }
    }, env.SIGNS_LIST_UPDATE_INTERVAL);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default signsIndexerBot;
