class Cat {
    /**
     * 
     * @param {*} position 고양이의 위치를 지정합니다. 미지정 시 임의 위치에 고양이가 생성됩니다.
     * @param {*} skin 고양이 스킨을 지정합니다. 미지정 시 임의 스킨이 지정됩니다.
     * @returns 
     */
    constructor(position, skin) {
        // 초기화 메서드 호출
        this.initialize(position, skin);

        // 드래그 앤 드롭 관련 속성 추가
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // 드래그 앤 드롭 이벤트 리스너 등록
        this.element.addEventListener('mousedown', (event) => this.startDragging(event));
        document.addEventListener('mousemove', (event) => this.drag(event));
        this.element.addEventListener('mouseup', (event) => this.stopDragging(event));
        // 모바일 이벤트 리스너 등록
        this.element.addEventListener('touchstart', (event) => this.startDragging({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }), { passive: true });
        document.addEventListener('touchmove', (event) => this.drag({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }));
        this.element.addEventListener('touchend', () => this.stopDragging());

        // 화면 크기 변경 시 이벤트
        window.addEventListener("resize", () => this.handleWindowResize());

        return this;
    }

    /**
     * 
     * @param {*} skin 고양이 스킨을 지정합니다. 미지정 시 임의 스킨이 지정됩니다. 
     */
    setSkin(skin) {

        // 기존 스킨 제거
        dex_cats.forEach(cat => { this.element.classList.remove(cat.id) });

        // Lv.0 스킨 랜덤 부여
        const skins = ['흰냥이', '치즈', '고등어', '깜냥이', '젖소', '턱시도', '샴'];
        // const skins = ['map'];

        const skin_index = Math.floor(Math.random() * skins.length);
        this.skin = skin == null ? skins[skin_index] : skin
        this.element.classList.add(this.skin);
        // this.element.style.backgroundImage = `url('./img/cat_skin_${skin == null ? skins[skin_index] : skin}.png')`;

        if (skin === '우유') this.element.classList.add('special');

        // css 설정
        this.element.style.setProperty("--cat-skin-url", `url('../img/cat_skin_${this.skin}.png')`);

        // 통계를 위해서 넣었습니다
        if (p !== null) {
            p.data.achievement[`CATS__${this.skin}`] = (p.data.achievement[`CATS__${this.skin}`] || 0) + 1;
            p.data.achievement.CATS__total = (p.data.achievement.CATS__total || 0) + 1;
        }

        // 도전 과제 달성 확인
        events.똑같은_영웅도_환영(skins);

        return this;
    }

