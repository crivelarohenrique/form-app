import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {

  constructor() { }


  getErrorMessageField(field: AbstractControl): string {
    if (field.hasError('required')) {
      return 'O campo é obrigatório.';
    }
    if (field.hasError('email')) {
      return 'O email é inválido.'
    }
    if (field.hasError('pattern')) {
      return 'O campo não segue as regras de validação.'
    }
    if (field.hasError('passwordMismatch')) {
      return 'As senhas não coincidem.'
    }
    return '';
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true};
      } else if (confirmPassword) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }
}
