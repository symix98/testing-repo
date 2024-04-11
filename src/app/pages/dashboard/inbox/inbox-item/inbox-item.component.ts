import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Inbox } from 'src/app/core/models/inbox.model';
import { DateAgo } from 'src/app/core/miscellaneous/global-props.template';
import { Subscription } from 'rxjs';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox-item',
  templateUrl: './inbox-item.component.html',
  styleUrls: ['./inbox-item.component.scss'],
})
export class InboxItemComponent implements OnInit, OnDestroy {
  @Input() inboxItem: Inbox;
  formStatus: any;
  dateAgo: any = '';

  subscription = new Subscription();

  constructor(
    public dateService: DateService,
    private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDateAgo(this.inboxItem);
  }

  getDateAgo(inboxItem: Inbox) {
    if (inboxItem.dateAgoFrame !== DateAgo.Earlier) {
      const dateAgo = this.dateService.dateAgo(inboxItem.dateTime);
      this.dateAgo += dateAgo;
      if (dateAgo === DateAgo.Today) {
        this.dateAgo +=
          ' - ' + this.dateService.timeFromNow(inboxItem.dateTime);
      } else if (
        dateAgo === DateAgo.Yesterday ||
        dateAgo === DateAgo.Two_Days_Ago
      ) {
        this.dateAgo +=
          ' - ' + this.dateService.extractTimeFromDate(inboxItem.dateTime);
      }
    } else {
      this.dateAgo = this.dateService.convertDate(inboxItem.dateTime);
    }
  }

  updateReadStatus(inboxItem): Promise<void> {
    return new Promise((resolve, reject) => {
      inboxItem.unread = false;
      inboxItem.readTime = new Date();
      this.subscription.add(
        this.apiService.put(ApiURL.inboxes, inboxItem).subscribe(
          (res) => {
            resolve();
          },
          () => {
            this.utilitiesService.notifyError(
              'Error updating inbox read status'
            );
            resolve();
          }
        )
      );
    });
  }

  async updateUnRead(args: Inbox) {
    console.log(args);    
    if (args.formType === 'transmittal') {
      let obj = {
        id : args.formId,
      }
      this.router.navigate(['documents/inbox-transmittal', obj])
    }else{
      let obj = {
        id : args.formId,
        formType: args.formType
      }
      this.router.navigate(['documents/document-track', obj])
  
    }
    // let obj = {
    //   id : args.formId,
    //   formType: args.formType
    // }
    // this.router.navigate(['documents/document-track', obj])
    // let routeId = '';
    // await this.updateReadStatus(args);
    // const param =
    // {
    //   formId: args.formId
    // };

    // this.router.navigate([routeId, param]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
