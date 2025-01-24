import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { SignUserComponent } from './sign-user.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ActivatedRoute, provideRouter, RouterModule } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { routes } from '../../app.routes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularMaterialComponents } from '../../shared/angular-material.component';

describe('SignUserComponent', () => {
  let component: SignUserComponent;
  let fixture: ComponentFixture<SignUserComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['get', 'post', 'register'])
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['snapshot'])
    activatedRouteMock.snapshot = {
      url: [{ path: 'register' }]
    } as any;

    await TestBed.configureTestingModule({
      imports: [SignUserComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        provideAnimationsAsync()
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


  describe('Function passwordStrengthValue', () => {
    it('should return 30 for "Fraca" ', () => {
      component.passwordStrength = 'Fraca'
      const result = component.passwordStrengthValue();
      expect(result).toBe(30)
    })

    it('should return 60 for "Media" ', () => {
      component.passwordStrength = 'Média'
      const result = component.passwordStrengthValue();
      expect(result).toBe(60)
    })

    it('should return 100 for "Forte" ', () => {
      component.passwordStrength = 'Forte'
      const result = component.passwordStrengthValue();
      expect(result).toBe(100)
    })

    it('should return 0 for an invalid value', () => {
      component.passwordStrength = 'Invalid';
      const result = component.passwordStrengthValue();
      expect(result).toBe(0);
    })
  })

  describe('Function calculatePasswordStrength', () => {
    it('should return "Fraca" for weak passwords', () => {
      const result = component.calculatePasswordStrength('12345')
      expect(result).toBe('Fraca');
      expect(component.passwordStrengthColor).toBe('#FF6F61')
    })

    it('should return "Média" for regular passwords', () => {
      const result = component.calculatePasswordStrength('Teste123')
      expect(result).toBe('Média');
      expect(component.passwordStrengthColor).toBe('#FFEB3B')
    })

    it('should return "Forte" for strong passwords', () => {
      const result = component.calculatePasswordStrength('Teste123!')
      expect(result).toBe('Forte');
      expect(component.passwordStrengthColor).toBe('#4CAF50')
    })

    it('should return passwordStrength when password value changes', fakeAsync(() => {

      component.form.get('password')?.setValue('Teste123!');
      tick();

      expect(component.passwordStrength).toBe('Forte');
      expect(component.passwordStrengthColor).toBe('#4CAF50');

      component.form.get('password')?.setValue('Teste123');
      tick();
      expect(component.passwordStrength).toBe('Média');
   
    }))
  })

  describe('Function submit() with authService.register()', () => {
    it('should open the snackbar with successful register', () => {
      component.form = new FormGroup({
        email: new FormControl('test@example.com'),
        password: new FormControl('Teste123!'),
        confirmPassword: new FormControl('Teste123!')
      });

      authServiceMock.register.and.returnValue(of({
        email: 'test@example.com',
        token: 'testToken'
      }))

      component.submit();

      expect(authServiceMock.register).toHaveBeenCalledWith(component.form.value);
    });

    it('should open the snackbar with successful register', () => {
      component.form = new FormGroup({
        email: new FormControl('test@example.com'),
        password: new FormControl('Teste123!'),
        confirmPassword: new FormControl('Teste123!')
      });

      authServiceMock.register.and.returnValue(throwError(() => ('Erro ao registrar.')))

      component.submit();

      expect(authServiceMock.register).toHaveBeenCalledWith(component.form.value);
    });
  });
});
