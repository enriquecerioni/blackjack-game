const myModule = (() => {
  "use strict";

  let deck = [];
  const types = ["C", "D", "H", "S"],
    specials = ["A", "J", "Q", "K"];

  let scores = [];

  // HTML References
  const divCardsPlayers = document.querySelectorAll(".divCards");

  const btnGetCard = document.querySelector("#btnGetCard"),
    btnStop = document.querySelector("#btnStop"),
    btnNewGame = document.querySelector("#btnNewGame"),
    scoreHTML = document.querySelectorAll("small");

  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        deck.push(i + type);
      }
    }

    for (let type of types) {
      for (let special of specials) {
        deck.push(special + type);
      }
    }
    return _.shuffle(deck);
  };

  // This function initializes the game
  const initializeGame = (numPlayers = 2) => {
    deck = createDeck();
    scores = [];
    for (let i = 0; i < numPlayers; i++) {
      scores.push(0);
    }

    scoreHTML.forEach(element => element.innerText = 0 );
    divCardsPlayers.forEach(element => element.innerHTML = '');

    btnGetCard.disabled = false;
    btnStop.disabled = false;
  };

  // Request one card
  const getCard = () => {
    if (deck.length === 0) {
      throw "There are no cards in the deck";
    }
    return deck.pop();
  };

  // This function is used to obtain the value of the card
  const valueCard = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
  };

  // turn: 0 = first player and the last will be the computer
  const accumulatePoints = (card, turn) => {
    scores[turn] += valueCard(card);
    scoreHTML[turn].innerText = scores[turn];
    return scores[turn];
  };

  const createCard = (card, turn ) => {
    const imgCard = document.createElement("img");
    imgCard.src = `assets/cartas/${card}.png`;
    imgCard.classList.add("gameCard");
    divCardsPlayers[turn].append(imgCard);
  };

  const determineWinner = () => {

    const [score, scoreComputer] = scores

    setTimeout(() => {
      if (scoreComputer === score) {
        alert("Nobody wins :(");
      } else if (score > 21 || scoreComputer === 21) {
        alert("Computer wins");
      } else if (scoreComputer > 21) {
        alert("Player wins");
      } else {
        alert("Computer wins");
      }
    }, 10);
  }

  // Computer turn
  const computerTurn = (score) => {
    let scoreComputer = 0;
    do {
      const card = getCard();
      scoreComputer = accumulatePoints(card, scores.length - 1);
      createCard(card, scores.length - 1);

    } while (scoreComputer < score && score <= 21);

    determineWinner();
  };

  // Events
  btnGetCard.addEventListener("click", () => {

    const card = getCard();
    const scorePlayer = accumulatePoints(card, 0);

    createCard(card, 0);

    // validate score
    if (scorePlayer > 21) {
      console.warn("You loss.");
      btnGetCard.disabled = true;
      btnStop.disabled = true;
      computerTurn(scorePlayer);
    } else if (scorePlayer === 21) {
      console.warn("21, great.");
      btnGetCard.disabled = true;
      btnStop.disabled = true;
      computerTurn(scorePlayer);
    }
  });

  btnStop.addEventListener("click", () => {
    btnGetCard.disabled = true;
    btnStop.disabled = true;

    computerTurn(scores[0]);
  });

  btnNewGame.addEventListener("click", () => {
    initializeGame();
  });

  return {
    newGame: initializeGame
  };

})();
