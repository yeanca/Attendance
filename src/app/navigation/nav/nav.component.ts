import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user=>{
      if(user){
        this.authService.currentuserSignal.set({
          email:user.email!,
          displayName:user.displayName!
        });
        console.log(this.authService.currentuserSignal())
      }else{
        this.authService.currentuserSignal.set(null);
      }
    });
  }

  logOut(){
    this.authService.logout().subscribe(()=>{});
    this.router.navigate(['/login']);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  
 get isUserLoggedIn() {
    const user = this.authService.currentuserSignal();
    return user && user!=null;
  }

  get user():User{
    return this.authService.currentuserSignal() as User;
  }
  // get isAdmin():boolean{
  //   return this.user.role=='Admin'
  // }
  // get isUser():boolean{
  //   return this.user.role=='User'
  // }

}
