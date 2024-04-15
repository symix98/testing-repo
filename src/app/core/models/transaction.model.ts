export class Transaction {
  id: number;
  transactionNo: string;
  roomId: number;
  badgeNo: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestStatus: string;
  leaveStartDt: Date;
  leaveEndDt: Date;
  manDays: number;
  remarks: string;
  attachment: string;

  constructor(
      id?: number,
      transactionNo?: string,
      roomId?: number,
      badgeNo?: string,
      checkInDate?: Date,
      checkOutDate?: Date,
      guestStatus?: string,
      leaveStartDt?: Date,
      leaveEndDt?: Date,
      manDays?: number,
      remarks?: string,
      attachment?: string
  ) {
      this.id = id;
      this.transactionNo = transactionNo;
      this.roomId = roomId;
      this.badgeNo = badgeNo;
      this.checkInDate = checkInDate;
      this.checkOutDate = checkOutDate;
      this.guestStatus = guestStatus;
      this.leaveStartDt = leaveStartDt;
      this.leaveEndDt = leaveEndDt;
      this.manDays = manDays;
      this.remarks = remarks;
      this.attachment = attachment;
  }
}
