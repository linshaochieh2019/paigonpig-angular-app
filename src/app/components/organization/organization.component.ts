import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service'; 
import { OrganizationService } from '../../services/organization/organization.service';
import { Organization } from '../../interfaces/organization.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  currentOrganization: Organization = {} as Organization;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // get the current user then query orgazation by id
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.getOrganization(user.orgId);
      } else {
        this.currentUser = null;
        this.currentOrganization = {} as Organization;
      }
    });
  }

  getOrganization(orgId: string): void {
    this.organizationService
      .getOrganizationById(orgId)
      .subscribe((organization) => {
        this.currentOrganization = organization;
      });
  }

}
