import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private firestore: AngularFirestore) {}

  // Fetch a single organization by ID
  getOrganizationById(orgId: string): Observable<any> {
    return this.firestore
      .collection('organizations')
      .doc(orgId)
      .valueChanges()
  }

  // Update an organization by ID
  updateOrganization(orgId: string, updatedData: any): Promise<void> {
    return this.firestore.collection('organizations').doc(orgId).update(updatedData);
  }
}
