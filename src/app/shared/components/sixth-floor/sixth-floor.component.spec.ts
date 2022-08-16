import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixthFloorComponent } from './sixth-floor.component';

describe('SixthFloorComponent', () => {
  let component: SixthFloorComponent;
  let fixture: ComponentFixture<SixthFloorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SixthFloorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SixthFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
