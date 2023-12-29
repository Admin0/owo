class Parameter {
    constructor() {
        // 로컬 스토리지에서 파라미터 값을 가져오거나 기본값으로 설정
        this.val = localStorage.val != null ? JSON.parse(localStorage.val) : {};
        this.cats = localStorage.cats != null ? JSON.parse(localStorage.cats) : null;

        // 날짜와 점심 시간 기본값 설정
        this.val.date = { yyyy: new Date().getFullYear(), mm: new Date().getMonth(), dd: new Date().getDate() };
        this.val.lunch_start = '12:00';
        this.val.lunch_final = '13:00';

        // 리소스 초기화 메서드 호출
        this.initResources();
        // URL에서 파라미터 값을 가져와 설정
        this.getParaFromURL();
    }

    // 리소스 초기화 메서드
    initResources() {
        if (this.val.resources == null) {
            this.val.resources = { minerals: 50, supplies: 0, suppliesMax: 12 };
        }
    }

    // 자원 추가, 삭제, 조작을 담당하는 객체
    resources = {
        setMinerals(val) {
            p.val.resources.minerals += val;
        },
        setSupplies(val) {
            p.val.resources.supplies += val;
        },
        setSuppliesMax(val) {
            // 최대 자원 수를 증가시키지만 200을 초과하지 않도록 설정
            const origin = p.resources.suppliesMax;
            origin = origin + val < 200 ? origin + val : 200;
        }
    }

    // URL에 파라미터 값을 설정하는 메서드
    setParaToURL(params) {
        this.val.work_start = params.work_start;
        this.val.work_final = params.work_final;
        this.val.payday = params.payday || '25';
        history.pushState('', '퇴근 시간을 알려주는 고양이', `?work_start=${this.val.work_start}&work_final=${this.val.work_final}&payday=${this.val.payday}`);
        this.setCountdownNewValue(cd);
        this.updateParameterValues();
    }

    // URL에서 파라미터 값을 가져오는 메서드
    getParaFromURL() {
        // URL에서 작업 시작, 종료 및 월급일 정보를 가져와 설정
        this.val.work_start = new URLSearchParams(window.location.search).get('work_start') || this.val.work_start || '08:30';
        this.val.work_final = new URLSearchParams(window.location.search).get('work_final') || this.val.work_final || '17:30';
        this.val.payday = new URLSearchParams(window.location.search).get('payday') || this.val.payday || '25';
    }

    setCountdownNewValue(countdownObject) {
        countdownObject.setTime(this.val.work_final);
    }

    // 파라미터 값을 업데이트하는 메서드
    updateParameterValues() {
        // 화면에 자원 값 및 공급품 정보를 업데이트하고
        document.querySelector('#minerals').textContent = this.val.resources.minerals;
        this.val.resources.supplies = cats.length;
        document.querySelector('#supplies').textContent = `${this.val.resources.supplies}/${this.val.resources.suppliesMax}`;

        // 로컬 스토리지에 저장
        localStorage.setItem('val', JSON.stringify(this.val));
        localStorage.setItem('cats', JSON.stringify(cats));
    }

    // 이벤트를 정의해보자
    getShouldEvent() {
        events.allCatsDead();
    }
}

const events = {
    titleEvent: () => {
        const messages = [
            '***********************************',
            '*** 퇴근 시간을 알려주는 고양이 ***',
            '*** owo: Off Work On-time v.2.2 ***',
            '***********************************',
            '',
            '*** 오늘의 해시태그 ***',
            `#${tag[dice(1, tag.length, -1)]}`,
            `#${tag[dice(1, tag.length, -1)]}`,
            `#${tag[dice(1, tag.length, -1)]}`
        ];

        let i = 0;
        showMessage = () => {
            context.setMessage(messages[i]);
            i++;
            if (i < messages.length) { 
                setTimeout(showMessage, 1000); 
            } else {
                isOnTitleEvent = false;
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
    allCatsDead: () => {
        console.info(`[owo][event] allCatsDead (${p.val.resources.supplies}/${p.val.resources.suppliesMax})`);
        if (p.val.resources.supplies == 0) {
            console.info(`[owo][event] *** allCatsDead ***`);
            context
                .setMessage('')
                .setMessage('*** 모든 고양이가 고양이 별로 떠났습니다 ***')
                .setMessage('*** 성좌 냥냥이가 당신을 원망합니다... ***')
        }
    },
    test: () => {
        console.log('test');
    }

}

const skills = {
    getReasonableNumbers(times = 1) {
        return Math.min(Math.floor(window.innerWidth * window.innerHeight / 33333 * times), 100 * times);
    },

    getMineralOk(cost) { return p.val.resources.minerals - cost >= 0 },
    setMineral(cost) { p.val.resources.minerals -= cost; },
    getSupplyOk() { return p.val.resources.supplies < p.val.resources.suppliesMax },

    summonCat(pos) {
        const cost = 50;
        if (this.getSupplyOk() && this.getMineralOk(cost)) {
            this.setMineral(cost);
            const cat = new Cat(pos).setMeow('Eow');
            cats.push(cat);
            context.setMessage(`${cat.skin}에게 간택 당했습니다.`);
            p.updateParameterValues();
        } else if (!this.getMineralOk(cost)) {
            context.setMessage('광물이 부족합니다.');
        } else {
            context.setMessage('보급고가 부족합니다.');
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
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonFish(pos, options) {
        const cost = 4;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('fish'));
            if (options == null || options.mute != true) context.setMessage('생선을 소환했습니다.');
            p.updateParameterValues();
        } else {
            context.setMessage('광물이 부족합니다.');
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
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonCucumber(pos, options) {
        pisces.push(new Fish(pos).setType('cucumber'));
        if (options == null || options.mute != true) context.setMessage('오이를 소환했습니다.');
        p.updateParameterValues();
        return this;
    },
    summonMassiveCucumbers(n) {
        let i = 0; for (i; i < n; i++) { this.summonCucumber(); }
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonMineral(pos) {
        const cost = 0;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('mineral'));
            context.setMessage('광물을 소환했습니다.');
            p.updateParameterValues();
        } else {
            context.setMessage('광물이 부족합니다.');
        }
        return this;
    },
    summonMassiveMinerals(n) {
        let i = 0; for (i; i < n; i++) { this.summonMineral(); }
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonYarnball(pos, options) {
        const cost = 100;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('yarnball').startSliding(options));
            if (options == null || options.mute != true) context.setMessage('털실 공을 소환했습니다.');
            p.updateParameterValues();
        } else {
            context.setMessage('광물이 부족합니다.');
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
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonWaterbottle(pos) {
        const cost = 2;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos).setType('waterbottle'));
            context.setMessage('물병을 소환했습니다.');
            p.updateParameterValues();
        } else {
            context.setMessage('광물이 부족합니다.');
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
    summonMassiveYWaterbottle(n) {
        let i = 0; for (i; i < n; i++) { if (this.summonYarnball() == false) { context.setMessage('소환을 중지합니다.'); break; } }
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonRandom(pos, options = { mute: false, free: false }) {
        const cost = options.free ? 0 : 1;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos));
            if (options == null || options.mute != true) context.setMessage('아무거나 소환했습니다.');
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
            .setMessage(`고양이들이 깜짝 놀랐습니다!`);

    },
}