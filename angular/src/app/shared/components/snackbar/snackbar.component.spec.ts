import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarComponent } from './snackbar.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  let snackBarRefMock: jasmine.SpyObj<MatSnackBarRef<SnackbarComponent>>;
  let span: HTMLElement;

  beforeEach(() => {
    snackBarRefMock = jasmine.createSpyObj('MatSnackBarRef', ['dismissWithAction']);

    TestBed.configureTestingModule({ 
      imports: [ SnackbarComponent ],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRefMock },
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Test message' } },
      ]
    });

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    span = fixture.nativeElement.querySelector('span')
  })

  it ("should create", () => {
    expect(component).toBeDefined();
  });

  it ("should dispaly 'data.message' ", () => {
    fixture.detectChanges();
    expect(span.textContent).toContain(component.data.message)
  })

  it('should close snackbar when called', () => {
    component.close()

    expect(snackBarRefMock.dismissWithAction).toHaveBeenCalled();
  })

});
