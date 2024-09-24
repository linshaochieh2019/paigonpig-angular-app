import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap, map } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    // Listen to auth state and fetch user data from Firestore
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // If user is authenticated, fetch user document from Firestore
          return this.firestore.doc(`users/${user.uid}`).valueChanges();
        } else {
          // If no user is logged in, return null
          return of(null);
        }
      })
    );
  }

  async signUp(email: string, password: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    // Check if the user was created successfully
    if (userCredential.user) {
      const user = {
        id: userCredential.user.uid,
        email: email,
        role: 'user',
      };

      // Add the user to Firestore directly
      await this.firestore.collection('users').doc(user.id).set(user);

      return userCredential;
    } else {
      throw new Error('User creation failed');
    }
  }

  // Log in with email and password
  async signIn(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/tasks']);
      })
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  }

  async signOut() {
    return this.afAuth.signOut();
  }

  // // Reset password
  // async resetPassword(email: string): Promise<void> {
  //   try {
  //     await this.afAuth.sendPasswordResetEmail(email);
  //     console.log('Password reset email sent');
  //   } catch (error) {
  //     console.error('Error sending password reset email: ', error);
  //   }
  // }

  // Get current user
  getCurrentUser(): Observable<any> {
    return this.user$;
  }

  // Get user role
  getUserRole(): Observable<string> {
    return this.getCurrentUser().pipe(
      switchMap(currentUser => {
        if (currentUser) {
          return this.firestore.doc(`users/${currentUser.id}`).valueChanges()
            .pipe(map((user: any) => user?.role));
        } else {
          return of(null);
        }
      })
    );
  }
}