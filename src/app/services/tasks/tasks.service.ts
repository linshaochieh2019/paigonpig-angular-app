// tasks.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Task } from '../../interfaces/task.interfece';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasksCollection: AngularFirestoreCollection<Task>;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.tasksCollection = this.firestore.collection<Task>('tasks');
  }

  // Create a new task
  createTask(task: Task): Promise<void> {
    const id = this.firestore.createId(); // Generate a unique ID
    return this.tasksCollection.doc(id).set({ ...task, id });
  }

  // // Check the user's role before retrieving tasks
  // getTasks(): Observable<Task[]> {
  //   return this.authService.getUserRole().pipe(
  //     switchMap((role) => {
  //       // Get current date and two days ago
  //       const currentDate = new Date();
  //       const twoDaysAgo = new Date();
  //       twoDaysAgo.setDate(currentDate.getDate() - 2);

  //       if (role === 'admin') {
  //         // If the user is an admin, return all tasks
  //         return this.firestore
  //           .collection<Task>('tasks', (ref) =>
  //             ref.where('deadline', '>=', twoDaysAgo.toISOString())
  //           )
  //           .valueChanges({ idField: 'id' });
  //       } else if (role === 'user') {
  //         // If the user is not an admin, only return tasks assigned to them
  //         return this.authService.getCurrentUser().pipe(
  //           switchMap((user) => {
  //             const currentUserId = user?.id;
  //             return this.firestore
  //               .collection<Task>('tasks', (ref) =>
  //                 ref
  //                   .where('assignee', '==', currentUserId)
  //                   .where('deadline', '>=', twoDaysAgo.toISOString())
  //               )
  //               .valueChanges({ idField: 'id' });
  //           })
  //         );
  //       } else {
  //         // Not showing any tasks if the user is not logged in
  //         return [];
  //       }
  //     })
  //   );
  // }

  //
  getTasksByOrgId(): Observable<Task[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user) {
          // If no user is logged in, return an empty array
          return of([]);
        }

        const currentUserId = user.id;
        const userOrgId = user.orgId; // Assuming orgId is a property of the user
        const currentDate = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(currentDate.getDate() - 2);

        return this.authService.getUserRole().pipe(
          switchMap((role) => {
            if (role === 'admin') {
              // If the user is an admin, return all tasks in their organization
              return this.firestore
                .collection<Task>('tasks', (ref) =>
                  ref
                    .where('orgId', '==', userOrgId)
                    .where('deadline', '>=', twoDaysAgo.toISOString())
                )
                .valueChanges({ idField: 'id' });
            } else if (role === 'user') {
              // If the user is not an admin, return only tasks assigned to them in their organization
              return this.firestore
                .collection<Task>('tasks', (ref) =>
                  ref
                    .where('orgId', '==', userOrgId)
                    .where('assignee', '==', currentUserId)
                    .where('deadline', '>=', twoDaysAgo.toISOString())
                )
                .valueChanges({ idField: 'id' });
            } else {
              // Return an empty array if the user role is not recognized
              return of([]);
            }
          })
        );
      })
    );
  }

  // Get a task by ID
  getTask(id: string): Observable<Task | undefined> {
    return this.tasksCollection.doc<Task>(id).valueChanges();
  }

  // Update an existing task
  updateTask(id: string, task: Partial<Task>): Promise<void> {
    return this.tasksCollection.doc(id).update(task);
  }

  // Delete a task by ID and redirect to tasks list
  deleteTask(id: string): Promise<void> {
    return this.tasksCollection.doc(id).delete();
  }
}
