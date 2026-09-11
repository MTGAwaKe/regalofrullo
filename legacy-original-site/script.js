/* ============ Utilities ============ */
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ============ Starfield ============ */
(function initStars(){
  const starsEl = document.getElementById('stars');
  for(let i=0;i<50;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.animationDelay = (Math.random()*3)+'s';
    starsEl.appendChild(s);
  }
})();

/* ============ Ambient background icons ============ */
(function initAmbient(){
  const positions = [
    {top:'6%', left:'4%', rot:'-8deg'},
    {top:'72%', left:'80%', rot:'10deg'},
    {top:'38%', left:'88%', rot:'-6deg'},
    {top:'85%', left:'8%', rot:'7deg'}
  ];
  document.querySelectorAll('.ambient').forEach(el=>{
    const icons = (el.dataset.icons || '').split(',').map(s=>s.trim()).filter(Boolean);
    icons.forEach((icon,i)=>{
      const pos = positions[i % positions.length];
      const span = document.createElement('span');
      span.textContent = icon;
      span.style.top = pos.top;
      span.style.left = pos.left;
      span.style.transform = 'rotate('+pos.rot+')';
      el.appendChild(span);
    });
  });
})();

/* ============ Inventory / piece reward system ============ */
const TOTAL_PIECES = 10;
const inventoryGrid = document.getElementById('inventoryGrid');
for(let i=1;i<=TOTAL_PIECES;i++){
  const slot = document.createElement('div');
  slot.className = 'inv-slot';
  slot.id = 'inv'+i;
  slot.textContent = '?';
  inventoryGrid.appendChild(slot);
}
function fillInventory(n, icon, message){
  const slot = document.getElementById('inv'+n);
  if(slot){
    slot.textContent = icon;
    slot.classList.add('filled','pop');
  }
  showReward(message);
}
function showReward(message){
  const t = document.getElementById('rewardToast');
  t.textContent = message;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1700);
}

/* ============ Screen navigation ============ */
function goTo(n){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelector('.screen[data-screen="'+n+'"]').classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  if(n===10) runFinalSequence();
}
document.getElementById('startBtn').addEventListener('click', ()=>goTo(1));

/* ============ LEVEL 1: Maze (33) ============ */
const mazeLayout = [
  [1,1,1,1,1,0,0],
  [0,1,1,0,1,1,1],
  [1,1,1,1,1,0,1],
  [1,0,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [0,0,0,0,1,0,0],
  [0,0,0,1,1,1,1]
];
const mazeStart = {r:0,c:0};
const mazeGoal = {r:6,c:6};
let mazePos = {...mazeStart};
const mazeGridEl = document.getElementById('mazeGrid');

function renderMaze(){
  mazeGridEl.style.gridTemplateColumns = 'repeat('+mazeLayout[0].length+', minmax(28px, 42px))';
  mazeGridEl.innerHTML = '';
  for(let r=0;r<mazeLayout.length;r++){
    for(let c=0;c<mazeLayout[0].length;c++){
      const cell = document.createElement('div');
      const isOpen = mazeLayout[r][c]===1;
      cell.className = 'maze-cell ' + (isOpen ? 'open' : 'wall');
      if(isOpen && r===mazeGoal.r && c===mazeGoal.c){
        cell.classList.add('goal');
        cell.textContent = '33';
      }
      if(r===mazePos.r && c===mazePos.c){
        cell.classList.add('player');
        cell.textContent = '';
      }
      mazeGridEl.appendChild(cell);
    }
  }
}
function moveMaze(dr,dc){
  const nr = mazePos.r+dr, nc = mazePos.c+dc;
  if(nr<0||nc<0||nr>=mazeLayout.length||nc>=mazeLayout[0].length) return;
  if(mazeLayout[nr][nc]!==1) return;
  mazePos = {r:nr, c:nc};
  renderMaze();
  if(mazePos.r===mazeGoal.r && mazePos.c===mazeGoal.c){
    const fb = document.getElementById('fb1');
    fb.textContent = 'Ce l\'hai fatta: 33, un anno bellissimo tutto da vivere.';
    fb.className = 'feedback ok';
    fillInventory(1, 'ðŸ”©', 'Hai raccolto: un bullone.');
    setTimeout(()=>goTo(2), 1200);
  }
}
document.querySelectorAll('.maze-controls button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    moveMaze(parseInt(btn.dataset.dr), parseInt(btn.dataset.dc));
  });
});
document.addEventListener('keydown', (e)=>{
  if(!document.querySelector('.screen[data-screen="1"]').classList.contains('active')) return;
  if(e.key==='ArrowUp') moveMaze(-1,0);
  if(e.key==='ArrowDown') moveMaze(1,0);
  if(e.key==='ArrowLeft') moveMaze(0,-1);
  if(e.key==='ArrowRight') moveMaze(0,1);
});
renderMaze();

