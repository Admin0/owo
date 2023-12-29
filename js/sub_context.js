class Context {
    constructor() {
        this.loadContextElement();
        this.loadMessagesElement();
        this.loadToastElement();
        this.setToasts();

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

            // 10 초 뒤 메시지 삭제
            setTimeout(() => {
                message_wrap.remove();
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

    dragElement(elmnt) {
        let isDragging = false;
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt.onmousedown = dragMouseDown;
        elmnt.addEventListener('touchstart', (event) => dragMouseDown({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }), { passive: true });

        document.onmousemove = elementDrag;
        document.addEventListener('touchmove', (event) => elementDrag({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }), { passive: true });

        elmnt.onmouseup = closeDragElement;
        elmnt.ontouchend = closeDragElement;


        // 윈도 크기 변화할 경우 처리
        window.onresize = handleWindowResize;

        function dragMouseDown(e) {
            isDragging = true;
            pos3 = e.clientX;
            pos4 = e.clientY;
        }

        function elementDrag(e) {
            if (!isDragging) return;

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const rect = elmnt.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width / 2;
            const maxY = window.innerHeight - rect.height / 2;

            // set the element's new position:
            elmnt.style.left = Math.max(rect.width / 2, Math.min(elmnt.offsetLeft - pos1, maxX)) + "px";
            elmnt.style.top = Math.max(rect.height / 2, Math.min(elmnt.offsetTop - pos2, maxY)) + "px";
        }

        function handleWindowResize() {
            // 위치 변경이 한 번도 없을 경우 이벤트 무시
            if (elmnt.style.left === '') return;

            const rect = elmnt.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width / 2;
            const maxY = window.innerHeight - rect.height / 2;

            // 현재 위치가 화면을 벗어나면 새로운 위치로 설정
            elmnt.style.left = Math.max(rect.width / 2, Math.min(elmnt.offsetLeft, maxX)) + "px";
            elmnt.style.top = Math.max(rect.height / 2, Math.min(elmnt.offsetTop, maxY)) + "px";
        }

        function closeDragElement() {
            isDragging = false;
        }
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