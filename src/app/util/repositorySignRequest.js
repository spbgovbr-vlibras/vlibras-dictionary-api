import axios from 'axios';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';
import { DICTIONARY_ERROR } from '../../config/error';
import constants from '../util/constants';

var GLOBAL_REPOSITORY_IS_DOWN = false;
var GLOBAL_TIMEOUT_CURRENT = 0;
var GLOBAL_TIMEOUT_OBJECT = null;
var GLOBAL_TIMEOUT_INCREMENT = Number(env.GLOBAL_TIMEOUT_INCREMENT || 10000);
var GLOBAL_TIMEOUT_MAXIMUM = Number(env.GLOBAL_TIMEOUT_MAXIMUM || 6 * GLOBAL_TIMEOUT_INCREMENT);

const GLOBAL_TIMEOUT_AXIOS_DEFAULT = Number(env.GLOBAL_TIMEOUT_AXIOS_DEFAULT || 5000)
const axiosInstance = axios.create({ timeout: GLOBAL_TIMEOUT_AXIOS_DEFAULT });

async function resetTimeout() {
  GLOBAL_REPOSITORY_IS_DOWN = false;
}

async function handleAxiosError(error) {
  if (error.code === constants.ERROR_CODES.ERROR_CONNECTION_ABORTED && GLOBAL_REPOSITORY_IS_DOWN === false) {
    GLOBAL_REPOSITORY_IS_DOWN = true;
    GLOBAL_TIMEOUT_CURRENT += GLOBAL_TIMEOUT_INCREMENT;
    if (GLOBAL_TIMEOUT_CURRENT > GLOBAL_TIMEOUT_MAXIMUM) {
      GLOBAL_TIMEOUT_CURRENT = GLOBAL_TIMEOUT_INCREMENT;
    }
    if (GLOBAL_TIMEOUT_OBJECT !== null) {
      clearTimeout(GLOBAL_TIMEOUT_OBJECT);
    }
    GLOBAL_TIMEOUT_OBJECT = setTimeout(resetTimeout, GLOBAL_TIMEOUT_CURRENT);
    const error = {
      error: {
        status: 404,
        code: constants.ERROR_CODES.ERROR_DICTIONARY_TIMEOUT_REACHED,
        message: DICTIONARY_ERROR.axiosErrorTimeoutReached,
        ta: GLOBAL_TIMEOUT_AXIOS_DEFAULT,
        tc: GLOBAL_TIMEOUT_CURRENT,
        tm: GLOBAL_TIMEOUT_MAXIMUM,
      }
    }
    throw error;
  }
}

const repositorySignRequest = (
  async function requestSignFromSignsRepository(version, platform, sign, region) {
    if (GLOBAL_REPOSITORY_IS_DOWN) {
      const error = {
        error: {
          status: 404,
          code: constants.ERROR_CODES.ERROR_DICTIONARY_NOT_RESPONSE,
          message: DICTIONARY_ERROR.dictionaryIsDown,
          ta: GLOBAL_TIMEOUT_AXIOS_DEFAULT,
          tc: GLOBAL_TIMEOUT_CURRENT,
          tm: GLOBAL_TIMEOUT_MAXIMUM,
        }
      }
      throw error;
    }

    const signURL = region
      ? new URL(`/api/signs/${version}/${platform}/${region}/${sign}`, env.DICTIONARY_REPOSITORY_URL)
      : new URL(`/api/signs/${version}/${platform}/${sign}`, env.DICTIONARY_REPOSITORY_URL);

    try {
      const response = await axiosInstance.get(signURL.href, { responseType: 'stream' });
      const localSignPath = path.join(env.LOCAL_DICTIONARY_REPOSITORY, decodeURI(signURL.pathname));

      await fs.promises.mkdir(path.dirname(localSignPath), { recursive: true });

      const streamWriter = fs.createWriteStream(localSignPath);
      response.data.pipe(streamWriter);

      return new Promise((resolve, reject) => {
        streamWriter.on('finish', () => {
          resolve(localSignPath);
        });
        streamWriter.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      await handleAxiosError(error);
      throw new Error(error.message);
    }
  }
);

export default repositorySignRequest;
