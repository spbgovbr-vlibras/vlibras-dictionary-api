import { getTrie } from '../helpers/trie';

const indexer = async function bundleIndexer(req, res, next) {
	try {
		const bundlesList = await getTrie();
		res.status(200).json(bundlesList);

	} catch (error) {
		next(error);
	}

}

export default indexer;