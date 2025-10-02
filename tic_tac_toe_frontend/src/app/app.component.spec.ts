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

  it('should start with X as current player (Knight)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    expect(app['xIsNext']()).toBeTrue();
    expect(app.currentPlayer()).toBe('X');
    // status should mention Knight (Player 1)
    expect(app.statusText()).toContain('Knight (Player 1)');
  });

  it('should allow placing a mark and toggle player (icons visible)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as AppComponent;
    fixture.detectChanges();

    app.handleCellClick(0);
    fixture.detectChanges();

    expect(app['board']()[0]).toBe('X');
    expect(app.currentPlayer()).toBe('O');
    // Icon mapping
    expect(app.getIconForMark('X')).toBe('♞');
    expect(app.getIconForMark('O')).toBe('♛');
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
    // status should reflect winner in text
    expect(app.statusText()).toContain('wins!');
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
