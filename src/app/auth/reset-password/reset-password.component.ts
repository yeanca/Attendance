import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  public resetForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private matSnackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

  reset() {
    if (this.resetForm.valid) {
      const email = this.resetForm.controls['email'].value;
      this.authService.resetPassword(email).subscribe({
      next: () => {
        this.matSnackBar.open('Password reset email sent!', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000
        });
      },
      error: (err) => {
        console.log('Error sending password reset email');
        this.matSnackBar.open('Failed to send password reset email. Please try again.', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000
        });
      }
    });
  }
  }
}
