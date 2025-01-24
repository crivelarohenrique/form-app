import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHintPasswordComponent } from './dialog-hint-password.component';

describe('DialogHintPasswordComponent', () => {
  let component: DialogHintPasswordComponent;
  let fixture: ComponentFixture<DialogHintPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHintPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogHintPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
