import { facade } from "./lib/facade/Facade.ts";

export const setupRoutes = (app) => {
  app.get('/flights', async (req, res) => {
    try {
      const results = await facade.selectFlights();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json(`There was an error with your request`);
    }
  });

  app.post('/jobs/flightingest', async (req, res) => {
    const result = await facade.ingestFlights();
    if (result.success) {
      res.status(200).json(`Ingest successful`);
    } else {
      res.status(result.errorCode ?? 500).send();
    }
  });

  app.get('*', (req, res) => {
    res.status(404).json('Route Not Found');
  });
};
