import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  // Fetch users whose role is 'user'
  getUsers(): Observable<any[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('role', '==', 'user'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id: id, ...(data || {}) };
          })
        )
      );
  }

  // Fetch user by ID
  getUserById(userId: string): Observable<any> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .snapshotChanges()
      .pipe(
        map((action) => {
          const data = action.payload.data();
          const id = action.payload.id;
          return { id: id, ...(data || {}) };
        })
      );
  }
}
