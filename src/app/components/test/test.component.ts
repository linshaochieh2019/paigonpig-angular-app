import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  user: any | null = null;

  constructor(public authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      console.log('User: ', user)
    });
  }

  login(){
    this.authService.signIn('email', 'password');
  }

  logout(){
    this.authService.signOut();
  }
}

