import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {}
  login(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: () => {
        console.log('Login successful');
      },
      error(err) {
        console.log('Login failed');
      },
    });
  }
}
