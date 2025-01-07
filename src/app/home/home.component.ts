import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { SignIn } from '../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  dateToday: Date;
  msg: string;
  sign: boolean;
  sigOut: boolean = false;
  signDate: string = null;
  late: boolean = false;
  latey: boolean = false;
  lateR: boolean = false;
  excusesList: any[] = [
    { id: 1, value: 'Public Holiday' },
    { id: 2, value: 'Offical Errand/Assignment' },
    { id: 3, value: 'Permitted by Supervior (Sent a mail)' },
    { id: 4, value: 'Weather/Rain' },
    { id: 5, value: 'No Excuse' },
  ];
  excuse: any;
  fetchedData: SignIn | null = null;
  idtoUpdate: string | null = null;
  signInList:SignIn[]=[];

  constructor(
    public authService: AuthService,
    private attendanceService: AttendanceService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.sign = false;
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentuserSignal.set({
          email: user.email!,
          displayName: user.displayName!,
        });
        this.fetchData();
      } else {
        this.authService.currentuserSignal.set(null);
      }
    });
    let user = this.authService.currentuserSignal().displayName;
    this.attendanceService.fetchDataByNameAndDateRange(user).subscribe(response=>{
      // alert('This is fired!')
      this.signInList=response;
      console.log(this.signInList);

    })
  }

  signIn() {
    const data = {
      name: this.authService.currentuserSignal().displayName,
      timeout:null
    };
    this.attendanceService.signIn(data).then(() => {
        this.sign = true;
        this.msg = "You signed in at";
        console.log('Data saved with unique ID and timestamp!');
        this.matSnackBar.open('Signed in successfully!', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000,
        });
        this.fetchData();
      })
      .catch((error) => {
        console.error('Error saving data: ', error);
        this.matSnackBar.open('Error signing in!', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  fetchData() {
    let user = this.authService.currentuserSignal().displayName;
    this.attendanceService.fetchDataByNameAndDate(user).subscribe((data) => {
      this.fetchedData = data;
      this.sign = this.fetchedData != null ? true : false;
      this.idtoUpdate = this.fetchedData.id;
      this.lateR=this.fetchedData.late==true?true:false
      // this.msg = "You signed in at";
      // console.log(this.fetchedData)
    });
  }

  signOut() {
    const data: SignIn = {
      name: this.fetchedData.name,
      timestamp:this.fetchedData.timestamp,
      timeout:new Date().toISOString()
    } 
    this.attendanceService.signOut(this.idtoUpdate, data).then(() => {
        this.sign = true;
        this.sigOut = true;
        this.msg = "You signed out at";
        this.fetchData();
        this.matSnackBar.open('Sign out succssfully', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000
        });
      });
  }

  lateReason(event: any) {
    //   let reason= this.excusesList.find(x=>x.id==Number(event.target.value));
    //   let model={
    //     userId:this.user.appId,
    //     lateReason:reason.value
    //   }
    //   this.attendanceService.Excuse(model).subscribe(response => {
    //     console.log(response);
    //     this.lateR = true;
    //   }, error => { console.log(error); this.lateR = false; });
    // }
    // get user(): User {
    //   return JSON.parse(localStorage.getItem('goal_tracker_user')) as User;
    // }
  }
}
