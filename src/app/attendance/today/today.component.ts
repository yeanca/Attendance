import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { SignIn } from '../../models';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrl: './today.component.css'
})
export class TodayComponent implements OnInit {
  signIns:SignIn[]=[];
  selectedDate:string='';
  constructor(private attendanceService:AttendanceService){}

  ngOnInit(): void {
    
  }

  fetchData() {
    if (this.selectedDate) {
      this.attendanceService.fetchDataByDate(this.selectedDate).subscribe(response=>{
        this.signIns=response;
      })
    }
  }

}
