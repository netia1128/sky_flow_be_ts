export enum TripClassCode { ECONOMY, BUSINESS, FIRST_CLASS };

export interface IFlightDomainProperties {
  departureDate: string;
  destination: string;
  distance: number;
  duration: number;
  md5Hash: string;
  origin: string;
  priceUsd: number;
  returnDate: string;
  tripClassCode: TripClassCode;
};