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

  isCollapsed: boolean = true;
  role:string='';
  
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user=>{
      if(user){
        this.authService.currentuserSignal.set({
          email:user.email!,
          displayName:user.displayName!
        });
        
        const userRoleObservable = this.authService.getUserRole(user.displayName);
          userRoleObservable.subscribe(role => {
            this.role = role.role;
            console.log(role);
          });

      }else{
        this.authService.currentuserSignal.set(null);
      }
    });


  }

  getUserRole() {
    try {
      const user = this.authService.currentuserSignal().displayName;
      console.log('user here: ',user)
      const userRoleObservable = this.authService.getUserRole(user);
      userRoleObservable.subscribe(role => {
        this.role = role.role;
        console.log(role);
      });
    } catch (error) {
      console.error('Error fetching user role:', error.message);
    }
  }

  toggle(): void {
    this.isCollapsed = !this.isCollapsed; // Toggle the collapsed state
  }

  logOut(){
    this.authService.logout().subscribe(()=>{});
    this.router.navigate(['/login']);
  }
  
 get isUserLoggedIn() {
    const user = this.authService.currentuserSignal();
    return user && user!=null;
  }

  get user():User{
    return this.authService.currentuserSignal() as User;
  }

}
