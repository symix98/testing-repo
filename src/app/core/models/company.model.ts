export class Company {
    Id: number;
    OwnedBy: string;
    Location: string;
    ServicesId: number;
    ContactPerson: string;
    ContactNo: string;
    ContactEmail: string;
    Remarks: string;
  
    constructor(
      Id: number,
      OwnedBy: string,
      Location: string,
      ServicesId: number,
      ContactPerson: string,
      ContactNo: string,
      ContactEmail: string,
      Remarks: string
    ) {
      this.Id = Id;
      this.OwnedBy = OwnedBy;
      this.Location = Location;
      this.ServicesId = ServicesId;
      this.ContactPerson = ContactPerson;
      this.ContactNo = ContactNo;
      this.ContactEmail = ContactEmail;
      this.Remarks = Remarks;
    }
  }
  