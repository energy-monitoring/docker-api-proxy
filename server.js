const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');
const portfinder = require('portfinder');

const cache = new NodeCache({ stdTTL: 3600 });
const app = express();
const PORT = 8000;

const TARGET_URLS = {
  '/aec': 'https://api.energy-charts.info',
  '/ass': 'https://api.sunrise-sunset.org'
};

/* CORS configuration */
const allowedOrigins = [
  /* Development */
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /* Production */
  'https://energy-monitor.ixno.de'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, false);

    const isAllowed = allowedOrigins.some(pattern => 
      (typeof pattern === 'string' && pattern === origin) ||
      (pattern instanceof RegExp && pattern.test(origin))
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

/* Proxy route */
app.use('/:prefix/*', async (req, res, next) => {
  const { prefix } = req.params;
  const targetBaseUrl = TARGET_URLS[`/${prefix}`];

  if (!targetBaseUrl) {
    return res.status(400).send('Invalid API prefix');
  }

  const targetPath = req.params[0];
  const targetUrl = `${targetBaseUrl}/${targetPath}`;
  const cacheKey = `${prefix}-${req.originalUrl}`;

  /* Check and use existing cache api response */
  if (cache.has(cacheKey)) {
    console.log(`Cache hit for ${cacheKey}`);
    return res.json(cache.get(cacheKey));
  }

  console.log(`Cache miss for ${cacheKey}`);
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      params: req.query,
      data: req.body,
    });

    /* Set response to chache */
    cache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching data from ${targetUrl}`, error);
    next(error);
  }
});

/* Error handling */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

/* Start proxy */
portfinder.getPortPromise()
  .then((port) => {
    app.listen(PORT, () => {
      console.log(`Proxy server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