    initialize(pos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }, skin) {
        // 객체 생성
        this.element = document.createElement('div');
        this.element.className = 'cat';
        document.getElementById('cage').appendChild(this.element);
        // document.body.appendChild(this.element);

        // 본체 이미지를 표시할 공간
        this.figure = document.createElement('figure');
        this.element.appendChild(this.figure);

        // 고양이 정보를 표시할 창
        this.infoWindow = document.createElement('div');
        this.infoWindow.className = 'info-window';
        this.element.appendChild(this.infoWindow);

        // 고양이 체력바를 표시할 창
        this.hpBar = document.createElement('div');
        this.hpBar.className = 'hp-bar';
        this.element.appendChild(this.hpBar);

        this.hp = 50;
        this.hp_max = 50;

        // 50% 확률로 초기 움직임 설정
        this.isMoving = Math.random() > 0.5;

        // 초기 위치 랜덤 설정
        const rect = this.element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        this.position = {
            x: Math.max(0, Math.min(pos.x, maxX)),
            y: Math.max(0, Math.min(pos.y, maxY))
        };

        // 초기 위치 스타일 적용
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        // 초기 각도 및 속도 랜덤 설정
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 5 + 1;

        // 고양이 색깔 지정
        this.setSkin(skin);

        // 소환 이벤트
        this.toggleMovement('drag');
        setTimeout(() => {
            this.element.classList.remove('drag');
            this.toggleMovement('stop');
        }, 250);

        this
            .startMoving()          // 초기 이동 시작
            .updateInfoWindow()     // 고양이 정보 창 업데이트
            .updateHpBar();         // 고양이 체력 바 업데이트

        return this;
    }

    moveCat() {
        if (!this.isMoving) {
            return;
        }

        const deltaX = this.speed * Math.cos(this.angle);
        const deltaY = this.speed * Math.sin(this.angle);

        const rect = this.element.getBoundingClientRect();
        const newX = rect.left + deltaX;
        const newY = rect.top + deltaY;

        // 화면 경계를 벗어나면 방향을 바꿈
        if (newX < 0 || newX + rect.width > window.innerWidth) {
            this.angle = Math.PI - this.angle;
        }
        if (newY < 0 || newY + rect.height > window.innerHeight) {
            this.angle = -this.angle;
        }

        this.position.x = newX;
        this.position.y = newY;

        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;

        // 고양이 달리기 걷기 클래스 업데이트
        this.element.classList.add(this.speed > 3 ? 'run' : 'walk');

        // 고양이 방향 클래스 업데이트
        this.element.classList.remove('left', 'right');
        this.element.classList.add(deltaX > 0 ? 'right' : 'left');

        // 고양이 정보 창 업데이트
        this.updateInfoWindow();

        // 생선이랑 충돌 이벤트
        pisces.forEach(fish => { fish.activateWithCat([this]) });

    }

    toggleMovement(action) {
        this.isMoving = !this.isMoving;

        // 이동 관련 클래스 삭제
        this.element.classList.remove('walk', 'run', 'wash', 'lick', 'stretch', 'watch', 'surprised');

        if (action == undefined) {
            if (this.isMoving) {
                // 이동 중일 때, 랜덤한 방향과 속도 설정
                this.angle = Math.random() * 2 * Math.PI;
                this.speed = Math.random() * 5 + 1;

                // 방향성 애니메이션 클래스 삭제
                this.element.classList.remove('left', 'right');
            } else {
                // 이동이 정지되었을 때, 랜덤한 클래스 추가
                const randomClasses = ['cat', 'cat', 'cat', 'wash', 'lick', 'stretch', 'watch'];
                const randomClassIndex = Math.floor(Math.random() * randomClasses.length);
                const randomClass = randomClasses[randomClassIndex];
                this.element.classList.add(randomClass);

                switch (randomClass) {
                    // 스트레칭 이후에 동작 이후에 꼬리흔들기 시작
                    case 'stretch':
                        setTimeout(() => { this.toggleMovement('stop'); }, 1000);
                        break;
                    default:
                        break;
                }
            }
        } else {
            this.isMoving = false;

            // 지정된 움직임이 있을 때
            const randomClass = action;
            this.element.classList.add(action);
            switch (action) {
                case 'surprised':
                    // 놀라는 동작 이후에 꼬리흔들기 시작
                    setTimeout(() => { this.toggleMovement('stop'); }, 1000);
                    break;
                default:
                    break;
            }

        }

        // 고양이 정보 창 업데이트
        this.updateInfoWindow();

        return this;
    }

    startMoving() {
        this.stopMoving();

        // 일정한 간격으로 고양이 이동
        this.moveCatInterval = setInterval(() => this.moveCat(), 30);

        // 일정한 간격으로 움직임 토글
        this.toggleMovementInterval = setInterval(() => this.toggleMovement(), Math.random() * 5000 + 1000);

        return this;
    }

    stopMoving() {
        clearInterval(this.moveCatInterval);
        clearInterval(this.toggleMovementInterval);
    }

    startDragging(event) {
        // 드래그 시작 시 위치 오프셋 설정
        this.isDragging = true;
        const rect = this.element.getBoundingClientRect();
        this.dragOffsetX = event.clientX - rect.left;
        this.dragOffsetY = event.clientY - rect.top;

        // 이동 관련 클래스 삭제 및 이동 중지
        this.element.classList.remove('walk', 'run', 'wash', 'lick', 'stretch', 'watch', 'surprised');
        this.stopMoving();

        // 드래그 클래스 추가
        this.element.classList.add('drag');
        this.setMeow('Hoe?');
    }

    drag(event) {
        // 드래그 중일 때, 새로운 위치로 이동
        if (this.isDragging && !this.element.classList.contains('유령')) {
            const newX = event.clientX - this.dragOffsetX;
            const newY = event.clientY - this.dragOffsetY;

            const setDirection = (direction) => {
                const oppositeDirection = direction === 'left' ? 'right' : 'left';
                this.element.classList.remove(oppositeDirection);
                this.element.classList.add(direction);
            }

            if (this.position.x > event.clientX - this.dragOffsetX) {
                setDirection('left');
            } else if (this.position.x < event.clientX - this.dragOffsetX) {
                setDirection('right');
            }

            // 화면 경계를 벗어나지 않도록 제한
            const maxX = window.innerWidth - this.element.clientWidth;
            const maxY = window.innerHeight - this.element.clientHeight;

            this.position.x = Math.max(0, Math.min(newX, maxX));
            this.position.y = Math.max(0, Math.min(newY, maxY));

            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${this.position.y}px`;

            // 정보 창 업데이트
            this.updateInfoWindow();
        }
    }

    stopDragging() {
        // 드래그 종료 시 상태 초기화 및 이동 재개
        this.isDragging = false;
        this.element.classList.remove('drag');
        this.toggleMovement();
        this.startMoving();

        // 생선이랑 충돌 이벤트
        pisces.forEach(fish => { fish.activateWithCat([this]); });
    }

    handleWindowResize() {
        const rect = this.element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        // 현재 위치가 화면을 벗어나면 새로운 위치로 설정
        this.position.x = Math.min(this.position.x, maxX);
        this.position.y = Math.min(this.position.y, maxY);

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    // 야옹 소리를 내는 메서드
    setMeow(mmm) {
        const rect = this.element.getBoundingClientRect();
        if (this.meow != null) { this.meow.remove(); }

        this.meow = document.createElement('div');
        this.meow.className = 'meow';
        document.getElementById('cage').appendChild(this.meow);

        this.meow.innerHTML = this.skin != '유령' ? mmm : '······.';
        // this.updateInfoWindow();

        const meowRect = this.meow.getBoundingClientRect();
        this.meow.style.left = `${rect.left + rect.width / 2 - meowRect.width / 2}px`;
        this.meow.style.top = `${rect.top - 8}px`;

        // 일정 시간 후 삭제
        setTimeout(() => { this.meow.remove(); }, 2000);

        return this;
    }

    updateInfoWindow() {
        // 고양이 정보 창 위치 설정 (고양이 옆)
        // const catRect = this.element.getBoundingClientRect();
        // this.infoWindow.style.left = `${catRect.right}px`;
        // this.infoWindow.style.top = `${catRect.top}px`;

        // 테이블을 생성하고 헤더를 추가
        let tableHTML = '<table>';
        tableHTML += '<tr><th>ATTR</th><th>VALUE</th></tr>';

        // 테이블에 행 추가
        function addRowToTable(property, value) {
            return `<tr><td>${property}</td><td>${value}</td></tr>`;
        }

        // 고양이 정보 추가
        tableHTML += addRowToTable('type', `${this.skin}`);
        tableHTML += addRowToTable('HP', `${Math.round(this.hp)}/${this.hp_max}`);
        tableHTML += addRowToTable('position', `x: ${Math.floor(this.position.x)}, y: ${Math.floor(this.position.y)}`);
        tableHTML += addRowToTable('vector', `v: ${this.speed.toFixed(1)}, a: ${this.angle.toFixed(1)}`);
        tableHTML += addRowToTable('move', this.isMoving ? this.speed > 3 ? 'run' : 'walk' : 'stop');

        // 현재 고양이 객체의 클래스 리스트 가져오기
        const classList = Array.from(this.element.classList);
        tableHTML += addRowToTable('class', classList.join(', '));

        // 울음소리 디버그를 위한 정보 추가
        // tableHTML += addRowToTable('meow', this.meow == undefined ? '-----' : this.meow.innerHTML);

        // 테이블을 닫음
        tableHTML += '</table>';

        // 정보 창에 HTML 설정
        this.infoWindow.innerHTML = tableHTML;

        return this;
    }

    updateHp(val) {
        const hp = this.hp;
        const hp_max = this.hp_max;
        if (hp + val < hp_max && hp + val > 0) {
            this.hp += val;
        } else {
            if (val > 0) {
                this.hp = hp_max;
            } else {
                // 고양이 쥬금 ㅠㅠ
                events.catDead(this);
            }
        }
        return this;
    }
    updateHpBar() {
        const hp = this.hp;
        const hp_max = this.hp_max;
        // 테이블을 생성하고 헤더를 추가
        let tableHTML = hp / hp_max * 100 > 50 ? '<table class="high"><tr>' : hp / hp_max * 100 > 25 ? '<table class="mid"><tr>' : '<table class="low"><tr>';

        for (let i = 0; i < Math.ceil(hp_max / 10); i++) {
            tableHTML += i < Math.ceil(hp / 10) ? '<td class="on"></td>' : '<td class=""></td>';
        }

        // 테이블을 닫음
        tableHTML += '</tr></table>';

        // 정보 창에 HTML 설정
        this.hpBar.innerHTML = tableHTML;

        // 잠깐동안 보였다가 사라지기
        this.hpBar.classList.add('show');
        setTimeout(() => { this.hpBar.classList.remove('show') }, 1000);
    }

}
