class Parameter {
    constructor() {
        // 로컬 스토리지에서 파라미터 값을 가져오거나 기본값으로 설정
        this.data = localStorage.data != null ? JSON.parse(localStorage.data) : {};
        this.cats = localStorage.cats != null ? JSON.parse(localStorage.cats) : null;

        // 날짜와 점심 시간 기본값 설정
        this.data.date = { yyyy: new Date().getFullYear(), mm: new Date().getMonth(), dd: new Date().getDate() };
        this.data.lunch_start = '12:00';
        this.data.lunch_final = '13:00';

        // 리소스 초기화 메서드 호출
        this.initResources();
        // URL에서 파라미터 값을 가져와 설정
        this.getParaFromURL();
    }

    // 리소스 초기화 메서드
    initResources() {
        // 자원 
        if (this.data.resources == null) { this.data.resources = { minerals: 50, supplies: 0, suppliesMax: 12 }; }

        // 통계 & 도전 과제
        if (this.data.achievement == null) { this.data.achievement = achievement.data; }
        if (this.data.dex_cats == null) { this.data.dex_cats = dex_cats; }
        if (this.data.dex_pisces == null) { this.data.dex_pisces = dex_pisces; }
        if (this.data.dex_achievement == null) { this.data.dex_achievement = dex_achievement; }
    }

    // 자원 추가, 삭제, 조작을 담당하는 객체
    resources = {
        setMinerals(val) {
            p.data.resources.minerals += val;
        },
        setSupplies(val) {
            p.data.resources.supplies += val;
        },
        setSuppliesMax(val) {
            // 최대 자원 수를 증가시키지만 200을 초과하지 않도록 설정
            const origin = p.resources.suppliesMax;
            origin = origin + val < 200 ? origin + val : 200;
        }
    }

    // URL에 파라미터 값을 설정하는 메서드
    setParaToURL(params) {
        this.data.work_start = params.work_start;
        this.data.work_final = params.work_final;
        this.data.payday = params.payday || '25';
        history.pushState('', '퇴근 시간을 알려주는 고양이', `?work_start=${this.data.work_start}&work_final=${this.data.work_final}&payday=${this.data.payday}`);
        this.setCountdownNewValue(cd);
        this.updateParameterValues();
    }

    // URL에서 파라미터 값을 가져오는 메서드
    getParaFromURL() {
        // URL에서 작업 시작, 종료 및 월급일 정보를 가져와 설정
        this.data.work_start = new URLSearchParams(window.location.search).get('work_start') || this.data.work_start || '08:30';
        this.data.work_final = new URLSearchParams(window.location.search).get('work_final') || this.data.work_final || '17:30';
        this.data.payday = new URLSearchParams(window.location.search).get('payday') || this.data.payday || '25';
    }

    setCountdownNewValue(countdownObject) {
        countdownObject.setTime(this.data.work_final);
    }

    // 파라미터 값을 업데이트하는 메서드
    updateParameterValues() {
        // 화면에 자원 값 및 공급품 정보를 업데이트하고
        document.querySelector('#minerals').textContent = this.data.resources.minerals;
        this.data.resources.supplies = cats.length;
        document.querySelector('#supplies').textContent = `${this.data.resources.supplies}/${this.data.resources.suppliesMax}`;

        // 로컬 스토리지에 저장
        localStorage.setItem('data', JSON.stringify(this.data));
        localStorage.setItem('cats', JSON.stringify(cats));

        achievement.checkAchievement();
    }

    // 이벤트를 정의해보자
    getShouldEvent() {
        events.allCatsDead();
    }
}


// 이벤트 메시지의 색을 쉽게 설정해주는 서브 이벤트 
/**
 * cat: green
 * pisces: yellow
 * vaillan: red
 * time, num: light green
 * special: pink - sky blue
 */

