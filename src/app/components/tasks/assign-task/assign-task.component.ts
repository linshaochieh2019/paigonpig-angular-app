import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../../services/tasks/tasks.service';
import { Task } from '../../../interfaces/task.interfece';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.scss'],
})
export class AssignTaskComponent implements OnInit {
  currentUserId: string | null = null; // To store the current user's ID
  users: any[] = []; // To store the list of users
  filteredUsers: any[] = []; // Filtered list based on search input
  selectedAssignee: any | null = null; // Store the selected user
  assignTaskForm: FormGroup;
  newTask: Task = { title: '', description: '', completed: false };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tasksService: TasksService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.assignTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigneeSearch: [''], // Search bar input field
      deadline: [''],
    });
  }

  ngOnInit(): void {
    // Get the current user's ID
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUserId = user?.id;
    });

    // Fetch users from th`e service
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  // Filter users based on the search input
  filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    // Filter the users based on the search term, only if search term is not empty
    if (searchTerm.trim()) {
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = [];
    }
  }

  // Select a user as the assignee
  selectAssignee(user: any): void {
    this.selectedAssignee = user;
    this.assignTaskForm.patchValue({ assigneeSearch: user.name }); // Update search input with selected user's name
    this.filteredUsers = []; // Hide the filtered list after selection
  }

  // Submit the task
  onSubmit() {
    if (this.assignTaskForm.valid && this.selectedAssignee) {
      this.createTask();
      this.router.navigate(['/tasks']);

    } else if (this.selectedAssignee === null) {
      alert('Please select an assignee');
    }
    else {
      console.log('Form is invalid');
    }
  }

  // Create a new task
  createTask(): void {
    // Assign the form values to the new task object
    this.newTask.title = this.assignTaskForm.value.title;
    this.newTask.description = this.assignTaskForm.value.description;
    this.newTask.assignee = this.selectedAssignee.id;
    this.newTask.assigneeName = this.selectedAssignee.name;
    this.newTask.assignedBy = this.currentUserId!;

    // new Date() but convert to string to storing
    let currentDate = new Date();
    this.newTask.createdTime = currentDate.toISOString();

    let deadlineDate = new Date(this.assignTaskForm.value.deadline);
    this.newTask.deadline = deadlineDate.toISOString();

    // Create the task
    if (this.newTask.title?.trim()) {
      this.tasksService.createTask(this.newTask).then(() => {
        this.newTask = { title: '', description: '', completed: false }; // Reset the form
        this.selectedAssignee = null; // Clear the selected assignee
      });
    }
  }
}
