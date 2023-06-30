import { FlightIngestJobDomain } from '../domains/FlightIngestJobDomain.ts';
import { FlightDomain } from '../domains/FlightDomain.ts';

class Facade {
  ingestFlights() {
    return new FlightIngestJobDomain().ingestFlights();
  }

  selectFlights() {
    try {
      return FlightDomain.selectFlights();
    } catch (err) {
      throw err;
    }
  }
}

export const facade = new Facade();
