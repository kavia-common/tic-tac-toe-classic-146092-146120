import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * AppComponent renders a complete Tic Tac Toe game UI.
 * - Displays a 3x3 board, current player, and status (win/draw/turn).
 * - Allows players to make moves by clicking cells.
 * - Detects wins and draws.
 * - Provides a reset button to start a new game.
 * The component follows the "Ocean Professional" modern theme using blue and amber accents.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Theme constants (Ocean Professional)
  readonly colors = {
    primary: '#2563EB',
    secondary: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
  };

  // Game state
  board = signal<Array<string | null>>(Array(9).fill(null)); // 0..8 cells
  xIsNext = signal<boolean>(true);
  gameOver = signal<boolean>(false);
  winner = signal<'X' | 'O' | null>(null);

  // Derived/computed values
  // 'X' = Player 1 (Knight), 'O' = Player 2 (Queen)
  currentPlayer = computed(() => (this.xIsNext() ? 'X' : 'O'));

  /**
   * statusText
   * Returns a human-friendly status line using the chess icons for accessibility.
   * Example: "Knight (Player 1) to move" or "Queen (Player 2) wins!"
   */
  statusText = computed(() => {
    const markToRole = (m: 'X' | 'O') => (m === 'X' ? 'Knight (Player 1)' : 'Queen (Player 2)');
    if (this.winner()) {
      return `${markToRole(this.winner()!)} wins!`;
    }
    if (this.gameOver() && !this.winner()) {
      return 'It’s a draw!';
    }
    return `${markToRole(this.currentPlayer() as 'X' | 'O')} to move`;
  });

  // PUBLIC_INTERFACE
  /**
   * getIconForMark
   * Returns the proper chess icon for a given mark:
   *  - 'X' -> Knight ♞
   *  - 'O' -> Queen ♛
   * Returns an empty string when mark is null.
   */
  getIconForMark(mark: 'X' | 'O' | null): string {
    if (mark === 'X') return '♞';
    if (mark === 'O') return '♛';
    return '';
  }

  // PUBLIC_INTERFACE
  /**
   * narrowMark
   * Narrows any board cell string value to the strict union 'X' | 'O' | null
   * for safe template usage with getIconForMark.
   */
  narrowMark(value: string | null): 'X' | 'O' | null {
    return value === 'X' || value === 'O' ? value : null;
  }

  // PUBLIC_INTERFACE
  /**
   * handleCellClick
   * Handles user click on a board cell. Places the current player's mark if valid,
   * updates game state, checks for a win or draw, and toggles the turn.
   * @param index number - The board index (0-8) that was clicked.
   */
  handleCellClick(index: number): void {
    if (this.gameOver()) return;
    const cells = [...this.board()];
    if (cells[index] !== null) return;

    cells[index] = this.currentPlayer();
    this.board.set(cells);

    const win = this.calculateWinner(cells);
    if (win) {
      this.winner.set(win);
      this.gameOver.set(true);
      return;
    }

    if (cells.every((c) => c !== null)) {
      this.gameOver.set(true);
      return;
    }

    this.xIsNext.set(!this.xIsNext());
  }

  // PUBLIC_INTERFACE
  /**
   * resetGame
   * Resets the board and game state to start a new game.
   */
  resetGame(): void {
    this.board.set(Array(9).fill(null));
    this.xIsNext.set(true);
    this.gameOver.set(false);
    this.winner.set(null);
  }

  /**
   * calculateWinner
   * Checks all winning lines and returns 'X' or 'O' if a winner is found, otherwise null.
   */
  private calculateWinner(cells: Array<string | null>): 'X' | 'O' | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],            // diagonals
    ];
    for (const [a, b, c] of lines) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a] as 'X' | 'O';
      }
    }
    return null;
  }
}
