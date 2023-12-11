class Cat {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'cat';
        document.body.appendChild(this.element);

        // 고양이 정보를 표시할 창
        this.infoWindow = document.createElement('div');
        this.infoWindow.className = 'info-window';
        document.body.appendChild(this.infoWindow);
        const skins = ['흰냥이', '깜냥이', '치즈', '고등어', '젖소', '턱시도'];
        this.element.style.backgroundImage = `url('./img/cat_skin_${skins[Math.floor(Math.random() * skins.length)]}.png')`;

        this.isMoving = Math.random() > 0.5; // 50% 확률로 초기 움직임 설정

        // 초기화 메서드 호출
        this.initialize();

        // 드래그 앤 드롭 관련 속성 추가
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // 드래그 앤 드롭 이벤트 리스너 등록
        this.element.addEventListener('mousedown', (event) => this.startDragging(event));
        document.addEventListener('mousemove', (event) => this.drag(event));
        document.addEventListener('mouseup', () => this.stopDragging());
    }

    initialize() {
        // 초기 위치 랜덤 설정
        this.position = {
            x: Math.random() * (window.innerWidth - 64) + 32,
            y: Math.random() * (window.innerHeight - 64) + 32
        };

        // 초기 위치 스타일 적용
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        // 초기 각도 및 속도 랜덤 설정
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 5 + 1;

        // 초기 이동 시작
        this.startMoving();

        // 고양이 정보 창 업데이트
        this.updateInfoWindow();
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

    }

    toggleMovement() {
        this.isMoving = !this.isMoving;

        // 이동 관련 클래스 삭제
        this.element.classList.remove('walk', 'run', 'wash', 'lick', 'point', 'watch');

        if (this.isMoving) {
            // 이동 중일 때, 랜덤한 방향과 속도 설정
            this.angle = Math.random() * 2 * Math.PI;
            this.speed = Math.random() * 5 + 1;

            // 방향성 애니메이션 클래스 삭제
            this.element.classList.remove('left', 'right');
        } else {
            // 이동이 정지되었을 때, 랜덤한 클래스 추가
            const randomClasses = ['cat', 'cat', 'cat', 'wash', 'lick', 'point', 'watch'];
            const randomClassIndex = Math.floor(Math.random() * randomClasses.length);
            const randomClass = randomClasses[randomClassIndex];

            this.element.classList.add(randomClass);
        }

        // 고양이 정보 창 업데이트
        this.updateInfoWindow();
    }

    startMoving() {
        this.stopMoving();

        // 일정한 간격으로 고양이 이동
        this.moveCatInterval = setInterval(() => this.moveCat(), 30);

        // 일정한 간격으로 움직임 토글
        this.toggleMovementInterval = setInterval(() => this.toggleMovement(), Math.random() * 5000 + 1000);
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
        this.element.classList.remove('walk', 'run', 'wash', 'lick', 'point', 'watch');
        this.stopMoving();

        // 드래그 클래스 추가
        this.element.classList.add('drag');
    }

    drag(event) {
        // 드래그 중일 때, 새로운 위치로 이동
        if (this.isDragging) {
            const newX = event.clientX - this.dragOffsetX;
            const newY = event.clientY - this.dragOffsetY;

            if (this.position.x > event.clientX - this.dragOffsetX) {
                this.element.classList.remove('right');
                this.element.classList.add('left');
            } else if (this.position.x < event.clientX - this.dragOffsetX) {
                this.element.classList.remove('left');
                this.element.classList.add('right');
            }

            // 화면 경계를 벗어나지 않도록 제한
            const maxX = window.innerWidth - this.element.clientWidth;
            const maxY = window.innerHeight - this.element.clientHeight;

            this.position.x = Math.max(0, Math.min(newX, maxX));
            this.position.y = Math.max(0, Math.min(newY, maxY));

            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${this.position.y + 32}px`;

            // 정보 창 업데이트
            this.updateInfoWindow();
        }
    }

    stopDragging() {
        // 드래그 종료 시 상태 초기화 및 이동 재개
        this.isDragging = false;
        this.element.classList.remove('drag');
        this.startMoving();
    }

    updateInfoWindow() {
        // 고양이 정보 창 위치 설정 (고양이 옆)
        const catRect = this.element.getBoundingClientRect();
        this.infoWindow.style.left = `${catRect.right}px`;
        this.infoWindow.style.top = `${catRect.top}px`;

        // 테이블을 생성하고 헤더를 추가
        let tableHTML = '<table>';
        tableHTML += '<tr><th>ATTR</th><th>VALUE</th></tr>';

        // 테이블에 행 추가
        function addRowToTable(property, value) {
            return `<tr><td>${property}</td><td>${value}</td></tr>`;
        }

        // 고양이 정보 추가
        tableHTML += addRowToTable('position', `(${Math.floor(this.position.x)}, ${Math.floor(this.position.y)})`);
        tableHTML += addRowToTable('speed', this.speed.toFixed(2));
        tableHTML += addRowToTable('angle', this.angle.toFixed(2));
        tableHTML += addRowToTable('move', this.isMoving ? this.speed > 3 ? 'run' : 'walk' : 'stop');

        // 현재 고양이 객체의 클래스 리스트 가져오기
        const classList = Array.from(this.element.classList);
        tableHTML += addRowToTable('class', classList.join(', '));

        // 테이블을 닫음
        tableHTML += '</table>';

        // 정보 창에 HTML 설정
        this.infoWindow.innerHTML = tableHTML;
    }
}
