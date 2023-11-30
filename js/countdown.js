class countdown {
    constructor (target = '.countdown', options) {
        this.target = document.querySelector(target);
        return this;
    }

    set (target, options) {
        if (target != null) this.target = document.querySelector(target);

        function addElement(e, n, c) {
            e.appendChild(Object.assign(document.createElement(n), { className: c }));
        }
        addElement(this.target, 'span', 'numbox numh');
        addElement(this.target, 'span', 'numbox numm');
        addElement(this.target, 'span', 'numbox nums');
        addElement(this.target, 'span', 'numbox numc');

        return this;
    }

    target (querySelector) {
        this.target = document.querySelector(querySelector);
        return this;
    }

    start(obj) {countdown_function(p); return this;}
    stop(obj) {return this;}
}

function $(selector) { return document.querySelectorAll(selector).length == 1 ? document.querySelector(selector) : document.querySelectorAll(selector); }

let p = {
    id: '#page_1',
    date: { yyyy: new Date().getFullYear(), mm: new Date().getMonth(), dd: new Date().getDate() },

    get: (para) => { return new URLSearchParams(window.location.search).get(para) },
    has: (para) => { return new URLSearchParams(window.location.search).has(para) },
    set: (para, val) => { p[para] = val; localStorage.setItem(para, val); },
    set_push: function () {
        $('#setting input#work_start').value = this.work_start;
        $('#setting input#work_final').value = this.work_final;
        $('#setting input#payday').value = `${this.date.yyyy}-${this.date.mm + 1}-${this.payday}`;
        history.pushState('', '퇴근 시간을 알려주는 고양이', `?work_start=${this.work_start}&work_final=${this.work_final}&payday=${this.payday}`);
        clearTimeout(countdown_function);
        countdown_function(this);
    },

    work_start: function () { return this.has('work_start') ? this.get('work_start') : S('work_start') != null ? S('work_start') : '08:30' },
    work_final: function () { return this.has('work_final') ? this.get('work_final') : S('work_final') != null ? S('work_final') : '17:30' },
    lunch_start: '12:00',
    lunch_final: '13:00',
    payday: function () { return this.has('payday') ? this.get('payday') : S('payday') != null ? S('payday') : '25' },
}

p.work_start = p.work_start();
p.work_final = p.work_final();
p.payday = p.payday();

function S(key) { return localStorage.getItem(key); }

// settings
localStorage.setItem("work_start", p.work_start);
localStorage.setItem("work_final", p.work_final);
localStorage.setItem("payday", p.payday);
$('#setting input#work_start').value = p.work_start;
$('#setting input#work_final').value = p.work_final;
$('#setting input#payday').value = `${p.date.yyyy}-${p.date.mm + 1}-${p.payday}`;

$('#setting_bt').addEventListener("click", (e) => {
    const s = $('#setting');
    console.log(s.scrollHeight);
    s.style.height = !s.classList.contains('on') ? `${s.scrollHeight}px` : 0;
    console.log(s.scrollHeight);
    // s.style.height = 0; 
    s.classList.toggle('on');
    $('#setting_bt').classList.toggle('on');
});
$('#setting input').forEach((e) => {
    e.addEventListener("change", (e) => {
        p.set('work_start', $('#setting input#work_start').value);
        p.set('work_final', $('#setting input#work_final').value);
        p.set('payday', $('#setting input#payday').value.substring(8, 10));
        p.set_push();
    });
});


let IS_WEEKDAYS = new Date().getDay() != 0 && new Date().getDay() != 6 ? true : false;

