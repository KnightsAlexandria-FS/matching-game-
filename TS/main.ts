enum GameState {
  Playing,
  Won,
  Lost,
}

class MemoryGame {
  private cards: string[] = ["A", "A", "B", "B", "C", "C"];
  private attempts: number = 3;
  private flippedCards: HTMLElement[] = [];
  private matchedCount: number = 0;

  constructor() {
    this.setupGame();
  }

  private setupGame(): void {
    const grid = document.getElementById("cardgrid") as HTMLDivElement;
    grid.innerHTML = "";
    this.attempts = 3;
    this.matchedCount = 0;
    this.updateUI(GameState.Playing);
    const shuffled = this.cards.sort(() => Math.random() - 0.5);

    shuffled.forEach((symbol) => {
      const cardEl = this.createCardElement(symbol);
      grid.appendChild(cardEl);
    });
  }
  private updateUI(state: GameState): void {
    const countSpan = document.getElementById("attemptscount") as HTMLElement;

    countSpan.innerText = this.attempts.toString();

    const overlay = document.getElementById("overlay") as HTMLElement;
    const message = document.getElementById("message") as HTMLElement;

    if (state == GameState.Won) {
      overlay.classList.remove("hidden");
      message.innerText = "YOU WON!!";
    } else if (state == GameState.Lost) {
      overlay.classList.remove("hidden");
      message.innerText = "GAME OVER!";
    } else {
      overlay.classList.add("hidden");
    }
  }
  private createCardElement(symbol: string): HTMLElement {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="back"></div>
            <div class="front">${symbol}</div>
        `;

    card.addEventListener("click", () => this.handleFlip(card));
    return card;
  }
  private handleFlip(card: HTMLElement): void {
    if (this.flippedCards.length < 2 && !card.classList.contains("flipped")) {
      card.classList.add("flipped");
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    }
  }

  private checkMatch(): void {
    const [card1, card2] = this.flippedCards;

    // Type assertion: finding the text inside the 'front' face
    const val1 = (card1.querySelector(".front") as HTMLElement).innerText;
    const val2 = (card2.querySelector(".front") as HTMLElement).innerText;

    if (val1 === val2) {
      this.matchedCount++;
      this.flippedCards = [];
      if (this.matchedCount === 3) this.updateUI(GameState.Won);
    } else {
      this.attempts--;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        this.flippedCards = [];

        if (this.attempts <= 0) {
          this.updateUI(GameState.Lost);
        } else {
          this.updateUI(GameState.Playing);
        }
      }, 1000);
    }
  }
}
//reset
const game = new MemoryGame();
const resetBtn = document.getElementById("resetbtn") as HTMLButtonElement;
resetBtn.onclick = () => location.reload();
