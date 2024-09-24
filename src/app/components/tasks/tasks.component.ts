// tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks/tasks.service';
import { Task } from '../../interfaces/task.interfece';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  isAdmin: boolean = false;
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isEditingTask: boolean = false;
  filteredTasks: Task[] = []; // Filtered tasks based on the search term
  searchTerm: string = ''; // The search keyword

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
      this.filteredTasks = tasks;
    });
  }

  selectTask(task: Task) {
    this.selectedTask = task;
    this.isEditingTask = false;
  }
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

  // Called when the search term changes
  onSearchChange(searchValue: string) {
    this.filteredTasks = this.filterTasks(searchValue);
  }

  // Filter tasks based on the search term
  filterTasks(searchTerm: string): Task[] {
    if (!searchTerm) {
      return this.tasks; // If no search term, return all tasks
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    console.log(lowerCaseTerm)

    return this.tasks.filter(
      (task) =>
        (task.title && task.title.toLowerCase().includes(lowerCaseTerm)) ||
        (task.description &&
          task.description.toLowerCase().includes(lowerCaseTerm)) ||
        (task.assigneeName && task.assigneeName.toLowerCase().includes(lowerCaseTerm))
    );
  }
}
