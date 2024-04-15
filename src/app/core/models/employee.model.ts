export class Employee {
  Id: number;
  image: string;
  BadgeNo: string;
  EmployeeName: string;
  JobTitle: string;
  Department: string;
  Nationality: string;
  Category: string;
  ContractBase: string;
  Band: string;
  EqvBand: string;
  Project: string;
  isCCC: boolean;
  Company: string;
  WorkLocation: string;
  MessEntitlment: string;
  MealCategory: string;
  MealType: string;
  Religion: string;
  EmployeeActive: boolean;
  InactiveReason: string;
  MobileNo: string;
  PassportNo: string;
  QidNo: string;
  Email: string;
  MessCard: string;
  MilkCard: string;

  constructor(
    Id: number,
    image: string,
    BadgeNo: string,
    EmployeeName: string,
    JobTitle: string,
    Department: string,
    Nationality: string,
    Category: string,
    ContractBase: string,
    Band: string,
    EqvBand: string,
    Project: string,
    isCCC: boolean,
    Company: string,
    WorkLocation: string,
    MessEntitlment: string,
    MealCategory: string,
    MealType: string,
    Religion: string,
    EmployeeActive: boolean,
    InactiveReason: string,
    MobileNo: string,
    PassportNo: string,
    QidNo: string,
    Email: string,
    MessCard: string,
    MilkCard: string
  ) {
    this.Id = Id;
    this.image = image;
    this.BadgeNo = BadgeNo;
    this.EmployeeName = EmployeeName;
    this.JobTitle = JobTitle;
    this.Department = Department;
    this.Nationality = Nationality;
    this.Category = Category;
    this.ContractBase = ContractBase;
    this.Band = Band;
    this.EqvBand = EqvBand;
    this.Project = Project;
    this.isCCC = isCCC;
    this.Company = Company;
    this.WorkLocation = WorkLocation;
    this.MessEntitlment = MessEntitlment;
    this.MealCategory = MealCategory;
    this.MealType = MealType;
    this.Religion = Religion;
    this.EmployeeActive = EmployeeActive;
    this.InactiveReason = InactiveReason;
    this.MobileNo = MobileNo;
    this.PassportNo = PassportNo;
    this.QidNo = QidNo;
    this.Email = Email;
    this.MessCard = MessCard;
    this.MilkCard = MilkCard;
  }
}
