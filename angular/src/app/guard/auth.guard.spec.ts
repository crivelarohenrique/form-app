import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../core/services/auth/auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['initializeAuth'])
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
    });
  });

  const executeGuard = async (url: string) => {
    const route: any = {}
    const state: any = { url }
    return TestBed.runInInjectionContext(() => authGuard(route, state))
  }

  it('should allow access to the /profile route when the user is authenticated', async () => {
    mockAuthService.initializeAuth.and.returnValue(Promise.resolve({ email: 'a@gmail.com', token: '123' }));
    const result = await executeGuard('/profile');
    expect(result).toBe(true);
  });

  it('should redirect to /login when the user is not authenticated', async () => {
    mockAuthService.initializeAuth.and.returnValue(Promise.resolve(null));
    mockRouter.createUrlTree.and.returnValue({} as any);
    const result = await executeGuard('/profile');
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(mockRouter.createUrlTree.calls.mostRecent().returnValue);
  })

  it('should allow access to public routes /login and /register when not authenticated', async () => {
    mockAuthService.initializeAuth.and.returnValue(Promise.resolve(null));
    const resultLogin = await executeGuard('/login')
    const resultRegister = await executeGuard('/register')
    
    expect(resultLogin).toBeTrue();
    expect(resultRegister).toBeTrue();
    
  })

  it('should redirect authenticated users to /profile when trying to access /login or /register', async () => {
    mockAuthService.initializeAuth.and.returnValue(Promise.resolve({ email: 'a@gmail.com', token: "123"}))
    mockRouter.createUrlTree.and.returnValue({} as any);

    const resultLogin = await executeGuard('/login')
    const resultRegister = await executeGuard('/register')

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/profile'])
    expect(resultLogin).toEqual(mockRouter.createUrlTree.calls.mostRecent().returnValue);
    expect(resultRegister).toEqual(mockRouter.createUrlTree.calls.mostRecent().returnValue);
  })

  it('should redirect to /login in case of an authentication error', async () => {
    mockAuthService.initializeAuth.and.returnValue(Promise.reject('Error'));
    mockRouter.createUrlTree.and.returnValue({} as any);
    const result = await executeGuard('/profile')
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(mockRouter.createUrlTree.calls.mostRecent().returnValue);
  });

});
