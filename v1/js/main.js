// Project owo (off work on-time) 
// A cat that tells you when to leave work

const time = new Time();
// time.log("init");

tag_manager(document.querySelector("#inside_page"), 2013);
// time.log("set_tags");

// 바라보기 생성
const st = new Stare('.cat');

// 카운트다운 생성
const cd = new Countdown()
  .setTarget('.countdown')
  .setTime(S('work_final'))
  .setOptions({ timer_head: 'h', timer_tail: 'c' })
  .start();


function $(selector) { return document.querySelectorAll(selector).length == 1 ? document.querySelector(selector) : document.querySelectorAll(selector); }
function S(key) { return localStorage.getItem(key); }
const p = {
  date: { yyyy: new Date().getFullYear(), mm: new Date().getMonth(), dd: new Date().getDate() },

  get: (para) => { return new URLSearchParams(window.location.search).get(para) },
  has: (para) => { return new URLSearchParams(window.location.search).has(para) },
  set: (para, val) => { p[para] = val; localStorage.setItem(para, val); },
  set_push: function () {
    $('#setting input#work_start').value = this.work_start;
    $('#setting input#work_final').value = this.work_final;
    $('#setting input#payday').value = `${this.date.yyyy}-${this.date.mm + 1}-${this.payday}`;
    history.pushState('', '퇴근 시간을 알려주는 고양이', `?work_start=${this.work_start}&work_final=${this.work_final}&payday=${this.payday}`);
    cd.setTime(this.work_final);
  },
  work_start: function () { return this.has('work_start') ? this.get('work_start') : S('work_start') != null ? S('work_start') : '08:30' },
  work_final: function () { return this.has('work_final') ? this.get('work_final') : S('work_final') != null ? S('work_final') : '17:30' },
  lunch_start: '12:00',
  lunch_final: '13:00',
  payday: function () { return this.has('payday') ? this.get('payday') : S('payday') != null ? S('payday') : '25' },
}

p.work_start = p.work_start();
p.work_final = p.work_final();
p.payday = p.payday();


let IS_WEEKDAYS = new Date().getDay() != 0 && new Date().getDay() != 6 ? true : false;
let engine_timeout;

function engine(p) {

  id = p.id;
  yyyy = p.date.yyyy;
  mm = p.date.mm;
  dd = p.date.dd;

  function M(n) { return Math.floor(n / 1000); }
  function D(d) { return M(d / 24 / 60 / 60); }

  const TIME__NOW = new Date().getTime();

  const TIME__WORK_START = new Date(yyyy, mm, dd, p.work_start.substring(0, 2), p.work_start.substring(3, 5)).getTime();
  const TIME__WORK_FINAL = new Date(yyyy, mm, dd, p.work_final.substring(0, 2), p.work_final.substring(3, 5)).getTime();
  const IS_BEFORE_WORK = TIME__NOW > TIME__WORK_START ? false : true;
  const IS_AFTER_WORK = TIME__NOW > TIME__WORK_FINAL ? true : false;
  const DATE__WEEKEND = new Date(yyyy, mm, dd + 6 - new Date().getDay()).getTime();
  const DATE__PAYDAY = new Date(yyyy, mm, p.payday).getTime();
  const IS_PAYDAY_COME_BEFORE_WEEKEND = TIME__NOW < DATE__PAYDAY && DATE__PAYDAY < DATE__WEEKEND ? true : false;
  // const IS_WEEKDAYS = new Date().getDay() != 0 && new Date().getDay() != 6 ? true : false;

  const hour = IS_BEFORE_WORK ? p.work_start.substring(0, 2) : p.work_final.substring(0, 2);
  const min = IS_BEFORE_WORK ? p.work_start.substring(3, 5) : p.work_final.substring(3, 5);
  const time_end = new Date(yyyy, mm, dd, hour, min).getTime();

  if (IS_WEEKDAYS) {
    $('h2 .msg').innerText = IS_BEFORE_WORK ? '출근까지 남은 시간' : !IS_AFTER_WORK ? '퇴근까지 남은 시간' : '퇴근 시간이다옹!';
    $('h2 .msg').innerText += cd.time_fragment.STD < 60 * 60 * 1000 ? '🔥' : '';
    $('h2 .dday').innerText = IS_PAYDAY_COME_BEFORE_WEEKEND ? `월급날까지 D-${D(DATE__PAYDAY - TIME__NOW) + 1}` : `주말까지 D-${D(DATE__WEEKEND - TIME__NOW) + 1}`
    $('h2 .dday').innerText += TIME__NOW > DATE__PAYDAY - 24 * 60 * 60 * 1000 ? '💰' : '';
    $('h2 .dday').innerText += D(DATE__WEEKEND - TIME__NOW) <= 0 ? '🔥' : '';
  } else {
    $('h2 .msg').innerText = '주말이다냥💖';
  }

  if (!cd.isIgnited()) {
    document.title = `OwO [ ${cd.getHours()}:${cd.getMins()}:${cd.getSecs()} ]`;
  } else {
    document.title = `UwU [ 00:00:00 ]`;
  }
  engine_timeout = setTimeout(() => engine(p), 500);
}

/**
 * SETTINGS
 */
localStorage.setItem("work_start", p.work_start);
localStorage.setItem("work_final", p.work_final);
localStorage.setItem("payday", p.payday);
$('#setting input#work_start').value = p.work_start;
$('#setting input#work_final').value = p.work_final;
$('#setting input#payday').value = `${p.date.yyyy}-${p.date.mm + 1}-${p.payday}`;

$('#setting_bt').addEventListener("click", (e) => {
  const s = $('#setting');
  s.style.height = !s.classList.contains('on') ? `${s.scrollHeight}px` : 0;
  s.classList.toggle('on');
  $('#setting_bt').classList.toggle('on');
});
$('#setting input').forEach((e) => {
  e.addEventListener("change", (e) => {
    p.set('work_start', $('#setting input#work_start').value);
    p.set('work_final', $('#setting input#work_final').value);
    p.set('payday', $('#setting input#payday').value.substring(8, 10));
    p.set_push();
  });
});

engine(p);
time.log('activated');