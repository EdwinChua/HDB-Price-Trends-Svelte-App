export class HDB_Resale_Flat_Record {
    block: string;
    flat_model: string;
    flat_type: string;
    floor_area_sqm: string;
    lease_commence_date: string;
    month: string;
    rank: number;
    remaining_lease: string;
    resale_price: string;
    storey_range: string;
    street_name: string;
    town: string;
  
    constructor(
      block: string,
      flat_model: string,
      flat_type: string,
      floor_area_sqm: string,
      lease_commence_date: string,
      month: string,
      rank: number,
      remaining_lease: string,
      resale_price: string,
      storey_range: string,
      street_name: string,
      town: string
    ) {
      this.block = block;
      this.flat_model = flat_model;
      this.flat_type = flat_type;
      this.floor_area_sqm = floor_area_sqm;
      this.lease_commence_date = lease_commence_date;
      this.month = month;
      this.rank = rank;
      this.remaining_lease = remaining_lease;
      this.resale_price = resale_price;
      this.storey_range = storey_range;
      this.street_name = street_name;
      this.town = town;
    }
  }
  