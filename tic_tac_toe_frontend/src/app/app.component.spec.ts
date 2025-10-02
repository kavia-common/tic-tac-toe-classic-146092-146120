import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title Tic Tac Toe', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading?.textContent).toContain('Tic Tac Toe');
  });

  it('should start with X as current player', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    expect(app['xIsNext']()).toBeTrue();
    expect(app.currentPlayer()).toBe('X');
  });

  it('should allow placing a mark and toggle player', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    app.handleCellClick(0);
    expect(app['board']()[0]).toBe('X');
    expect(app.currentPlayer()).toBe('O');
  });

  it('should detect a winner', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    // X wins on top row: 0,1,2
    app.handleCellClick(0); // X
    app.handleCellClick(3); // O
    app.handleCellClick(1); // X
    app.handleCellClick(4); // O
    app.handleCellClick(2); // X -> win
    expect(app['winner']()).toBe('X');
    expect(app['gameOver']()).toBeTrue();
  });

  it('should reset the game', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    app.handleCellClick(0);
    app.resetGame();
    expect(app['board']().every(c => c === null)).toBeTrue();
    expect(app['xIsNext']()).toBeTrue();
    expect(app['gameOver']()).toBeFalse();
    expect(app['winner']()).toBeNull();
  });
});
