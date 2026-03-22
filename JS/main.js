var GameState;
(function (GameState) {
  GameState[(GameState["Playing"] = 0)] = "Playing";
  GameState[(GameState["Won"] = 1)] = "Won";
  GameState[(GameState["Lost"] = 2)] = "Lost";
})(GameState || (GameState = {}));

class MemoryGame {
  constructor() {
    this.cards = ["A", "B", "A", "B", "C", "C"];
    this.attempts = 3;
    this.flippedCards = [];
    this.matchedCount = 0;
    this.setupGame();
  }

  setupGame() {
    const grid = document.getElementById("cardgrid");
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
  updateUI(state) {
    const countSpan = document.getElementById("attemptscount");
    countSpan.innerText = this.attempts.toString();
    const overlay = document.getElementById("overlay");
    const message = document.getElementById("message");
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
  createCardElement(symbol) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="back"></div>
            <div class="front">${symbol}</div>
        `;
    card.addEventListener("click", () => this.handleFlip(card));
    return card;
  }

  handleFlip(card) {
    if (this.flippedCards.length < 2 && !card.classList.contains("flipped")) {
      card.classList.add("flipped");
      this.flippedCards.push(card);
      if (this.flippedCards.length == 2) {
        this.checkMatch();
      }
    }
  }
  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const val1 = card1.querySelector(".front").innerText;
    const val2 = card2.querySelector(".front").innerText;
    if (val1 == val2) {
      this.matchedCount++;
      this.flippedCards = [];
      if (this.matchedCount == 3) this.updateUI(GameState.Won);
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
const game = new MemoryGame();
const resetBtn = document.getElementById("resetbtn");
resetBtn.onclick = () => location.reload();
