class Countdown {

    /**
     * 
     * @param {string} query_selector 
     * @param {*} time 
     * @param {Object} options 
     * @returns 
     */
    constructor(query_selector, time, options) {

        this.setTarget(query_selector);
        this.setTime(time);
        this.setOptions(options);

        return this;
    }

    set(query_selector, time, options) {
        this.setTarget(query_selector);
        this.setTime(time);
        this.setOptions(options);
        return this;
    }

    /**
     * 타이머 요소를 선택해봅시다.
     * @param {string} querySelector 
     * @returns {Object} self
     */
    setTarget(query_selector = '.countdown') {
        this.target = document.querySelector(query_selector);
        return this;
    }

    /**
     * 타이머가 끝날 시간을 설정해봅시다.
     * @param {string} time 00:00 => 00시 00분까지 , +0 => 0시간 뒤까지, 0(숫자) => 0시간 뒤까지.
     */
    setTime(time = 1) {
        const d = new Date();
        if (time == null) {
            this.time = d.setHours(d.getHours() + 1);
        } else if (typeof time == 'number') {
            this.time = d.setHours(d.getHours() + time);
            return this;
        } else {
            if (time.substring(2, 3) == ':') {  // time_end
                this.time = d.setHours(time.substring(0, 2), time.substring(3, 5));
            } else if (time.substring(0, 1) == '+') {   // time_after
                this.time = d.setHours(d.getHours() + Number(time.substring(time.length - 1)));
            }
        }
        return this;
    }

    /**
     * 여러가지 옵션들을 설정해봅시다.
     * @param {*} options 
     * @param {*} options.timer_head 타이머 머리 단위 설정. d:일, h:시간, m:분
     * @param {*} options.timer_tail 타이머 꼬리 단위 설정. h:시간, m:분, s:초, c:센티초
     * 
     */
    setOptions(options = { timer_head: 'd', timer_tail: 'c' }) { if (options != null) this.options = options; return this; }

    time_fragment = {
        d: 0, h: 0, m: 0, s: 0, c: 0
    }

    countdown(timer_head_index = 1, timer_tail_index = 5) {
        function M(n) { return Math.floor(n / 1e3); }
        function D(d) { return M(d / 24 / 60 / 60); }
        const T = this.time_fragment;

        let TIME__NOW, TIME__END;
        TIME__NOW = new Date().getTime();
        TIME__END = new Date(this.time).getTime();
        T.STD = TIME__END - TIME__NOW;

        if (T.STD > 0) {
            T.d = timer_head_index > 0 ? 0 : M(T.STD / 864e2);
            T.h = timer_head_index > 1 ? 0 : M((T.STD - T.d * 864e5) / 36e2);
            T.m = timer_head_index > 2 ? 0 : M((T.STD - T.d * 864e5 - T.h * 36e5) / 60);
            T.s = timer_head_index > 3 ? 0 : M(T.STD - T.d * 864e5 - T.h * 36e5 - T.m * 60 * 1e3);
            T.c = M((T.STD - T.d * 864e5 - T.h * 36e5 - T.m * 6e4 - T.s * 1e3) * 1e2);

        } else {
            T.d = T.h = T.m = T.s = T.c = 0;
            // e.querySelectorAll('.numbox').forEach((e) => { e.textContent = '00' });
        }
        return this;
    }

    toFullLength(v) { if (v < 10) v = '0' + v; return v; }

    /**
     * 시간이 얼마나 남았는지 문자열로 반환합니다.
     * @param {string} s 구분자입니다. ':', '-', ' ' 등을 사용해보세요. 기본값 ':'.
     * @returns 
     */
    get(s = ':', full_length = true) {
        return this.getDays() + s + this.getHours() + s + this.getMins() + s + this.getSecs() + s + this.getcSecs();
    }

    getDays(full_length = true) { return full_length ? this.toFullLength(this.time_fragment.d) : this.time_fragment.d; }
    getHours(full_length = true) { return full_length ? this.toFullLength(this.time_fragment.h) : this.time_fragment.h }
    getMins(full_length = true) { return full_length ? this.toFullLength(this.time_fragment.m) : this.time_fragment.m }
    getSecs(full_length = true) { return full_length ? this.toFullLength(this.time_fragment.s) : this.time_fragment.s }
    getcSecs(full_length = true) { return full_length ? this.toFullLength(this.time_fragment.c) : this.time_fragment.c }

    isIgnited() { return this.time_fragment.STD <= 0 }

    /**
     * 타이머를 시작합니다.
     */
    start() {
        const timer_elements = ['d', 'h', 'm', 's', 'c'];
        const timer_head_index = timer_elements.indexOf(this.options.timer_head);
        const timer_tail_index = timer_elements.indexOf(this.options.timer_tail) + 1;
        if (!this.target.contains(document.querySelector('.numbox'))) {
            timer_elements.slice(timer_head_index, timer_tail_index).forEach(e => {
                this.target.appendChild(
                    Object.assign(
                        document.createElement('span'), { className: `numbox num_${e}` }
                    ));
            });
        }
        if (!this.target.contains(document.querySelector('.separator'))) {
            document.querySelectorAll('.numbox:not(:last-child)').forEach(e => {
                const separator = Object.assign(document.createElement('span'), {
                    className: 'separator', innerText: ':'
                });
                e.parentNode.insertBefore(separator, e.nextSibling);
            });
        }
        this.countdown(timer_head_index, timer_tail_index);
        const T = this.time_fragment;
        [
            { key: this.target.querySelector('.num_d'), val: T.d },
            { key: this.target.querySelector('.num_h'), val: T.h },
            { key: this.target.querySelector('.num_m'), val: T.m },
            { key: this.target.querySelector('.num_s'), val: T.s },
            { key: this.target.querySelector('.num_c'), val: T.c },
        ].slice(timer_head_index, timer_tail_index).forEach((e, i) => {
            const fullLengthValue = this.toFullLength(e.val);
            if (e.key.textContent != fullLengthValue) {
                e.key.classList.add('on');
                e.key.textContent = fullLengthValue;

                // 값이 바뀌면 0.25초 후에 'on' 클래스를 확인하고 삭제 / 단, 센티초는 계속 켜짐
                if (e.key != this.target.querySelector('.num_c')) {
                    setTimeout(() => {
                        e.key.classList.remove('on');
                    }, 250);
                }
            } else {
                // 값이 바뀌지 않으면 센티초의 경우에 'on' 클래스 제거
                if (e.key == this.target.querySelector('.num_c')) {
                    setTimeout(() => {
                        e.key.classList.remove('on');
                    }, 250);
                }
            }
        });

        this.timeout = setTimeout(() => this.start(), 10);

        return this;
    }
    /**
     * 타이머를 종료합니다.
     */
    stop() {
        clearTimeout(this.timeout);
        console.log('countdown is stopped');
        return this;
    }

}