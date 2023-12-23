class Fish {
    constructor(pos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }) {
        this.element = document.createElement('div');
        this.element.className = 'pisces';
        document.body.appendChild(this.element);

        // 생선 정보를 표시할 창
        this.infoWindow = document.createElement('div');
        this.infoWindow.className = 'info-window';
        this.element.appendChild(this.infoWindow);

        // 초기 위치 설정
        const rect = this.element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        this.position = {
            x: Math.max(0, Math.min(pos.x, maxX)),
            y: Math.max(0, Math.min(pos.y, maxY))
        };

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.setType();

        // 방향 설정
        this.element.classList.add(Math.random() > .5 ? 'left' : 'right');

        // 고양이 객체와 충돌 이벤트 감지
        this.activateInterval = setInterval(() => this.activate(cats), 100);

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
        this.element.addEventListener('touchend', (event) => this.stopDragging(event));

        // 화면 크기 변경 시 이벤트
        window.addEventListener("resize", () => this.handleWindowResize());

        // 생선 정보 창 업데이트
        this.updateInfoWindow();
    }

    setType(type) {
        const types = ['fish', 'cucumber', 'mineral', 'yarnball'];
        const type_index = Math.floor(Math.random() * types.length);

        // 기존 클래스 삭제
        types.forEach(type => { this.element.classList.remove(type); });
        this.element.classList.remove('goldfish', 'richmineral', 'raremineral', 'richraremineral');

        // 파라미터 전달 안 받았으면 랜덤값 지정
        this.type = type == null ? types[type_index] : type;

        // 생선은 1/10 확률로 금붕어가 된다
        if (this.type == 'fish') { this.type = Math.floor(Math.random() * 10) != 0 ? 'fish' : 'goldfish' }
        // 광물은 1/10 확률로 풍부한광물 된다
        if (this.type == 'mineral') { this.type = Math.floor(Math.random() * 10) != 0 ? 'mineral' : 'richmineral' }
        // 광물은 1/20 확률로 희귀광물이 된다
        if (this.type == 'mineral') { this.type = Math.floor(Math.random() * 20) != 0 ? 'mineral' : 'raremineral' }
        // 희귀광물이 1/10 확률로 풍부한희귀광물이 된다
        if (this.type == 'raremineral') { this.type = Math.floor(Math.random() * 10) != 0 ? 'raremineral' : 'richraremineral' }

        this.element.classList.add(this.type);
        this.updateInfoWindow();
        return this;
    }

    startDragging(event) {
        // 움직이고 있으면 움직임 종료
        this.stopMoving();

        // 드래그 시작 시 위치 오프셋 설정
        this.isDragging = true;
        const rect = this.element.getBoundingClientRect();
        this.dragOffsetX = event.clientX - rect.left;
        this.dragOffsetY = event.clientY - rect.top;

        // 드래그 클래스 추가
        this.element.classList.add('drag');

        // if (this.type == 'yarnball') {
        // 드래그 시작 시의 시간과 위치 저장
        this.startDragTime = performance.now();
        this.startDragX = event.clientX;
        this.startDragY = event.clientY;

        // 드래그 이력 저장
        this.dragHistory = [];
        // }
    }

    drag(event) {
        // 드래그 중일 때, 새로운 위치로 이동
        if (this.isDragging) {

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

            // 털실 공을 굴려보자
            // if (this.type == 'yarnball') {
            this.lastDragX = event.clientX;
            this.lastDragY = event.clientY;

            // 드래그 이력 추가
            this.dragHistory.push({ x: event.clientX, y: event.clientY, time: performance.now() });
            // }

            this.updateInfoWindow();
        }
    }

    stopDragging(event) {
        // 드래그 종료 시 상태 초기화 및 이동 재개
        this.isDragging = false;
        this.element.classList.remove('drag');

        // if (this.type == 'yarnball' && this.dragHistory != null) {
        if (this.dragHistory != null) {
            // 드래그 종료되기 100ms 전의 시간
            const startTime = performance.now() - 100;

            // 드래그 종료되기 100ms 전의 위치를 찾기
            const startIndex = this.dragHistory.findIndex((entry) => entry.time >= startTime);

            // 드래그 종료되기 100ms 전의 위치 / 없으면 현재 위치
            const startPos = startIndex != -1 ? this.dragHistory[startIndex] : { x: this.x, y: this.y };

            // 드래그 종료되기 100ms 전의 위치에서 현재 위치까지의 거리 계산
            const deltaX = this.lastDragX - startPos.x;
            const deltaY = this.lastDragY - startPos.y;

            // 마우스 커서의 이동 거리를 속도로 계산
            const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / (performance.now() - startPos.time) * 9.8;

            // 마우스 커서의 이동 각도 계산
            const angle = Math.atan2(deltaY, deltaX);

            // 이동 시작
            this.startSliding(speed, angle);
        }
    }

    getPosition() {
        const rect = this.element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
        };
    }

    remove() {
        this.element.remove();
        this.infoWindow.remove();
        clearInterval(this.activateInterval);
        // 객체를 삭제할 때 메모리에서도 해제하려고 넣었는데 작동하는지는 몰?루 --> 에러 생기네;;
        // for (var key in this) {
        //     if (this.hasOwnProperty(key)) {
        //         this[key] = null;
        //     }
        // }
    }

    // Cat 객체를 전달받아 activate 메서드 호출
    activate(cats) {
        cats.forEach(cat => {
            const catRect = cat.element.getBoundingClientRect();
            const catPosition = { x: catRect.left, y: catRect.top }
            const distance = this.calculateDistance(this.getPosition(), catPosition);

            // 생선과의 거리가 일정 이내일 경우 동작을 수행
            // 고양이와 생선을 옮길때는 이벤트 제외
            if (distance < 32 && !cat.element.classList.contains('drag') && !this.element.classList.contains('drag')) {
                switch (this.type) {
                    case 'fish':
                    case 'goldfish':
                        // 생선을 먹는 움직임
                        cat.toggleMovement('lick');
                        // 야옹거리는 동작
                        cat.setMeow('Meow ♥️');
                        // 고양이 체력 증가
                        cat.updateHp(10);
                        // 생선 객체 삭제
                        this.remove();
                        break;
                    case 'cucumber':
                        // 오이를 먹는 움직임
                        cat.toggleMovement('surprised');
                        // 야옹거리는 동작
                        cat.setMeow('Grrrr!');
                        // 고양이 체력 감소
                        cat.updateHp(-10);
                        // 오이 객체 삭제
                        this.remove();
                        break;
                    case 'richraremineral': p.resources.setMinerals(8);
                    case 'raremineral': p.resources.setMinerals(8);
                    case 'richmineral': p.resources.setMinerals(8);
                    case 'mineral':
                        p.resources.setMinerals(8);
                        p.updateParameterValues();

                        // 오이를 먹는 움직임
                        cat.toggleMovement('surprised');
                        // 야옹거리는 동작
                        cat.setMeow('Grrrr!');
                        // 오이 객체 삭제
                        this.remove();
                        break;
                    case 'yarnball':
                        // 공이랑 부딪히면 고양이는 멈춤
                        cat.toggleMovement();
                        // 야옹거리는 동작
                        cat.setMeow('Nyaa!');

                        // 공 움직임 시작
                        this.startSliding();

                        break;
                    default:
                        break;
                }
                cat.updateHpBar();
            }
        });
    }

    // 생선과의 거리를 계산하는 유틸리티 메서드
    calculateDistance(point1, point2) {
        const deltaX = point1.x - point2.x;
        const deltaY = point1.y - point2.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    moveFish() {
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

        // 생선 방향 클래스 업데이트
        this.element.classList.remove('left', 'right');
        this.element.classList.add(Math.cos(this.angle) > 0 ? 'right' : 'left', 'move');

        this.updateInfoWindow();
    }
    /**
     * 
     * @param {*} v velocity를 정의합니다.
     * @param {*} a angle를 정의합니다.
     */
    startSliding(v = Math.random() * 5 + 1, a = Math.random() * 2 * Math.PI) {
        this.stopMoving();

        this.speed = v;
        this.angle = a;

        // 일정한 간격으로 생선 이동
        this.moveFishInterval = setInterval(() => this.moveFish(), 30);

        const getFriction = () => {
            switch (this.type) {
                case 'yarnball':
                    return 0.01;
                default:
                    return 0.1;
            }
        }
        this.moveFishSpeedDown = setInterval(() => {
            this.speed = this.speed > 0 ? this.speed -= getFriction() : 0, 30;
            if (this.speed == 0) { this.stopMoving(); this.element.classList.remove('move'); this.updateInfoWindow(); }
        });

        return this;
    }

    stopMoving() {
        clearInterval(this.moveFishInterval);
        clearInterval(this.moveFishSpeedDown);
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

    updateInfoWindow() {
        // 생선 정보 창 위치 설정 (생선 옆)
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

        // 생선 정보 추가
        tableHTML += addRowToTable('type', `${this.type}`);
        tableHTML += addRowToTable('position', `x: ${Math.floor(this.position.x)}, y: ${Math.floor(this.position.y)}`);
        if (this.speed != null) {
            tableHTML += addRowToTable('vector', `v: ${this.speed.toFixed(1)}, a: ${this.angle.toFixed(1)}`);
        } else {
            tableHTML += addRowToTable('vector', `v: -.-, a: -.-`);
        }

        // 현재 생선 객체의 클래스 리스트 가져오기
        const classList = Array.from(this.element.classList);
        tableHTML += addRowToTable('class', classList.join(', '));

        // 테이블을 닫음
        tableHTML += '</table>';

        // 정보 창에 HTML 설정
        this.infoWindow.innerHTML = tableHTML;
    }

}