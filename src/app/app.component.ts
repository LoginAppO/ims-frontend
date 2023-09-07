import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  token: string | null = null;
  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? null;
  }
}