const events = {
    titleEvent: () => {
        const messages = [
            ``,
            `*** ${setClass('퇴근 시간을 알려주는 고양이', 'special')} ***`,
            `- Project ${setClass('OwO', 'special')} as Off Work On-time v.${p.data.achievement.version}`,
        ];

        let i = 0;
        showMessage = () => {
            context.setMessage(messages[i]);
            i++;
            if (i < messages.length) {
                setTimeout(showMessage, 1000);
            }
        }
        showMessage();
    },
    todaysHashtags: (moment = '55', tagCount = 3) => {
        if (cd.getSecs() != moment) { return }
        context
            .setMessage(``)
            .setMessage(`*** 오늘의 해시태그 ***`)
        for (let i = 0; i < tagCount; i++) { context.setMessage(`#${tag[dice(1, tag.length, -1)]}`); }
    },
    catDead: (cat) => {
        cat.hp = 0;
        cat.setMeow('Woem...');
        context
            .setMessage('')
            .setMessage(`*** ${setClass(cat.skin, cat.skin === '우유' ? 'special' : 'cat')}가 ${setClass('고양이 별', 'special')}로 떠났습니다. 
            당신은 ${setClass(cat.skin, cat.skin === '우유' ? 'special' : 'cat')}와의 추억을 오랬동안 기억할 것입니다. ***`);
        const i = cats.findIndex(target => target == cat);

        // 고양이 객체 제거
        cat.setSkin('유령');
        // cats[i].element.remove();
        cats.splice(i, 1);

        p.data.achievement.cat_dead++;
        p.updateParameterValues();

        p.getShouldEvent();
    },
    allCatsDead: () => {
        console.info(`[owo][event] allCatsDead (${p.data.resources.supplies}/${p.data.resources.suppliesMax})`);
        // 고양이들이 다 냥이별로 갔는지 체크 후 실행
        if (p.data.resources.supplies == 0) {
            console.info(`[owo][event] *** allCatsDead ***`);
            context
                .setMessage(``)
                .setMessage(`*** 모든 ${setClass(`고양이`, `cat`)}가 고양이 별로 떠났습니다 ***`)
                .setMessage(`*** ${setClass(`성좌 냥냥이`, `special`)}가 당신을 원망합니다... ***`);

            p.data.achievement.cat_dead_all++;
            p.updateParameterValues();
        }
    },
    setDex: () => {

    },
    showDex: (delay) => {
        setTimeout(() => {
            document.getElementById('dex').classList.add('on');
            document.querySelector('.pisces.dex').classList.add('down');
        }, delay);

        // 도감 통계 업데이트 <-- 랙 문제로 가끔씩만 호출되는 자리로 이동
        Object.keys(p.data.achievement).forEach(key => {
            if (document.querySelector(`.${key}`) === null) { return }
            document.querySelector(`.${key} .val`).textContent = p.data.achievement[key];
        });

        p.updateParameterValues();
    },
    hideDex: () => {
        document.getElementById('dex').classList.remove('on');
        document.querySelector('.pisces.dex').classList.remove('down');
    }

}

