// tasks.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description: string;
  completed?: boolean;
  assignedBy?: string;
  assignee?: string;
  createdTime?: string;
  deadline?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasksCollection: AngularFirestoreCollection<Task>;

  constructor(private firestore: AngularFirestore) {
    this.tasksCollection = this.firestore.collection<Task>('tasks');
  }

  // Create a new task
  createTask(task: Task): Promise<void> {
    const id = this.firestore.createId(); // Generate a unique ID
    return this.tasksCollection.doc(id).set({ ...task, id });
  }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.tasksCollection.valueChanges({ idField: 'id' });
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
