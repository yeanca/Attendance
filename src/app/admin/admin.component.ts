import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { SignIn, UserSummary } from '../models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  signIns: SignIn[] = [];
  userSummaries: UserSummary[] = [];
  month: string = new Date().toLocaleString('default', { month: 'long' });
  startDate: string = '';
  endDate: string = '';

  constructor(private attendanceService: AttendanceService, private authService: AuthService) { }

  ngOnInit(): void {
    // Fetch data for the current month
    this.attendanceService.fetchCurrentMonthData().subscribe(data => {
      this.signIns = data;
      this.calculateUserSummaries();
    });
  }

  fetchDataInRange() {
    this.attendanceService.fetchDataInRange(this.startDate, this.endDate).subscribe(data => {
      this.signIns = data;
      this.calculateUserSummaries();
    });
  }


  private calculateUserSummaries(): void {
    const userMap: { [key: string]: UserSummary } = {};

    this.signIns.forEach(signIn => {
      const userName = signIn.name;

      if (!userMap[userName]) {
        userMap[userName] = {
          name: userName,
          totalAttendance: 0,
          totalLate: 0
        };
      }

      userMap[userName].totalAttendance += 1; // Increment total attendance
      if (signIn.late) {
        userMap[userName].totalLate += 1; // Increment total late if applicable
      }
    });

    // Convert the userMap object to an array
    this.userSummaries = Object.values(userMap);
  }
}