// 기술은 사용자가 동적으로 발생시킬 수 있는 간단한 이벤트입니다
const skills = {
    getReasonableNumbers(times = 1) {
        return Math.min(Math.floor(window.innerWidth * window.innerHeight / 33333 * times), 100 * times);
    },

    getMineralOk(cost) { return p.data.resources.minerals - cost >= 0 },
    setMineral(cost) { p.data.resources.minerals -= cost; },
    getSupplyOk() { return p.data.resources.supplies < p.data.resources.suppliesMax },

    summonCat(pos) {
        const cost = 50;
        if (this.getSupplyOk() && this.getMineralOk(cost)) {
            this.setMineral(cost);
            const cat = new Cat(pos).setMeow('Eow');
            cats.push(cat);
            context.setMessage(`${setClass(cat.skin, 'cat')}에게 간택 당했습니다.`);
            p.updateParameterValues();
        } else if (!this.getMineralOk(cost)) {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        } else {
            context.setMessage(`${setClass('보급고', 'pisces')}가 부족합니다.`);
        }
    },
    summonMassiveCats(n) {
        let i = 0
        for (i; i < n; i++) {
            if (this.summonCat() == false) {
                context.setMessage('소환을 중지합니다.');
                break;
            }
        }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonFish(pos, options) {
        const cost = 4;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('fish'));
            if (options == null || options.mute != true) context.setMessage(`${setClass('생선', 'pisces')}을 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonMassiveFishs(n) {
        let i = 0; for (i = 0; i < n; i++) {
            if (this.summonFish() == false) {
                context.setMessage('소환을 중지합니다.');
                break;
            }
        }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonCucumber(pos, options) {
        pisces.push(new Fish(pos).setType('cucumber'));
        if (options == null || options.mute != true) context.setMessage('<span class="pisces">오이</span>를 소환했습니다.');
        p.updateParameterValues();
        return this;
    },
    summonMassiveCucumbers(n) {
        let i = 0; for (i; i < n; i++) { this.summonCucumber(); }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonMineral(pos) {
        const cost = 0;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('mineral'));
            context.setMessage(`${setClass('광물', 'pisces')}을 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonMassiveMinerals(n) {
        let i = 0; for (i; i < n; i++) { this.summonMineral(); }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonYarnball(pos, options) {
        const cost = 100;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('yarnball').startSliding(options));
            if (options == null || options.mute != true) context.setMessage('<span class="pisces">털실 공</span>을 소환했습니다.');
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonMassiveYarnballs(n) {
        let i = 0;
        for (i; i < n; i++) {
            if (this.summonYarnball() == false) {
                context.setMessage('소환을 중지합니다.');
                break;
            }
        }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonWaterbottle(pos, options) {
        const cost = 2;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('waterbottle'));
            context.setMessage(`${setClass('물병', 'pisces')}을 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonWaterbottleBowlingpins(pos) {
        const quarterViewFactor = .75;
        const w = 10;
        const h = Math.sqrt(16) / 3 * w * quarterViewFactor;

        this
            // line 4th
            .summonWaterbottle({ x: pos.x - 2 * w, y: pos.y - h })
            .summonWaterbottle({ x: pos.x - 2 / 3 * w, y: pos.y - h })
            .summonWaterbottle({ x: pos.x + 2 / 3 * w, y: pos.y - h })
            .summonWaterbottle({ x: pos.x + 2 * w, y: pos.y - h })

            // line 3rd
            .summonWaterbottle({ x: pos.x - 4 / 3 * w, y: pos.y })
            .summonWaterbottle({ x: pos.x, y: pos.y })
            .summonWaterbottle({ x: pos.x + 4 / 3 * w, y: pos.y })

            // line 2nd
            .summonWaterbottle({ x: pos.x - 2 / 3 * w, y: pos.y + h })
            .summonWaterbottle({ x: pos.x + 2 / 3 * w, y: pos.y + h })

            // line 1st
            .summonWaterbottle({ x: pos.x, y: pos.y + 2 * h })

            // ball
            .summonYarnball({ x: pos.x, y: pos.y + 20 * h }, { mute: true });
    },
    summonWaterbottleDelivery(pos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }) {
        const quarterViewFactor = .75;
        const w = 12;
        const h = w * quarterViewFactor;

        const maxX = window.innerWidth - 2 * w;
        const maxY = window.innerHeight - 2 * w;
        this.pos = {
            x: Math.max(2 * w, Math.min(pos.x, maxX)),
            y: Math.max(2 * w, Math.min(pos.y, maxY))
        };

        this
            // line 4th
            .summonWaterbottle({ x: pos.x - 2 * w, y: pos.y - 2 * h })
            .summonWaterbottle({ x: pos.x - 1 * w, y: pos.y - 2 * h })
            .summonWaterbottle({ x: pos.x, y: pos.y - 2 * h })
            .summonWaterbottle({ x: pos.x + 1 * w, y: pos.y - 2 * h })
            .summonWaterbottle({ x: pos.x + 2 * w, y: pos.y - 2 * h })
            // line 3th
            .summonWaterbottle({ x: pos.x - 2 * w, y: pos.y - 1 * h })
            .summonWaterbottle({ x: pos.x - 1 * w, y: pos.y - 1 * h })
            .summonWaterbottle({ x: pos.x, y: pos.y - 1 * h })
            .summonWaterbottle({ x: pos.x + 1 * w, y: pos.y - 1 * h })
            .summonWaterbottle({ x: pos.x + 2 * w, y: pos.y - 1 * h })
            // line 2th
            .summonWaterbottle({ x: pos.x - 2 * w, y: pos.y })
            .summonWaterbottle({ x: pos.x - 1 * w, y: pos.y })
            .summonWaterbottle({ x: pos.x, y: pos.y })
            .summonWaterbottle({ x: pos.x + 1 * w, y: pos.y })
            .summonWaterbottle({ x: pos.x + 2 * w, y: pos.y })
            // line 1th
            .summonWaterbottle({ x: pos.x - 2 * w, y: pos.y + h })
            .summonWaterbottle({ x: pos.x - 1 * w, y: pos.y + h })
            .summonWaterbottle({ x: pos.x, y: pos.y + h })
            .summonWaterbottle({ x: pos.x + 1 * w, y: pos.y + h })
            .summonWaterbottle({ x: pos.x + 2 * w, y: pos.y + h });

        context.setMessage(`[냥냥택배] 주문하신 ${setClass('생수', 'pisces')}${setClass('2 L x 20 개', 'num')}, 문앞에 배송 완료 되었습니다.`)
    },
    summonMassiveYWaterbottle(n) {
        let i = 0; for (i; i < n; i++) { if (this.summonYarnball() == false) { context.setMessage('소환을 중지합니다.'); break; } }
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonRandom(pos, options = { mute: false, free: false }) {
        const cost = options.free ? 0 : 1;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos));
            if (options == null || options.mute != true) context.setMessage('<span class="pisces">아무거나</span> 소환했습니다.');
            p.updateParameterValues();
        } else {
            context.setMessage('광물이 부족합니다.');
        }
    },
    summonMassiveRandoms(n, options) {
        let i = 0;
        for (i; i < n; i++) {
            this.summonRandom(undefined, options);
        }

        if (options !== null || options.mute === true) return;

        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
        context
            .setMessage('')
            .setMessage(`(그들의 연회에 저는 그만 정신을 잃고 말았습니다 (꼴까닥))`);
    },
    clearAllPisces() {
        const i = pisces.length;
        while (pisces.length > 0) { pisces[pisces.length - 1].remove(); }
        if (i != 0) context.setMessage(`${i} 개의 물건들을 치웠습니다.`);
        else context.setMessage(`방안에 물건이 없습니다.`);
    },
    surpriseCats() {
        cats.forEach(event => {
            event.toggleMovement('surprised');
        });
        context
            .setMessage(``)
            .setMessage(`${setClass('고양이', 'cat')}들이 깜짝 놀랐습니다!`);

    },
}

// SUB FUNCTIONS

const loadElement = (element, module, callback = () => { }) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", module, true);
    xhttp.send();
    xhttp.onload = (event) => {
        element.innerHTML = event.target.responseText;
        callback();
    }
}

const setClass = (content, cls) => {
    return `<span class="${cls}">${content}</span>`
}
