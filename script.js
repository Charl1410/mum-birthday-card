
// --- Open card (physical card effect) ---
const card3d = document.getElementById("card3d");
document.getElementById("openCardBtn").addEventListener("click", () => {
  card3d.classList.add("opened");
});

const MUM_NAME = "Mamma";
const FROM_NAME = "Charlotte";
const MEMORIES = [
  "Thank you for always being there — even when I didn't realise I needed you.",
  "You make home feel like home.",
  "I'm so lucky to have you. Today is all about you 💛"
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
  msg.textContent = `Happy Birthday, ${MUM_NAME}! 🎉 Wishing you a day full of love, laughs, and your favourite treats.`;
  burstConfetti();
});

document.getElementById("hugBtn").addEventListener("click", () => {
  msg.textContent = `Sending you the biggest hug, ${MUM_NAME} 🤗 (This one is interactive, so it counts extra!)`;
  softConfetti();
});

document.getElementById("memoryBtn").addEventListener("click", () => {
  const pick = MEMORIES[Math.floor(Math.random() * MEMORIES.length)];
  memoryBox.classList.remove("hidden");
  memoryBox.textContent = pick;
});

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
