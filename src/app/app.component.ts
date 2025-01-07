import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Employee Attendance Tracker';
  
  constructor(public authService:AuthService){}
  ngOnInit(): void {
    
  }

  logOut(){
    this.authService.logout().subscribe(()=>{});
  }
}
