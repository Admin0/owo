class Context {
    constructor() {
        this.loadContextElement();
        this.loadMessagesElement();
        this.loadToastElement();
        this.setToasts();

        this.setSelectCatOrSometing();

        this.initializeSkills(this);

        // 컨텍스트 메뉴 불러오기
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            this.setDevMode();
            this.getSkill();
            this.showContext(event);
        }, false);
        document.querySelector('#context_bt').addEventListener("click", (event) => {
            console.log('1');
            this.setDevMode();
            this.getSkill();
            this.showContext(event)
        });

        // 컨텍스트 메뉴 종료하기
        document.addEventListener("click", (event) => {
            const keepElements = document.querySelectorAll('#context .skill, #context .sub, #context_bt');
            const isClickedOnKeeps = Array.from(keepElements).some(keepElement => keepElement.contains(event.target));
            if (document.querySelector('#context.on') != null) {
                if (isClickedOnKeeps) {
                    // console.log(`context: 1`);
                } else {
                    this.element.classList.remove("on");
                    // console.log(`context: 2`);
                }
            } else {
                // console.log(`context: 3`);
                this.element.classList.remove("on");
            }
            // console.log(`context: 4`);
            // context.classList.remove("on");
        });
    }

    loadElement(element, module) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            element.innerHTML = this.responseText;
        }
        xhttp.open("GET", module, true);
        xhttp.send();
    }
    loadContextElement() {
        this.element = document.createElement('section');
        this.element.id = 'context';
        document.body.appendChild(this.element);

        // 컨텍스트 메뉴 로드
        this.loadElement(this.element, "./module/context.html");
        this.sub = { element: null }
    }

    loadMessagesElement() {
        this.messages = document.createElement('section');
        this.messages.id = 'messages';
        document.body.appendChild(this.messages);

        // setMessage 에서 이전 메시지와 같은 지 확인 목적
        this.messages.textCheckVal = '이전 메시지와 같은 지 확인할 거에요';
    }
    setMessage(msg_string) {
        // 이전 메시지와 다른 값인 경우 메시지 출력
        if (this.messages.textCheckVal != msg_string) {
            // 바깥 구조 생성
            const message_wrap = document.createElement('div');
            message_wrap.className = 'message_wrap'

            // 내부 중 시간 부분 생성
            const time = document.createElement('div');
            time.className = 'time';
            const d = new Date();
            const z = number => (number < 10 ? '0' : '') + number;
            time.innerText = `[${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}]`;
            message_wrap.appendChild(time);

            // 내부 중 메시지 부분 생성
            const message = document.createElement('div');
            message.className = 'message';
            message.innerText = msg_string;
            message_wrap.appendChild(message);

            document.getElementById(this.messages.id).appendChild(message_wrap)
            this.messages.textCheckVal = msg_string;

            // 7 초 뒤 메시지 삭제
            setTimeout(() => {
                message_wrap.remove();
                this.messages.textCheckVal = '7 초 뒤 메시지 삭제';
            }, 7000);
        }
    }

    loadToastElement() {
        this.toast = document.createElement('section');
        this.toast.id = 'toast';
        document.body.appendChild(this.toast);
    }
    setToasts() {
        const toastLoadInterval = setInterval(() => {
            if (document.querySelectorAll('[title]').length != 0) {
                setToasts();
                clearInterval(toastLoadInterval);
            }
        }, 100);
        const setToasts = () => {
            document.querySelectorAll('[title]').forEach(event => {
                // console.log('2', event);
                event.addEventListener('mouseenter', event2 => {
                    // console.log('4');
                    if (event.getAttribute('title') != null) {
                        event.setAttribute('data-title', event.getAttribute('title'));
                        event.removeAttribute("title");
                        // console.log('3');
                    }
                    this.toast.style.left = `${event.getBoundingClientRect().x + 12}px`
                    this.toast.style.top = `${event.getBoundingClientRect().y}px`
                    this.toast.innerHTML = event.getAttribute('data-title');
                    this.toast.classList.add('on');
                });
                event.addEventListener('mouseleave', event2 => {
                    this.toast.classList.remove('on');
                })
            });
        }
    }

    setDevMode(wannaToggle = false) {
        // 현재 dev_mode 값을 확인
        let isDevMode = this.getDevMode();

        // 토글 옵션이 true일 때, dev_mode를 전환해서 저장한다.
        if (wannaToggle) {
            isDevMode = isDevMode ? false : true;
            localStorage.setItem('dev_mode', isDevMode ? 'true' : 'false');
        }

        const contextDevElement = document.querySelector('#context .dev_mode');
        if (isDevMode) {
            document.body.classList.add('dev_mode');
            contextDevElement != null ? contextDevElement.classList.add('activated') : false;
        } else {
            document.body.classList.remove('dev_mode');
            contextDevElement != null ? contextDevElement.classList.remove('activated') : false;
        }
    }
    getDevMode() {
        return localStorage.getItem('dev_mode') == 'true' ? true : false;
    }
    setAutoSummon() {
        const isAutoSummon = p.autoSummon == null ? false : p.autoSummon ? false : true;

        const contextAutoSummonElement = document.querySelector('#context .auto_summon');
        if (isAutoSummon) {
            contextAutoSummonElement != null ? contextAutoSummonElement.classList.remove('activated') : false;
            // this.setMessage('급식기 전원을 켰습니다.');
        } else {
            contextAutoSummonElement != null ? contextAutoSummonElement.classList.add('activated') : false;
            // this.setMessage('급식기 전원을 껐습니다.');
        }
        p.autoSummon = isAutoSummon;
    }

    initializeSkills(parent) {
        this.skill = {
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
                    parent.setMessage(`${cat.skin}에게 간택 당했습니다.`);
                    p.updateParameterValues();
                } else if (!this.getMineralOk(cost)) {
                    parent.setMessage('광물이 부족합니다.');
                    return false;
                } else {
                    parent.setMessage('보급고가 부족합니다.');
                    return false;
                }
            },
            summonMassiveCats(n) {
                let i = 0
                for (i; i < n; i++) {
                    if (this.summonCat() == false) {
                        parent.setMessage('소환을 중지합니다.');
                        break;
                    }
                }
                if (i != 0) parent.setMessage(`(x${i} 회 소환 성공)`);
            },
            summonFish(pos) {
                const cost = 4;
                if (this.getMineralOk(cost)) {
                    this.setMineral(cost);
                    pisces.push(new Fish(pos).setType('fish'));
                    parent.setMessage('생선을 소환했습니다.');
                    p.updateParameterValues();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                    return false;
                }
            },
            summonMassiveFishs(n) {
                let i = 0; for (i = 0; i < n; i++) {
                    if (this.summonFish() == false) {
                        parent.setMessage('소환을 중지합니다.');
                        break;
                    }
                }
                if (i != 0) parent.setMessage(`(x${i} 회 소환 성공)`);
            },
            summonCucumber(pos) {
                pisces.push(new Fish(pos).setType('cucumber'));
                parent.setMessage('오이를 소환했습니다.');
                p.updateParameterValues();
            },
            summonMassiveCucumbers(n) {
                let i = 0; for (i; i < n; i++) { this.summonCucumber(); }
                if (i != 0) parent.setMessage(`(x${i} 회 소환 성공)`);
            },
            summonMineral(pos) {
                const cost = 0;
                if (this.getMineralOk(cost)) {
                    this.setMineral(cost);
                    pisces.push(new Fish(pos).setType('mineral'));
                    parent.setMessage('광물을 소환했습니다.');
                    p.updateParameterValues();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                    return false;
                }
            },
            summonMassiveMinerals(n) {
                let i = 0; for (i; i < n; i++) { this.summonMineral(); }
                if (i != 0) parent.setMessage(`(x${i} 회 소환 성공)`);
            },
            summonYarnball(pos) {
                const cost = 50;
                if (this.getMineralOk(cost)) {
                    this.setMineral(cost);
                    pisces.push(new Fish(pos).setType('yarnball').startSliding());
                    parent.setMessage('털실 공을 소환했습니다.');
                    p.updateParameterValues();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                    return false;
                }
            },
            summonMassiveYarnballs(n) {
                let i = 0;
                for (i; i < n; i++) {
                    if (this.summonYarnball() == false) {
                        parent.setMessage('소환을 중지합니다.');
                        break;
                    }
                }
                if (i != 0) parent.setMessage(`(x${i} 회 소환 성공)`);
            },
            summonAll(n) {
                let i = 0;
                for (i; i < n; i++) {
                    this.summonFish(undefined, { mute: true });
                }
                let j = 0;
                for (j; j < n; j++) {
                    this.summonCucumber(undefined, { mute: true });
                }
                let k = 0;
                for (k; k < n; k++) {
                    this.summonMineral(undefined, { mute: true });
                }
                parent.setMessage(`(x${i + j + k} 회 소환 성공)`);
            },
            summonRandom(pos, options) {
                const cost = 1;
                if (this.getMineralOk(cost)) {
                    this.setMineral(cost);
                    pisces.push(new Fish(pos));
                    if (options == null || options.mute != true) parent.setMessage('아무거나 소환했습니다.');
                    p.updateParameterValues();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                    return false;
                }
            },
            summonMassiveRandoms(n, options) {
                let i = 0;
                for (i; i < n; i++) {
                    this.summonRandom(undefined, options);
                }
                if (options == null || options.mute != true) if (i != 0) parent.setMessage(`(x${i} 회 소환 성공)`);
            },
            clearAllPisces() {
                const i = pisces.length;
                while (pisces.length > 0) {
                    pisces[pisces.length - 1].remove();
                }
                if (i != 0) parent.setMessage(`${i} 개의 물건들을 치웠습니다.`);
                else parent.setMessage(`방안에 물건이 없습니다.`);
            },
            surpriseCats() {
                cats.forEach(event => {
                    event.toggleMovement('surprised');
                });
                parent.setMessage(``);
                parent.setMessage(`고양이들이 깜짝 놀랐습니다!`);
                parent.setMessage(``);
            }
        }
    }

    setSkill(skill = p.val.skill) {
        const targetSkill = document.querySelector(`#context .skill.${skill}`);

        // 현재 선택된 스킬이 액티베이션 상태이면 액티베이션 취소
        if (targetSkill != null && targetSkill.classList.contains('activated')) {
            targetSkill.classList.remove('activated');
            p.val.skill = 'dummy'; // 선택 해제 시 스킬 정보 삭제
        } else {
            // 현재 선택된 스킬이 액티베이션 상태가 아니면 액티베이션 상태로 변경
            this.getSkill(skill);
            p.val.skill = skill;
            p.updateParameterValues();
        }
    }
    getSkill(skill = p.val.skill) {
        const targetSkill = document.querySelector(`#context .skill.${skill}`);
        document.querySelectorAll('#context .skill').forEach((e) => { e.classList.remove('activated'); });
        if (targetSkill != null) {
            targetSkill.classList.add('activated');
        }
    }

    /**
     * 이벤트 위치를 기준으로 컨텍스트 메뉴를 표시합니다.
     * @param {Event} e - 컨텍스트 메뉴를 트리거한 이벤트입니다.
     */
    showContext(e) {
        // if (!is_mobile) {
        if (true) {
            // 컨텍스트 메위 생성 위치 계산
            const rect = context.element.getBoundingClientRect();
            context.x = window.innerWidth - rect.width > e.pageX ? e.pageX : window.innerWidth - rect.width;

            if (window.innerHeight - rect.height > e.pageY - document.documentElement.scrollTop) {
                context.y = e.pageY - document.documentElement.scrollTop;
            } else {
                context.y = window.innerHeight - rect.height;
            }
            context.element.style.left = `${context.x}px`;
            context.element.style.top = `${context.y}px`;
            context.element.classList.add("on");
        } else {
            // 모바일 네비게이션 메뉴 토글
            if ($('nav').attr('class') != 'on') {
                $('nav, #nav_bg').classList.add('on');
            } else {
                $('nav, #nav_bg').classList.remove('on');
            }
        }
        // 하위 메뉴 항목 위치 계산
        context.element.querySelectorAll('.context').forEach(sub_context => {
            sub_context.parentElement.addEventListener('mouseenter', (e) => {
                const rect = context.element.getBoundingClientRect();
                const sub_wrap_rect = e.target.getBoundingClientRect();
                const sub_rect = e.target.querySelector('section.context').getBoundingClientRect();
                context.sub.element = e.target.querySelector('section.context');

                // 오른쪽에 너무 붙어있을 때 화면 밖으로 나가지 않게 조절
                if (window.innerWidth - rect.right > sub_rect.width - 7) {
                    context.sub.x = rect.width - 7;
                } else {
                    context.sub.x = (window.innerWidth - rect.right) + (rect.width - sub_rect.width);
                }

                // 아래쪽에 너무 붙어있을 때 화면 밖으로 나가지 않게 조절
                if (sub_wrap_rect.top + sub_rect.height < window.innerHeight - 7) {
                    context.sub.y = sub_wrap_rect.top - rect.top - 7;
                } else {
                    context.sub.y = (window.innerHeight - rect.bottom) + (rect.height - sub_rect.height);
                }
                context.sub.element.style.left = `${context.sub.x}px`;
                context.sub.element.style.top = `${context.sub.y}px`;
            }, { once: true });

            sub_context.parentElement.addEventListener('click', (e) => {
                const check_is_not_null = e.target.querySelector('section.context');
                if (check_is_not_null != null) {
                    check_is_not_null.classList.toggle('on');
                }
            })
        });
    }

    setSelectCatOrSometing() {
        document.addEventListener('click', event => {
            document.querySelectorAll('.cat, .pisces').forEach(event => { event.classList.remove('selected'); });
            if (event.target.matches('.cat, .pisces')) {
                event.target.classList.add('selected');
            }
        });
    }
}

