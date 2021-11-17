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
  ]; // 10

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
      BACK: "card-back"
    }
  };

  MemoryGame.prototype = {
    init: function () {
      this.gameLevel = this.getGameLevel();
      this.containerEl = document.createElement("div");
      this.containerEl.className = MemoryGame.classes.CONTAINER;

      this.containerEl.style.width = "400px"

      this.outerContainerEl.appendChild(this.containerEl);

      this.renderCards();
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
    createCard: function (emoji) {
      const { CONTAINER, WRAPPER, FRONT, BACK} = MemoryGame.classes.CARD;
      const template = `
        <div class="${WRAPPER}">
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
        this.containerEl.appendChild(this.createCard(filteredEmojis[idx]));
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
