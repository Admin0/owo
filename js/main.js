// Project owo (off work on-time) 
// A cat that tells you when to leave work

const time = new Time();  // 시간 객체 생성
// time.log("init");

// 모바일에서 접속했는지 확인
const is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 스크립트 로드 함수
function loadScript(src, handler) {
  const js = document.createElement('script');
  js.src = src;
  document.head.appendChild(js);
  js.onload = handler;
}

// 바라보기 생성
// const st = new Stare('.cat');

// loadScript('/js/main_parameter.js', () => {
const p = new Parameter();

// 컨텍스트 메뉴 객체 생성
const context = new Context();
context.setDevMode();

// 이동할 요소들 지정 (카운트다운 | 도감)
new Dragable(document.getElementById("dex"));
new Dragable(document.getElementById("book"));

// 카운트다운 객체 생성
const cd = new Countdown()
  .setTarget('.countdown')
  .setTime(p.val.work_final)
  .setOptions({ timer_head: 'h', timer_tail: 'c' })
  .start();


// 설정 객체 생성
settings = new Settings();

// 기본 이벤트 막기 (select 이벤트)
document.addEventListener('mousedown', (e) => {
  e.preventDefault();
  p.updateParameterValues();
});
document.addEventListener('touchend', (e) => {
  // e.preventDefault();
  p.updateParameterValues();
});


// 고양이 객체 생성
const cats = [new Cat().setSkin('우유'), new Cat(), new Cat()];
for (let i = 0; i < skills.getReasonableNumbers(.1); i++) { cats.push(new Cat()); }

cats.forEach(cat => {

});

// 생선 객체 생성
const pisces = [];

// 도감 생성
pisces.push(new Fish().setType('dex'));

const leftClick = event => {
  // 생선을 고양이에게 뺏긴 경우 이벤트 중단
  if (p.fishInterceptedByCat) return;

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
      case 'cat':
        skills.summonCat(pos);
        break;
      case 'fish':
        skills.summonFish(pos);
        break;
      case 'cucumber':
        skills.summonCucumber(pos);
        break;
      case 'mineral':
        skills.summonMineral(pos);
        break;
      case 'random':
        skills.summonRandom(pos);
        break;
      case 'yarnball':
        skills.summonYarnball(pos);
        break;
      case 'waterbottle':
        skills.summonWaterbottle(pos);
        break;
      case 'waterbottlebowling':
        skills.summonWaterbottleBowlingpins(pos);
        break;
      default:
        break;
    }
  }
}
document.addEventListener('mouseup', (event) => { leftClick(event); p.fishInterceptedByCat = false; });
document.addEventListener('touchend', (event) => { leftClick(event); p.fishInterceptedByCat = false; });

// 초기 이벤트 시작
events.titleEvent();

// 연속 이벤트 정의
setInterval(() => {
  function shouldSummonEvil() {
    const seconds = cd.getSecs();
    const validTimes = [45, 30, 15, '00'];  // 10 초 미만이면 앞에 0 붙이고 문자열로 바뀜

    return validTimes.includes(seconds);
  }

  // 오늘의 한마디
  events.todaysHashtags('55', 3);

  if (cd.isIgnited() || !shouldSummonEvil() || cats.length == 0) { return; }

  const evilList = [
    '잼민이', '헤드헌터', '월급루팡', '생계형 월급 채굴꾼', '버즈도둑놈',
    '카페인 중독자', '키보드 스매셔', '자료요청 독촉맨', '회신기한 ASAP 맨', '파티션 포스트잇 도배꾼',
    '부서폭파범(KDA 2/1/3)', '맑은 눈의 광인', '탕비실 독재자', '질문봇', '넵봇',
    '물음표 살인마', '젊은 꼰대', '책상위 서류탑 맨'
  ];
  const evil = evilList[Math.floor(Math.random() * evilList.length)];

  p.autoSummon = p.autoSummon == null ? true : p.autoSummon;
  if (!p.autoSummon) {
    context.setMessage(`급식기 전원이 꺼져있습니다.`);
    return;
  }


  // 예상되는 최대 개수 계산
  const maxFish = skills.getReasonableNumbers(2) + 10;
  context.setMessage(``);
  if (pisces.length <= maxFish) {
    skills.summonMassiveRandoms(skills.getReasonableNumbers(1 / 3) + 3, { mute: true, free: true });
    context.setMessage(`*** 자동 급식기 작동 완료 (${pisces.length}/${maxFish}) ***`);
    context.setMessage(`(사악한 <span class="villain">${evil}</span>이(가) 다른 <span class="pisces">물건</span>들도 흩뿌렸습니다.)`);
  } else {
    context.setMessage(`*** 자동 급식기 작동 실패 (${pisces.length}/${maxFish}) ***`);
    context.setMessage(`(선량한 <span class="villain">${evil}</span>이(가) 어질러진 꼴을 보고 급식기 작동을 막았습니다.)`);
  }
}, 1000);

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