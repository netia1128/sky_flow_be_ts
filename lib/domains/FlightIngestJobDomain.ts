import { FlightBuilder } from "../builders/FlightBuilder.ts";
import { fetchFlightDataService } from "../services/fetchflightDataService.ts";
import { FlightDomain } from "./FlightDomain.ts";
import { logger } from '../logger/Logger.ts';
import { IFlightDomainProperties } from "../interfaces/interfaces.ts";

export class FlightIngestJobDomain {
  existingFutureFlights: string[];
  incomingFlights: string[];
  success: (boolean | null);
  errorCode: (number | null);

  constructor() {
    this.existingFutureFlights = [];
    this.incomingFlights = [];
    this.success = null;
    this.errorCode = null;
  }

  async ingestFlights() {
    try {
      this.existingFutureFlights = await FlightDomain.selectFlights();
      await this.fetchNewFlights();

      /* eslint-disable */
      for (const flight of this.incomingFlights) {
        const flightBuilderObject = await this.buildFlight(flight);
        if (!flightBuilderObject) continue;
        if (this.existingFutureFlights.find((existingFlight) => existingFlight.md5Hash === flightBuilderObject.md5Hash)) continue;
        await this.insertFlight(flightBuilderObject);
      };

      this.success = true;
      return { success: this.success };
      
    } catch (err) {
      return { success: this.success, errorCode: this.errorCode };
    }
  }

  async fetchNewFlights() {
    try {
      this.incomingFlights = await fetchFlightDataService();
    } catch (err) {
      logger.logFlightDataServiceError(err);
      this.errorCode = 502;
      this.success = false;
      throw err;
    }
  }

  buildFlight(flight: {}) {
    try {
      return new FlightBuilder()
        .withDepartureDate(flight)
        .withDestination(flight)
        .withDistance(flight)
        .withDuration(flight)
        .withOrigin(flight)
        .withPriceUsd(flight)
        .withReturnDate(flight)
        .withTripClassCode(flight)
        .withMd5Hash(flight);
    } catch (err) {
      logger.logFlightBuilderError(flight, err);
      this.success = false;
      this.errorCode = 422;
      return false;
    }
  }

  async insertFlight(flightBuilderObject: IFlightDomainProperties) {
    try {
      await new FlightDomain(flightBuilderObject).insertFlight();
    } catch (err) {
      logger.logFlightInsertionError(flightBuilderObject, err);
      this.success = false;
      this.errorCode = 500;
      return false;
    }
  }


}
