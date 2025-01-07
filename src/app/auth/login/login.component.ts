import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  hide = true;
  public errorMsg = null;
  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  private returnUrl;
  constructor(private authService: AuthService,private formBuilder: FormBuilder,private router: Router, private matSnackBar: MatSnackBar,private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }
  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
          this.matSnackBar.open('Login successful', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000
          });
        },
        error: (err) => {
          console.log('Login failed');
          let errorMessage = 'An error occurred. Please try again later.';
          if (err.status === 401) {
            errorMessage = 'Incorrect password! Please try again.';
          } else if (err.status === 404) {
            errorMessage = 'User  not found! Please check your email.';
          } else if (err.status === 400) {
            errorMessage = 'Bad request! Please check your input.';
          }

          this.matSnackBar.open(errorMessage, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000
          });
        }
      });
    } else {
      this.matSnackBar.open('Please fill in all required fields correctly.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 5000
      });
    }
  }
}
