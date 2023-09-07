import { Component, ViewChild } from '@angular/core';
import { LogInterface, LoginService, LoginStatus } from 'src/app/services/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';

interface LogStringsInterface {
  id: number;
  email: string;
  loggedAt: string;
  status: string;
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent {
  logins: LogInterface[] = [];
  loginsData = new MatTableDataSource<LogStringsInterface>([]);

  displayedColumns: string[] = ['Id', 'Email', 'LoggedAt', 'Status'];

  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];

  filter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginService: LoginService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loginsData.paginator = this.paginator;

    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.loginsData.sort = this.sort;
  }

  onPageChange(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.filter === '') this.fetchData();
    else this.searchData();
  }

  private fetchData(): void {
    this.loginService.logs(this.pageNumber, this.pageSize).subscribe((response) => {
      if (response.succeeded) {
        this.totalCount = response.data.totalCount;
        this.logins = response.data.items;
        this.loginsData.data = this.mapData(response.data.items);
      }
    });
  }

  searchData(): void {
    this.loginService.filter(this.pageNumber, this.pageSize, this.filter).subscribe((response) => {
      console.log(response);
      if (response.succeeded) {
        this.totalCount = response.data.totalCount;
        this.logins = response.data.items;
        this.loginsData.data = this.mapData(response.data.items);
      }
    });
  }

  private mapData(data: LogInterface[]): LogStringsInterface[] {
    return data.map((element) => {
      return {
        id: element.id,
        email: element.email,
        loggedAt: this.datePipe.transform(element.loggedAt, 'yyyy-MM-dd hh:mm') ?? '',
        status: LoginStatus[element.status],
      };
    });
  }
}
