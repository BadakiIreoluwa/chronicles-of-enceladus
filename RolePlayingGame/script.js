// Initialize Elements and Variables
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
const weapons = [
  {
    name: "stick",
    power: 5
  },
  {
    name: "shortsword",
    power: 10
  },
  {
    name: "Thunderstrike Warhammer",
    power: 20
  },
  {
    name: "Voidreaper GreatSword",
    power: 50
  }
];
const monsters = [
  {
    name: "stalker",
    level: 2,
    health: 15
  },
  {
    name: "arcane golem",
    level: 8,
    health: 70
  },
  {
    name: "Voidlord Magath",
    level: 20,
    health: 300
  }
]

//Array holding text content and functions of every location
const locations = [
  {
    name: "town square",
    "button text": ["Go to the Emporium", "Go to the Haunted Forest", "Fight Voidlord Magath"],
    "button functions": [goEmporium, goForest, fightMagath],
    text: "You return to the town square. A grand sign reads \"The Enceladus Emporium\"."
  },
  {
    name: "emporium",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store. You are greeted by an array of powerful weapons and magical supplies."
  },
  {
    name: "forest",
    "button text": ["Fight stalker", "Fight arcane golem", "Go to town square"],
    "button functions": [fightStalker, fightGolem, goTown],
    text: "You enter the haunted forest. The distant howls of unseen creatures fill the air."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Retreat"],
    "button functions": [attack, dodge, goTown],
    text: "You are engaged in battle with a monster."
  },
  {
    name: "defeat monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, goTown],
    text: "The monster fades into a pile of ash and gold from travelers it has consumed. You gain XP."
  },
  {
    name: "lose",
    "button text": ["???RESTART???", "???RESTART???", "???RESTART???"],
    "button functions": [restart, restart, restart],
    text: "Your mortal shell has perished in battle. Your bravery has not gone unnoticed. We grant you another chance to continue your quest." 
  },
  {
    name: "win",
    "button text": ["???RESTART???", "GitHub", "Manual"],
    "button functions": [restart, goGithub, goManual],
    text: "By your hand, Voidlord Magath was vanquished, and Enceladus has been freed from the creatures of the void."
  }
]

//Initialize Buttons
button1.onclick = goEmporium;
button2.onclick = goForest;
button3.onclick = fightMagath;

//update function to change text and buttons based on current location
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() { update(locations[0]); }

function goEmporium() { update(locations[1]); }

function goForest() { update(locations[2]); }

function goFight() { 
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    text.innerText = "You buy a small health potion.";
  } else {
    text.innerText = "You do not have enough gold to buy this item.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      currentWeapon++;
      gold -= 30;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      inventory.push(newWeapon);
      text.innerText = `You purchased a ${newWeapon}.\n`;
    } else {
      text.innerText = "You do not have enough gold to buy this item.\n";
    }
  } else {
    text.innerText = "You have already purchased the Voidreaper Greatsword! No greater weapon exist in all the land.\n"
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
    text.innerText += `Inventory: ${inventory}.`; 
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let soldWeapon = inventory.shift();
    text.innerText = `You sold your ${soldWeapon}.\nInventory: ${inventory}.`;
  } else {
    text.innerText = "You'll need that to defeat the creatures of the void.";
  }
}

function fightStalker() {
  fighting = 0;
  goFight();
} 

function fightGolem() {
  fighting = 1;
  goFight();
}

function fightMagath() {
  fighting = 2;
  goFight();
}

function attack() {
  text.innerText = `The ${monsters[fighting].name} attacks.`;
  health -= getMonsterAttack(monsters[fighting].level);
  healthText.innerText = health;
  if (health <= 0) {
    lose(); 
  } else {
    text.innerText += `\nYou fight back with your ${weapons[currentWeapon].name}.`;
    if (isMonsterHit()) {
    // Math.floor(Math.random() * y) + x generates a pseudo-random integer from x to y
      monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
      text.innerText += "\nYou miss.";
    }
    monsterHealthText.innerText = monsterHealth;
    if (monsterHealth <= 0) {
      if (fighting === 2) {
        winGame();
      } else {
        defeatMonster();
      }
    }
  }
}

function getMonsterAttack(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() < (.625 * (xp+1));
}

function dodge() {
  text.innerText = `The ${monsters[fighting].name} attacks.\nYou dodge the attack and take no damage`; 
}

function lose() { update(locations[5]); }

function winGame() { update(locations[6]); }

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += (monsters[fighting].level)/2;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function goGithub() { window.open("https://github.com/BadakiIreoluwa/chronicles-of-enceladus", "_blank"); }

function goManual() { window.open("about::blank", "_blank"); }
