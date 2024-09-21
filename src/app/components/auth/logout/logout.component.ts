import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }
}
