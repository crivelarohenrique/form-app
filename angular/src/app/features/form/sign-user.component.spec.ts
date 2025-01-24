import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { SignUserComponent } from './sign-user.component';
import { DialogHintPasswordComponent } from '../dialog-hint-password/dialog-hint-password.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth/auth.service';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { AngularMaterialComponents } from '../../shared/angular-material.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormErrorsService } from '../../shared/service/formErrors/form-errors.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SignUserComponent', () => {
  let component: SignUserComponent;
  let fixture: ComponentFixture<SignUserComponent>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let authServiceMock: AuthService;
  let formErrorsService: jasmine.SpyObj<FormErrorsService>;

  beforeEach(async () => {
    formErrorsService = jasmine.createSpyObj('FormErrorsService', ['getErrorMessageField'])
    authServiceMock = jasmine.createSpyObj('AuthService', [''])
    dialogMock = jasmine.createSpyObj('MatDialog', ['open'])

    await TestBed.configureTestingModule({
      imports: [SignUserComponent, RouterModule, AngularMaterialComponents, DialogHintPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: FormErrorsService, useValue: formErrorsService },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        provideRouter(routes),
        provideAnimationsAsync(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Function hidePassword', () => {
    
    it('should toggle hide state when hidePassword is called', () => {
      expect(component.hide()).toBeTrue();

      const event = new MouseEvent('click')
      component.hidePassword(event)

      expect(component.hide()).toBeFalse();
    })
  })

  describe('Function getErrorMessageField', () => {
    it('should return the error message from the service if the control exists', () => {

      const control = component.form.get('email')
  
      if (control) {
        const mockErrorMessage = 'Email is required';
      formErrorsService.getErrorMessageField.and.returnValue(mockErrorMessage);
  
      const result = component.getErrorMessage('email')
  
      expect(formErrorsService.getErrorMessageField).toHaveBeenCalledWith(control);
      expect(result).toBe(mockErrorMessage);  
      }
    })
  
    it('should return an empty string if the control does not exist', () => {
      const result = component.getErrorMessage('nonExistentControl');
      expect(result).toBe('');
    })
  }) 


  describe('Function openSnackbar()', () => {
    it('should open the snack bar with the provided message', () => {
      const snackBarSpy = spyOn(component['_snackBar'], 'open');

      component.openSnackBar('Test Message');

      expect(snackBarSpy).toHaveBeenCalledWith('Test Message', 'Fechar', {
        duration: component.durationInSeconds * 1000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      })
    })
  })

  describe('Function openHintPassword()', () => {
    it('should open the password hint dialog', () => {
      const dialogSpy = spyOn(component.dialog, 'open');

      component.openHintPassword();

      expect(dialogSpy).toHaveBeenCalledWith(DialogHintPasswordComponent, {
        width: '700px',
        data: {}
      })
    })
  })


  it('should call openSnackBar with error if form is invalid', () => {
    const snackBarSpy = spyOn(component['_snackBar'], 'open')

    component.submit()

    expect(snackBarSpy).toHaveBeenCalledWith('Senha ou email inválidos.', 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    })
  })
});
