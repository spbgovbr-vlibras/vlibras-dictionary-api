import Sign from '../sign/Sign';

const metrics = async function serviceMetrics(req, res, next) {
  try {
    const metricsData = await Sign.aggregate([
      {
        $facet: {
          totalRequests: [
            {
              $group: {
                _id: '$available',
                requests: { $sum: '$hits' },
              },
            },
          ],
          totalSignsSearched: [
            {
              $group: {
                _id: '$available',
                signs: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]).exec();

    return res.status(200).json({ dictionaryMetrics: metricsData[0] });
  } catch (error) {
    return next(error);
  }
};

export default metrics;
