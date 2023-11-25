const p = {
    date: { yyyy: new Date().getFullYear(), mm: new Date().getMonth(), dd: new Date().getDate() },

    get: (para) => { return new URLSearchParams(window.location.search).get(para) },
    has: (para) => { return new URLSearchParams(window.location.search).has(para) },
    set: (para, val) => { pages[para] = val; localStorage.setItem(para, val); },
    set_push: () => {
        $('#setting input#work_start').value = pages.work_start;
        $('#setting input#work_final').value = pages.work_final;
        $('#setting input#payday').value = `${p.date.yyyy}-${p.date.mm + 1}-${pages.payday}`;
        history.pushState('', '퇴근 시간을 알려주는 고양이', `?work_start=${pages.work_start}&work_final=${pages.work_final}&payday=${pages.payday}`);
        clearTimeout(countdown);
        countdown('page_1', p.date.yyyy, p.date.mm, p.date.dd, pages);
    }
}

function S(key) {
    return localStorage.getItem(key);
}

function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}

function dbg() { // for debug
    p.set('work_start', '08:00');
    p.set('work_final', `${new Date().getHours() + 1}:${new Date().getMonth()}`);
    p.set('payday', new Date().getDate() + 1);
    p.set_push();
}

const pages = {
    id: 'page_1',
    work_start: p.has('work_start') ? p.get('work_start') : S('work_start') != null ? S('work_start') : '08:30',
    work_final: p.has('work_final') ? p.get('work_final') : S('work_final') != null ? S('work_final') : '17:30',
    lunch_start: '12:00',
    lunch_final: '13:00',
    payday: p.has('payday') ? p.get('payday') : S('payday') != null ? S('payday') : '25'
};

// settings
localStorage.setItem("work_start", pages.work_start);
localStorage.setItem("work_final", pages.work_final);
localStorage.setItem("payday", pages.payday);
$('#setting input#work_start').value = pages.work_start;
$('#setting input#work_final').value = pages.work_final;
$('#setting input#payday').value = `${p.date.yyyy}-${p.date.mm + 1}-${pages.payday}`;

$('#setting_bt').addEventListener("click", (e) => { $('#setting').classList.toggle('on'); $('#setting_bt').classList.toggle('on') });
$$('#setting input').forEach((e) => {
    e.addEventListener("change", (e) => {
        p.set('work_start', $('#setting input#work_start').value);
        p.set('work_final', $('#setting input#work_final').value);
        p.set('payday', $('#setting input#payday').value.substring(8, 10));
        p.set_push();
    });
})
// $('#book').onmouseleave = (e) => { $('#setting').classList.remove('on') };


// new URL(window.location.href).searchParams.get('work_start');

function M(n) {
    return Math.floor(n / 1000);
}

function D(d) {
    return M(d / 24 / 60 / 60);
}

const d = new Date();
const yyyy = p.date.yyyy;
const mm = p.date.mm;
const dd = p.date.dd;

countdown('page_1', yyyy, mm, dd, pages);

function countdown(id, yyyy, mm, dd, pages) {

    const TIME__NOW = new Date().getTime();

    const TIME__WORK_START = new Date(yyyy, mm, dd, pages.work_start.substring(0, 2), pages.work_start.substring(3, 5)).getTime();
    const TIME__WORK_FINAL = new Date(yyyy, mm, dd, pages.work_final.substring(0, 2), pages.work_final.substring(3, 5)).getTime();
    const IS_BEFORE_WORK = TIME__NOW > TIME__WORK_START ? false : true;
    const IS_AFTER_WORK = TIME__NOW > TIME__WORK_FINAL ? true : false;
    const DATE__WEEKEND = new Date(yyyy, mm, dd + 6 - new Date().getDay()).getTime();
    const DATE__PAYDAY = new Date(yyyy, mm, pages.payday).getTime();
    const IS_PAYDAY_COME_BEFORE_WEEKEND = DATE__PAYDAY < DATE__WEEKEND ? true : false;

    const hour = IS_BEFORE_WORK ? pages.work_start.substring(0, 2) : pages.work_final.substring(0, 2);
    const min = IS_BEFORE_WORK ? pages.work_start.substring(3, 5) : pages.work_final.substring(3, 5);
    const time_end = new Date(yyyy, mm, dd, hour, min).getTime();
    let dday, days, hours, minutes, seconds, centiseconds;

    dday = time_end - TIME__NOW;

    $('h2 .msg').innerText = IS_BEFORE_WORK ? '출근까지 남은 시간' : !IS_AFTER_WORK ? '퇴근까지 남은 시간' : '퇴근 시간이다옹!';
    $('h2 .msg').innerText += dday < 60 * 60 * 1000 ? '🔥' : '';
    $('h2 .dday').innerText = IS_PAYDAY_COME_BEFORE_WEEKEND ? `월급일까지 D-${D(DATE__PAYDAY - TIME__NOW) + 1}` : `주말까지 D-${D(DATE__WEEKEND - TIME__NOW) + 1}`
    $('h2 .dday').innerText += D(DATE__PAYDAY - TIME__NOW) <= 0 ? '💰' : '';
    $('h2 .dday').innerText += D(DATE__WEEKEND - TIME__NOW) <= 0 ? '🔥' : '';

    if (dday >= 0) {
        days = M(dday / 24 / 60 / 60);
        hours = M((dday - days * 24 * 60 * 60 * 1000) / 60 / 60);
        minutes = M((dday - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000) / 60);
        seconds = M(dday - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000);
        centiseconds = M((dday - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000) * 100);

        var count_list = [
            // [`#${id} .numd`, days],
            [`#${id} .numh`, hours],
            [`#${id} .numm`, minutes],
            [`#${id} .nums`, seconds],
            [`#${id} .numc`, centiseconds]
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
        setTimeout(countdown, 10, id, yyyy, mm, dd, pages);
    } else {
        $(`#${id} .countdown`).innerHTML = '<span class="numbox numh">00</span>:<span class="numbox numm">00</span>:<span class="numbox nums">00</span>:<span class="numbox numc">00</span>';
        document.title = `UwU [ 00:00:00 ]`;
        $('body').classList.remove('on');

        let days = -(M(dday / 24 / 60 / 60) + 1);
        if (days == 0) {
            // $(`#${id} .dday`).innerHTML = `${yy}.${mm + 1}.${dd}. / D-Day`;
        } else {
            // $(`#${id} .dday`).innerHTML = `${yy}.${mm + 1}.${dd}. / D+${days}`;
        }
        clearTimeout(countdown);
    }
}


