import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserInterface, UserService } from 'src/app/services/user.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  users: UserInterface[] = [];
  usersData = new MatTableDataSource<UserInterface>([]);

  displayedColumns: string[] = ['Id', 'Email'];

  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];

  filter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.usersData.paginator = this.paginator;

    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.usersData.sort = this.sort;
  }

  onPageChange(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.filter === '') this.fetchData();
    else this.searchData();
  }

  private fetchData(): void {
    this.userService.users(this.pageNumber, this.pageSize).subscribe((response) => {
      if (response.succeeded) {
        this.totalCount = response.data.totalCount;
        this.users = response.data.items;
        this.usersData.data = response.data.items;
      }
    });
  }

  searchData(): void {
    this.userService.filter(this.pageNumber, this.pageSize, this.filter).subscribe((response) => {
      console.log(response);
      if (response.succeeded) {
        this.totalCount = response.data.totalCount;
        this.users = response.data.items;
        this.usersData.data = response.data.items;
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        const updatedData = [...this.usersData.data, result.data];
        this.usersData.data = updatedData;
        this.users = this.usersData.data;
        this.totalCount = this.totalCount + 1;
      }
    });
  }
}
