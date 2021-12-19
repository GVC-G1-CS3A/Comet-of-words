function Word(height, width, color, text) {
  // Base
  var word = this;

  // Specifications
  word.width = width;
  word.height = height;
  word.c = color || 'red';       // word color
  word.x = 0;                    // center x
  word.y = 0;                    // center y
  word.m = 0;                    // mass
  word.vx = 0;                   // velocity of x direction of ball
  word.vy = 0;                   // velocity of y direction of ball
  word.context = null            // the drawing context of ball
  word.text = text;
}

Word.prototype.draw = function () {
  // Base
  var word = this;

  // Check Context
  if(!word.context){return}

  // Draw Ball
  word.context.beginPath();
  word.context.fillStyle = word.c;
  console.log(word.c);
  word.context.fillText(word.text, word.x, word.y);
};
