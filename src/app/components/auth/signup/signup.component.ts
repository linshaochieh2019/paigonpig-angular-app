import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  orgId: string = '';


  constructor(private authService: AuthService) {}

  async onSubmit() {
    await this.authService.signUp(this.email, this.password, this.orgId);
  }
}
