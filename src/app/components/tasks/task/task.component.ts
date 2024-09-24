// task.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../../services/tasks/tasks.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() taskDeleted = new EventEmitter<Task>();
  @Output() toEditTask = new EventEmitter<Task>();

  isAdmin: boolean = false;

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
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
  }

  // Mark the task as completed
  markAsComplete() {
    if (this.task && !this.task.completed && confirm('Are you sure you completed task?')) {
      this.task.completed = true;
      this.tasksService.updateTask(this.task.id!, { completed: true });
    }
  }

  // Edit the task
  editTask() {
    if (this.task) {
      this.toEditTask.emit(this.task);
    }
  }

  // Delete the task and
  deleteTask() {
    if (this.task && confirm('Are you sure you want to delete this task?')) {
      this.tasksService.deleteTask(this.task.id!);
      this.taskDeleted.emit(this.task);
    }
  }
}
