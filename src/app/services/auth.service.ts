import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { updateProfile } from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { User } from '../models';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = this.afAuth.authState;
  currentuserSignal = signal<User | null | undefined>(undefined);
  public isAuth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public current: User;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    // Check the authentication state on initialization
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuth.next(true);
        this.current = user; // Store the current user
        localStorage.setItem('user', JSON.stringify(user)); // Store user info in local storage
      } else {
        this.isAuth.next(false);
        this.current = null; // Clear the current user
        localStorage.removeItem('user'); // Remove user info from local storage
      }
    });

    // Check local storage for user info
    const user = localStorage.getItem('user');
    if (user) {
      this.current = JSON.parse(user); // Restore user info from local storage
      this.isAuth.next(true); // Set authentication state to true
    }
  }

  signUp(displayName: string, email: string, password: string, role: string): Observable<void> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password).then((response) => {
        if (response.user) {
          return updateProfile(response.user, { displayName: displayName }).then(() => {
            // Store the user's role in the database
            const userId = response.user.uid; // Get the user ID
            return this.db.object(`users/${userId}`).set({ displayName, email, role }); // Store user data including role
          });
        }
        throw new Error('User  creation failed');
      })
    );
  }

  login(email: string, password: string): Observable<void> {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password).then((response) => {
        if (response.user) {
          this.current = response.user; // Store the current user
          localStorage.setItem('user', JSON.stringify(response.user)); // Store user info in local storage
          this.isAuth.next(true);
        }
      })
    );
  }

  resetPassword(email: string): Observable<void> {
    return new Observable((observer) => {
      this.afAuth.sendPasswordResetEmail(email)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut().then(() => {
      this.isAuth.next(false);
      localStorage.removeItem('user'); // Remove user info from local storage
    }));
  }

  getUserRole(userId: string): Observable<any> {
    return this.db.object(`users/${userId}`).valueChanges();
  }
}
