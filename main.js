const canvas = document.querySelector('canvas')
const scoreBoard = document.querySelector('.score')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
let aspectRatio = canvas.height/canvas.width
const PILLARGAP = 120
const GAMESPEED = 1
let highScore = localStorage.getItem("flappyBirdHighScore") || 0
let score = 0
let backgroundPos = {x1:0, x2:aspectRatio*800}
let frame = 0
document.body.height = innerHeight
class Star {
  constructor(){
    this.x = Math.random()*canvas.width
    this.y = Math.random()*canvas.height
    this.radius = Math.random()*2
  }
  update(){
    this.draw()
    this.x-= 2*GAMESPEED
    if (this.x+this.radius<0) {
      this.x = canvas.width
      this.y = Math.random()*canvas.height
    }
  }
  draw(){
    c.beginPath()
    c.fillStyle = "white"
    c.arc(this.x, this.y, this.radius,0,Math.PI*2)
    c.fill()
  }
}
class Pillar {
  constructor() {
    this.x = canvas.width//+Math.random()*canvas.width*.5
    this.gapOffset = (Math.random()*canvas.height*.4)+(canvas.height*.2)
    this.color= "#fff"
    this.width = 30
  }
  update(){
    this.draw()
    this.x-=4*GAMESPEED
    
    //Gameover code || Collision Detection
    if (this.x + this.width >= bird.x && this.x < bird.x+bird.length) {
      if (bird.y < this.gapOffset || bird.y+bird.length> this.gapOffset+PILLARGAP) {
        gameOver()
      }
    }
  }
  draw(){
    c.fillStyle = this.color
    // top pillar
    c.fillRect(this.x,0,this.width,this.gapOffset)
    // c.strokeRect(this.x,0,this.width,this.gapOffset)
    // bottom pillar
    c.fillRect(this.x,this.gapOffset+PILLARGAP,this.width,canvas.height-(this.gapOffset+PILLARGAP))
    // c.strokeRect(this.x,this.gapOffset+PILLARGAP,this.width,canvas.height-(this.gapOffset+PILLARGAP))
  }
}
class Player {
  constructor() {
    this.x = 5
    this.y = canvas.height/2
    this.vy = 0
    this.acceleration = 1
    this.friction = 0.22
    this.length = 30
    this.flapping = false
    this.color = "#00ffd1"
  }
  update(){
    this.draw()
    if (this.y > canvas.height - this.length) {
      this.y = canvas.height - this.length
      this.vy = 0
    }else if (this.y < 0) {
      this.y = 0
      this.vy = 0
    }else {
      this.vy += this.acceleration
      this.vy *= 1-this.friction
      this.y += this.vy
    }
    if (this.flapping) {
      this.flap()
    }
  }
  draw(){
    c.fillStyle = this.color
    c.fillRect(this.x,this.y,this.length,this.length)
    c.strokeRect(this.x,this.y,this.length,this.length)
  }
  flap(){
      this.vy-=2.3*GAMESPEED
  }
}
let pillars = []
let stars = []
let bird = new Player()
let animationFrame;

function animate() {
  animationFrame = requestAnimationFrame(animate)
  c.clearRect(0,0,canvas.width, canvas.height)
  updateScore()
  handleStars()
  handlePillars()
  generatePillars()
  bird.update()
  frame++
}
function handlePillars() {
  pillars.forEach(pillar => {
    pillar.update()
  })
  pillars.forEach((pillar, i) => {
    if (pillar.x + pillar.width < 0) {
      pillars.splice(i, 1)
      score++
    }
  })
}
function updateScore() {
  scoreBoard.innerHTML = `HI ${highScore} ${score}`
}
function generatePillars() {
  if ((frame-50)%(60)==0) {
    pillars.push(new Pillar)
  }
}
function handleStars() {
  stars.forEach(star => {
    star.update()
  })
}
(function() {
  for (let i=0;i<50;i++) {
    stars.push(new Star())
  }
})()
function gameOver() {
  cancelAnimationFrame(animationFrame)
  document.querySelector('.menu').style.display = null
  document.querySelector('.play').innerHTML = 'Restart'
  pillars = []
  localStorage.setItem("flappyBirdHighScore", highScore<score?highScore=score:highScore)
  score = 0
  frame = 0
}
addEventListener('touchstart', e => {
  bird.flapping = true
})
addEventListener('touchend', e => {
  bird.flapping = false
})
addEventListener('mousedown', e => {
  bird.flapping = true
})
addEventListener('mouseup', e => {
  bird.flapping = false
})

addEventListener('load',loadCanvas)
function loadCanvas() {
  c.clearRect(0,0,canvas.width, canvas.height)
  updateScore()
  handleStars()
  bird.draw()
}
function start() {
  document.querySelector('.menu').style.display = 'none'
  bird = new Player()
  animate()
}

const rotateBtn = document.querySelector('.orientation')
rotateBtn.addEventListener('click', function(){
  if (screen.orientation.type == 'landscape-primary') {
    screen.orientation.unlock()
    resizeCanvas()
  } else {
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    else if (document.documentElement.webkitRequestFullScreen) document.documentElement.webkitRequestFullScreen();
    resizeCanvas()
    screen.orientation.lock("landscape-primary")
      .then(resizeCanvas)
      .catch(function(error) {alert(error);}
    );
  }
})

function resizeCanvas() {
  document.body.height = innerHeight
  canvas.width = innerWidth
  canvas.height = innerHeight
  pillars = []
  stars = [];
  (function() {
    for (let i=0;i<50;i++) {
      stars.push(new Star())
    }
  })()
  handleStars()
  bird.y = canvas.height/2
}
addEventListener('fullscreenchange', resizeCanvas)
addEventListener('webkitfullscreenchange', resizeCanvas)
screen.orientation.addEventListener("change", resizeCanvas)
addEventListener('resize', resizeCanvas)