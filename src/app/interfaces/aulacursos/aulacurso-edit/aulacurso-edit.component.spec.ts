import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulacursoEditComponent } from './aulacurso-edit.component';

describe('AulacursoEditComponent', () => {
  let component: AulacursoEditComponent;
  let fixture: ComponentFixture<AulacursoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AulacursoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AulacursoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
