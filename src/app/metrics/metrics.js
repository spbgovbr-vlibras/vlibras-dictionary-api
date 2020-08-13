import Sign from '../sign/Sign';

const metrics = async function serviceMetrics(req, res, next) {
  try {
    const startTime = req.query.startTime
      ? new Date(req.query.startTime)
      : new Date(0);

    const endTime = req.query.endTime
      ? new Date(req.query.endTime)
      : new Date(8640000000000000);

    const queries = {
      signsRequestsCount: [
        { $match: { createdAt: { $gte: startTime, $lt: endTime } } },
        { $group: { _id: '$available', count: { $sum: '$hits' } } },
        { $project: { available: '$_id', count: 1, _id: 0 } },
      ],
      signsCount: [
        { $match: { createdAt: { $gte: startTime, $lt: endTime } } },
        { $group: { _id: '$available', count: { $sum: 1 } } },
        { $project: { available: '$_id', count: 1, _id: 0 } },
      ],
      signsRankingAvailable: [
        {
          $match: {
            available: true,
          },
        },
        {
          $project: {
            name: 1, hits: -1, available: 1,
          },
        },
        { $sort: { hits: -1 } },
        { $limit: 10 },
      ],
      signsRankingUnavailable: [
        {
          $match: {
            available: false,
          },
        },
        {
          $project: {
            name: 1, hits: 1, available: 1,
          },
        },
        { $sort: { hits: -1 } },
        { $limit: 10 },
      ],
    };

    const [signsRequestsCounters,
      signsCounters,
      signsRankingAvailable,
      signsRankingUnavailable] = await Promise.all([
      Sign.aggregate(queries.signsRequestsCount),
      Sign.aggregate(queries.signsCount),
      Sign.aggregate(queries.signsRankingAvailable),
      Sign.aggregate(queries.signsRankingUnavailable),
    ]);

    return res.status(200).json({
      signsRequestsCounters, signsCounters, signsRankingAvailable, signsRankingUnavailable,
    });
  } catch (error) {
    return next(error);
  }
};

export default metrics;
