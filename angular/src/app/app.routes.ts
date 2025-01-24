import { Routes } from '@angular/router';
import { SignUserComponent } from './features/form/sign-user.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  {
    path: "login",
    component: SignUserComponent,
    canActivate: [authGuard]
  },
  { 
    path: "register", 
    component: SignUserComponent,
    canActivate: [authGuard]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];
