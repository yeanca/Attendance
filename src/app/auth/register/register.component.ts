import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  public hide = true;
  public errorMsg = null;
  public submitted: boolean = false;
  public registerForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required]
  });
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private matSnackBar: MatSnackBar) { }

  signUp() {
    let displayName = this.registerForm.controls['fullName'].value;
    let email = this.registerForm.controls['email'].value;
    let password = this.registerForm.controls['password'].value;
    let role = this.registerForm.controls['role'].value;
    this.authService.signUp(displayName, email, password,role).subscribe({
      next: (response) => {
        this.matSnackBar.open('Registration Success!', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000
        });
        this.registerForm.reset;
        this.router.navigate(['/admin'])
      },
      error(err) {
        console.log('Registration failed');
        this.matSnackBar.open(err, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }
}
