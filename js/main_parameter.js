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
        this.data.resources.supplies = cats.length
        document.querySelector('#supplies').textContent = `${this.data.resources.supplies}/${this.data.resources.suppliesMax}`;

        // 로컬 스토리지에 저장
        localStorage.setItem('data', JSON.stringify(this.data));
        localStorage.setItem('cats', JSON.stringify(cats));

        // 도전 과제
        achievement.checkAchievement();
    }

    // 이벤트를 정의해보자
    getShouldEvent() {
        events.allCatsDead();
    }
}

// 임무는 이야기를 진행시키는 큰 이벤트의 줄기입니다.
const quests = {

}

// 사건은 클래스에서 각각의 경우에 대응하기 위해 만들어진 패시브 이벤트입니다.
const events = {
    titleEvent: () => {
        const messages = [
            ``,
            `*** ${setClass('퇴근 시간을 알려주는 고양이', 'special')} ***`,
            `- Project ${setClass('OwO', 'special')} as Off Work On-time v.${p.data.achievement.VERSION}`,
        ];

        if (cd.isIgnited()) {
            messages.push('', '　', '타이머가 00:00을 가르키고 있습니다. 정시퇴근 했을 리가 없는데...', '야근 모드가 활성화됩니다. 타이머가 30 분 뒤로 설정됩니다.', '', '3', '2', '1', '');
            setTimeout(() => cd.isIgnited() && cd.setTime(`${('0' + (new Date().getHours()) % 24).slice(-2)}:${('0' + (new Date().getMinutes() + 30)).slice(-2)}`), messages.length * 1000);
        }

        let i = 0;
        showMessage = () => {
            context.setMessage(messages[i]);
            i++;
            if (i < messages.length) { setTimeout(showMessage, 1000); }
        };
        showMessage();
    }
    ,

    todaysHashtags: (moment = '55', tagCount = 3) => {
        if (cd.getSecs() !== moment) { return }
        context
            .setMessage(``)
            .setMessage(`*** 오늘의 해시태그 ***`)
        for (let i = 0; i < tagCount; i++) { context.setMessage(`#${tag[dice(1, tag.length, -1)]}`); }
    },

    fishBuildUp: (fish) => {

        // 생선은 낮은 확률로 금붕어가 된다
        if (fish.type == 'fish') { fish.type = Math.floor(Math.random() * 32) != 0 ? 'fish' : 'fish_rich' }
        // 광물은 낮은 확률로 풍부한광물 된다
        if (fish.type == 'mineral') { fish.type = Math.floor(Math.random() * 16) != 0 ? 'mineral' : 'mineral_rich' }
        // 광물은 낮은 확률로 희귀광물이 된다
        if (fish.type == 'mineral') { fish.type = Math.floor(Math.random() * 16) != 0 ? 'mineral' : 'mineral_rare' }
        // 희귀광물이 낮은 확률로 풍부한희귀광물이 된다
        if (fish.type == 'mineral_rare') { fish.type = Math.floor(Math.random() * 16) != 0 ? 'mineral_rare' : 'mineral_richrare' }

        switch (fish.type) {
            case 'mineral_rich':
            case 'mineral_richrare':
                fish.hp = fish.hp_max = 40;
                break;

            case 'yarnball':
                // 체력 추가
                fish.hp = fish.hp_max = 30;

                // 색깔 바꾸기
                fish.figure.style.filter = `brightness(150%) hue-rotate(${Math.floor(Math.random() * 60) * 6}deg`;
                break;

            case 'potion_health_bottle':
            case 'potion_vigor_bottle':
            case 'potion_poison_bottle':
                // 체력 추가
                fish.hp = fish.hp_max = 10;
                break;

            case 'waterbottle':
                fish.hp = fish.hp_max = 30;
                break;

            case 'dex':
                fish.element.classList.add('special');
                fish.element.addEventListener('click', (event) => {
                    const click_distance = fish.calculateDistance(
                        { x: fish.startX, y: fish.startY }
                    );
                    if (click_distance < 16) {
                        fish.element.classList.add('down');
                        events.showDex(500);
                    }
                });
                break;

            case '택배':
                fish.type = Math.random() > .125 ? '택배' : '큰_택배';
            case '큰_택배':
                fish.hp = fish.hp_max = 10;
                fish.element.addEventListener('click', (event) => {
                    const click_distance = fish.calculateDistance(
                        { x: fish.startX, y: fish.startY }
                    );
                    if (click_distance < 16) {
                        // fish.setType('택배_상자');
                        fish.kill();
                    }
                });
                break;

            default:
                break;
        }

        // 체력바를 표시할 창
        switch (fish.type) {
            case 'mineral_rich':
            case 'mineral_richrare':
                if (fish.hp != null) {
                    fish.hpBar = document.createElement('div');
                    fish.hpBar.className = 'hp-bar';
                    fish.element.appendChild(fish.hpBar);

                    // 체력 바 업데이트
                    fish.updateHpBar();
                }
                break;

            default:
                break;
        }

        // 효과 요소 추가
        fish.effect = document.createElement('div');
        fish.effect.className = 'effect';
        fish.element.appendChild(fish.effect);

        // 이로치 발생 시 
        if (fish.irochi === true) {
            if (fish.hp !== undefined) { fish.hp_max *= 2; fish.hp = fish.hp_max }
        }

        // 사이즈 설정
        switch (fish.type) {
            case '큰_택배':
                fish.element.classList.add('size_large');
                break;

            default:
                break;
        }

    },
    /**
     * 
     * @param {*} fish      충돌한 생선 객체
     * @param {*} cat       생선 객체와 충돌한 고양이 객체
     * @param {*} catRect   고양이 객체 요소의 getBoundingClientRect
     * @returns 
     */
    fishActivateWithCat: (fish, cat, catRect) => {

        // 완전 멈추지는 않고 속도가 줄어든다
        this.speed = this.speed / 2;

        // 생선 새로운 각도 구함: 고양이 반대편에서 90도 랜덤 값
        const a_new = Math.atan2(catRect.y - fish.position.y, catRect.x - fish.position.x) + Math.PI - (Math.PI / 4) + (Math.random() * Math.PI / 2);
        const v_new = 2 + (cat.speed * 1 / 2) + (fish.speed) + (3 * Math.random());

        const damage_for_cat = -(1 + (fish.speed || 0));

        const knockover = (options = { meow: undefined }) => {
            options.meow = options.meow || undefined;

            // 이전에 충돌한 cat, position 정보 업데이트
            fish.prevCollidedCat = cat;
            fish.prevCollidedPosition = fish.getPosition();

            // 고양이 움직임 정의
            cat
                .toggleMovement(fish.speed > 3 ? 'surprised' : null)     // 물병이랑 부딪히면 고양이는 멈춤
                .updateHp(damage_for_cat);        // 체력 업데이트

            if (options.meow !== undefined) cat.setMeow(options.meow);   // 야옹거리는 동작

            // 생선 움직임 정의
            fish
                .startSliding({
                    v: fish.speed != 0 ? fish.speed * 3 / 4 + 3 : 5 * Math.random() + 3,
                    a: a_new
                })              // 물병 움직임 시작
                .updateHp(-5);  // 물병 내구도 업데이트
        }

        const mineral_rich = () => {

            knockover({ meow: 'Nyan!' });
            // 이전에 충돌한 cat, position 정보 업데이트
            fish.prevCollidedCat = cat;
            fish.prevCollidedPosition = fish.getPosition();

            // 고양이 움직임 정의
            cat
                .toggleMovement(fish.speed > 3 ? 'surprised' : null)     // 부딪히면 고양이는 멈춤
                .setMeow('Nyan!')    // 야옹거리는 동작
                .updateHp(damage_for_cat);        // 체력 업데이트

            // 생선 움직임 정의
            fish
                .startSliding({
                    v: fish.speed != 0 ? fish.speed * 3 / 4 + 3 : 5 * Math.random() + 3,
                    a: a_new
                })              // 광물 움직임 시작
                .updateHp(-5);  // 광물 내구도 업데이트

            skills.splitMassiveFish(cat, fish, { n: 1, length: 32, breakup: false, type: ['mineral'] });
        }

        const 동전 = () => {

            if (fish.element.classList.contains('massive')) {
                skills.splitMassiveFish(cat, fish, { n: 9, length: 0, breakup: true });
                cat.setMeow('🪙');
            } else {
                fish.kill();
            }

            // 이로치 동전 --> 냐옹
            if (fish.element.classList.contains('irochi')) {
                cat.evolution(fish, '냐옹', { rename: '색이 다른 동전', meow: '🪙🪙🪙' });
            }
        }

        const 천년퍼즐 = () => {
            if (fish.element.classList.contains('Lv3') && cat.skin === '스핑크스') {
                cat.evolution(fish, '파라오', { meow: '𓂀' });
            } else {
                switch (cat.skin) {
                    case '스핑크스':
                        context
                            .setMessage('')
                            .setMessage(`${setClass(cat.skin, 'cat')}가 ${setClass('천년 퍼즐', 'pisces')}의 힘으로 ${setClass('체력', 'var')}이 늘어난 기분을 느꼈다.`, cat);
                        break;

                    default:
                        cat.evolution(fish, '스핑크스');
                        break;
                }

            }

            fish.kill();
        }

        switch (fish.type) {
            case 'fish_rich':
                // 고양이 체력 증가
                cat.updateHp(10);
            case 'fish':

                // 고양이 움직임 정의
                cat
                    .toggleMovement('lick')     // 셍선를 먹는 움직임
                    .setMeow('Meow❤️')         // 야옹거리는 동작
                    .updateHp(10);              // 체력 업데이트

                // 생선 객체 삭제
                fish.kill();
                break;
            case 'cucumber':
                // 고양이 움직임 정의
                cat
                    .toggleMovement('surprised')     // 오이를 먹는 움직임
                    .setMeow('Grrrr!')               // 야옹거리는 동작
                    .updateHp(damage_for_cat - 10);                   // 체력 업데이트

                // 오이 객체 삭제
                fish.kill();

                break;
            case 'mineral_rare': p.resources.setMinerals(8);
            case 'mineral':
                p.resources.setMinerals(8);
                p.updateParameterValues();

                cat.setMeow('💎');

                // 객체 삭제
                fish.kill();
                break;

            case 'mineral_richrare': p.resources.setMinerals(8); cat.setMeow('💎');
            case 'mineral_rich': p.resources.setMinerals(8); mineral_rich(); cat.setMeow('💎'); break;

            case 'yarnball':
                // 이전에 충돌한 cat, position 정보 업데이트
                fish.prevCollidedCat = cat;
                fish.prevCollidedPosition = fish.getPosition();

                // 고양이 움직임 정의
                cat
                    .toggleMovement()    // 공이랑 부딪히면 고양이는 멈춤
                    .setMeow('Nyaa!')    // 야옹거리는 동작
                    .updateHp(damage_for_cat);       // 체력 업데이트

                // 생선 움직임 정의
                fish
                    .startSliding({
                        v: v_new,
                        a: a_new
                    })              // 공 움직임 시작
                    .updateHp(-5);  // 공 내구도 업데이트

                break;

            case 'waterbottle':
                // 누운채로 멈춰있으면 작동 안 함 --> 제거
                if (fish.element.classList.contains('down') && fish.speed === 0) { cat.setMeow('💧'); fish.kill(); return; }

                knockover();

                break;

            case '택배': case '큰_택배': knockover({ meow: '📦' }); break;

            case 'stone_moon':
                switch (cat.skin) {
                    case '깜냥이': cat.evolution(fish, '달빛냥이'); break;

                    case '흰냥이': cat.evolution(fish, '우주비행사'); break;

                    default:
                        context
                            .setMessage('')
                            .setMessage(`${setClass(cat.skin, 'cat')}는 ${setClass('달맟이 돌', 'pisces')}의 힘으로 ${setClass('건강', 'var')}해진 기분을 느꼈다.`, cat);

                        cat.hp_max += 30;
                        cat.hp = cat.hp_max;

                        fish.kill();
                        break;
                }

                break;

            case '화석': cat.evolution(fish, '공룡'); break;

            case '천년퍼즐': 천년퍼즐(); break;

            case 'potion_health':
                cat.setMeow('❤️');
                cat.updateHp(50);
                fish.setType('potion_health_bottle');

                knockover();

                break;
            case 'potion_vigor':
                cat.setMeow('💜');
                cat.updateHp(50);
                fish.setType('potion_vigor_bottle');

                knockover();

                break;
            case 'potion_poison':
                cat.setMeow('💚');
                cat.updateHp(- 50);
                fish.setType('potion_poison_bottle');

                knockover();

                break;
            case 'potion_health_bottle':
            case 'potion_vigor_bottle':
            case 'potion_poison_bottle':
                // 누운채로 멈춰있으면 작동 안 함 --> 제거
                if (fish.element.classList.contains('down') && fish.speed === 0) { cat.setMeow('🧪'); fish.kill(); return; }
                knockover();
                break;

            case '동전': 동전(); break;

            default: break;
        }

        cat.updateHpBar();
        p.updateParameterValues();

    },

    fishActivateWithGhost: (fish, cat, catRect) => {
        switch (fish.type) {
            case '천년퍼즐':

                fish.prevCollidedCat = cat;
                fish.prevCollidedPosition = fish.getPosition();

                // 유령 흡수
                cat.figure.animate({ filter: ['brightness(1)', 'brightness(5)'] }, {
                    duration: 200,
                    animationDirection: 'alternate',
                    iterations: Infinity,
                    composite: 'add',
                });

                if (fish.element.classList.contains('Lv3')) {
                    // nothing
                } else if (fish.element.classList.contains('Lv2')) {
                    fish.element.classList.remove('Lv2');
                    fish.element.classList.add('Lv3');
                } else if (fish.element.classList.contains('Lv1')) {
                    fish.element.classList.remove('Lv1');
                    fish.element.classList.add('Lv2');
                } else { fish.element.classList.add('Lv1'); }


                setTimeout(() => {
                    // 해당 객체 삭제
                    cat.element.remove();
                    clearInterval(cat.activateInterval);

                }, 500);
        }
    },

    catDead: (cat) => {
        cat.hp = 0;
        cat.setMeow('Woem...');
        context
            .setMessage('')
            .setMessage(`*** ${setClass(cat.skin, cat.skin === '우유' ? 'special' : 'cat')}가 ${setClass('고양이 별', 'special')}로 떠났습니다. 
            당신은 ${setClass(cat.skin, cat.skin === '우유' ? 'special' : 'cat')}와의 추억을 오랬동안 기억할 것입니다. *** (${p.data.resources.supplies - 1}/${p.data.resources.suppliesMax})`, cat);
        const i = cats.findIndex(target => target == cat);

        // 고양이 객체 제거
        cat.setSkin('유령');
        // cats[i].element.remove();
        cats.splice(i, 1);
        skills.highlight(cat);

        p.data.achievement.cat_dead++;
        p.updateParameterValues();

        p.getShouldEvent();
    },
    allCatsDead: () => {
        // console.info(`[owo] allCatsDead (${p.data.resources.supplies}/${p.data.resources.suppliesMax})`);
        // 고양이들이 다 냥이별로 갔는지 체크 후 실행
        if (p.data.resources.supplies == 0) {
            // console.info(`[owo] *** allCatsDead ***`);
            context
                .setMessage(``)
                .setMessage(`*** 모든 ${setClass(`고양이`, `cat`)}가 고양이 별로 떠났다 ***`)
                .setMessage(`*** ${setClass(`성좌 냥냥이`, `special`)}가 당신을 원망한다... ***`);

            p.data.achievement.cat_dead_all++ || 1;
            p.updateParameterValues();

            achievement.getAchievement('고양이_별')
        }
    },

    똑같은_영웅도_환영: (skins) => {
        const cats_achiev = document.querySelectorAll('#cage .cat');       // 똑같은 영웅도 환영
        if (document.querySelectorAll('#cage .cat').length === 7) {
            skins.forEach(skin => {
                let check_똑같은_영웅도_환영 = true;
                document.querySelectorAll('#cage .cat').forEach((cat, i) => {
                    if (i == 0) return;   // 우유는 제외
                    check_똑같은_영웅도_환영 *= cat.classList.contains(skin);
                    // console.log(i, check_똑같은_영웅도_환영, skin, cat.classList.contains(skin));
                });
                if (check_똑같은_영웅도_환영 === 1) { achievement.getAchievement('똑같은_영웅도_환영') }
                // console.info(`[owo] 똑같은_영웅도_환영: ${check_똑같은_영웅도_환영}`)
            });
        }
    },

    스트라이크: (fish) => {
        if (fish.type !== 'waterbottle' || p.data.achievement.스트라이크__completed === true) { return }
        const pins = [];
        pisces.forEach(e => { if (fish.calculateDistance(e.position) < 32) { pins.push(e); } });
        if (pins.length >= 10) {
            setTimeout(() => {
                let count = 0;
                pins.forEach(f => { if (f.element.classList.contains('down')) { count++; } });
                if (count >= 10) { achievement.getAchievement('스트라이크'); }
            }, 500)
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
            p.data.achievement[key] = p.data.achievement[key] || 0;
            document.querySelector(`.${key} .val`).textContent = p.data.achievement[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

    summonCat(pos, options = { skin: undefined }) {
        const cost = 50;
        if (this.getSupplyOk() && this.getMineralOk(cost)) {
            this.setMineral(cost);
            const skin = options.skin !== undefined ? options.skin[Math.floor(Math.random() * options.skin.length)] : undefined;
            const cat = new Cat(pos, skin).setMeow('Eow');
            cats.push(cat);
            context.setMessage(`${setClass(cat.skin, 'cat')}에게 간택 당했다.`);
            p.updateParameterValues();
        } else if (!this.getMineralOk(cost)) {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족하다.`);
        } else {
            context.setMessage(`${setClass('보급고', 'pisces')}가 부족하다.`);
        }
    },
    summonMassiveCats(n, options = { skin: undefined }) {
        let i = 0
        for (i; i < n; i++) {
            if (this.summonCat(undefined, options) == false) {
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
            pisces.push(new Fish(pos, 'fish'));
            if (options == null || options.mute != true) context.setMessage(`${setClass('생선', 'pisces')}을 소환했다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족하다.`);
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
        if (options == null || options.mute != true) context.setMessage('<span class="pisces">오이</span>를 소환했다.');
        p.updateParameterValues();
        return this;
    },
    summonMassiveCucumbers(n) {
        let i = 0; for (i; i < n; i++) { this.summonCucumber(); }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonMineral(pos, options = { mute: false, vector: undefined }) {
        const cost = 0;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos, 'mineral').startSliding(options.vector));
            if (options == null || options.mute != true) context.setMessage(`${setClass('광물', 'pisces')}을 소환했다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonMineralRich(pos, options = { mute: false, vector: undefined }) {
        const cost = 0;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos, 'mineral_rich').startSliding(options.vector));
            context.setMessage(`${setClass('광물', 'pisces')}을 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonMassiveMinerals(n, pos) {
        let i = 0; for (i; i < n; i++) { this.summonMineral(pos, pos !== undefined ? undefined : { vector: { v: 0 } }); }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonMassiveMineralsRich(n, pos) {
        let i = 0; for (i; i < n; i++) {

            const angle = Math.PI * 2 * Math.random();
            const length = 64 * Math.random();
            pos.x = Math.round(pos.x + Math.cos(angle) * length);
            pos.y = Math.round(pos.y + Math.sin(angle) * length);

            // console.log(pos, angle, length);
            this.summonMineralRich(pos, pos !== undefined ? undefined : { vector: { v: 0 } });
        }
        if (i != 0) context.setMessage(`(${setClass('x' + i, 'num')}회 소환 성공)`);
    },
    summonYarnball(pos, options = { mute: false, vector: undefined }) {
        const cost = 100;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos, 'yarnball').startSliding(options.vector));
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
            pisces.push(new Fish(pos, 'waterbottle'));
            if (options == null || options.mute != true) context.setMessage(`${setClass('물병', 'pisces')}을 소환했습니다.`);
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
            .summonWaterbottle({ x: pos.x - 2 * w, y: pos.y - h }, { mute: true })
            .summonWaterbottle({ x: pos.x - 2 / 3 * w, y: pos.y - h }, { mute: true })
            .summonWaterbottle({ x: pos.x + 2 / 3 * w, y: pos.y - h }, { mute: true })
            .summonWaterbottle({ x: pos.x + 2 * w, y: pos.y - h }, { mute: true })

            // line 3rd
            .summonWaterbottle({ x: pos.x - 4 / 3 * w, y: pos.y }, { mute: true })
            .summonWaterbottle({ x: pos.x, y: pos.y }, { mute: true })
            .summonWaterbottle({ x: pos.x + 4 / 3 * w, y: pos.y }, { mute: true })

            // line 2nd
            .summonWaterbottle({ x: pos.x - 2 / 3 * w, y: pos.y + h }, { mute: true })
            .summonWaterbottle({ x: pos.x + 2 / 3 * w, y: pos.y + h }, { mute: true })

            // line 1st
            .summonWaterbottle({ x: pos.x, y: pos.y + 2 * h }, { mute: true })

            // ball
            .summonYarnball({ x: pos.x, y: pos.y + 20 * h }, { mute: true });

        if (this.getMineralOk(20)) { context.setMessage(`${setClass('물병', 'pisces')}들을 넘어뜨리기 적당한 위치로 세웠습니다.`, pos); }
    },
    summonWaterbottleDelivery(pos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }) {
        const quarterViewFactor = .75;
        const w = 12;
        const h = w * quarterViewFactor;

        const maxX = window.innerWidth - 64 - 2 * w;
        const maxY = window.innerHeight - 64 - 1 * h;
        this.pos = {
            x: Math.max(2 * w, Math.min(pos.x, maxX)),
            y: Math.max(2 * h, Math.min(pos.y, maxY))
        };

        this
            // line 4th
            .summonWaterbottle({ x: this.pos.x - 2 * w, y: this.pos.y - 2 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x - 1 * w, y: this.pos.y - 2 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x, y: this.pos.y - 2 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 1 * w, y: this.pos.y - 2 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 2 * w, y: this.pos.y - 2 * h }, { mute: true })
            // line 3th
            .summonWaterbottle({ x: this.pos.x - 2 * w, y: this.pos.y - 1 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x - 1 * w, y: this.pos.y - 1 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x, y: this.pos.y - 1 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 1 * w, y: this.pos.y - 1 * h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 2 * w, y: this.pos.y - 1 * h }, { mute: true })
            // line 2th
            .summonWaterbottle({ x: this.pos.x - 2 * w, y: this.pos.y }, { mute: true })
            .summonWaterbottle({ x: this.pos.x - 1 * w, y: this.pos.y }, { mute: true })
            .summonWaterbottle({ x: this.pos.x, y: this.pos.y }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 1 * w, y: this.pos.y }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 2 * w, y: this.pos.y }, { mute: true })
            // line 1th
            .summonWaterbottle({ x: this.pos.x - 2 * w, y: this.pos.y + h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x - 1 * w, y: this.pos.y + h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x, y: this.pos.y + h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 1 * w, y: this.pos.y + h }, { mute: true })
            .summonWaterbottle({ x: this.pos.x + 2 * w, y: this.pos.y + h }, { mute: true });

        if (this.getMineralOk(20)) { context.setMessage(`[냥냥 택배] 고객님께서 주문하신 ${setClass('생수', 'pisces')} ${setClass('x20 개', 'num')} 상품을 배송완료 하였습니다.`, pos) }
    },
    summonMassiveYWaterbottle(n) {
        let i = 0; for (i; i < n; i++) { if (this.summonYarnball() == false) { context.setMessage('소환을 중지합니다.'); break; } }
        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
    },
    summonPotionPoison(pos, options) {
        const cost = 50;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos, 'potion_poison'));
            if (options == null || options.mute != true) context.setMessage(`${setClass('독약', 'pisces')}을 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summon동전(pos, options) {
        const cost = 0;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos, '동전'));
            pisces[pisces.length - 1].element.classList.add('massive');
            if (options == null || options.mute != true) context.setMessage(`${setClass('동전 무더기', 'pisces')}를 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summon택배(pos, options = { mute: false, free: false }) {
        const cost = options.free ? 0 : 50;
        if (this.getMineralOk(cost)) {
            this.setMineral(cost);
            pisces.push(new Fish(pos, '택배'));
            if (options == null || options.mute != true) context.setMessage(`${setClass('택배', 'pisces')}를 소환했습니다.`);
            p.updateParameterValues();
        } else {
            context.setMessage(`${setClass('광물', 'pisces')}이 부족합니다.`);
        }
        return this;
    },
    summonMassive택배(n, options) {
        let i = 0;
        for (i; i < n; i++) {
            this.summon택배(undefined, options);
        }

        if (options !== null || options.mute === true) return;

        if (i != 0) context.setMessage(`(x${i} 회 소환 성공)`);
        context
            .setMessage('')
            .setMessage(`(그들의 연회에 저는 그만 정신을 잃고 말았습니다 (꼴까닥))`);
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
        while (pisces.length > 1) { pisces[pisces.length - 1].remove(); }
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
    highlight(target) {
        // 이벤트 위치
        const x = target.position.x + 32;
        const y = target.position.y + 32;

        // 강조 요소 생성
        const highlightElement = document.createElement("div");
        highlightElement.classList.add("highlight");
        highlightElement.style.left = x + "px";
        highlightElement.style.top = y + "px";

        document.body.appendChild(highlightElement);

        // 오버레이 요소 표시
        const overlayElement = document.createElement("div");
        overlayElement.classList.add("overlay");

        document.body.appendChild(overlayElement);

        // 강조 효과와 오버레이가 사라지도록 설정
        setTimeout(function () {
            document.body.removeChild(highlightElement);
            document.body.removeChild(overlayElement);
        }, 1000);
    },

    // 쌓여있는 생선을 흩뿌림
    splitMassiveFish(cat, fish, options = { n: 9, length: 64, breakup: true, type: [fish.type], chance: 1 }) {

        if (typeof (options.n) === 'undefined') { options.n = 9 }
        if (typeof (options.length) === 'undefined') { options.length = 64 }
        if (typeof (options.breakup) === 'undefined') { options.breakup = true }
        if (typeof (options.type) === 'undefined') { options.type = [fish.type] }
        if (typeof (options.chance) === 'undefined') { options.chance = 1 }

        for (let i = 0; i < options.n; i++) {

            const angle = Math.PI * 2 * Math.random();
            const length = options.length * Math.random();
            const pos = {
                x: Math.round(fish.position.x + Math.cos(angle) * length),
                y: Math.round(fish.position.y + Math.sin(angle) * length)
            }

            const piece = new Fish(
                pos,
                options.type.length === 1 ? options.type[0] : Math.random() > options.chance ? options.type[0] : options.type[Math.floor(Math.random() * options.type.length) + 1]
            );

            piece.startSliding();
            piece.prevCollidedCat = cat;
            piece.prevCollidedPosition = pos;

            pisces.push(piece);
        }

        if (options.breakup) { fish.element.classList.remove('massive'); }

        return;
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


// 이벤트 메시지의 색을 쉽게 설정해주는 서브 이벤트 
/**
 * cat: green
 * pisces: yellow
 * vaillan: red
 * time, num: light green
 * special: pink - sky blue
 */
const setClass = (content, cls) => {
    return `<span class="${cls}">${content}</span>`
}
