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
  selectedTask: Task | null = null;
  isEditingTask: boolean = false;

  constructor(
    private tasksService: TasksService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if the user is an admin
    this.authService.getCurrentUser().subscribe((user) => {
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

  selectTask(task: Task) {
    this.selectedTask = task;
  }

  // // Mark a task as completed
  // toggleCompletion(task: Task): void {
  //   this.tasksService.updateTask(task.id!, { completed: !task.completed });
  // }

  // Method to handle task deletion
  onTaskDeleted(task: Task) {
    this.selectedTask = null; // Clear selected task after deletion
  }

  // Method to handle task editing
  onEditTask(task: Task) {
    this.isEditingTask = true;
    this.selectedTask = task;
  }

  onTaskUpdated(task: Task) {
    this.isEditingTask = false;
    
    // To refresh the selectedTask content
    this.selectedTask = task;
    this.loadTasks();
  }
}
