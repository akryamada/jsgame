// グローバル変数
let startTime;
let totalSelectedPrice = 0;
let currentPhaseIndex = 0;
const phases = ['ricePhase', 'sideDishPhase', 'soupPhase', 'sidePhase', 'leftoverPhase'];
let currentPhase;
let selectedItemIds = new Set();
let selectedItems = [];
let currentSessionItems = [];

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('startButton').addEventListener('click', function() {
    transitionScreen('startScreen', 'playScreen');
    startTime = new Date();
    currentPhaseIndex = 0;
    switchPhase();
  });

  document.getElementById('restartButton').addEventListener('click', function() {
    transitionScreen('resultScreen', 'playScreen');
    resetGame();
  });
}

function switchPhase() {
  if (currentPhase) {
    currentPhase.style.display = 'none';
  }
  if (currentPhaseIndex < phases.length) {
    currentPhase = document.getElementById(phases[currentPhaseIndex]);
    currentPhase.style.display = 'block';
    populatePhase();
    bindPhaseButtons();
  } else {
    transitionScreen('playScreen', 'resultScreen');
    showResults();
  }
}

function bindPhaseButtons() {
  let buttons = currentPhase.querySelectorAll('.foodButton');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      if (!selectedItemIds.has(this.dataset.id)) {
        totalSelectedPrice += parseInt(this.dataset.price);
        selectedItemIds.add(this.dataset.id);
        selectedItems.push({ id: this.dataset.id, name: this.textContent.split(' ')[0], price: this.dataset.price });
        this.classList.add('selected');
      }
      if (currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        switchPhase();
      } else {
        transitionScreen('playScreen', 'resultScreen');
        showResults();
      }
    });
  });
}

function populatePhase() {
  const phaseTitles = {
    'ricePhase': 'ごはんの大きさは？',
    'sideDishPhase': 'おかずを選ぼう！',
    'soupPhase': '汁物を選ぼう！',
    'sidePhase': '副菜を選ぼう！',
    'leftoverPhase': '取り残しはない？'
  };

  const items = getItemsForCurrentPhase();
  currentPhase.innerHTML = `<h2>${phaseTitles[currentPhase.id]}</h2>`;
  items.forEach(item => {
    const button = document.createElement('button');
    button.className = 'foodButton';
    button.textContent = `${item.name} ${item.price}円`;
    button.dataset.price = item.price;
    button.dataset.id = item.id;
    if (item.discounted) {
      button.classList.add('discounted');
    }
    currentPhase.appendChild(button);
  });

  if (currentPhaseIndex !== phases.length - 1) {
    const noNeedButton = document.createElement('button');
    noNeedButton.className = 'foodButton noNeed';
    noNeedButton.textContent = 'いらない';
    noNeedButton.dataset.price = 0;
    noNeedButton.dataset.id = 'noNeed';
    currentPhase.appendChild(noNeedButton);
  } else {
    const noLeftoverButton = document.createElement('button');
    noLeftoverButton.className = 'foodButton noLeftover';
    noLeftoverButton.textContent = '取り残しはない';
    noLeftoverButton.dataset.price = 0;
    noLeftoverButton.dataset.id = 'noLeftover';
    currentPhase.appendChild(noLeftoverButton);
  }
}

