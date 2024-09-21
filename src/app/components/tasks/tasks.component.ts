// tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { TasksService, Task } from '../../services/tasks/tasks.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  isAdmin: boolean = false;
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', completed: false };
  editTask: Task | null = null;

  constructor(private tasksService: TasksService, private authService: AuthService) {}

  ngOnInit(): void {
    // Check if the user is an admin
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.role === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
    this.loadTasks();
  }

  // Load tasks from Firestore
  loadTasks(): void {
    this.tasksService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  // Create a new task
  createTask(): void {
    if (this.newTask.title?.trim()) {
      this.tasksService.createTask(this.newTask).then(() => {
        this.newTask = { title: '', description: '', completed: false }; // Reset the form
      });
    }
  }

  // Edit an existing task
  selectTaskForEdit(task: Task): void {
    this.editTask = { ...task }; // Make a copy of the task to edit
  }

  // Update the selected task
  updateTask(): void {
    if (this.editTask && this.editTask.id) {
      this.tasksService.updateTask(this.editTask.id, this.editTask).then(() => {
        this.editTask = null; // Clear the edit form
      });
    }
  }

  // Delete a task
  deleteTask(id: string): void {
    this.tasksService.deleteTask(id);
  }

  // Mark a task as completed
  toggleCompletion(task: Task): void {
    this.tasksService.updateTask(task.id!, { completed: !task.completed });
  }
}
