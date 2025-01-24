import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../../interfaces/auth';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = "https://form-personal-project-app-22c6039c0d38.herokuapp.com/api";
  private isAuthenticated = new BehaviorSubject<AuthResponse | null>(null);
  isAuthenticated$ = this.isAuthenticated.asObservable();
  user: AuthResponse | null = null;

  constructor(
    private http: HttpClient,
  ) {
    this.validate().subscribe();
    this.isAuthenticated$.subscribe({
      next: (data) => {
        this.user = data;
      }
    });
  }

  async initializeAuth(): Promise<AuthResponse | null> {
    return new Promise((resolve) => {
      this.validate().subscribe({
        next: (data) => {
          resolve(data);
        }
      });
    });
  }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, data, { withCredentials: true })
      .pipe(
        tap(user => this.isAuthenticated.next(user)),
        catchError(() => {
          this.isAuthenticated.next(null);
          return throwError(() => new Error('Não foi possível entrar na sua conta.'));
        })
      );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.API}/auth/register`, data, { withCredentials: true })
    .pipe(
      tap(user => this.isAuthenticated.next(user)),
      catchError(() => {
        this.isAuthenticated.next(null);
        return throwError(() => new Error('Não foi possível registrar-se.'));
      })
    );
  }

  logout() {
    return this.http.post(`${this.API}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticated.next(null)
      })
    );
  }

  validate(): Observable<AuthResponse | null> {
    return this.http.get<AuthResponse>(`${this.API}/auth/validate`, { withCredentials: true })
      .pipe(
        tap(user => this.isAuthenticated.next(user)),
        catchError((error) => {
          if (error.status === 403) {
            this.isAuthenticated.next(null);
          }
          return of(null);
        })
      );
  }

  getEmail() {
    if (!this.user) {
      throw new Error('Usuário não está logado.');
    }
    return this.user.email;
  }
}
