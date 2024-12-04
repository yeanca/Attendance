import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { updateProfile } from 'firebase/auth';
import { from, Observable } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = this.afAuth.authState;
  currentuserSignal = signal<User | null | undefined>(undefined);
  constructor(private afAuth: AngularFireAuth) {}

  signUp(displayName: string,email: string,password: string): Observable<void> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password).then((response) => {
          if (response.user) {
            return updateProfile(response.user, { displayName: displayName });
          }
          throw new Error('User creation failed');
        })
    );
  }

  login(email: string, password: string): Observable<void> {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password).then(() => {})
    );
  }
}
