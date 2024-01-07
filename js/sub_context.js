class Context {
    constructor() {
        this.loadContextElement();
        this.loadMessagesElement();
        this.loadToastElement();
        this.setToasts();
        this.loadDexElement();

        this.setSelectCatOrSometing();

        // 컨텍스트 메뉴 불러오기
        oncontextmenu = (event) => {
            event.preventDefault();

            this.setDevMode();
            this.getSkill();
            this.showContext(event);
        }
        document.querySelector('#context_bt').addEventListener("click", (event) => {
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

    loadContextElement() {
        this.element = document.createElement('section');
        this.element.id = 'context';
        document.body.appendChild(this.element);

        // 컨텍스트 메뉴 로드
        loadElement(this.element, "./module/context.html");
        this.sub = { element: null }
    }

    loadMessagesElement() {
        this.messages = document.createElement('section');
        this.messages.id = 'messages';
        document.body.appendChild(this.messages);

        // setMessage 에서 이전 메시지와 같은 지 확인 목적
        this.messages.textCheckVal = '이전 메시지와 같은 지 확인할 거에요';
    }

    setMessage(somethingToSay) {
        // 이전 메시지와 다른 값인 경우 메시지 출력
        if (this.messages.textCheckVal != somethingToSay) {

            // 바깥 구조 생성 (messages > message > 1 time & 2 text)
            const message = document.createElement('div');
            message.className = 'message'
            messages.appendChild(message);

            // 내부 중 시간 부분 생성
            const time = document.createElement('div');
            time.className = 'time';
            const d = new Date();
            const z = number => (number < 10 ? '0' : '') + number;
            time.innerText = `[${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}] `;
            message.appendChild(time);

            // 내부 중 메시지 부분 생성
            const text = document.createElement('div');
            text.className = 'text';
            text.innerHTML = somethingToSay;
            message.appendChild(text);

            this.messages.textCheckVal = somethingToSay;

            // 10 초 뒤 메시지 삭제
            setTimeout(() => {
                message.remove();
                this.messages.textCheckVal = '10 초 뒤 메시지 삭제';
            }, 10000);
        }
        return this;
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

    loadDexElement() {
        const dex = document.createElement('section');
        dex.id = 'dex';
        document.body.appendChild(dex);

        // 도감 로드 후 세부 목록 만들기
        const setDexList = (array, target, off_dexc) => {
            array.forEach((e, i) => {
                const li = document.createElement('li');
                li.className = e.id;
                document.querySelector(`#dex .${target}`).appendChild(li);

                const figure = document.createElement('figure');
                li.appendChild(figure);

                const dl = document.createElement('dl');
                dl.className = 'toast';
                li.appendChild(dl);
                const dt_on = document.createElement('dt');
                dt_on.innerHTML = e.name;
                dl.appendChild(dt_on);
                const dd_on = document.createElement('dd');
                dd_on.className = 'on dev_mode';
                dd_on.innerHTML = e.desc;
                dl.appendChild(dd_on);
                const dd_off = document.createElement('dd');
                dd_off.className = 'off';
                dd_off.innerText = off_dexc;
                dl.appendChild(dd_off);

                e.element = li;
            });
        }

        // 도감 로드 후 통계 목록 만들기
        const setStatisticsList = () => {
            Object.keys(p.data.achievement).forEach(key => {
                const li = document.createElement('li');
                li.className = key;
                document.querySelector('#dex #statistics').appendChild(li);

                ['name', 'val'].forEach(each => {
                    const element = document.createElement('span');
                    element.className = each;
                    document.querySelector(`#dex #statistics .${key}`).appendChild(element);
                });
                document.querySelector(`#dex #statistics .${key} .name`).textContent = `${key}: `;
            });
        }

        // 도감 로드
        loadElement(dex, "./module/dex.html", () => {
            setStatisticsList();
            setDexList(dex_cats, 'cats', '만나지 못했습니다.');
            setDexList(dex_pisces, 'pisces', '발견하지 못했습니다.');
            setDexList(dex_achievement, 'achievement', '달성하지 못했습니다.');

            p.updateParameterValues();
        });

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

    setSkill(skill = p.data.skill) {
        const targetSkill = document.querySelector(`#context .skill.${skill}`);

        // 현재 선택된 스킬이 액티베이션 상태이면 액티베이션 취소
        if (targetSkill != null && targetSkill.classList.contains('activated')) {
            targetSkill.classList.remove('activated');
            p.data.skill = 'dummy'; // 선택 해제 시 스킬 정보 삭제
        } else {
            // 현재 선택된 스킬이 액티베이션 상태가 아니면 액티베이션 상태로 변경
            this.getSkill(skill);
            p.data.skill = skill;
            p.updateParameterValues();
        }
    }
    getSkill(skill = p.data.skill) {
        const targetSkill = document.querySelector(`#context .skill.${skill}`);
        document.querySelectorAll('#context .skill').forEach((e) => { e.classList.remove('activated'); });
        if (targetSkill != null) { targetSkill.classList.add('activated'); }
    }

    /**
     * 이벤트 위치를 기준으로 컨텍스트 메뉴를 표시합니다.
     * @param {Event} e - 컨텍스트 메뉴를 트리거한 이벤트입니다.
     */
    showContext(e) {
        // 컨텍스트 메뉴 생성 위치 계산
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

            sub_context.parentElement.onclick = (event) => {
                const check_is_not_null = event.target.querySelector('section.context');
                if (check_is_not_null != null) { check_is_not_null.classList.toggle('on'); }
            };
        });

    }

    setSelectCatOrSometing() {
        document.addEventListener('click', event => {
            document.querySelectorAll('.cat, .pisces, .pisces figure').forEach(event => {
                if (event.matches('.cat, .pisces')) event.classList.remove('selected');
                if (event.parentElement.matches('.pisces')) event.classList.remove('selected');
            });
            if (event.target.matches('.cat, .pisces')) { event.target.classList.add('selected'); }
            if (event.target.parentElement.matches('.pisces')) { event.target.parentElement.classList.add('selected'); }
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
                    p.data.work_start = document.querySelector('#settings input#work_start').value;
                    p.data.work_final = document.querySelector('#settings input#work_final').value;
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

class Dragable {
    constructor(elmnt) {
        this.element = elmnt;
        this.init();
    }

    init() {
        this.position = {};
        this.rect = this.element.getBoundingClientRect();

        this.element.onmousedown = (event) => this.startDragging(event);
        this.element.addEventListener('touchstart', (event) => this.startDragging({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }), { passive: true });

        document.addEventListener('mousemove', (event) => { this.drag(event) });
        document.addEventListener('touchmove', (event) => this.drag({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }), { passive: true });

        this.element.onmouseup = (event) => this.stopDragging(event);
        this.element.addEventListener('touchend', (event) => { this.stopDragging(event) });

        // 윈도 크기 변화할 경우 처리
        window.addEventListener('resize', () => { this.handleWindowResize() });

    }

    startDragging(e) {
        this.isDragging = true;
        this.rect = this.element.getBoundingClientRect();
        this.dragOffsetX = e.clientX - this.rect.left - this.rect.width / 2;
        this.dragOffsetY = e.clientY - this.rect.top - this.rect.height / 2;

        this.element.classList.add('drag');

    }

    drag(e) {
        if (!this.isDragging) return;

        // 드래그 중일 때, 새로운 위치로 이동
        const newX = e.clientX - this.dragOffsetX - this.rect.width / 2;
        const newY = e.clientY - this.dragOffsetY - this.rect.height / 2;

        // 화면 경계를 벗어나지 않도록 제한
        const maxX = window.innerWidth - this.rect.width;
        const maxY = window.innerHeight - this.rect.height;

        this.position.x = Math.max(0, Math.min(newX, maxX));
        this.position.y = Math.max(0, Math.min(newY, maxY));

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.bottom = 'auto';
        this.element.style.right = 'auto';


    }

    stopDragging() {
        this.isDragging = false;
        this.element.classList.remove('drag');
    }

    handleWindowResize() {
        if (window.innerWidth <= this.rect.width) {
            this.element.style.left = '';
            return;
        }

        const maxX = window.innerWidth - this.rect.width;
        const maxY = window.innerHeight - this.rect.height;

        // 위치 변경이 한 번도 없을 경우 이벤트 무시
        if (this.element.style.left === '') return;

        // 현재 위치가 화면을 벗어나면 새로운 위치로 설정
        this.position.x = Math.min(this.element.offsetLeft, maxX);
        this.position.y = Math.min(this.element.offsetTop, maxY);

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        // 현재 위치가 화면을 벗어나면 새로운 위치로 설정
    }
}