/* ============ LEVEL 2: Memorize & find (Puglia) ============ */
const seekTargetsList = ['â˜€ï¸','ðŸŒŠ','ðŸ«’','ðŸš'];
const seekDecoys = ['ðŸŒŸ','ðŸ‹','ðŸ¦‹','ðŸƒ','ðŸ‡','ðŸŒ¸','ðŸª¨','ðŸŠ','ðŸŒ´','ðŸ¦€','ðŸ•Šï¸','ðŸŒ¼','ðŸ§­','ðŸ¯','ðŸŒ','ðŸ‰','ðŸŒ¾','ðŸ','ðŸ„','ðŸŒ™'];
const SEEK_MAX_MISTAKES = 4;
let seekFound = new Set();
let seekMistakes = 0;
let seekCellsContent = [];
let seekPhase = 'memorize';

function renderLives(){
  const el = document.getElementById('seekLives');
  const remaining = SEEK_MAX_MISTAKES - seekMistakes;
  el.textContent = 'ðŸ”©'.repeat(Math.max(remaining,0)) + 'âšª'.repeat(Math.min(seekMistakes, SEEK_MAX_MISTAKES));
}

function buildSeek(){
  const targetsBar = document.getElementById('seekTargets');
  targetsBar.innerHTML = '';
  seekTargetsList.forEach(icon=>{
    const d = document.createElement('div');
    d.className = 'seek-target';
    d.textContent = icon;
    d.dataset.icon = icon;
    targetsBar.appendChild(d);
  });
  seekFound = new Set();
  seekMistakes = 0;
  seekPhase = 'memorize';
  renderLives();

  const totalCells = 24;
  const pool = shuffle([...seekDecoys]).slice(0, totalCells - seekTargetsList.length);
  seekCellsContent = shuffle([...seekTargetsList, ...pool]);

  const grid = document.getElementById('seekGrid');
  grid.innerHTML = '';
  seekCellsContent.forEach(icon=>{
    const cell = document.createElement('div');
    cell.className = 'seek-cell memorize' + (seekTargetsList.includes(icon) ? ' is-target-preview' : '');
    cell.dataset.icon = icon;
    cell.textContent = icon;
    grid.appendChild(cell);
  });

  const status = document.getElementById('seekStatus');
  let countdown = 3;
  status.textContent = 'Memorizza dove sono... ' + countdown;
  const timer = setInterval(()=>{
    countdown--;
    if(countdown>0){
      status.textContent = 'Memorizza dove sono... ' + countdown;
    } else {
      clearInterval(timer);
      startSeekPlay();
    }
  }, 900);
}

function startSeekPlay(){
  seekPhase = 'play';
  const status = document.getElementById('seekStatus');
  status.textContent = 'Ora tocca a te: trova i 4 simboli!';
  const grid = document.getElementById('seekGrid');
  grid.innerHTML = '';
  seekCellsContent.forEach(icon=>{
    const cell = document.createElement('div');
    cell.className = 'seek-cell';
    cell.dataset.icon = icon;
    cell.textContent = 'â”';
    cell.addEventListener('click', ()=>revealSeekCell(cell));
    grid.appendChild(cell);
  });
}

