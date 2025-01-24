import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, of, throwError } from 'rxjs';

describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let authService: AuthService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post'])


    httpClientSpy.get.and.returnValue(of({ email: 'test@example.com' }))

    authService = new AuthService(httpClientSpy);
  })



  describe('Function initializeAuth()', () => {
    it('should initialize auth and resolve with user data when valid', async () => {
      httpClientSpy.get.and.returnValue(of({ email: 'test@example.com', token: 'testToken' }))

      const result = await authService.initializeAuth();

      expect(result).toEqual({ email: 'test@example.com', token: 'testToken' });
    })

    it('should initialize auth and resolve with null when invalid', async () => {
      httpClientSpy.get.and.returnValue(throwError(() => ({ status: 403 })));

      const result = await authService.initializeAuth();

      expect(result).toBeNull();
    })

    it('should initialize auth and resolve with null when error.status is not 403', async () => {
      httpClientSpy.get.and.returnValue(throwError(() => ({ status: 500 })));

      const result = await authService.initializeAuth();

      expect(result).toBeNull();
    })
  })

  describe('Function login()', () => {
    it('should send a POST request to login and set isAuthenticated to user', () => {

      httpClientSpy.post.and.returnValue(of({ email: 'test@example.com', token: '12345678910' }));
      const loginData = { email: 'test@example.com', password: '123456' }
      authService.login(loginData).subscribe();

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${authService['API']}/auth/login`, loginData, { withCredentials: true });
      authService.isAuthenticated$.subscribe((value) => {
        expect(value).toEqual({ email: 'test@example.com', token: '12345678910' })
      })
    })

    it('should send a POST request to login and return error', () => {
      httpClientSpy.post.and.returnValue(throwError(() => new Error('Erro ao entrar.')));
      const loginData = { email: 'test@example.com', password: '123456' }

      authService.login(loginData).subscribe({
        next: () => fail('expected an error, but got a response.'),
        error: (err) => {
          expect(err.message).toBe('Não foi possível entrar na sua conta.')
        }
      });
    })


    describe('Function register()', () => {
      it('should send a POST request to register an user', () => {

        httpClientSpy.post.and.returnValue(of({ email: 'test@example.com', token: '12345678910' }))
        const registerData = { email: 'test@example.com', password: '123456' }
        authService.register(registerData).subscribe();

        expect(httpClientSpy.post).toHaveBeenCalledWith(`${authService['API']}/auth/register`, registerData, { withCredentials: true });
        authService.isAuthenticated$.subscribe((value) => {
          expect(value).toEqual({ email: 'test@example.com', token: '12345678910' })
        })
      })

      it('should send a POST request to register and return error', () => {
        httpClientSpy.post.and.returnValue(throwError(() => new Error('Erro ao cadastrar.')));
        const registerData = { email: 'test@example.com', password: '123456' }

        authService.register(registerData).subscribe({
          next: () => fail('expected an error, but got a response.'),
          error: (err) => {
            expect(err.message).toBe('Não foi possível registrar-se.')
          }
        });

        expect(httpClientSpy.post).toHaveBeenCalledWith(`${authService['API']}/auth/register`, registerData, { withCredentials: true });
        authService.isAuthenticated$.subscribe((value) => {
          expect(value).toBeNull();
        })
      })
    })


    describe('Function logout()', () => {
      it('should update isAuthenticated to null when logout is called', () => {
        httpClientSpy.post.and.returnValue(of({}))
        authService.logout().subscribe();

        authService.isAuthenticated$.subscribe((value) => {
          expect(value).toBeNull();
        })
      })
    })
  

    describe('Function getEmail()', () => {
      it('shoulda return email when user is logged in', () => {
        authService.user = { email: 'test@example.com', token: 'testToken' }

        expect(authService.getEmail()).toBe('test@example.com')
      })

      it('should throw an error if user is not logged in', () => {
        authService.user = null;
        expect(() => authService.getEmail()).toThrowError('Usuário não está logado.');
      })
    })

  })
});



