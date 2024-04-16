import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ProductService } from 'src/app/core/services/fake-data';
import { CustomerService } from 'src/app/core/services/fakedata-customers';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AddRoomComponent } from '../add-room/add-room.component';
import { EditRoomComponent } from '../edit-room/edit-room.component';
import { Room } from 'src/app/core/models/room.model';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';

@Component({
  selector: 'app-room-master',
  templateUrl: './room-master.component.html',
  styleUrls: ['./room-master.component.scss'],
  providers: [ProductService, CustomerService],
})
export class RoomMasterComponent implements OnInit, OnDestroy, AfterContentChecked {
  
  rooms!: Room[] | null;
  selectedRooms!: Room[] | null;
  subscription = new Subscription();

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.getRooms();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  getRooms() {
    this.subscription.add(
      this.apiService.get(ApiURL.rooms).subscribe({
        next: (res) => {
          this.rooms = res;
        },
        complete: () => {
        },
        error: (err) => {
          this.utilitiesService.notifyError("Could not perform operation!");
          throw new Error('Could not perform operation!');
        },
      })
    );
  }

  openNewRoom() {
    this.dialogService
      .open(AddRoomComponent, {
        header: 'Add Room',
        height: '60vh',
        width: '50%',
        modal: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          console.log(res);
          this.rooms.push(res);
          this.utilitiesService.notifySuccess('Room Added');
        }
      });
  }

  openEditRoom(room: Room) {
    this.dialogService
      .open(EditRoomComponent, {
        header: 'Edit Room',
        height: '60vh',
        width: '50%',
        modal: true,
        data: room,
      })
      .onClose.subscribe((res) => {
        if (res) {
          console.log(res);
          this.rooms.push(res);
          this.utilitiesService.notifySuccess('Room Saved');
        }
      });
  }

  deleteRoom(id: number) {
    this.subscription.add(
      this.apiService.delete(ApiURL.rooms + '/' + id).subscribe({
        next: (res) => {},
        complete: () => {
          this.utilitiesService.notifySuccess("Room Deleted");
        },
        error: (err) => {
          this.utilitiesService.notifyError("Could not perform operation!");
          throw new Error('Could not perform operation!');
        },
      })
    );
  }

  deleteSelectedRooms() {
    this.selectedRooms.forEach((room) => {
      this.subscription.add(
        this.apiService.delete(ApiURL.rooms + '/' + room.id).subscribe({
          next: (res) => {},
          complete: () => {
            this.utilitiesService.notifySuccess("Selected Rooms Deleted");
          },
          error: (err) => {
            this.utilitiesService.notifyError("Could not perform operation!");
            throw new Error('Could not perform operation!');
          },
        })
      );
    })
  }

  getSeverity(status: string) {
    switch (status) {
      case 'available':
        return 'success';
      case 'not-available':
        return 'danger';
    }
  }
}
