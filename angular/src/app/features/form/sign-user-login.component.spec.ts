import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUserComponent } from './sign-user.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, of, throwError } from 'rxjs';

describe('SignUserComponent', () => {
  let component: SignUserComponent;
  let fixture: ComponentFixture<SignUserComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['get', 'post', 'login'])
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['snapshot'])
    activatedRouteMock.snapshot = {
      url: [{ path: 'login' }]
    } as any;

    await TestBed.configureTestingModule({
      imports: [SignUserComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideAnimationsAsync(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize login form', () => {

    expect(component.form).toBeDefined();
  })


  describe('Function submit() with authService.login()', () => {
      it('should return successful login', () => {
        component.form = new FormGroup({
          email: new FormControl('test@example.com'),
          password: new FormControl('Teste123!')
        });

        authServiceMock.login.and.returnValue(of({
          email: 'test@example.com',
          token: 'testToken'
        }))
    
        component.submit();
  
        expect(authServiceMock.login).toHaveBeenCalledWith(component.form.value);
      });

      it('should return error login', () => {
        component.form = new FormGroup({
          email: new FormControl('test@example.com'),
          password: new FormControl('Teste123!')
        });

        authServiceMock.login.and.returnValue(throwError(() => ('Erro ao logar.') ))
    
        component.submit();
  
        expect(authServiceMock.login).toHaveBeenCalledWith(component.form.value);
      });
    });
});
