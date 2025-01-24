import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularMaterialComponents } from '../../shared/angular-material.component';
import { FormErrorsService } from '../../shared/service/formErrors/form-errors.service';
import { DialogHintPasswordComponent } from '../dialog-hint-password/dialog-hint-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  imports: [AngularMaterialComponents, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-user.component.html',
  styleUrls: ['./sign-user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUserComponent {

  readonly dialog = inject(MatDialog)
  form: FormGroup;
  hide = signal(true);
  passwordStrength: string = '';
  passwordStrengthColor : string = '#FF6F61'

  formRoute: string;

  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;


  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formErrorsService: FormErrorsService,
    private router: Router,
  ) {
    this.formRoute = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path : '';
    this.form = this.formBuilder.group({})

    if (this.formRoute === 'register') {
      this.form = this.formBuilder.group({
          email: new FormControl('', [
            Validators.required, 
            Validators.email, 
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/)]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/[A-Z]/),
            Validators.pattern(/[a-z]/),
            Validators.pattern(/[0-9]/),
            Validators.pattern(/[^A-Za-z0-9]/),
          ]),
          confirmPassword: new FormControl('', [Validators.required])
      }, {
        validators: this.formErrorsService.passwordMatchValidator()
      });

      this.form.get('password')?.valueChanges.subscribe((password) => {
        this.passwordStrength = this.calculatePasswordStrength(password);
      })
    }

    if (this.formRoute === 'login') {
      this.form = this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
      });
    }
  }


  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  getErrorMessage(controlName: string): string | ValidationErrors {
    const control = this.form.get(controlName)
    if (control) {
      return this.formErrorsService.getErrorMessageField(control);
    }
    return '';
  }

  calculatePasswordStrength(password: string): string {
    let strength = 0;
  
    if (password.length >= 6) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
    if (strength <= 40) {
      this.passwordStrengthColor = '#FF6F61'
      return 'Fraca';
    } else if (strength <= 99) {
      this.passwordStrengthColor = '#FFEB3B'
      return 'Média';
    } else {
      this.passwordStrengthColor = '#4CAF50'
      return 'Forte';
    }
  }

  passwordStrengthValue() {
    switch (this.passwordStrength) {
      case 'Fraca':
        return 30;
      case 'Média':
        return 60;
      case 'Forte':
        return 100; 
      default:
        return 0;
    }
  }

  hidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openHintPassword() {
    this.dialog.open(DialogHintPasswordComponent, {
      width: '700px',
      data: {}
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Fechar', {
      duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  submit() {
    if (this.form.invalid) {
      this.openSnackBar("Senha ou email inválidos.")
      return;
    };

    if (this.formRoute === 'login') {

      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.openSnackBar('Usuário logado com sucesso.'),
            this.router.navigate(['/profile'])
        }
        ,
        error: () => this.openSnackBar('Erro ao identificar usuário, tente novamente!'),
      });

    } else if (this.formRoute === 'register') {
      this.authService.register(this.form.value).subscribe({
        next: () => {
          this.openSnackBar('Usuário registrado com sucesso!')
          this.router.navigate(['/login'])
        },
        error: () => this.openSnackBar('Erro ao registrar usuário, tente novamente!'),
      });
    }
  }
}