function countdown_function(p) {

    id = p.id;
    yyyy = p.date.yyyy;
    mm = p.date.mm;
    dd = p.date.dd;

    function M(n) { return Math.floor(n / 1000); }
    function D(d) { return M(d / 24 / 60 / 60); }

    const TIME__NOW = new Date().getTime();

    const TIME__WORK_START = new Date(yyyy, mm, dd, p.work_start.substring(0, 2), p.work_start.substring(3, 5)).getTime();
    const TIME__WORK_FINAL = new Date(yyyy, mm, dd, p.work_final.substring(0, 2), p.work_final.substring(3, 5)).getTime();
    const IS_BEFORE_WORK = TIME__NOW > TIME__WORK_START ? false : true;
    const IS_AFTER_WORK = TIME__NOW > TIME__WORK_FINAL ? true : false;
    const DATE__WEEKEND = new Date(yyyy, mm, dd + 6 - new Date().getDay()).getTime();
    const DATE__PAYDAY = new Date(yyyy, mm, p.payday).getTime();
    const IS_PAYDAY_COME_BEFORE_WEEKEND = TIME__NOW < DATE__PAYDAY && DATE__PAYDAY < DATE__WEEKEND ? true : false;
    // const IS_WEEKDAYS = new Date().getDay() != 0 && new Date().getDay() != 6 ? true : false;

    const hour = IS_BEFORE_WORK ? p.work_start.substring(0, 2) : p.work_final.substring(0, 2);
    const min = IS_BEFORE_WORK ? p.work_start.substring(3, 5) : p.work_final.substring(3, 5);
    const time_end = new Date(yyyy, mm, dd, hour, min).getTime();
    let dday, days, hours, minutes, seconds, centiseconds;

    dday = time_end - TIME__NOW;


    if (IS_WEEKDAYS) {
        $('h2 .msg').innerText = IS_BEFORE_WORK ? '출근까지 남은 시간' : !IS_AFTER_WORK ? '퇴근까지 남은 시간' : '퇴근 시간이다옹!';
        $('h2 .msg').innerText += dday < 60 * 60 * 1000 ? '🔥' : '';
        $('h2 .dday').innerText = IS_PAYDAY_COME_BEFORE_WEEKEND ? `월급일까지 D-${D(DATE__PAYDAY - TIME__NOW) + 1}` : `주말까지 D-${D(DATE__WEEKEND - TIME__NOW) + 1}`
        $('h2 .dday').innerText += TIME__NOW < DATE__PAYDAY && D(DATE__PAYDAY - TIME__NOW) <= 0 ? '💰' : '';
        $('h2 .dday').innerText += D(DATE__WEEKEND - TIME__NOW) <= 0 ? '🔥' : '';
    } else {
        $('h2 .msg').innerText = '주말이다냥💖';
    }

    if (dday >= 0 && IS_WEEKDAYS) {
        days = M(dday / 24 / 60 / 60);
        hours = M((dday - days * 24 * 60 * 60 * 1000) / 60 / 60);
        minutes = M((dday - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000) / 60);
        seconds = M(dday - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000);
        centiseconds = M((dday - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000) * 100);

        var count_list = [
            // [`#${id} .numd`, days],
            [`${id} .numh`, hours],
            [`${id} .numm`, minutes],
            [`${id} .nums`, seconds],
            [`${id} .numc`, centiseconds]
        ];
        for (i = 0; i < count_list.length; i++) {
            let num = $(count_list[i][0]);
            if (count_list[i][1] < 10) count_list[i][1] = '0' + count_list[i][1];
            if (num.textContent != count_list[i][1]) {
                num.textContent = count_list[i][1];
                num.classList.remove('on');
            } else {
                num.classList.add('on');
            }
            document.title = `OwO [ ${count_list[0][1]}:${count_list[1][1]}:${count_list[2][1]} ]`;
        }
        // $(`#${id} .dday`).innerText = `${yyyy}.${mm + 1}.${dd}. / D-${days + 1}`;
        $('body').classList.add('on');
        setTimeout(countdown_function, 10, p);
    } else {
        $(`${id} .countdown`).innerHTML = '<span class="numbox numh">00</span><span class="numbox numm">00</span><span class="numbox nums">00</span><span class="numbox numc">00</span>';
        document.title = `UwU [ 00:00:00 ]`;
        $('body').classList.remove('on');

        let days = -(M(dday / 24 / 60 / 60) + 1);
        if (days == 0) {
            // $(`#${id} .dday`).innerHTML = `${yy}.${mm + 1}.${dd}. / D-Day`;
        } else {
            // $(`#${id} .dday`).innerHTML = `${yy}.${mm + 1}.${dd}. / D+${days}`;
        }
        clearTimeout(countdown_function);
    }
}


