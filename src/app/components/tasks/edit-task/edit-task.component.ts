import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { Task } from '../../../interfaces/task.interfece';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {

  @Input() task: Task | undefined; // Receive the task to edit
  @Output() taskUpdated = new EventEmitter<Task>(); // Emit the updated task

  currentUserId: string | null = null;
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedAssignee: any | null = null;
  editTaskForm: FormGroup;
  existingTask: Task | null = null; // Store the existing task details

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tasksService: TasksService,
    private authService: AuthService
  ) {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigneeSearch: [''],
      deadline: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get current user ID
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUserId = user?.id;
    });

    // Fetch users for assignee search
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      const user = this.users.find((user) => user.id === this.task?.assignee);
      this.selectedAssignee = user || null;
    });

    // If you have a task input, patch the form with its values
    if (this.task) {
      this.editTaskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        assigneeSearch: this.selectedAssignee,
        deadline: this.task.deadline,
      });
    }
    
  }

  // Filter users based on search input
  filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
  }

  // Select an assignee
  selectAssignee(user: any): void {
    this.selectedAssignee = user;
    this.editTaskForm.patchValue({ assigneeSearch: user.name }); // Update search field
    this.filteredUsers = []; // Hide filtered results
  }

  // Submit the edited task
  onSubmit(): void {
    if (this.editTaskForm.valid && this.selectedAssignee) {

      // Convert datetime to string before storing
      let deadlineDate = new Date(this.editTaskForm.value.deadline).toISOString();


      const updatedTask: Task = {
        ...this.existingTask,
        title: this.editTaskForm.value.title,
        description: this.editTaskForm.value.description,
        deadline: deadlineDate,            
        assignee: this.selectedAssignee.id,
        assigneeName: this.selectedAssignee.name,
        updatedTime: new Date().toISOString(),
      };
      this.tasksService.updateTask(this.task?.id!, updatedTask).then(() => {
        this.taskUpdated.emit(updatedTask); 
      });
    }
  }
}
