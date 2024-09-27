import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null; // Stores user data
  editMode = false; // Flag to toggle edit mode
  profileForm: FormGroup; // Form for editing user profile

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Initialize form with empty values
    this.profileForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.patchValues();
      } else {
        this.user = null;
      }
    });
  }

  // Toggle edit mode
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  // Patch value when user data is available
  patchValues(): void {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        phone: this.user.phone,
        email: this.user.email,
      });
    }
  }

  // Save changes to the user's profile
  saveChanges(): void {
    if (this.user && this.profileForm.valid) {
      const updatedData = this.profileForm.value;
      this.userService.updateUser(this.user.id, updatedData).then(() => {
        console.log('User profile updated successfully');
        this.editMode = false; // Exit edit mode
      });
    }
  }
}
