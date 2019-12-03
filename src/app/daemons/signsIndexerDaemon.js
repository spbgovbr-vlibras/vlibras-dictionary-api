import env from '../../config/environments/environment';
import { indexerError } from '../util/debugger';
import { indexSigns } from '../util/signsIndexer';

const signsIndexerDaemon = async function dictionarySignsIndexerDaemon() {
  try {
    await indexSigns();
    setInterval(async () => {
      try {
        await indexSigns();
      } catch (error) {
        indexerError(error.message);
      }
    }, env.SIGNS_LIST_REFRESH_INTERVAL);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default signsIndexerDaemon;
