import axios from 'axios';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';

const signUpdate = async function dictionarySignUpdate(version, platform, sign, region) {
  const signURL = region
    ? new URL(`${version}/${platform}/${region}/${sign}`, env.MAIN_DICTIONARY_DNS)
    : new URL(`${version}/${platform}/${sign}`, env.MAIN_DICTIONARY_DNS);

  try {
    const response = await axios.get(signURL.href, { responseType: 'stream' });
    const localSignPath = path.join(env.DICTIONARY_DIR, decodeURI(signURL.pathname));
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
    throw new Error(error.message);
  }
};

export default signUpdate;
