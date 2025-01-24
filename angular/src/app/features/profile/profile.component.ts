import { Component } from '@angular/core';
import { AngularMaterialComponents } from '../../shared/angular-material.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [AngularMaterialComponents],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  email!: string;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.getEmail()
  }

  getEmail() {
    this.email = this.authService.getEmail();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['login'])
      },
      error: (error) => {
        this.errorMessage  = 'Erro ao deslogar' + error.message
      }
    })
  }

}
