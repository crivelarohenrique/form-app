import { TestBed } from '@angular/core/testing';

import { FormErrorsService } from './form-errors.service';
import { FormControl, FormGroup } from '@angular/forms';

describe('FormErrorsService', () => {
  let formErrorsService: FormErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    formErrorsService = TestBed.inject(FormErrorsService);
  });

  it('#getErrorMessageField should return required field message', () => {

    const control = new FormControl();
    control.setErrors({ required: true });
    control.markAllAsTouched();

    expect(formErrorsService.getErrorMessageField(control)).toBe('O campo é obrigatório.')
  });

  it('#getErrorMessageField should return email error message', () => {
    
    const control = new FormControl();
    control.setErrors({ email: true })
    control.markAllAsTouched();

    expect(formErrorsService.getErrorMessageField(control)).toBe('O email é inválido.')
  });

  it('#getErrorMessageField should return mismatch passwords', () => {
    
    const control = new FormControl();
    control.setErrors({ passwordMismatch: true })
    control.markAllAsTouched();

    expect(formErrorsService.getErrorMessageField(control)).toBe('As senhas não coincidem.')
  })

  it('#getErrorMessageField should return pattern regex error', () => {

    const control = new FormControl();
    control.setErrors({ pattern: true });
    control.markAllAsTouched;

    expect(formErrorsService.getErrorMessageField(control)).toBe('O campo não segue as regras de validação.')
  })


  it ('#getErrorMessageField should return empty string for no errors', () => {

    const control = new FormControl();

    expect(formErrorsService.getErrorMessageField(control)).toBe('');
  })

  it('#passwordMatchValidator should return error if passwords do not match', () => {
    
    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: new FormControl('abcdef')
    })

    const validator = formErrorsService.passwordMatchValidator();
    const result = validator(formGroup);

    expect(formGroup.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    expect(result).toEqual({ passwordMismatch: true });
  });

  it('#passwordMatchValidator should not return error if passwords match', () => {

    const formGroup = new FormGroup({
      password: new FormControl('123456'),
      confirmPassword: new FormControl('123456')
    })

    const validator = formErrorsService.passwordMatchValidator();
    const result = validator(formGroup)  
  
    expect(formGroup.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    expect(result).toEqual(null);
  })

});
