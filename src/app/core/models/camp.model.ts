export class Camp {
    Id: number;
    CompanyId: number;
    CampName: string;
    Location: string;
    Remarks: string;
  
    constructor(
      Id: number,
      CompanyId: number,
      CampName: string,
      Location: string,
      Remarks: string
    ) {
      this.Id = Id;
      this.CompanyId = CompanyId;
      this.CampName = CampName;
      this.Location = Location;
      this.Remarks = Remarks;
    }
  }
  