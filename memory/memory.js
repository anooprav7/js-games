(function () {
  "use strict";
  /**
   * Memory aka Concentration Game
   * @param {string} outerContainerId Outer containing element id.
   * @constructor
   */
  function MemoryGame(outerContainerId) {
    // Singleton
    if (MemoryGame.instance_) {
      return MemoryGame.instance_;
    }
    MemoryGame.instance_ = this;

    this.outerContainerEl = document.querySelector(outerContainerId);
    this.containerEl = null;
    this.gameLevel = null;
    this.selectedCards = [];

    this.init();
  }

  window["MemoryGame"] = MemoryGame;

  /**
   * Exhaustive list of all emojis to be used on the card
   */
  MemoryGame.emojis = [
    "🧳",
    "🧶",
    " 🦺",
    " 👔",
    " 🧦",
    " 👗",
    "🥻",
    " 👜",
    " 💍",
    " 💼"
  ].map((emoji, idx) => ({ emoji, id: idx }));

  /**
   * Number of cards on a side of the board by level
   */
  MemoryGame.sideSizeByLevel = [4, 6, 8];

  /**
   * String keys used for LocalStorage
   */
  MemoryGame.cacheKeys = {
    GAME_LEVEL: "memoryGame.level"
  };

  /**
   * CSS classes for Game elements
   */
  MemoryGame.classes = {
    CONTAINER: "cards-container",
    CARD: {
      CONTAINER: "card",
      WRAPPER: "card-wrapper",
      FRONT: "card-front",
      BACK: "card-back",
      ACTIVE: "card_active",
      CORRECT: "card_correct"
    }
  };

  MemoryGame.prototype = {
    init: function () {
      this.gameLevel = this.getGameLevel();
      this.containerEl = document.createElement("div");
      this.containerEl.className = MemoryGame.classes.CONTAINER;

      this.containerEl.style.width = "400px";
      this.containerEl.addEventListener("click", this.onCardSelect);

      this.outerContainerEl.appendChild(this.containerEl);

      this.renderCards();
    },
    onCardSelect: function (evt) {
      const element = evt.target.parentElement;
      const {WRAPPER, ACTIVE, CORRECT} = MemoryGame.classes.CARD;
      if(element.classList.contains(WRAPPER) && !element.classList.contains(CORRECT)){
        element.classList.toggle(ACTIVE);
        MemoryGame.instance_.addAndEvaluateCard(element);
      }
    },
    addAndEvaluateCard: function(cardEl) {
      if(this.selectedCards.length >= 2){
        const card1Id = this.selectedCards[0].dataset.id;
        const card2Id = this.selectedCards[1].dataset.id;
        const { CORRECT, ACTIVE } = MemoryGame.classes.CARD;
        if(card1Id === card2Id && this.selectedCards[0] !== this.selectedCards[1]) {
          this.selectedCards[0].classList.add(CORRECT);
          this.selectedCards[1].classList.add(CORRECT);
        }
        this.selectedCards[0].classList.remove(ACTIVE);
        this.selectedCards[1].classList.remove(ACTIVE);

        this.selectedCards = [];
      }
      this.selectedCards.push(cardEl);
    },
    /**
     * Get game level. This checks cache and out of bounds condition
     */
    getGameLevel: function () {
      let currentLevel =
        localStorage.getItem(MemoryGame.cacheKeys.GAME_LEVEL) || "0";
      currentLevel = Number.parseInt(currentLevel);
      currentLevel =
        currentLevel > MemoryGame.sideSizeByLevel.length - 1
          ? MemoryGame.sideSizeByLevel.length - 1
          : currentLevel;
      return currentLevel;
    },

    /**
     * Create a game card
     */
    createCard: function (emoji, dataId) {
      const { CONTAINER, WRAPPER, FRONT, BACK } = MemoryGame.classes.CARD;
      const template = `
        <div class="${WRAPPER}" data-id="${dataId}">
          <div class="${FRONT}"></div>
          <div class="${BACK}">
            {{SYMBOL}}
          </div>
        </div>`;
      const el = document.createElement("div");

      el.innerHTML = template.replace("{{SYMBOL}}", emoji);
      el.className = CONTAINER;

      return el;
    },

    /**
     * render all the cards to the DOM. Shuffle - Fisher--Yates Algorithm
     */
    renderCards: function () {
      const sideSize = MemoryGame.sideSizeByLevel[this.gameLevel];

      const uniqueCount = (sideSize * sideSize) / 2;
      const filteredEmojis = MemoryGame.emojis.slice(0, uniqueCount);
      const countList = Array(uniqueCount).fill(2);

      while (countList.length > 0) {
        const idx = Math.floor(Math.random() * countList.length);
        // const dataId = `${idx}_${countList.length}`;
        const { emoji, id } = filteredEmojis[idx];
        this.containerEl.appendChild(
          this.createCard(emoji, id)
        );
        countList[idx] -= 1;

        if (countList[idx] === 0) {
          filteredEmojis.splice(idx, 1);
          countList.splice(idx, 1);
        }
      }
    }
  };
})();

function onDocumentLoad() {
  new MemoryGame("#root");
}

document.addEventListener("DOMContentLoaded", onDocumentLoad);
