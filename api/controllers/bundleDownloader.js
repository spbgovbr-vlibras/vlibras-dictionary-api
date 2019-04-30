import axios from 'axios';
import createError from 'http-errors';
import fs from 'fs';
import path from 'path';
import { validationResult } from 'express-validator/check';
import Bundle from '../models/bundle';

const updateDict = async function updateDictionary(version, platform, sign, region) {
	
	let bundleURL = new URL(`${version}/${platform}/${sign}`, process.env.MAIN_DICT_DNS);

	if (region !== undefined) {
		bundleURL.pathname = `${version}/${platform}/${region}/${sign}`;
	}

	try {
		const response = await axios.get(bundleURL.href, { responseType: 'stream' });

		const localBundlePath = path.join(process.env.BUNDLES_DIR, decodeURI(bundleURL.pathname));
		const streamWriter = fs.createWriteStream(localBundlePath);

		response.data.pipe(streamWriter)

		return new Promise((resolve, reject) => {
			streamWriter.on('finish', () => { resolve(localBundlePath) });
			streamWriter.on('error', () => { reject(createError(404)) });
		});

	} catch (error) {
		throw createError(404, error.message);
	}
	
}

const downloader = async function bundleDownloader(req, res, next) {
	
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(createError(422, errors.array()));
	}

	try {
		const bundleRequest = new Bundle({
			name: req.params.sign,
			requester: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});

		let bundleFile = path.join(
			process.env.BUNDLES_DIR,
			req.params.version,
			req.params.platform,
			req.params.sign
		);

		fs.access(bundleFile, fs.F_OK, async (err) => {
			if (err) {
				try {
					bundleFile = await updateDict(
						req.params.version,
						req.params.platform,
						req.params.sign
					);

					res.download(bundleFile);
					bundleRequest.available = true;
					
				} catch (error) {
					bundleRequest.available = false;
					next(error);

				} finally {
					await bundleRequest.save();
				}
			
			} else {
				res.download(bundleFile);
				bundleRequest.available = true;
				await bundleRequest.save();
			}

		});
		
	} catch (error) {
		next(error);
	}
	
}

const regionDownloader = async function regionBundleDownloader(req, res, next) {
	
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(createError(422, errors.array()));
	}

	try {
		const bundleRequest = new Bundle({
			name: req.params.sign,
			region: req.params.region,
			requester: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});

		let bundleFile = path.join(
			process.env.BUNDLES_DIR,
			req.params.version,
			req.params.platform,
			req.params.region,
			req.params.sign
		);

		fs.access(bundleFile, fs.F_OK, async (err) => {
			if (err) {
				try {
					bundleFile = await updateDict(
						req.params.version, 
						req.params.platform, 
						req.params.sign, 
						req.params.region
					);
					
					res.download(bundleFile);
					bundleRequest.available = true;
					
				} catch (error) {
					bundleRequest.available = false;

					try {
						await downloader(req, res, next);
					} catch (error) {
						next(error);
					}
					
				} finally {
					await bundleRequest.save();
				}
			
			} else {
				res.download(bundleFile);
				bundleRequest.available = true;
				await bundleRequest.save();
			}

		});
		
	} catch (error) {
		next(error);
	}
	
}

export { downloader, regionDownloader };