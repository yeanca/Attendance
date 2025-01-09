import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { updateProfile } from 'firebase/auth';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { AuthUser, SignIn, User } from '../models';
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

  // async getUserRole(): Promise<Observable<any>> {
  //   const user = this.currentuserSignal().email; // Fetch the currently authenticated user
  //   console.log('user here: ',user)
  //   if (user) {
  //     let fix= this.db.object(`users/${user}`).valueChanges(); // Fetch user role by UID
  //     console.log('found: ',fix);
  //     return fix
  //   } else {
  //     throw new Error('User is not authenticated'); // Handle unauthenticated state
  //   }
  // }

  getUserRole(name: string): Observable<AuthUser | null> {
    return this.db
      .list('/users', (ref) => ref.orderByChild('displayName').equalTo(name))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          // Map the actions into a structured array
          const users = actions.map((a) => {
            const data = a.payload.val();
            const id = a.payload.key;
  
            if (data && typeof data === 'object') {
              return { id, ...data } as AuthUser; // Cast to AuthUser
            } else {
              return null; // Return null if data is not an object
            }
          });
  
          // Return the first matching user or null if none found
          return users.length > 0 ? users[0] : null;
        })
      );
  }
  
}
