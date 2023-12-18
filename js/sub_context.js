class Context {
    constructor() {
        this.setContextElement();
        this.setMessagesElement();
        this.initializeSkills(this);
    }

    setElement(element, module) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            element.innerHTML = this.responseText;
        }
        xhttp.open("GET", module, true);
        xhttp.send();

        // this.element = document.querySelector(selector);
        this.sub = { element: null }
    }

    setContextElement() {
        this.element = document.createElement('section');
        this.element.id = 'context';
        document.body.appendChild(this.element);

        // 컨텍스트 메뉴 로드
        this.setElement(this.element, "./module/context.html")

        // this.element = document.querySelector(selector);
        this.sub = { element: null }
    }

    setMessagesElement() {
        this.messages = document.createElement('section');
        this.messages.id = 'messages';
        document.body.appendChild(this.messages);
    }
    setMessage(string) {
        const d = new Date();
        const z = number => (number < 10 ? '0' : '') + number;
        const message = document.createElement('div')
        message.innerText = `[${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}] ${string}`;
        document.getElementById(this.messages.id).appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 5000);

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
        cats.forEach(cat => { cat.infoWindow.style.display = isDevMode ? 'block' : 'none'; });
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

    initializeSkills(parent) {
        this.skill = {
            summonCat(pos) {
                if (p.resources.supplies < p.resources.suppliesMax) {
                    const cat = new Cat(pos).setMeow('Eow');
                    cats.push(cat);
                    parent.setMessage(`${cat.skin}에게 간택 당했습니다. `);
                    p.updateResources();
                } else {
                    parent.setMessage('보급고가 부족합니다.');
                }
            },
            summonMassiveCats(n) {
                for (let i = 0; i < n; i++) {
                    this.summonCat();
                }
            },
            summonFish(pos) {
                const cost = 1;
                if (p.resources.minerals - cost >= 0) {
                    p.resources.minerals -= cost;
                    pisces.push(new Fish(pos).setType('fish'));
                    parent.setMessage('생선을 소환했습니다.');
                    p.updateResources();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                }
            },
            summonMassiveFishs(n) {
                for (let i = 0; i < n; i++) {
                    this.summonFish();
                }
            },
            summonCucumber(pos) {
                pisces.push(new Fish(pos).setType('cucumber'));
                parent.setMessage('오이를 소환했습니다.');
                p.updateResources();
            },
            summonMassiveCucumbers(n) {
                for (let i = 0; i < n; i++) {
                    this.summonCucumber();
                }
            },
            summonMineral(pos) {
                const cost = 0;
                if (p.resources.minerals - cost >= 0) {
                    p.resources.minerals -= cost;
                    pisces.push(new Fish(pos).setType('mineral'));
                    parent.setMessage('광물을 소환했습니다.');
                    p.updateResources();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                }
            },
            summonMassiveMinerals(n) {
                for (let i = 0; i < n; i++) {
                    this.summonMineral()
                }
            },
            summonYarnball(pos) {
                const cost = 50;
                if (p.resources.minerals - cost >= 0) {
                    p.resources.minerals -= cost;
                    pisces.push(new Fish(pos).setType('yarnball'));
                    parent.setMessage('털실 공을 소환했습니다.');
                    p.updateResources();
                } else {
                    parent.setMessage('광물이 부족합니다.');
                }
            },
            summonMassiveYarnballs(n) {
                for (let i = 0; i < n; i++) {
                    this.summonYarnball();
                }
            },
            summonAll(n) {
                for (let i = 0; i < n; i++) {
                    this.summonFish();
                    this.summonCucumber();
                    this.summonMineral();
                }
            },
            clearAllPisces() {
                pisces.forEach(fish => { fish.remove(); });
                pisces.length = 0;
            }
        }
    }

    setSkill(skill = localStorage.skill) {
        const targetSkill = document.querySelector(`#context .skill.${skill}`);

        // 현재 선택된 스킬이 액티베이션 상태이면 액티베이션 취소
        if (targetSkill != null && targetSkill.classList.contains('activated')) {
            targetSkill.classList.remove('activated');
            localStorage.removeItem('skill'); // 선택 해제 시 스킬 정보 삭제
        } else {
            // 현재 선택된 스킬이 액티베이션 상태가 아니면 액티베이션 상태로 변경
            this.getSkill(skill);
            localStorage.setItem('skill', skill);
        }
    }
    getSkill(skill = localStorage.skill) {
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
                e.target.querySelector('section.context').classList.toggle('on');
            })
        });
    }
}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    context.setDevMode();
    context.getSkill();
    context.showContext(e);
}, false);

document.addEventListener("click", (e) => {
    const context = document.querySelector("#context");
    const keepElements = document.querySelectorAll('#context .skill, #context .sub');
    const isClickedOnKeeps = Array.from(keepElements).some(keepElement => keepElement.contains(e.target));
    if (document.querySelector('#context.on') != null) {
        if (isClickedOnKeeps) {
            // console.log(`context: 1`);
        } else {
            context.classList.remove("on");
            // console.log(`context: 2`);
        }
    } else {
        // console.log(`context: 3`);
        context.classList.remove("on");
    }
    // console.log(`context: 4`);
    // context.classList.remove("on");
});


