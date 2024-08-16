let fft;
let song;
let wave;
let index;
let radius;
let rMin;
let rMax;
let rAvg;
let particle;
let particlesArray = [];
let amp;
let bgImage;
let alpha

function preload() {
  song = loadSound("demoSong.mp3");
  bgImage = loadImage("night-sky.jpg");
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  userStartAudio().then(function () {
    song.play();
  });
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER)
  bgImage.filter(BLUR, 4);

  rMin = 100;
  rMax = 250;
  rAvg = (rMin + rMax) / 2;

  fft = new p5.FFT();
}

function draw() {
  background(0);
  stroke(255);
  noFill();
  strokeWeight(3);

  wave = fft.waveform();
  fft.analyze();
  amp = fft.getEnergy(20, 200);

  translate(width / 2, height / 2);

  push();
  if (amp > 230) {
    rotate(random(-0.5, 0.5));
  }
  image(bgImage, 0, 0, width + 100, height + 100);
  pop();

  alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    noFill()
    stroke(255)
    for (let i = 0; i <= 180; i += 0.5) {
      index = floor(map(i, 0, 180, 0, wave.length - 1));
      radius = map(wave[index], -1, 1, rMin, rMax);
      let x = radius * sin(i) * t;
      let y = radius * cos(i);

      vertex(x, y);
    }
    endShape();
  }

  particle = new Particle();
  particlesArray.push(particle);

  for (let i = particlesArray.length - 1; i >= 0; i--) {
    if (!particlesArray[i].edges()) {
      particlesArray[i].update(amp > 200);
      particlesArray[i].draw();
    } else {
      particlesArray.splice(i, 1);
    }
  }
  console.log(particlesArray.length);
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(rAvg);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.color = (random(200, 255), random(200, 255), random(200, 255));
  }
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > this.height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
