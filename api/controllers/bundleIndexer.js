import { getTrie } from '../helpers/trie';

const indexer = async function bundleIndexer(req, res, next) {
	try {
		const animationsList = await getTrie();
		res.status(200).json(animationsList);
			
	} catch (error) {
		next(error);
	}

}

export default indexer;