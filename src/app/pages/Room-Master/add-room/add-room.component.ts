import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Room } from 'src/app/core/models/room.model';
import { Transaction } from 'src/app/core/models/transaction.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent
  implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit
{
  rooms: Room = new Room();
  selectedRooms!: Transaction[] | null;

  roomStatuses!: any[];
  campIds!: any[];
  cateringIds!: any[];
  roomsRateIds!: any[];
  availableRooms!: any[];
  roomAllocations: any = [
    { id: 'ar', name: 'Arab' },
    { id: 'in', name: 'India' },
    { id: 'pk', name: 'Pakistan' },
  ];
  roomCategories: any = [
    { id: 'sr', name: 'Senior' },
    { id: 'jr', name: 'Junior' },
    { id: 'wk', name: 'Worker' },
  ];

  subscription = new Subscription();

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getRefTablesData();
}

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  getRefTablesData() {
    this.subscription.add(
      this.apiService.get(ApiURL.roomStatuses).subscribe({
        next: (res) => {
          this.roomStatuses = res;
        },
        complete: () => {
          this.getCamps();
        },
        error: (err) => {
          this.utilitiesService.notifyError("Could not perform operation!");
        //   throw new Error('Could not perform operation!');
        },
      })
    );
  }

  getCamps() {
    this.subscription.add(
        this.apiService.get(ApiURL.camp).subscribe({
          next: (res) => {
            this.campIds = res;
          },
          complete: () => {
            this.getCaterings();
          },
          error: (err) => {
            this.utilitiesService.notifyError("Could not perform operation!");
            throw new Error('Could not perform operation!');
          },
        })
      );
  }

  getCaterings() {
    this.subscription.add(
        this.apiService.get(ApiURL.catering).subscribe({
          next: (res) => {
            this.cateringIds = res;
          },
          complete: () => {
            this.getRoomRates();
          },
          error: (err) => {
            this.utilitiesService.notifyError("Could not perform operation!");
            throw new Error('Could not perform operation!');
          },
        })
      );
  }

  getRoomRates() {
    this.subscription.add(
        this.apiService.get(ApiURL.rooms_rate).subscribe({
          next: (res) => {
            this.roomsRateIds = res;
          },
          complete: () => {
            this.getRoomRates();
          },
          error: (err) => {
            this.utilitiesService.notifyError("Could not perform operation!");
            throw new Error('Could not perform operation!');
          },
        })
      );
  }

  save() {
    if (this.hasEmptyFields()) {
      this.subscription.add(
        this.apiService.post(ApiURL.rooms, this.rooms).subscribe(
          (res) => {
            this.ref.close(res);
          },
          (err) => {
            this.utilitiesService.notifyError("Could not perform operation!");
            throw new Error('Could not perform operation!');
          }
        )
      );
    } else {
      console.log(this.rooms);
      this.utilitiesService.notifyWarning('Please fill all fields');
    }
  }

  hasEmptyFields(): boolean {
    let roomsToCheck = { ...this.rooms };
    delete roomsToCheck.description;
    delete roomsToCheck.availableFrom;
    for (const key of Object.keys(roomsToCheck)) {
      if (
        roomsToCheck[key] === null ||
        roomsToCheck[key] < 0 ||
        roomsToCheck[key] === ''
      ) {
        return true;
      }
    }
    return false;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }
}
