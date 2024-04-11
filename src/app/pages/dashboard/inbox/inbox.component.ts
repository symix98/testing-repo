import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ListViewModel } from 'src/app/core/models/listview.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Inbox } from 'src/app/core/models/inbox.model';
import { Account } from 'src/app/core/models/account.model';
import { Subscription } from 'rxjs';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  inbox: Inbox[] = [];
  originalInbox: Inbox[] = [];
  inboxLoaded: boolean;
  noData: boolean;
  loading: boolean;
  loggedInUserAccount: AppUsers;
  userEmail: string;

  //Inbox Filter
  inboxFilter: string;

  //ToDo Grouping
  grouped: boolean = false;
  groupedBy: number;
  presented: any;

  users: AppUsers[];

  spoolsListView: ListViewModel;

  subscription = new Subscription();


  constructor(private router: Router, private utilitiesService: UtilitiesService, private apiService: ApiService, private dateService: DateService) { }

  async ngOnInit(): Promise<void> {

    this.loggedInUserAccount = await this.utilitiesService.getCurrentAppUser();
    if (this.loggedInUserAccount) {
      this.userEmail = this.loggedInUserAccount.userId;
      if (this.userEmail) {
        this.getInboxData(this.userEmail);
      }
    }
  }

  getInboxData(userId: string) {
    this.loading = true;
    let query: ApiQuery = null;
    query = {
      filter: new Map<string, string>([['assignedToId', userId]]),
      sort: ['dateTime,desc']
    };
    this.subscription.add(this.apiService.get(ApiURL.inboxes, query).subscribe(inbox => {
      if (inbox.length > 0) {
        this.originalInbox = inbox;
        this.presented = this.originalInbox;
        this.manipulateInboxDataForDisplay();
      }
      else {
        this.inboxLoaded = true;
        this.noData = true;
      }
      this.loading = false;
    }, () => {
      this.inboxLoaded = false;
      this.loading = false;
      this.utilitiesService.notifyError('Error retrieving inbox');
    }));
  }

  async manipulateInboxDataForDisplay() {
    //await this.getUsers();
    for (let elem of this.originalInbox) {
      elem.dateAgoFrame = this.dateService.dateAgo(elem.dateTime);
    }

    this.inboxLoaded = true;
  }

  // filter by message, title and assigned by
  filter(args) {

    let filteredArr;
    if (args) {

      if (!this.grouped) {
        filteredArr = this.originalInbox.filter(item => {
          return item.message.toLowerCase().indexOf(args.toLowerCase()) > -1
            || item.title.toLowerCase().indexOf(args.toLowerCase()) > -1
            || item.assignedByName.toLowerCase().indexOf(args.toLowerCase()) > -1;
        })

        this.presented = filteredArr;
      }
      else {
        if (this.groupedBy === 1) {
          this.groupByUserFilter(args);
        }

        if (this.groupedBy === 2) {
          this.groupByReadFilter(args);
        }
        if (this.groupedBy === 3) {
          this.groupByDateFilter(args);
        }
      }
    }
    else {
      if (!this.grouped) {
        this.presented = this.originalInbox;
      }
      else {
        this.grouped = false;
        this.group(this.groupedBy);
      }
    }
  }


  group(x?: number, action?: boolean) {

    this.inboxFilter = '';

    if ((!this.groupedBy) || (this.groupedBy == x)) {
      this.grouped = !this.grouped;
    }

    if (this.grouped) {
      this.groupedBy = x;
      if (x == 1) {
        this.groupByUser();
      }
      if (x == 2) {
        this.groupByRead();
      }
      if (x == 3) {
        this.groupByDate();
      }
    }
    else {
      this.groupedBy = null;
      this.presented = this.originalInbox;
    }
  }

  groupByUser() {
    let arr: any[] = [];
    this.originalInbox.forEach(element => {
      const index = arr.findIndex(x => x.groupBy == element.assignedByName);

      if (index < 0) {
        let elements: Inbox[] = [];
        elements.push(element);

        arr.push({
          groupBy: element.assignedByName,
          elements: elements,
          active: false
        });
      }
      else {
        arr[index].elements.push(element);
      }
    });

    this.presented = this.sortArray(arr);
  }

  groupByUserFilter(filterBy?: any) {
    let arr: any[] = [];

    this.originalInbox.filter(item => {
      return item.message.toLowerCase().indexOf(filterBy.toLowerCase()) > -1
        || item.title.toLowerCase().indexOf(filterBy.toLowerCase()) > -1
        || item.assignedByName.toLowerCase().indexOf(filterBy.toLowerCase()) > -1;
    }).forEach(element => {
      const index = arr.findIndex(x => x.groupBy == element.assignedByName);

      if (index < 0) {
        let elements: Inbox[] = [];
        elements.push(element);

        arr.push({
          groupBy: element.assignedByName,
          elements: elements,
          active: false
        });
      }
      else {
        arr[index].elements.push(element);
      }
    });

    this.presented = this.sortArray(arr);
  }

  groupByRead() {
    let arr: any[] = [];
    this.originalInbox.forEach(element => {
      const index = arr.findIndex(x => x.groupBy == element.unread);

      if (index < 0) {
        let elements: Inbox[] = [];
        elements.push(element);

        arr.push({
          groupBy: element.unread,
          elements: elements,
          active: false
        });


      }
      else {
        arr[index].elements.push(element);
      }
    });
    arr.forEach(item => {
      if (item.groupBy) {
        item.groupBy = 'Unread';
      }
      else {
        item.groupBy = 'Read';
      }
    })
    this.presented = this.sortArrayReadUnread(arr);
  }


  groupByReadFilter(filterBy?: any) {
    let arr: any[] = [];

    this.originalInbox.filter(item => {
      return item.message.toLowerCase().indexOf(filterBy.toLowerCase()) > -1
        || item.title.toLowerCase().indexOf(filterBy.toLowerCase()) > -1
        || item.assignedByName.toLowerCase().indexOf(filterBy.toLowerCase()) > -1;
    }).forEach(element => {
      const index = arr.findIndex(x => x.groupBy == element.unread);

      if (index < 0) {
        let elements: Inbox[] = [];
        elements.push(element);

        arr.push({
          groupBy: element.unread,
          elements: elements,
          active: false
        });
      }
      else {
        arr[index].elements.push(element);
      }
    });

    arr.forEach(item => {
      if (item.groupBy) {
        item.groupBy = 'Unread';
      }
      else {
        item.groupBy = 'Read';
      }
    })
    this.presented = this.sortArrayReadUnread(arr);
  }



  groupByDate() {
    let arr: any[] = [];
    this.originalInbox.forEach(element => {
      const index = arr.findIndex(x => x.groupBy == element.dateAgoFrame);

      if (index < 0) {
        let elements: Inbox[] = [];
        elements.push(element);

        arr.push({
          groupBy: element.dateAgoFrame,
          elements: elements,
          active: false
        });
      }
      else {
        arr[index].elements.push(element);
      }
    });

    this.presented = this.sortArrayDate(arr);
  }

  groupByDateFilter(filterBy?: any) {
    let arr: any[] = [];

    this.originalInbox.filter(item => {
      return item.message.toLowerCase().indexOf(filterBy.toLowerCase()) > -1
        || item.title.toLowerCase().indexOf(filterBy.toLowerCase()) > -1
        || item.assignedByName.toLowerCase().indexOf(filterBy.toLowerCase()) > -1;
    }).forEach(element => {
      const index = arr.findIndex(x => x.groupBy == element.dateAgoFrame);

      if (index < 0) {
        let elements: Inbox[] = [];
        elements.push(element);

        arr.push({
          groupBy: element.dateAgoFrame,
          elements: elements,
          active: false
        });
      }
      else {
        arr[index].elements.push(element);
      }
    });

    this.presented = this.sortArrayDate(arr);
  }



  sortArray(arr): any[] {
    return arr.sort((a, b) => (a.groupBy > b.groupBy) ? 1 : -1)
  }

  sortArrayReadUnread(arr): any[] {
    return arr.sort((a, b) => (b.groupBy > a.groupBy) ? 1 : -1);
  }
  sortArrayDate(arr): any[] {
    return arr.sort((a, b) => Number(new Date(b.dateTime)) - Number(new Date(a.dateTime)));
  }

  toggleCollapse(index) {
    this.presented[index].active = !this.presented[index].active;
  }
}
