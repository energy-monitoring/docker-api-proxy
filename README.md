# API Proxy

This API Proxy provides a middleware that caches API data and adjusts CORS settings to ensure smooth access to the API.

The web server runs a Node.js server acting as the API Proxy.

## Prerequisites

* Docker
* Docker Compose

## Installation

### Build Docker Image

```bash
docker compose build
```

## Start Docker Container

```bash
docker compose up -d
```

## Stop Docker Container

```bash
docker compose down
```

# Configuration

## Caching

The proxy caches API data to improve performance. You can set the values within the `server.js` in the `cache` constant.
The default value is 3600s (one day). A change requires the image to be rebuilt.

## CORS

CORS settings are adjusted to allow access from various domains. You can set the values within `server.js` in the
`allowedOrigins` constant. This requires the image to be rebuilt.

# Endpoints

The API Proxy forwards requests to the following target URLs, with subsequent paths and queries being relayed 1:1:

* `/aec`: Forwards requests to https://api.energy-charts.info
* `/ass`: Forwards requests to https://api.sunrise-sunset.org

# Support

For support or questions, please create an issue in the repository.

# License

This project is licensed under the [MIT License](/LICENSE.md).

