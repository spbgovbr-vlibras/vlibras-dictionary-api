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
    };

    const [signsRequestsCounters, signsCounters] = await Promise.all([
      Sign.aggregate(queries.signsRequestsCount),
      Sign.aggregate(queries.signsCount),
    ]);

    return res.status(200).json({ signsRequestsCounters, signsCounters });
  } catch (error) {
    return next(error);
  }
};

export default metrics;
