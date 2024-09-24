import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userName: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.displayName || user.email;
        // Check if the user is an admin
        this.isAdmin = user.role === 'admin';
      } else {
        this.isLoggedIn = false;
        this.userName = null;
      }
    });
  }
}
