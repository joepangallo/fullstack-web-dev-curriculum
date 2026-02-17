function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  const response = { error: err.message || 'Internal server error' };
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;
  if (err.code === 'P2002') return res.status(409).json({ error: 'Record already exists.' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found.' });
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
