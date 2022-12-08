const canvas = document.getElementById("canvas");
const drawButton = document.getElementById('draw')
const clearButton = document.getElementById('clear')

drawButton.addEventListener('click', drawButtonClickHandler)
clearButton.addEventListener('click', clearButtonClickHandler)


const ctx = canvas.getContext("2d");

canvas.addEventListener('mousedown', (e) => canvasClickHandler(e));

let dots = [];
let count = 1

class Dot {
  constructor(x, y, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    // this.color = 'cornflowerblue';
    this.color = '#818181';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.font = "16px Roboto";
    ctx.strokeStyle = this.color;
    ctx.strokeText(this.id, this.x - 4, this.y - 17);
    ctx.stroke();
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

class Bezier {
  constructor(dots, sens) {
    this.dots = dots;
    this.sens = sens;
    this.width = 3;
    this.height = 3;
    this.color = '#818181'
    // this.color = 'dodgerblue'
  }

  draw() {
    for (let u = 0; u <= 1; u += this.sens) {
      const Px = parseInt(dots.reduce((total, value, index) => {
        return total + value.x * ((factorialize(this.dots.length - 1) /
          (factorialize(index) * factorialize((this.dots.length - 1 - index))))) *
          Math.pow(u, index) *
          Math.pow((1 - u), this.dots.length - 1 - index)
      }, 0));

      const Py = parseInt(dots.reduce((total, value, index) => {
        return total + value.y * (factorialize(this.dots.length - 1) /
          (factorialize(index) * factorialize((this.dots.length - 1 - index)))) *
          Math.pow(u, index) *
          Math.pow((1 - u), this.dots.length - 1 - index)
      }, 0));

      // console.log(Px, Py)
      ctx.fillStyle = this.color;
      ctx.fillRect(Px, Py, 3, 3);
      ctx.stroke();
    }
  }
}

let reqAnimationFrame;

function drawButtonClickHandler() {
  (function drawFrame() {
    reqAnimationFrame = requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    reDrawCanvas();
  }());
}

function clearButtonClickHandler() {
  dots = [];
  count = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(reqAnimationFrame);
}



function canvasClickHandler(event) {
  const { x, y } = getCursorPosition(event);

  const dot = dots.filter(dot => {
    const bounds = dot.getBounds()
    if (x >= bounds.x
      && x <= bounds.x + bounds.width
      && y >= bounds.y
      && y <= bounds.y + bounds.height) {
      return dot;
    }
  })

  if (dot.length === 0) {
    const newDot = new Dot(x, y, count);
    count++;
    newDot.draw();
    dots.push(newDot);
    return;
  };

  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mousemove', onMouseMove, false);

  function onMouseUp() {
    canvas.removeEventListener('mouseup', onMouseUp, false);
    canvas.removeEventListener('mousemove', onMouseMove, false);
  }

  function onMouseMove(event) {
    const mousePosition = getCursorPosition(event);
    dot[0].x = mousePosition.x;
    dot[0].y = mousePosition.y;
  }

}

function reDrawCanvas() {
  dots.forEach(dot => {
    dot.draw();
  })
  const bezier = new Bezier(dots, 0.001)
  bezier.draw();
}

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x: parseInt(x), y: parseInt(y) };
}

function factorialize(num) {
  if (num < 0)
    return -1;
  else if (num == 0)
    return 1;
  else {
    return (num * factorialize(num - 1));
  }
}