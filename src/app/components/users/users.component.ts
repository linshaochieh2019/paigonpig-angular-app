import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  currentUser: any;
  users: any[] = [];
  selectedUser: any = null; // Stores the user being edited
  editForm: FormGroup; // Reactive form for editing user details

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Initialize the edit form with empty values
    this.editForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      role: [''],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
        this.loadUsers();
      } else {
        this.currentUser = null;
      }
    });
  }

  // Load all users
  loadUsers(): void {
    this.userService.getUsersByOrg(this.currentUser.orgId).subscribe((data) => {
      this.users = data;
    });
  }

  // Set selected user for editing
  editUser(user: any): void {
    this.selectedUser = user;
    // Set form values based on the selected user's data
    this.editForm.patchValue({
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    });
  }

  // Update user data
  saveChanges(): void {
    if (this.selectedUser) {
      const updatedData = this.editForm.value;
      this.userService
        .updateUser(this.selectedUser.id, updatedData)
        .then(() => {
          console.log('User updated successfully');
          this.selectedUser = null; // Clear selected user after saving
          this.loadUsers(); // Reload users list
        });
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.selectedUser = null;
  }
}
