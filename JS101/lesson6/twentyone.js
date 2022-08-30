/*
Deck: Start with a standard 52-card deck consisting of the 4 suits (Hearts, Diamonds, Clubs, and Spades), and 13 values (2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace).

Card values:
* cards with numbers 2 through 10 are worth their face value. 
* The Jack, Queen, and King (i.e., card 11, 12, 13) are each worth 10
* Ace value:
  * If sum of hand, including the ace, <= 21, then the ace is worth 11
  * If sum of hand, including ace, > 21, then ace is worth 1

Turn logic:
* Player:
  * Player  always goes first, and can decide to either hit (deal another card) or stay ('pass')
  * If player's total > 21, player loses
* Dealer:
  * hit until the total is at least 17. 
  * If the dealer busts, then the player wins
* If both player and dealer stay: compare player and dealer's cards; see who has higher value

Win/lose criterion:
* If either's total > 21 during their turn, that person loses
* If both player and dealer stay (i.e., don't bust), then the person with the higher score wins
*/

const readline = require('readline-sync');

const MAX_HAND_VAL_THRESHOLD = 21;
const NUM_OWN_CARDS_VISIBLE_TO_PLAYER = 2;
const NUM_DEALER_CARDS_VISIBLE_TO_PLAYER = 1;
const MIN_FOR_DEALER_DECISION_CRITERION = 17;
const NUM_CARDS_FOR_INITIAL_HAND = 2;

const playerChoice = Object.freeze({
  hit: Symbol("hit"), // player wants to be dealt another card
  stay: Symbol("stay")
});

const Suit = Object.freeze({
  Heart: Symbol("Heart"),
  Spade: Symbol("Spade"),
  Diamond: Symbol("Diamond"),
  Club: Symbol("Club")
});

const ARR_OF_SUITS = [Suit.Heart, Suit.Diamond, Suit.Club, Suit.Spade];
const CARD_NUMS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
const JACK_QUEEN_KING_IDS = [11, 12, 13];
const JACK_QUEEN_KING_VALUE = 10;
const ACE_CARD_ID = 14;
const ACE_HIGH_VALUE = 11;
const ACE_LOW_VALUE = 1;



// console.log(CARD_DECK);

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]]; // swap elements
  }
}

/* from :: Array
returns array of cards*/
function sampleAndPop(from, numToSample) {
  if (numToSample === 0 || !from) return null;

  let retCards = [];

  for (let sampleIdx = 0; sampleIdx < numToSample; ++sampleIdx) {
    const randIdx = Math.floor(Math.random() * from.length);
    // console.log(`randIdx is ${randIdx}`);
    retCards = retCards.concat(from.splice(randIdx, 1));
    // console.log(`sampleIdx is ${sampleIdx}; retCards is ${retCards}; deck length is ${CARD_DECK.length}`);
  }
  // console.log(retCards);
  return retCards;
}

const dealOne = from => sampleAndPop(from, 1)[0];

function getInitialHand(deck) {
  let deckCopy;
  let drawnCards;
  do {
    deckCopy = deck.slice();
    drawnCards = sampleAndPop(deckCopy, NUM_CARDS_FOR_INITIAL_HAND);
  } while (computeHandValue(drawnCards) > MAX_HAND_VAL_THRESHOLD);

  console.log(`value of drawn cards is ${computeHandValue(drawnCards)}`);
  return [drawnCards, deckCopy];
}

function initGameAndDealCards(deck) {
  let [playerHand, newDeck] = getInitialHand(deck);
  let [dealerHand, finalDeck] = getInitialHand(newDeck);

  let gameState = {
    deck: finalDeck,

    playerHand: playerHand,
    valuePlayerHand: computeHandValue(playerHand),
    dealerHand: dealerHand,
    valueDealerHand: computeHandValue(dealerHand),

    playerBusted: false,
    dealerBusted: false
  };
  console.log(`gameState is ${JSON.stringify(gameState)}`);
  return gameState;
}

// * Ace value:
//   * If sum of hand, including the high value of the (new) ace, <= 21, then the ace is worth 11
//   * If sum of hand, including the high value of the (new) ace, > 21, then ace is worth 1
function computeValueNewHand(valueAccumHand, currCard) {
  let cardID = currCard.cardID;
  if (cardID <= 10) {
    return cardID + valueAccumHand;
  } else if (cardID >= 11 && cardID <= 13) {
    return JACK_QUEEN_KING_VALUE + valueAccumHand;
  } else {
    // it's the ace
    return (valueAccumHand + ACE_HIGH_VALUE) <= MAX_HAND_VAL_THRESHOLD ?
      valueAccumHand + ACE_HIGH_VALUE :
      valueAccumHand + ACE_LOW_VALUE;
  }
}
const computeHandValue = hand => hand.reduce(computeValueNewHand, 0);