function getItemsForCurrentPhase() {
  switch (currentPhaseIndex) {
    case 0:
      return [
        { id: 'riceMini', name: 'ごはんミニ', price: 84 },
        { id: 'riceSmall', name: 'ごはん小', price: 105 },
        { id: 'riceMedium', name: 'ごはん中', price: 126 },
        { id: 'riceLarge', name: 'ごはん大', price: 147 },
        { id: 'riceExtraLarge', name: 'ごはん特大', price: 209 }
      ];
    case 1:
      const sideDishItems = [
        { id: 'salmonButter', name: '海老よせフライ', price: 242 },
        { id: 'beefCurry', name: 'チキンカツ柚子胡椒マヨ', price: 286 },
        { id: 'chickenLemon', name: '唐揚げ香味ソース', price: 242 },
        { id: 'codKyoto', name: 'ローストンカツごまソース', price: 286 },
        { id: 'porkGinger', name: 'ポークミンチカツ', price: 242 },
        { id: 'beefPepper', name: '麻婆豆腐', price: 286 },
        { id: 'salmonCream', name: '豚塩ちゃんこ煮', price: 286 },
        { id: 'flounderSimmered', name: 'かつおカツ甘醤油だれ', price: 242 },
        { id: 'mincedCutlet', name: '鶏と茄子の山賊炒め', price: 286 },
        { id: 'chickenTikka', name: 'ビーフシチュー', price: 286 },
        { id: 'porkBelly', name: '麻婆茄子', price: 286 },
        { id: 'chickenNanban', name: 'チキン南蛮', price: 330 },
        { id: 'beefStew', name: '白身魚南蛮タルタル', price: 242 },
        { id: 'chickenTeriyaki', name: 'ローストチキンチーズソース', price: 374 },
        { id: 'shrimpChili', name: 'ローストンカツポン酢おろし', price: 330 },
        { id: 'hamburgSteak', name: 'ハンバーグデミソース', price: 286 },
        { id: 'roastBeef', name: '豚肉塩麹炒め', price: 330 },
        { id: 'fishFry', name: '鯖味噌煮', price: 242 },
        { id: 'porkShogayaki', name: 'ねぎ塩ハンバーグ', price: 242 },
        { id: 'chickenKaraage', name: '鯖生姜煮', price: 242 }
      ];
      return getRandomItems(sideDishItems, 5); // Display 5 items for side dish phase
    case 2:
      return [
        { id: 'misoSoup', name: 'みそ汁', price: 44 },
        { id: 'eggSoup', name: 'かきたま汁', price: 44 },
        { id: 'porkSoup', name: '豚汁', price: 121 }
      ];
    case 3:
      const sideItemItems = [
        { id: 'cucumberVinegar', name: 'きゅうりの酢の物', price: 49 },
        { id: 'macaroniSalad', name: '肉じゃがコロッケ', price: 121 },
        { id: 'eggRoll', name: 'たまご焼き', price: 56 },
        { id: 'cabbageSalt', name: 'ミニサラダ', price: 55 },
        { id: 'radishGrated', name: 'ハッシュポテト', price: 121 },
        { id: 'squidSalt', name: 'オクラ巣ごもり玉子', price: 99 },
        { id: 'shirasuBasil', name: 'ポテトサラダ', price: 77 },
        { id: 'hijikiSimmer', name: 'きんぴらごぼう', price: 77 },
        { id: 'konnyakuSimmer', name: 'ほうれん草ごまナムル', price: 99 },
        { id: 'mozukuVinegar', name: 'ひじき煮', price: 77 },
        { id: 'kimchi', name: 'だし巻き', price: 77 },
        { id: 'myogaMix', name: '冷奴', price: 55 },
        { id: 'cornGrilled', name: 'スライスオクラ', price: 77 },
        { id: 'bambooTosa', name: 'そぼろきんぴらごぼう', price: 99 },
        { id: 'spinachSesame', name: 'マカロニサラダ', price: 77 },
        { id: 'potatoCodRoe', name: 'スタミナ茄子', price: 99 },
        { id: 'grilledZucchini', name: 'オマール仕立てのビスクコロッケ', price: 121 },
        { id: 'broccoliSalad', name: 'チキンフリッター', price: 152 },
        { id: 'tofuSalad', name: '蒸し鶏サラダ', price: 121 },
        { id: 'edamame', name: '南瓜コロッケ', price: 121 },
        { id: 'cucumberPickles', name: '若鶏醤油揚げ', price: 198 }
      ];
      return getRandomItems(sideItemItems, 5); // Display 5 items for side item phase
    case 4:
      return getLeftoverItems();
    default:
      return [];
  }
}

