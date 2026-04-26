const player = document.getElementById("player");
const block = document.getElementById("block");
const virus = document.getElementById("virus");

// =====================
// 🐼 プレイヤー位置
// =====================
let px = 100;
let py = 400;

player.style.left = px + "px";
player.style.top = py + "px";

// =====================
// 🐒 仲間リスト
// =====================
const allies = [];

// =====================
// 🕹️ 操作（左右＋ジャンプ）
// =====================
document.addEventListener("keydown", (e) => {

  if (e.key === "a") px -= 10;
  if (e.key === "d") px += 10;

  player.style.left = px + "px";

  if (e.code === "Space") jump();
});

// =====================
// 🦘 ジャンプ
// =====================
let isJumping = false;

function jump() {
  if (isJumping) return;
  isJumping = true;

  let up = 0;

  let upTimer = setInterval(() => {
    if (up < 120) {
      py -= 5;
      player.style.top = py + "px";
      up += 5;
    } else {
      clearInterval(upTimer);

      let downTimer = setInterval(() => {
        if (up > 0) {
          py += 5;
          player.style.top = py + "px";
          up -= 5;
        } else {
          clearInterval(downTimer);
          isJumping = false;
        }
      }, 10);
    }
  }, 10);
}

// =====================
// 🦠 ウイルス（ゆっくり追跡）
// =====================
let vx = 600;
let vy = 200;

setInterval(() => {

  if (vx < px) vx += 0.4;   // ←ゆっくり
  if (vx > px) vx -= 0.4;

  if (vy < py) vy += 0.3;
  if (vy > py) vy -= 0.3;

  virus.style.left = vx + "px";
  virus.style.top = vy + "px";

  // 接触
  if (Math.abs(vx - px) < 50 && Math.abs(vy - py) < 50) {
    alert("💀 やられた！");
    vx = 600;
    vy = 200;
  }

}, 20);

// =====================
// 📦 ブロック → 仲間出現
// =====================
block.addEventListener("click", () => {

  const img = document.createElement("img");

  const animals = [
    "images/gibbon.png",
    "images/peacock.png",
    "images/chabo.png",
    "images/kinkei.png"
  ];

  const r = Math.floor(Math.random() * animals.length);
  img.src = animals[r];

  img.classList.add("spawn");

  img.style.left = block.offsetLeft + "px";
  img.style.top = (block.offsetTop - 60) + "px";

  document.body.appendChild(img);

  // ⭐仲間化
  allies.push({
    el: img,
    ox: Math.random() * 80,
    oy: Math.random() * 50
  });

});

// =====================
// 🤝 仲間追従
// =====================
setInterval(() => {

  allies.forEach(a => {

    let tx = px - a.ox;
    let ty = py - a.oy;

    let cx = parseFloat(a.el.style.left) || tx;
    let cy = parseFloat(a.el.style.top) || ty;

    a.el.style.left = cx + (tx - cx) * 0.1 + "px";
    a.el.style.top = cy + (ty - cy) * 0.1 + "px";

  });

}, 20);