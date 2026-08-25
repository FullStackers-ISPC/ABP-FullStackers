import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterPanel } from './footer-panel';

describe('FooterPanel', () => {
  let component: FooterPanel;
  let fixture: ComponentFixture<FooterPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
