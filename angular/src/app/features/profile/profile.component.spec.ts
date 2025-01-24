import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AngularMaterialComponents } from '../../shared/angular-material.component';
import { of, throwError } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthSerivce', ['getEmail', 'logout'])
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, AngularMaterialComponents],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the email form auth service', () => {
    const testEmail = 'test@example.com'
    authServiceMock.getEmail.and.returnValue(testEmail);

    component.getEmail();
    fixture.detectChanges();

    expect(component.email).toBe(testEmail);
  })

  it('should navigate to login when logout is called', () => {
    authServiceMock.logout.and.returnValue(of(true));;

    component.logout();

    expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
  })

  it('should handle error when logout fails', fakeAsync(() => {
    const errorMessage = 'error';
    authServiceMock.logout.and.returnValue(throwError(() => new Error(errorMessage)));

    component.logout();

    tick();
  

    expect(component.errorMessage).toContain('Erro ao deslogar' + errorMessage);
  }))
  
});