function revealSeekCell(cell){
  if(seekPhase!=='play' || cell.classList.contains('revealed')) return;
  const icon = cell.dataset.icon;
  const isTarget = seekTargetsList.includes(icon);

  if(isTarget){
    cell.classList.add('revealed','is-target');
    cell.textContent = icon;
    seekFound.add(icon);
    document.querySelectorAll('.seek-target').forEach(b=>{
      if(b.dataset.icon===icon) b.classList.add('found');
    });
    if(seekFound.size===seekTargetsList.length){
      const fb = document.getElementById('fb2');
      fb.textContent = 'Trovati tutti: sole, mare, ulivi e conchiglie. La Puglia dei tuoi 33 anni.';
      fb.className = 'feedback ok';
      fillInventory(2, 'ðŸ”§', 'Hai raccolto: un cacciavite.');
      seekPhase = 'done';
      document.getElementById('seekStatus').textContent = '';
      setTimeout(()=>goTo(3), 1300);
    }
  } else {
    cell.classList.add('revealed','is-decoy');
    cell.textContent = icon;
    seekMistakes++;
    renderLives();
    const fb = document.getElementById('fb2');
    if(seekMistakes >= SEEK_MAX_MISTAKES){
      fb.textContent = 'Troppi tentativi a vuoto: rimescolo tutto, riprova a memorizzare!';
      fb.className = 'feedback err';
      setTimeout(buildSeek, 1200);
    } else {
      fb.textContent = 'Non era quello... ricontrolla la memoria.';
      fb.className = 'feedback err';
      setTimeout(()=>{
        if(seekPhase==='play'){
          cell.classList.remove('revealed','is-decoy');
          cell.textContent = 'â”';
        }
      }, 650);
    }
  }
}
buildSeek();

/* ============ Generic sentence-order engine ============ */
function makeSentenceGame(opts){
  const { words, bankId, buildId, feedbackId, resetKey, successMsg, pieceNum, pieceIcon, pieceLabel, nextScreen } = opts;
  let order = [];
  function build(){
    const bank = document.getElementById(bankId);
    const buildEl = document.getElementById(buildId);
    bank.innerHTML = ''; buildEl.innerHTML = '';
    order = [];
    const shuffled = shuffle(words.map((w,i)=>({w,i})));
    shuffled.forEach(item=>{
      const chip = document.createElement('div');
      chip.className = 'word-chip';
      chip.textContent = item.w;
      chip.addEventListener('click', ()=>{
        chip.classList.add('used');
        order.push(item.i);
        const placed = document.createElement('div');
        placed.className = 'word-chip';
        placed.textContent = item.w;
        buildEl.appendChild(placed);
        check();
      });
      bank.appendChild(chip);
    });
  }
  function reset(){
    build();
    const fb = document.getElementById(feedbackId);
    fb.textContent = ''; fb.className = 'feedback';
  }
  function check(){
    if(order.length < words.length) return;
    const fb = document.getElementById(feedbackId);
    const correct = order.every((v,i)=>v===i);
    if(correct){
      fb.textContent = successMsg;
      fb.className = 'feedback ok';
      fillInventory(pieceNum, pieceIcon, 'Hai raccolto: ' + pieceLabel + '.');
      setTimeout(()=>goTo(nextScreen), 1300);
    } else {
      fb.textContent = 'L\'ordine non Ã¨ giusto, riprova!';
      fb.className = 'feedback err';
      setTimeout(reset, 800);
    }
  }
  document.querySelectorAll('[data-reset="'+resetKey+'"]').forEach(btn=>{
    btn.addEventListener('click', reset);
  });
  build();
}

/* LEVEL 3: Grotta del Soffio */
makeSentenceGame({
  words: ["La","visita","della","Grotta","del","Soffio,","mai","fatta."],
  bankId: 'wordBank3', buildId: 'sentenceBuild3', feedbackId: 'fb3', resetKey: '3',
  successMsg: 'Esatto. Quella grotta ce la siamo persa... per questa volta.',
  pieceNum: 3, pieceIcon: 'ðŸ”—', pieceLabel: 'un anello di catena', nextScreen: 4
});

/* LEVEL 9: Irlanda */
makeSentenceGame({
  words: ["Ti","amo","da","matti,","come","l'erba","d'Irlanda:","sempre","verde."],
  bankId: 'wordBank9', buildId: 'sentenceBuild9', feedbackId: 'fb9', resetKey: '9',
  successMsg: 'Sempre. Ultimo indizio raccolto.',
  pieceNum: 9, pieceIcon: 'ðŸª‘', pieceLabel: 'un sedile', nextScreen: 10
});

