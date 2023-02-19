import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntruderAlertModalComponent } from './intruder-alert-modal.component';

describe('IntruderAlertModalComponent', () => {
  let component: IntruderAlertModalComponent;
  let fixture: ComponentFixture<IntruderAlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntruderAlertModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntruderAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
