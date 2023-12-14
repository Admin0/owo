const context = {
    element: document.querySelector("#context"),
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
    },
    getDevMode() {
        return localStorage.getItem('dev_mode') == 'true' ? true : false;
    },
    skill: {
        summonMassiveCats(n) {
            for (let i = 0; i < n; i++) {
                cats.push(new Cat());
                if (context.getDevMode()) cats[cats.length - 1].infoWindow.style.display = 'block';
            }
        },
        summonMassiveFishs(n) {
            for (let i = 0; i < n; i++) {
                fishs.push(new Fish().setType('fish'));
            }
        },
        summonMassiveCucumbers(n) {
            for (let i = 0; i < n; i++) {
                fishs.push(new Fish().setType('cucumber'));
            }
        },
        summonMassiveMinerals(n) {
            for (let i = 0; i < n; i++) {
                fishs.push(new Fish().setType('mineral'));
            }
        },
        summonAll(n) {
            for (let i = 0; i < n; i++) {
                fishs.push(new Fish().setType('fish'));
                fishs.push(new Fish().setType('cucumber'));
                fishs.push(new Fish().setType('mineral'));
            }
        }
    },
    setSkill(skill = localStorage.skill) {
        document.querySelectorAll('#context .skill').forEach((e) => { e.classList.remove('activated'); });
        localStorage.setItem('skill', skill);
        const targetSkill = document.querySelector(`#context .skill.${skill}`)
        if (targetSkill != null) targetSkill.classList.add('activated');
    }
};

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    context.setDevMode();
    context.setSkill();

    if (!is_mobile) {
        function set_location() {
            const rect = context.element.getBoundingClientRect();
            // console.log(`window.innerWidth: ${window.innerWidth} / rect.width: ${rect.width} / e.pageX: ${e.pageX}`);
            // console.log(`window.innerHeight: ${window.innerHeight} / rect.height: ${rect.height} / e.pageY: ${e.pageY} / document.documentElement.scrollTop: ${document.documentElement.scrollTop}`);
            context.x = window.innerWidth - rect.width > e.pageX ? e.pageX : window.innerWidth - rect.width;

            if (window.innerHeight - rect.height > e.pageY - document.documentElement.scrollTop) {
                context.y = e.pageY - document.documentElement.scrollTop;
            } else {
                context.y = window.innerHeight - rect.height;
            }
            context.element.style.left = `${context.x}px`;
            context.element.style.top = `${context.y}px`;
            context.element.classList.add("on");

            // context.element.querySelector('section.context').parent().hover(function () { //하위 메뉴 항목
            //     if (window.innerWidth - rect.width - this.children().last().outerWidth() > e.pageX) {
            //         context.sub.x = 'calc(100% - .5em)';
            //     } else {
            //         context.sub.x = 'calc(' + (-$(this).children().last().outerWidth()) + 'px + .5em)';
            //     }
            //     if (window.innerHeight - this.position().top > this.children().last().outerHeight()) {
            //         context.sub.y = this.position().top - 7 + 'px';
            //     } else {
            //         context.sub.y = window.innerHeight - context.position().top - this.children().last().outerHeight() + "px";
            //     }
            //     $(this).children().last().css({
            //         'left': context.sub.x,
            //         'top': context.sub.y
            //     });
            // }).on("click", function (e) {
            //     context.classList.remove("on");
            // });
        }
        set_location();
    } else {
        if ($('nav').attr('class') != 'on') {
            $('nav, #nav_bg').classList.add('on');
        } else {
            $('nav, #nav_bg').classList.remove('on');
        }
    }
}, false);

document.addEventListener("click", (e) => {
    const context = document.querySelector("#context");
    const keepElements = document.querySelectorAll('#context .skill');
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


