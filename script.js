const LOCAL_BASE = "file:///E:/SDroiModLegacy/MagicRampageWeb/Source";


fetch("https://raw.githubusercontent.com/sdroimod/magic-rampage-inventory/refs/heads/main/items.json")
  .then(res => res.json())
  .then(items => {

    const TYPE_ORDER = {
      weapon: 0,
      armor: 1,
      artifact: 2,
      supply: 3,
      accessory: 4
    };

    items.sort((a, b) => {
      const typeDiff =
        (TYPE_ORDER[a.type] ?? 999) -
        (TYPE_ORDER[b.type] ?? 999);

      if (typeDiff !== 0) return typeDiff;
      return a.name.localeCompare(b.name);
    });

    const inventory = document.getElementById("inventory");

    items.forEach(item => {
      const slot = document.createElement("div");
      slot.className = "item-slot";

      const img = document.createElement("img");
      img.src = `${LOCAL_BASE}/${item.sprite}`;
      img.alt = item.name;

      if (item.type === "weapon") {
        img.classList.add("weapon");
      }

      img.onerror = () => {
        img.src = "sprites/placeholder.png";
      };

      slot.addEventListener("click", () => {
        openPopup(item);
      });

      slot.appendChild(img);
      inventory.appendChild(slot);
    });
  });

function openPopup(item) {
  closePopup();

  let currentLevel = 0;

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup";

  // CLOSE BUTTON
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "✕";
  closeBtn.onclick = closePopup;

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = item.name;

  const levelDiv = document.createElement("div");
  const statDiv = document.createElement("div");

  function updateStatUI() {
    levelDiv.textContent = `Level: ${currentLevel} / ${item.levelMax}`;

    if (item.type === "weapon") {
      const dmg = getStatAtLevel(
        item.stats.damage[0],
        item.stats.damage[1],
        currentLevel,
        item.levelMax
      );
      statDiv.textContent = `Damage: ${dmg}`;
    }

    if (item.type === "armor") {
      const armor = getStatAtLevel(
        item.stats.armor[0],
        item.stats.armor[1],
        currentLevel,
        item.levelMax
      );
      console.log(item.stats.armor[0],
        item.stats.armor[1],
        currentLevel,
        item.levelMax);
      statDiv.textContent = `Armor: ${armor}`;
    }
  }

  // buttons row
  const btnRow = document.createElement("div");
  btnRow.className = "btn-row";

  const downBtn = document.createElement("button");
  downBtn.textContent = "−";

  const upBtn = document.createElement("button");
  upBtn.textContent = "+";

  downBtn.onclick = () => {
    if (currentLevel > 1) {
      currentLevel--;
      updateStatUI();
    }
  };

  upBtn.onclick = () => {
    if (currentLevel < item.levelMax) {
      currentLevel++;
      updateStatUI();
    }
  };

  if (item.levelMax != 0) {
    btnRow.appendChild(downBtn);
    btnRow.appendChild(upBtn);
  }

  popup.appendChild(closeBtn);
  popup.appendChild(title);
  popup.appendChild(levelDiv);
  popup.appendChild(statDiv);
  popup.appendChild(btnRow);

  overlay.addEventListener("click", closePopup);
  popup.addEventListener("click", e => e.stopPropagation());

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  updateStatUI();
}

function closePopup() {
  const old = document.querySelector(".popup-overlay");
  if (old) old.remove();
}

/*
function openPopup(item) {
  closePopup(); // chỉ cho 1 popup

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup";

  popup.innerHTML = `
    <button class="close-btn">✕</button>
    <div class="title">${item.name}</div>
  `;
  if (item.type == "armor" || item.type == "weapon" || item.type == "artifact") {
    const elementDiv = document.createElement("div");
    elementDiv.classList.add("elementValue");
    var ele = item.element;
    if (ele == "")
      ele = "neutural";

    elementDiv.textContent = `Element: ${ele}`;
    popup.appendChild(elementDiv);
  }

  if (item.type == "armor") {
    const armorDiv = document.createElement("div");
    armorDiv.classList.add("armorValue");
    armorDiv.textContent = `Armor: ${item.stats.armor[0]}`;
    popup.appendChild(armorDiv);
  }

  if (item.type == "weapon") {
    const weaponDiv = document.createElement("div");
    weaponDiv.classList.add("damageValue");
    weaponDiv.textContent = `Damage: ${item.stats.damage[0]}`;


    popup.appendChild(weaponDiv);
  }

  const boostListDiv = document.createElement("div");
  boostListDiv.classList.add("boostList");

  Object.entries(item.boosts).forEach(([key, value]) => {
    const boostDiv = document.createElement("div");
    boostDiv.classList.add("boostValue");
    var normalizeValue = (value * 100).toFixed(0);
    var finalValue = normalizeValue;
    if (normalizeValue == 100)
      return;
    else {
        finalValue -= 100;
    }

    boostDiv.textContent = `${key} boost: ${finalValue}%`;
    boostListDiv.appendChild(boostDiv);
  });

  popup.appendChild(boostListDiv);
  // click nền → đóng
  overlay.addEventListener("click", closePopup);

  // click trong popup → không đóng
  popup.addEventListener("click", e => e.stopPropagation());

  // click nút close → đóng
  popup.querySelector(".close-btn")
    .addEventListener("click", closePopup);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

function closePopup() {
  const old = document.querySelector(".popup-overlay");
  if (old) old.remove();
}
*/
function getStatAtLevel(base, max, level, levelMax) {
  if (level <= 0 || levelMax <= 0) return base;
  return Math.round(base + ((max - base) / levelMax) * level);
}