/* ============ LEVEL 4: Memory ============ */
const memIcons = ['ðŸ’™','â­','ðŸŒº','ðŸ“š','â˜•','ðŸŒ™','ðŸŽˆ','ðŸ’Œ'];
let flipped = [];
let matchedCount = 0;
let lockBoard = false;
function buildMemory(){
  const grid = document.getElementById('memGrid');
  grid.innerHTML = '';
  const cards = shuffle([...memIcons, ...memIcons]);
  cards.forEach(icon=>{
    const c = document.createElement('div');
    c.className = 'card-mem';
    c.dataset.icon = icon;
    c.innerHTML = '<span class="back">?</span><span class="face">'+icon+'</span>';
    c.addEventListener('click', ()=>flipCard(c));
    grid.appendChild(c);
  });
}
function flipCard(c){
  if(lockBoard || c.classList.contains('flipped') || c.classList.contains('matched')) return;
  c.classList.add('flipped');
  flipped.push(c);
  if(flipped.length===2){
    lockBoard = true;
    const [a,b] = flipped;
    if(a.dataset.icon===b.dataset.icon){
      a.classList.add('matched'); b.classList.add('matched');
      matchedCount++;
      flipped = [];
      lockBoard = false;
      if(matchedCount===memIcons.length){
        const fb = document.getElementById('fb4');
        fb.textContent = 'Tutte le coppie trovate. Sono davvero orgoglioso di te: studi e lavori con una grinta pazzesca, ogni giorno.';
        fb.className = 'feedback ok';
        fillInventory(4, 'âš™ï¸', 'Hai raccolto: un ingranaggio.');
        setTimeout(()=>goTo(5), 1500);
      }
    } else {
      setTimeout(()=>{
        a.classList.remove('flipped'); b.classList.remove('flipped');
        flipped = []; lockBoard = false;
      }, 700);
    }
  }
}
buildMemory();

/* ============ Generic quiz engine ============ */
function makeQuiz(opts){
  const { containerId, options, feedbackId, pieceNum, pieceIcon, pieceLabel, successMsg, nextScreen } = opts;
  const container = document.getElementById(containerId);
  options.forEach(opt=>{
    const b = document.createElement('button');
    b.className = 'opt';
    b.textContent = opt.text;
    b.addEventListener('click', ()=>{
      const fb = document.getElementById(feedbackId);
      if(opt.correct){
        b.classList.add('correct');
        fb.textContent = successMsg;
        fb.className = 'feedback ok';
        fillInventory(pieceNum, pieceIcon, 'Hai raccolto: ' + pieceLabel + '.');
        container.querySelectorAll('.opt').forEach(o=>o.disabled = true);
        setTimeout(()=>goTo(nextScreen), 1300);
      } else {
        b.classList.add('wrong');
        fb.textContent = 'Non proprio... pensaci ancora.';
        fb.className = 'feedback err';
        setTimeout(()=>b.classList.remove('wrong'), 500);
      }
    });
    container.appendChild(b);
  });
}

/* LEVEL 5: Argentina */
makeQuiz({
  containerId: 'quizOpts5',
  options: [
    {text: '"Aculatado"', correct: true},
    {text: '"De culo"', correct: false},
    {text: '"Deculato"', correct: false},
    {text: '"Culatado"', correct: false},
  ],
  feedbackId: 'fb5',
  successMsg: 'Esatto: sempre e solo "aculatado". Ancora oggi ce lo ricordiamo.',
  pieceNum: 5, pieceIcon: 'ðŸ§²', pieceLabel: 'una leva', nextScreen: 6
});

/* LEVEL 6: Brasile / YemanjÃ¡ */
makeQuiz({
  containerId: 'quizOpts6',
  options: [
    {text: 'In cima a una montagna', correct: false},
    {text: 'Sul mare, tra i banchetti dei pescatori', correct: true},
    {text: 'Dentro un centro commerciale', correct: false},
  ],
  feedbackId: 'fb6',
  successMsg: 'Esatto: quel santuario sul mare, col profumo di pesce fresco tutt\'intorno.',
  pieceNum: 6, pieceIcon: 'ðŸªœ', pieceLabel: 'un piolo di scaletta', nextScreen: 7
});

/* LEVEL 8: Audi */
makeQuiz({
  containerId: 'quizOpts8',
  options: [
    {text: 'La simpatia', correct: false},
    {text: 'La sinceritÃ ', correct: false},
    {text: "L'Audi", correct: true},
  ],
  feedbackId: 'fb8',
  successMsg: 'Esatto. Non Ã¨ la risposta piÃ¹ romantica del mondo, ma Ã¨ quella vera.',
  pieceNum: 8, pieceIcon: 'ðŸ›¤ï¸', pieceLabel: 'un pezzo di binario', nextScreen: 9
});

