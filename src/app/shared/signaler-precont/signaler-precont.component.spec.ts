import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalerPrecontComponent } from './signaler-precont.component';

describe('SignalerPrecontComponent', () => {
  let component: SignalerPrecontComponent;
  let fixture: ComponentFixture<SignalerPrecontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalerPrecontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalerPrecontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
