// Import the necessary modules
const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

// Define the game's characters and field properties
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Define the Field class
class Field {
  constructor(field = [[]]) {
    // Initialize the field array, starting position, and hat position
    this.field = field;
    this.startPos = { x: 0, y: 0 };
    this.hatPos = { x: 0, y: 0 };

    // Set the current location to the starting position
    this.currentPos = { ...this.startPos };
  }

  // Helper function to generate a random position on the field outside of a specified off-limit position
  getRandomPosition(offLimit = { x: 0, y: 0 }) {
    let randomPos = { x: 0, y: 0 };
    do {
      randomPos.x = Math.floor(Math.random() * this.field[0].length);
      randomPos.y = Math.floor(Math.random() * this.field.length);
    } while (randomPos.x === offLimit.x && randomPos.y === offLimit.y);
    return randomPos;
  }

  // Initialize the starting position on the field
  initializeStartPosition() {
    this.startPos = this.getRandomPosition();
    this.currentPos = { ...this.startPos };
    this.field[this.startPos.y][this.startPos.x] = pathCharacter;
  }

  // Initialize the hat position on the field
  initializeHatPosition() {
    this.hatPos = this.getRandomPosition(this.startPos);
    this.field[this.hatPos.y][this.hatPos.x] = hat;
  }

  // Start the game
  startGame(hardMode = false) {
    // Initialize the starting and hat positions
    this.initializeStartPosition();
    this.initializeHatPosition();

    let playing = true;
    while (playing) {
      // Print the current state of the field
      this.printField();
      // Get the user's input for the next move
      this.getNextMove();

      // Check if the player is out of bounds, in a hole, or has found the hat
      if (!this.isInBounds()) {
        console.log('Out of bounds instruction.');
        playing = false;
        break;
      } else if (this.isInHole()) {
        console.log('Sorry, you fell down a hole.');
        playing = false;
        break;
      } else if (this.isAtHat()) {
        console.log('Congrats, you found your hat!');
        playing = false;
        break;
      }

      // For hard mode, randomly generate more holes on this turn
      if (hardMode && Math.random() > 0.2) {
        this.addHoles();
      }

      // Update the current position on the field
      this.field[this.currentPos.y][this.currentPos.x] = pathCharacter;
    }
  }

  // Print the current state of the field
  printField() {
    clear();
    this.field.forEach(row => console.log(row.join('')));
  }

  // Get the user's input for the next move
  getNextMove() {
    const input = prompt('Which way? ').toUpperCase();
    switch (input) {
      case 'U':
        this.currentPos.y -= 1;
        break;
      case 'D':
        this.currentPos.y += 1;
        break;
      case 'L':
      this.currentPos.x -= 1;
      break;
      case 'R':
      this.currentPos.x += 1;
      break;
      default:
      console.log('Invalid input. Please use U, D, L, or R.');
      this.getNextMove();
      }
      }
      
      // Check if the player is in bounds on the field
      isInBounds() {
      return (
      this.currentPos.y >= 0 &&
      this.currentPos.y < this.field.length &&
      this.currentPos.x >= 0 &&
      this.currentPos.x < this.field[0].length
      );
      }
      
      // Check if the player has fallen into a hole
      isInHole() {
      return this.field[this.currentPos.y][this.currentPos.x] === hole;
      }
      
      // Check if the player has found the hat
      isAtHat() {
      return this.field[this.currentPos.y][this.currentPos.x] === hat;
      }
      
      // Add more holes to the field
      addHoles(numHoles = 1) {
      for (let i = 0; i < numHoles; i++) {
      const holePos = this.getRandomPosition(this.startPos);
      this.field[holePos.y][holePos.x] = hole;
      }
      }
      }
      
      // Define the field array
      const myField = [
      [fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter],
      [fieldCharacter, hole, fieldCharacter, hole, fieldCharacter, fieldCharacter],
      [fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter, fieldCharacter],
      [hole, fieldCharacter, fieldCharacter, fieldCharacter, hole, fieldCharacter],
      [fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter, fieldCharacter],
      [fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, hat],
      ];
      
      // Initialize the game
      const myGame = new Field(myField);
      
      // Start the game
      myGame.startGame();