/* ============ LEVEL 7: Slider puzzle (couscous) ============ */
const sliderTarget = ['ðŸš','ðŸ¥£','ðŸ¥¬','ðŸŒ°','ðŸ‘',''];
const sliderNames = {'ðŸš':'cous cous','ðŸ¥£':'ceci','ðŸ¥¬':'spinacini','ðŸŒ°':'pistacchi','ðŸ‘':'albicocche'};
let sliderState = [];
let sliderEmptyIdx = 5;

function renderSliderTarget(){
  const el = document.getElementById('sliderTarget');
  if(!el) return;
  el.innerHTML = '';
  sliderTarget.filter(v=>v!=='').forEach(icon=>{
    const item = document.createElement('div');
    item.className = 'st-item';
    item.innerHTML = '<span>'+icon+'</span><span class="lbl">'+sliderNames[icon]+'</span>';
    el.appendChild(item);
  });
}

function sliderNeighbors(idx){
  const row = Math.floor(idx/3), col = idx%3;
  const n = [];
  if(row>0) n.push(idx-3);
  if(row<1) n.push(idx+3);
  if(col>0) n.push(idx-1);
  if(col<2) n.push(idx+1);
  return n;
}
function shuffleSlider(){
  sliderState = [...sliderTarget];
  sliderEmptyIdx = sliderState.indexOf('');
  for(let i=0;i<60;i++){
    const neighbors = sliderNeighbors(sliderEmptyIdx);
    const pick = neighbors[Math.floor(Math.random()*neighbors.length)];
    [sliderState[sliderEmptyIdx], sliderState[pick]] = [sliderState[pick], sliderState[sliderEmptyIdx]];
    sliderEmptyIdx = pick;
  }
  // avoid an already-solved shuffle
  if(sliderState.join('')===sliderTarget.join('')){
    shuffleSlider();
  }
}
function renderSlider(){
  const grid = document.getElementById('sliderGrid');
  grid.innerHTML = '';
  sliderState.forEach((val,idx)=>{
    const tile = document.createElement('div');
    tile.className = 'slider-tile' + (val==='' ? ' empty' : '');
    if(val!==''){
      tile.innerHTML = '<span>'+val+'</span><span class="lbl">'+sliderNames[val]+'</span>';
      tile.addEventListener('click', ()=>trySlide(idx));
    }
    grid.appendChild(tile);
  });
}
function trySlide(idx){
  const neighbors = sliderNeighbors(idx);
  if(!neighbors.includes(sliderEmptyIdx)) return;
  [sliderState[idx], sliderState[sliderEmptyIdx]] = [sliderState[sliderEmptyIdx], sliderState[idx]];
  sliderEmptyIdx = idx;
  renderSlider();
  if(sliderState.join('')===sliderTarget.join('')){
    const fb = document.getElementById('fb7');
    fb.textContent = 'Perfetto: ceci, spinacini, pistacchi e albicocche. Il tuo piatto del cuore.';
    fb.className = 'feedback ok';
    fillInventory(7, 'ðŸ”º', 'Hai raccolto: una trave.');
    document.querySelectorAll('.slider-tile').forEach(t=>t.replaceWith(t.cloneNode(true)));
    setTimeout(()=>goTo(8), 1300);
  }
}
renderSliderTarget();
shuffleSlider();
renderSlider();

/* ============ Final reveal sequence ============ */
let finalSequenceRun = false;
function runFinalSequence(){
  if(finalSequenceRun) return;
  finalSequenceRun = true;
  setTimeout(()=>{
    fillInventory(10, 'ðŸŽ ', 'Hai raccolto: un vagone.');
  }, 400);
  setTimeout(()=>{
    document.getElementById('assemblyStage').classList.add('revealed');
  }, 1400);
  setTimeout(()=>{
    document.getElementById('ticketCard').classList.add('revealed');
    fireConfetti();
  }, 2400);
}

/* ============ Confetti ============ */
function fireConfetti(){
  const layer = document.getElementById('confettiLayer');
  const colors = ['#F2B705','#FF4FA3','#3FE0D0','#FFF8ED'];
  for(let i=0;i<70;i++){
    const c = document.createElement('span');
    c.style.left = Math.random()*100+'%';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration = (2.2+Math.random()*1.8)+'s';
    c.style.animationDelay = (Math.random()*0.5)+'s';
    c.style.transform = 'rotate('+(Math.random()*360)+'deg)';
    layer.appendChild(c);
    setTimeout(()=>c.remove(), 4500);
  }
}
document.getElementById('confettiBtn').addEventListener('click', fireConfetti);