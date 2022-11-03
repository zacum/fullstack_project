module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  switch (true) {
    case typeof err === 'string':
      // custom application error
      return res.status(400).json({ message: err });
    case err.type != undefined:
      // custom application error
      return res.status(400).json(err);

    case err.status === 404:
      return res.status(err.status).json({ message: err.message });
    case err.name === 'UnauthorizedError':
      // jwt authentication error
      return res.status(401).json({ message: 'Unauthorized' });
    default:
      return res.status(500).json({ message: err.message });
  }
}
