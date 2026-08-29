import { TestBed } from '@angular/core/testing';
import { Landing } from './landing';

describe('Landing', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Landing);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});