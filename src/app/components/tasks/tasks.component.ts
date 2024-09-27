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
  currentUser: any;
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isEditingTask: boolean = false;
  filteredTasks: Task[] = []; // Filtered tasks based on the search term
  searchTerm: string = ''; // The search keyword
  displayOption: 'all' | 'completed' | 'incomplete' | 'today'= 'all'; // The display option

  constructor(
    private tasksService: TasksService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
    this.loadTasks();
  }

  // Load tasks from Firestore
  loadTasks(): void {
    this.tasksService.getTasksByOrgId().subscribe((tasks) => {
      this.tasks = this.sortTasksByDeadline(tasks);
      this.filteredTasks = this.tasks;
    });
  }

  //
  sortTasksByDeadline(tasks: Task[]): Task[] {
    tasks.sort((a, b) => {
      const deadlineA = new Date(a.deadline!);
      const deadlineB = new Date(b.deadline!);
      return deadlineA.getTime() - deadlineB.getTime();
    });

    return tasks;
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
    const filtered = this.filterTasks(searchValue);
    this.filteredTasks = this.sortTasksByDeadline(filtered);
  }

  // Filter tasks based on the search term
  filterTasks(searchTerm: string): Task[] {
    if (!searchTerm) {
      return this.tasks; // If no search term, return all tasks
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    console.log(lowerCaseTerm);

    return this.tasks.filter(
      (task) =>
        (task.title && task.title.toLowerCase().includes(lowerCaseTerm)) ||
        (task.description &&
          task.description.toLowerCase().includes(lowerCaseTerm)) ||
        (task.assigneeName &&
          task.assigneeName.toLowerCase().includes(lowerCaseTerm))
    );
  }

  // Called when the user selects a display option (all, completed, incomplete)
  setDisplayOption(option: 'all' | 'completed' | 'incomplete' | 'today') {
    this.displayOption = option;
    this.applyFilters();
    this.selectedTask = null;
  }

  // Apply both the search filter and the display option (completed/incomplete)
  applyFilters() {
    let filtered = this.filterTasks(this.searchTerm);

    if (this.displayOption === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    } else if (this.displayOption === 'incomplete') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (this.displayOption === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((task) => {
        const deadline = new Date(task.deadline!);
        deadline.setHours(0, 0, 0, 0);
        return deadline.getTime() === today.getTime();
      });
    }

    this.filteredTasks = filtered;
  }
}
