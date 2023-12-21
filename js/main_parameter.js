class Parameter {
    constructor() {
        // 로컬 스토리지에서 파라미터 값을 가져오거나 기본값으로 설정
        this.val = localStorage.owo_parameters != null ? JSON.parse(localStorage.owo_parameters) : {};

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
    setParaFromURL() {
        history.pushState('', '퇴근 시간을 알려주는 고양이', `?work_start=${this.val.work_start}&work_final=${this.val.work_final}&payday=${this.val.payday}`);
    }
    
    // URL에서 파라미터 값을 가져오는 메서드
    getParaFromURL() {
        // URL에서 작업 시작, 종료 및 월급일 정보를 가져와 설정
        this.val.work_start = new URLSearchParams(window.location.search).get('work_start') || this.val.work_start || '08:30';
        this.val.work_final = new URLSearchParams(window.location.search).get('work_final') || this.val.work_final || '17:30';
        this.val.payday = new URLSearchParams(window.location.search).get('payday') || this.val.payday || '25';
    }

    setCountdownNewValue(countdownObject){
        countdownObject.setTime(this.val.work_final);
    }

    // 파라미터 값을 가져오는 메서드
    // get(para) { return new URLSearchParams(window.location.search).get(para); }

    // 파라미터가 존재하는지 확인하는 메서드
    // has(para) { return new URLSearchParams(window.location.search).has(para); }

    // 파라미터 값을 설정하고 업데이트하는 메서드
    // set(para, val) { p.val[para] = val; this.updateParameterValues(); }

    // 설정 값을 업데이트하고 URL을 업데이트하는 메서드
    // set_push() {
    //     // document.querySelector('#settings input#work_start').value = this.val.work_start;
    //     // document.querySelector('#settings input#work_final').value = this.val.work_final;
    //     // document.querySelector('#settings input#payday').value = `${this.val.date.yyyy}-${this.val.date.mm + 1}-${this.val.payday}`;
    //     this.setParaFromURL();
    //     cd.setTime(this.val.work_final);
    // }

    // 파라미터 값을 업데이트하는 메서드
    updateParameterValues() {
        // 화면에 자원 값 및 공급품 정보를 업데이트하고 로컬 스토리지에 저장
        document.querySelector('#minerals .val').textContent = this.val.resources.minerals;
        this.val.resources.supplies = cats.length;
        document.querySelector('#supplies .val').textContent = `${this.val.resources.supplies}/${this.val.resources.suppliesMax}`;
        localStorage.setItem('owo_parameters', JSON.stringify(this.val));
    }
}
