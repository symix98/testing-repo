export class Room {
  id: number;
  campId: number;
  block: string;
  floor: number;
  roomCategory: string;
  bedCount: number;
  roomNo: string;
  rateId: number;
  roomAllocation: string;
  cateringId: number;
  availableFrom: Date;
  roomStatus: string;
  description: string;

  constructor(
    id?: number,
    campId?: number,
    block?: string,
    floor?: number,
    roomCategory?: string,
    bedCount?: number,
    roomNo?: string,
    rateId?: number,
    roomAllocation?: string,
    cateringId?: number,
    availableFrom?: Date,
    roomStatus?: string,
    description?: string
  ) {
    this.id = id;
    this.campId = campId;
    this.block = block;
    this.floor = floor;
    this.roomCategory = roomCategory;
    this.bedCount = bedCount;
    this.roomNo = roomNo;
    this.rateId = rateId;
    this.roomAllocation = roomAllocation;
    this.cateringId = cateringId;
    this.availableFrom = availableFrom;
    this.roomStatus = roomStatus;
    this.description = description;
  }
}