class Settings {
    constructor(settings_area = '#settings') {
        this.loadElement(document.querySelector(settings_area), './module/settings.html');
        this.element = document.querySelector(settings_area);

        this.initTimeSet();
    }

    initTimeSet() {
        document.querySelector('#setting_bt').addEventListener("click", () => { settings.showSettings(); });
        
        // 설정창이 켜진 상태에서 외부를 클릭하면 설정 닫기
        document.addEventListener("click", (event) => {
            const keepElements = document.querySelectorAll('#book, #context');
            const isClickedOnKeeps = Array.from(keepElements).some(keepElement => keepElement.contains(event.target));
            if (this.element.classList.contains('on') == true && !isClickedOnKeeps) { this.showSettings(); }
        });

        const initTimeInterval = setInterval(() => {
            if (document.querySelectorAll('[title]').length != 0) {
                initTimeSet();
                clearInterval(initTimeInterval);
            }
        }, 100);
        const initTimeSet = () => {
            document.querySelectorAll('#settings input').forEach((event) => {
                // console.log(event);
                event.addEventListener("change", (event) => {
                    console.log(event);
                    p.val.work_start = document.querySelector('#settings input#work_start').value;
                    p.val.work_final = document.querySelector('#settings input#work_final').value;
                    // p.set('payday', $('#settings input#payday').value.substring(8, 10));
                    p.setParaToURL();
                    p.updateParameterValues();
                });
            });
        }
    }

    loadElement(element, module) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            element.innerHTML = this.responseText;
        }
        xhttp.open("GET", module, true);
        xhttp.send();

        // this.element = document.querySelector(selector);
        this.sub = { element: null }
    }

    showSettings() {
        this.element.style.height = !this.element.classList.contains('on') ? `${this.element.scrollHeight}px` : 0;
        this.element.classList.toggle('on');
        document.querySelector('#setting_bt').classList.toggle('on');
    }

    clickButtons(target) {
        this.element.querySelectorAll('button').forEach((e) => {
            e.classList.remove('on');
        });
        target.classList.add('on');
    }
}