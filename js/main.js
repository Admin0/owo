// Project owo (off work on-time) 
// A cat that tells you when to leave work

const time = new Time();
// time.log("init");

// 모바일에서 접속했는지 확인
const is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function loadScript(src, handler) {
  const js = document.createElement('script');
  js.src = src;
  document.head.appendChild(js);
  js.onload = handler;
}
// time.log("set_tags");

// 바라보기 생성
// const st = new Stare('.cat');

// loadScript('/js/main_parameter.js', () => {
const p = new Parameter();

// 카운트다운 생성
const cd = new Countdown()
  .setTarget('.countdown')
  .setTime(p.val.work_final)
  .setOptions({ timer_head: 'h', timer_tail: 'c' })
  .start();


// SETTINGS
settings = new Settings();

document.querySelector('#setting_bt').addEventListener("click", () => { settings.showSettings(); });
document.querySelectorAll('#settings input').forEach((event) => {
  console.log(event);
  event.addEventListener("change", (event) => {
    console.log(event);
    p.val.work_start = document.querySelector('#settings input#work_start').value;
    p.val.work_final = document.querySelector('#settings input#work_final').value;
    // p.set('payday', $('#settings input#payday').value.substring(8, 10));
    p.set_push();
    p.updateParameterValues();
  });
});


document.addEventListener('mousedown', (e) => {
  e.preventDefault();
  p.updateParameterValues();
});
document.addEventListener('touchend', (e) => {
  // e.preventDefault();
  p.updateParameterValues();
});

// });

let IS_WEEKDAYS = new Date().getDay() != 0 && new Date().getDay() != 6 ? true : false;
let engine_timeout;


// 고양이 객체 생성
// const cats = p.cats || [new Cat().setSkin('우유'), new Cat(), new Cat(), new Cat(), new Cat(), new Cat(), new Cat()];
const cats = [new Cat().setSkin('우유'), new Cat(), new Cat(), new Cat(), new Cat(), new Cat(), new Cat()];
// console.log(cats);

cats.forEach(cat => {

});

// 생선 객체 생성
const pisces = [];

const leftClick = event => {
  // {고양이 객체 = 클릭의 영향을 받지 않는 요소} 정의
  const catElements = document.querySelectorAll('.cat, .pisces, #book, #context, #context_bt, footer');
  // 클릭된 요소가 고양이 객체인지 확인
  const isClickedOnCat = Array.from(catElements).some(catElement => catElement.contains(event.target));
  // 클릭된 요소가 고양이 객체가 아닌 경우에 대한 동작 && 마우스 왼쪽클릭일 경우에만
  if (!isClickedOnCat && event.button == 0) {
    const pos = {
      x: event.pageX - 64 + 64 * Math.random(),
      y: event.pageY - 86 + 64 * Math.random()
    }
    switch (p.val.skill) {
      case 'iconcat':
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
        context.skill.summonRandom(pos);
        break;
      case 'yarnball':
        context.skill.summonYarnball(pos);
        break;
      default:
        break;
    }
  }
}
document.addEventListener('mouseup', (event) => { leftClick(event); });
document.addEventListener('touchend', (event) => { leftClick(event); });

setInterval(() => {
  function shouldSummonEvil() {
    const seconds = cd.getSecs();
    const validTimes = [45, 30, 15, '00'];  // 10 초 미만이면 앞에 0 붙이고 문자열로 바뀜

    return validTimes.includes(seconds);
  }


  if (cd.isIgnited() || !shouldSummonEvil() || cats.length == 0) { return; }

  const evilList = ['요정', '마녀', '잼민', '헤드헌터', '월급루팡', '생계형월급채굴러', '버즈도둑놈', '부서폭파범(KDA 2/1/3)'];
  const evil = evilList[Math.floor(Math.random() * evilList.length)];
  context.setMessage('');

  p.autoSummon = p.autoSummon == null ? true : p.autoSummon;
  if (!p.autoSummon) {
    context.setMessage(`*** 방 밖에서 인기척이 있었지만, 방 문을 잠궈둔 덕에 아무일도 일어나지 않았습니다. ***`);
    context.setMessage('');
    return;
  }

  // 예상되는 최대 개수 계산
  const maxFish = context.skill.getReasonableNumbers(2);

  if (pisces.length <= maxFish) {
    context.setMessage(`*** 사악한 ${evil}이(가) 방 안을 어지럽히고 도망쳤습니다! ***`);
    context.setMessage('');
    context.skill.summonMassiveRandoms(context.skill.getReasonableNumbers(1/3));
  } else {
    context.setMessage(`*** 사악한 ${evil}이(가) 방 안의 더러운 모습을 보고 혀를 내두릅니다... ***`);
    context.setMessage('');
  }
}, 1000);

// CONTEXT MENU
const context = new Context();
context.setDevMode();

document.querySelector('#context').addEventListener('load', () => {
  console.log(context);
  context.loadToasts();
});

// localStorage.skill = 'undefined';
p.updateParameterValues();

// PWA Setting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

time.log('main.js was loaded.');