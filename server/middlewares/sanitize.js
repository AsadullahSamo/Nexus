const sanitize = (data) => {
  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  if (data && typeof data === 'object') {
    const cleaned = {};

    for (const key in data) {
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      cleaned[key] = sanitize(data[key]);
    }

    return cleaned;
  }

  return data;
};

const mongoSanitizer = (req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  next();
};

module.exports = mongoSanitizer;