function getLeftoverItems() {
  const allItems = [
    // すべてのアイテムのリストを統合
    ...[
      { id: 'salmonButter', name: '海老よせフライ', price: 242 },
      { id: 'beefCurry', name: 'チキンカツ柚子胡椒マヨ', price: 286 },
      { id: 'chickenLemon', name: '唐揚げ香味ソース', price: 242 },
      { id: 'codKyoto', name: 'ローストンカツごまソース', price: 286 },
      { id: 'porkGinger', name: 'ポークミンチカツ', price: 242 },
      { id: 'beefPepper', name: '麻婆豆腐', price: 286 },
      { id: 'salmonCream', name: '豚塩ちゃんこ煮', price: 286 },
      { id: 'flounderSimmered', name: 'かつおカツ甘醤油だれ', price: 242 },
      { id: 'mincedCutlet', name: '鶏と茄子の山賊炒め', price: 286 },
      { id: 'chickenTikka', name: 'ビーフシチュー', price: 286 },
      { id: 'porkBelly', name: '麻婆茄子', price: 286 },
      { id: 'chickenNanban', name: 'チキン南蛮', price: 330 },
      { id: 'beefStew', name: '白身魚南蛮タルタル', price: 242 },
      { id: 'chickenTeriyaki', name: 'ローストチキンチーズソース', price: 374 },
      { id: 'shrimpChili', name: 'ローストンカツポン酢おろし', price: 330 },
      { id: 'hamburgSteak', name: 'ハンバーグデミソース', price: 286 },
      { id: 'roastBeef', name: '豚肉塩麹炒め', price: 330 },
      { id: 'fishFry', name: '鯖味噌煮', price: 242 },
      { id: 'porkShogayaki', name: 'ねぎ塩ハンバーグ', price: 242 },
      { id: 'chickenKaraage', name: '鯖生姜煮', price: 242 }
    ],
    ...[
      { id: 'cucumberVinegar', name: 'きゅうりの酢の物', price: 49 },
      { id: 'macaroniSalad', name: '肉じゃがコロッケ', price: 121 },
      { id: 'eggRoll', name: 'たまご焼き', price: 56 },
      { id: 'cabbageSalt', name: 'ミニサラダ', price: 55 },
      { id: 'radishGrated', name: 'ハッシュポテト', price: 121 },
      { id: 'squidSalt', name: 'オクラ巣ごもり玉子', price: 99 },
      { id: 'shirasuBasil', name: 'ポテトサラダ', price: 77 },
      { id: 'hijikiSimmer', name: 'きんぴらごぼう', price: 77 },
      { id: 'konnyakuSimmer', name: 'ほうれん草ごまナムル', price: 99 },
      { id: 'mozukuVinegar', name: 'ひじき煮', price: 77 },
      { id: 'kimchi', name: 'だし巻き', price: 77 },
      { id: 'myogaMix', name: '冷奴', price: 55 },
      { id: 'cornGrilled', name: 'スライスオクラ', price: 77 },
      { id: 'bambooTosa', name: 'そぼろきんぴらごぼう', price: 99 },
      { id: 'spinachSesame', name: 'マカロニサラダ', price: 77 },
      { id: 'potatoCodRoe', name: 'スタミナ茄子', price: 99 },
      { id: 'grilledZucchini', name: 'オマール仕立てのビスクコロッケ', price: 121 },
      { id: 'broccoliSalad', name: 'チキンフリッター', price: 152 },
      { id: 'tofuSalad', name: '蒸し鶏サラダ', price: 121 },
      { id: 'edamame', name: '南瓜コロッケ', price: 121 },
      { id: 'cucumberPickles', name: '若鶏醤油揚げ', price: 198 }
    ]
  ];

  // 現在のセッションで選ばれていないアイテムをフィルタリング
  const leftoverItems = allItems.filter(item => !selectedItemIds.has(item.id));
  return getRandomItems(leftoverItems, 8); // 取り残しフェーズに8つのアイテムを表示
}