function addCardAndDisplayInfo(hand, newCard, newHandValue) {
  hand.push(newCard);
  console.log(`The new hand value is ${newHandValue}`);
}

// Draw card and return newHandValue, bustStatus, newCard
function hit(valueHand, deck) {
  // we know hit will only be called if there's at least one card left in deck, so safe to index
  let newCard = dealOne(deck);
  console.log("Drew: "+ `${JSON.stringify(newCard)}`);

  let newHandValue = computeValueNewHand(valueHand, newCard);
  let personHasBurst = newHandValue > MAX_HAND_VAL_THRESHOLD;
  
  return {newHandValue: newHandValue,
          personHasBurst: personHasBurst,
          newCard: newCard};
}

function displayHand(hand, personName) {
  console.log(`${personName} hand is`);
  hand.forEach(card => console.log(card));
}

/*   
  * Player  always goes first, and can decide to either hit (deal another card) or stay ('pass')
  * If player's total > 21, player loses
*/
function playerTurn(gameState) {
  displayHand(gameState.playerHand, "Player");

  while (gameState.deck.length > 0) {
    let choice = readline.question("(h)it or (s)tay?").trim();
    if (choice === "h") {
      let {newCard, newHandValue, personHasBurst} = hit(gameState.valuePlayerHand, gameState.deck);
      gameState.valuePlayerHand = newHandValue;
      gameState.playerHand.push(newCard); 
      console.log(`New hand total is ${newHandValue}`);

      if (personHasBurst) {
        console.log(`Hand total > ${MAX_HAND_VAL_THRESHOLD} ==> player loses!`);
        gameState.playerBusted = true;
        return;          
      }
    } else if (choice === "s") {
      return;
    } else {
      console.log("input not recognized");
    }
  }
}

/*
  * hit until the total is at least 17. 
  * If the dealer busts, then the player wins
*/
function dealerTurn(gameState) {
  displayHand(gameState.dealerHand, "Dealer");
  while (gameState.valueDealerHand < MIN_FOR_DEALER_DECISION_CRITERION) {
    let {newCard, newHandValue, personHasBurst} = hit(gameState.valueDealerHand, gameState.deck);

    gameState.valueDealerHand = newHandValue;
    gameState.dealerHand.push(newCard); 
    console.log(`New dealer hand total is ${gameState.valueDealerHand}`);

    if (personHasBurst) {
      console.log(`Hand total > ${MAX_HAND_VAL_THRESHOLD} ==> dealer loses!`);
      gameState.dealerBusted = true;
      return;
    }
  }
}

// * If both player and dealer stay: compare player and dealer's cards; see who has higher value
function comparePlayerAndDealerCards(gameState) {
  console.log(`dealer hand value: ${gameState.valueDealerHand}\nplayer hand value: ${gameState.valuePlayerHand}`);
  if (gameState.valueDealerHand > gameState.valuePlayerHand) {
    console.log("dealer wins");
  } else if (gameState.valueDealerHand < gameState.valuePlayerHand) {
    console.log("player wins");
  } else {
    console.log("It's a draw!");
  }
}

function makeDeck() {
  let deck = ARR_OF_SUITS.map(suit =>
    CARD_NUMS.map(cardVal =>
      ({'suit': suit, 
       'cardID': cardVal})
    )
  ).flat(2);

  console.log("(makeDeck) deck is: ");
  console.log(deck);
  return deck;
}

function endGame() {
  while (true) {
    let playAgain = readline.question("play again? y/n\n").trim().toLowerCase();
    if (playAgain === "y") {
      startGame();
      break;
    } else if (playAgain === "n") {
      return;
    } else {
      console.log("input not recognized\n");
    }
  }
}

function startGame() {
  let cardDeck = makeDeck();
  let gameState = initGameAndDealCards(cardDeck);
  // console.log(gameState);

  playerTurn(gameState);
  if (gameState.playerBusted) {
    endGame();
    return;
  }

  dealerTurn(gameState);
  if (gameState.dealerBusted) {
    endGame();
    return;
  }

  // both player and dealer have stayed
  comparePlayerAndDealerCards(gameState);
  endGame();
}
startGame();