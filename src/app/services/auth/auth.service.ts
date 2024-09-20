import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../../environments/environment';
import { switchMap, map, of, catchError, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http';
;


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private apiUrl = environment.apiUrl
  public currentUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient // Inject HttpClient
  ) {}

  async signUp(email: string, password: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    // Add user by calling the API
    const user = {
      id: userCredential.user ? userCredential.user.uid : null,
      email: email
    };

    // Call the API to add the user
    const response = await fetch(`${this.apiUrl}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    // If the API call fails, delete the user from Firebase
    if (!response.ok) {
      await userCredential.user?.delete();
    }

    return userCredential;
  }

  async signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);    
  }

  async signOut() {
    return this.afAuth.signOut();
  }

  get user$() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // User is logged in, fetch user data from your backend
          return this.http.get(`${this.apiUrl}/users/get`, {
            params: { userId: user.uid }
          }).pipe(
            map((userData: any) => ({ ...user, ...userData })), // Combine user data
            tap(userData => this.currentUser = userData), // Populate currentUser
            catchError(error => {
              console.error('Error fetching user data:', error);
              // Handle the error, e.g., return a default user object or throw an error
              return of(null); 
            })
          );
        } else {
          // User is logged out, return null
          return of(null); 
        }
      })
    );
  }
}
