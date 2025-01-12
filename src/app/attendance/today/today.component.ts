import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { SignIn } from '../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrl: './today.component.css'
})
export class TodayComponent implements OnInit {
  signIns:SignIn[]=[];
  selectedDate:string='';
  constructor(private attendanceService:AttendanceService, private matSnackBar:MatSnackBar, private router:Router) { }

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    this.fetchData();
  }

  fetchData() {
    if (this.selectedDate) {
      this.attendanceService.fetchDataByDate(this.selectedDate).subscribe(response=>{
        this.signIns=response;
      })
    }
  }

  updateLate(id: string) {
    let fix = this.signIns.find(x => x.id == id);
    let data: SignIn = {
      id: fix.id,
      name: fix.name,
      timestamp: fix.timestamp,
      late: false
    };
    this.attendanceService.updateLate(id, data).then(response => {
      this.fetchData();
      this.matSnackBar.open('Data updated!', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 5000
      });
    })
  }

  goBack(): void {
    this.router.navigate(['admin']); 
  }
}
