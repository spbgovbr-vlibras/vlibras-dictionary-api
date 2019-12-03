import axios from 'axios';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';

const signUpdate = async function dictionarySignUpdate(version, platform, sign, region) {
  const signURL = region
    ? new URL(`${version}/${platform}/${region}/${sign}`, env.DICTIONARY_REPOSITORY_URL)
    : new URL(`${version}/${platform}/${sign}`, env.DICTIONARY_REPOSITORY_URL);

  try {
    const response = await axios.get(signURL.href, { responseType: 'stream' });
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
    throw new Error(error.message);
  }
};

export default signUpdate;
