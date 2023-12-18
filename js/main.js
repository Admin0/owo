// Project owo (off work on-time) 
// A cat that tells you when to leave work

const time = new Time();
// time.log("init");

// 모바일에서 접속했는지 확인
const is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

tag_manager(document.querySelector("#inside_page"), 2013);
// time.log("set_tags");

// 바라보기 생성
// const st = new Stare('.cat');

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

  settingOn() {
    const s = $('#setting');
    s.style.height = !s.classList.contains('on') ? `${s.scrollHeight}px` : 0;
    s.classList.toggle('on');
    $('#setting_bt').classList.toggle('on');
  },

  resources: {
    minerals: 50,
    supplies: 0,
    suppliesMax: 12
  },
  updateResources() {
    document.querySelector('#minerals .val').textContent = this.resources.minerals;
    this.resources.supplies = cats.length;
    document.querySelector('#supplies .val').textContent = `${this.resources.supplies}/${this.resources.suppliesMax}`;
  }
}

p.work_start = p.work_start();
p.work_final = p.work_final();
p.payday = p.payday();


let IS_WEEKDAYS = new Date().getDay() != 0 && new Date().getDay() != 6 ? true : false;
let engine_timeout;


// 고양이 객체 생성
const cats = [new Cat().setSkin('우유'), new Cat(), new Cat(), new Cat(), new Cat(), new Cat(), new Cat()];

cats.forEach(cat => {
  if (S('dev_mode') == 'true') {
    cat.element.classList.add('outlined');
    cat.infoWindow.style.display = 'block';
  }
});

// 생선 객체 생성
const pisces = [];

document.addEventListener('mousedown', (event) => {
  const catElements = document.querySelectorAll('.cat, .pisces, #book, #context, footer');
  // 클릭된 요소가 고양이 객체인지 확인
  const isClickedOnCat = Array.from(catElements).some(catElement => catElement.contains(event.target));
  // 클릭된 요소가 고양이 객체가 아닌 경우에 대한 동작 && 마우스 왼쪽클릭일 경우에만
  if (!isClickedOnCat && event.button == 0) {
    const pos = {
      x: event.pageX - 64 + 64 * Math.random(),
      y: event.pageY - 86 + 64 * Math.random()
    }
    switch (S('skill')) {
      case 'cat':
        context.skill.summonCat(pos);
        break;
      case 'fish':
        context.skill.summonFish(pos);
        break;
      case 'cucumber':
        context.skill.summonCucumber(pos);
        break;
      case 'mineral':
        context.skill.summonMineral(pos);
        break;
      case 'random':
        pisces.push(new Fish(pos));
        context.setMessage('아무거나 소환했습니다.')
        break;
      case 'yarnball':
        context.skill.summonYarnball(pos);
        break;
      default:
        break;
    }

  }
});


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
  p.settingOn();
});
$('#setting input').forEach((e) => {
  e.addEventListener("change", (e) => {
    p.set('work_start', $('#setting input#work_start').value);
    p.set('work_final', $('#setting input#work_final').value);
    p.set('payday', $('#setting input#payday').value.substring(8, 10));
    p.set_push();
  });
});

p.updateResources();

document.addEventListener('mousedown', (e) => {
  e.preventDefault();
  p.updateResources();
});

const context = new Context();
context.setDevMode();
context.setSkill();
// localStorage.skill = 'undefined';

time.log('activated');