function showResults() {
  const endTime = new Date();
  const playTime = (endTime - startTime) / 1000;
  const score = 650 - totalSelectedPrice;
  let resultText;

  if (score > 0) {
    resultText = `${score}円 余った`;
  } else if (score < 0) {
    resultText = `${Math.abs(score)}円 損した`;
  } else {
    resultText = `0円 ぴったり`;
  }

  // 結果表示の更新
  document.getElementById('resultScreen').innerHTML = `
    <div class="result-info">
      <p id="playTimeDisplay">掛かった時間: ${playTime.toFixed(2)}秒</p>
      <p id="scoreDisplay">${resultText}</p>
    </div>
    <h2>選択したメニュー</h2>
    <ul>${selectedItems.map(item => `<li>${item.name}</li>`).join('')}</ul>
    <button id="restartButton">リスタート</button>
  `;

  displayAdjectiveNoun(playTime, score);
  setupEventListeners(); // リスタートボタンのイベントリスナーを再設定
}

function displayAdjectiveNoun(playTime, score) {
  let timeAdjective;
  if (playTime >= 120) {
    timeAdjective = 'さっさと決めろよ';
  } else if (playTime >= 90) {
    timeAdjective = '周りは迷惑している';
  } else if (playTime >= 60) {
    timeAdjective = 'マイペースな';
  } else if (playTime >= 40) {
    timeAdjective = '周りからじろじろ見られている';
  } else if (playTime >= 20) {
    timeAdjective = 'ちょっとマイペースな';
  } else if (playTime >= 10) {
    timeAdjective = '平均的な';
  } else if (playTime >= 5) {
    timeAdjective = 'せっかちな';
  } else {
    timeAdjective = '味噌汁をこぼすタイプの';
  }

  let scoreNoun;
  if (score == 0) {
    scoreNoun = 'ますたー・おぶ・学食ていかー';
  } else if (score > 0) {
    if (score <= 10) {
      scoreNoun = '学食定期のぷろ';
    } else if (score <= 20) {
      scoreNoun = '本当はもうちょっと攻めたい人';
    } else if (score <= 40) {
      scoreNoun = '構成を組み直すべき人';
    } else if (score <= 80) {
      scoreNoun = '取り残している人';
    } else if (score <= 150) {
      scoreNoun = 'レジ混雑の原因';
    } else if (score <= 250) {
      scoreNoun = '水筒忘れ';
    } else if (score <= 450) {
      scoreNoun = '金欠の人';
    } else if (score <= 649) {
      scoreNoun = 'ダイエット中';
    } else {
      scoreNoun = '昼食抜くタイプ';
    }
  } else {
    if (score > -10) {
      scoreNoun = '実は一番がめついタイプ';
    } else if (score > -20) {
      scoreNoun = 'ちょっと欲張り';
    } else if (score > -50) {
      scoreNoun = '普通に食べ過ぎている人';
    } else if (score > -150) {
      scoreNoun = 'お金持ち';
    } else if (score > -350) {
      scoreNoun = '大金持ち(笑)';
    } else {
      scoreNoun = 'オーガスタス';
    }
  }

  const adjectiveNounElement = document.createElement('p');
  adjectiveNounElement.className = 'adjectiveNoun';
  adjectiveNounElement.textContent = `${timeAdjective} ${scoreNoun}`;
  document.getElementById('resultScreen').appendChild(adjectiveNounElement);
}

function transitionScreen(hideId, showId) {
  const hideScreen = document.getElementById(hideId);
  const showScreen = document.getElementById(showId);
  hideScreen.style.opacity = '0';
  setTimeout(() => {
    hideScreen.style.display = 'none';
    showScreen.style.display = 'block';
    showScreen.style.opacity = '1';
  }, 500);
}

function resetGame() {
  selectedItemIds.clear();
  selectedItems = [];
  totalSelectedPrice = 0;
  startTime = new Date(); // Restart the timer
  currentPhaseIndex = 0;
  switchPhase();
}

function getRandomItems(items, numItems) {
  const weightedItems = items.flatMap(item => {
    const weight = Math.max(1, Math.floor((1000 - item.price) / 10)); // 重み付けを最低1に設定し、小数点以下を切り捨て
    return Array(weight).fill(item);
  });
  const selectedItems = [];
  const selectedIds = new Set();

  while (selectedItems.length < numItems) {
    const randomItem = weightedItems[Math.floor(Math.random() * weightedItems.length)];
    if (!selectedIds.has(randomItem.id)) {
      selectedItems.push(randomItem);
      selectedIds.add(randomItem.id);
    }
  }
  return selectedItems;
}
