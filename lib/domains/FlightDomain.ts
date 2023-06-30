import { postgresConnectionService } from "../services/PostgresConnectionService.ts";
import { TripClassCode } from "../interfaces/interfaces.ts";
import { IFlightDomainProperties } from "../interfaces/interfaces.ts";

export class FlightDomain {
    departureDate: string;
    destination: string;
    distance: number;
    duration: number;
    md5Hash: string;
    origin: string;
    priceUsd: number;
    returnDate: string;
    tripClassCode: TripClassCode;

  constructor({  
    departureDate,
    destination,
    distance,
    duration,
    md5Hash,
    origin,
    priceUsd,
    returnDate,
    tripClassCode,
  }: IFlightDomainProperties) {
    this.departureDate = departureDate;
    this.destination = destination;
    this.distance = distance;
    this.duration = duration;
    this.md5Hash = md5Hash;
    this.origin = origin;
    this.priceUsd = priceUsd;
    this.returnDate = returnDate;
    this.tripClassCode = tripClassCode;
  }

  static selectFlights() {
    try {
      const sql: string = `
        SELECT 
        f.id,
        f.price_usd as "priceUsd", 
        lkp_fc.trip_class_name as "tripClassName",
        f.origin,
        f.destination,
        f.departure_date as "departureDate",
        f.md5_hash as "md5Hash",
        f.return_date as "returnDate",
        f.duration,
        f.distance
        FROM 
        flights f,
        lkp_flight_class lkp_fc
        WHERE 
        lkp_fc.trip_class_code = f.trip_class_code
        AND departure_date > NOW()
        ORDER BY departure_date;`;

      return postgresConnectionService.runQuery(sql);
    } catch (err) {
      throw err;
    }
  }

  async insertFlight() {
    try {
      const sql: string = `
        INSERT INTO flights 
        (
          departure_date,
          destination,
          distance,
          duration,
          md5_hash,
          origin,
          price_usd,
          return_date,
          trip_class_code
          ) 
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9
          )
        ;
      `;
  
      const values: (string | number)[] = [
        this.departureDate,
        this.destination,
        this.distance,
        this.duration,
        this.md5Hash,
        this.origin,
        this.priceUsd,
        this.returnDate,
        this.tripClassCode
      ];
      return await postgresConnectionService.runQuery(sql, values);
    } catch (err) {
      throw err;
    }
  }
}