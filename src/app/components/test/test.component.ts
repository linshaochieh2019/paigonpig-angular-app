import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor(public authService: AuthService) {}
  
  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log('User logged in:', this.authService.currentUser);
      }
    });
  }
}

