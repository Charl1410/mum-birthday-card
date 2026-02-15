
// --- Open card (physical card effect) ---
const card3d = document.getElementById("card3d");
document.getElementById("openCardBtn").addEventListener("click", () => {
  card3d.classList.add("opened");
});

const MUM_NAME = "Mamma";
const FROM_NAME = "Charlotte";
const MEMORIES = [
  "Thank you for always being there for me.",
  "I hope this is better than an emoji birthday text!",
  "I hope you have the best day!",
  "I love you so much, Mamma. Happy Birthday! 💛"
];

// --- UI text setup ---
const dateLine = document.getElementById("dateLine");
const fromLine = document.getElementById("fromLine");
const msg = document.getElementById("msg");
const memoryBox = document.getElementById("memory");
fromLine.textContent = `from ${FROM_NAME}`;
dateLine.textContent = new Date().toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });

// --- Buttons ---
document.getElementById("celebrateBtn").addEventListener("click", () => {
  msg.textContent = `Happy Birthday, ${MUM_NAME}! 🎉 I hope you have an amazing day! I miss you!`;
  burstConfetti();
});

document.getElementById("hugBtn").addEventListener("click", () => {
  msg.textContent = `Sending you the biggest hug, ${MUM_NAME} 🤗`;
  softConfetti();
});

document.getElementById("memoryBtn").addEventListener("click", () => {
  const pick = MEMORIES[Math.floor(Math.random() * MEMORIES.length)];
  memoryBox.classList.remove("hidden");
  memoryBox.textContent = pick;
});

// --- Carousel (images from img folder) ---
const CAROUSEL_ALL_IMAGES = [
  "img/a4be28bf-2308-43b2-8946-26a76f63f4ad.JPG",
  "img/IMG_0450.jpeg",
  "img/IMG_0666.jpeg",
  "img/IMG_0692.jpeg",
  "img/IMG_1049.jpeg",
  "img/IMG_1060.jpeg",
  "img/IMG_1109.jpeg",
  "img/IMG_1841.jpeg",
  "img/IMG_2232.jpeg",
  "img/IMG_3566.jpeg",
  "img/IMG_4119.jpeg"
];

const WEB_IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;
const CAROUSEL_IMAGES = CAROUSEL_ALL_IMAGES.filter(path => WEB_IMAGE_EXT.test(path));

const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const carouselEl = document.getElementById("carousel");

let carouselIndex = 0;

CAROUSEL_IMAGES.forEach((src, i) => {
  const slide = document.createElement("div");
  slide.className = "carousel-slide";
  const img = document.createElement("img");
  img.src = src;
  img.alt = `Photo ${i + 1}`;
  slide.appendChild(img);
  carouselTrack.appendChild(slide);

  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "carousel-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Go to image ${i + 1}`);
  dot.addEventListener("click", () => goToSlide(i));
  carouselDots.appendChild(dot);
});

// Hide arrows/dots when only one image
if (CAROUSEL_IMAGES.length <= 1) {
  carouselPrev.style.display = "none";
  carouselNext.style.display = "none";
  if (carouselDots) carouselDots.style.display = "none";
}

function updateCarousel() {
  if (CAROUSEL_IMAGES.length === 0) return;
  const offset = -carouselIndex * 100;
  carouselTrack.style.transform = `translateX(${offset}%)`;
  carouselDots.querySelectorAll(".carousel-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === carouselIndex);
  });
}

function goToSlide(i) {
  if (CAROUSEL_IMAGES.length === 0) return;
  carouselIndex = (i + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
  updateCarousel();
}

carouselPrev.addEventListener("click", () => goToSlide(carouselIndex - 1));
carouselNext.addEventListener("click", () => goToSlide(carouselIndex + 1));

// --- Confetti (simple + lightweight) ---
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let W, H, pieces = [], anim;

function resize(){
  W = canvas.width = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

function makePieces(count, power){
  const arr = [];
  for(let i=0;i<count;i++){
    arr.push({
      x: Math.random()*W,
      y: -Math.random()*H*0.2,
      r: (Math.random()*6+3) * devicePixelRatio,
      vx: (Math.random()-0.5) * power * devicePixelRatio,
      vy: (Math.random()*2+2) * power * devicePixelRatio,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.2
    });
  }
  return arr;
}

function draw(){
  ctx.clearRect(0,0,W,H);
  for(const p of pieces){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.vy *= 1.005;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `hsl(${(p.x+p.y)%360} 85% 60%)`;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.8);
    ctx.restore();
  }
  pieces = pieces.filter(p => p.y < H + 40*devicePixelRatio);
  if(pieces.length){
    anim = requestAnimationFrame(draw);
  } else {
    cancelAnimationFrame(anim);
    ctx.clearRect(0,0,W,H);
  }
}

function burstConfetti(){
  pieces = pieces.concat(makePieces(180, 2.8));
  if(!anim) draw();
}
function softConfetti(){
  pieces = pieces.concat(makePieces(80, 1.8));
  if(!anim) draw();
}
