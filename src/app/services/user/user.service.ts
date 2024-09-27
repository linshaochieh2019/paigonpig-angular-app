import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  // Fetch users whose role is 'user' and belong to a specific organization
  getUsersByOrg(orgId: string): Observable<any[]> {
    return this.firestore
      .collection('users', (ref) =>
        ref.where('role', '==', 'user').where('orgId', '==', orgId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...(typeof data === 'object' ? data : {}) };
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

  // Update user by ID
  updateUser(userId: string, user: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).update(user);
  }
}
