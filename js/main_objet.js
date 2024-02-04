class Objet {
    constructor(pos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }, type) {
        this.element = document.createElement('div');
        this.element.className = 'objet down';
        document.getElementById('wall').appendChild(this.element);
        // document.body.appendChild(this.element);

        // 본체 이미지를 표시할 공간
        this.figure = document.createElement('figure');
        this.element.appendChild(this.figure);

        // 사물 정보를 표시할 창
        this.infoWindow = document.createElement('div');
        this.infoWindow.className = 'info-window';
        this.element.appendChild(this.infoWindow);

        const sell_btn = document.createElement('div');
        sell_btn.className = 'sell_btn';
        sell_btn.onclick = () => { this.element.remove() }
        this.infoWindow.appendChild(sell_btn);

        // 초기 위치 설정
        const rect = this.element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        this.position = {
            x: Math.max(0, Math.min(pos.x, maxX)),
            y: Math.max(128, Math.min(pos.y, maxY))
        };

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.setType(type);

        // 드래그 앤 드롭 관련 속성 추가
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // 드래그 앤 드롭 이벤트 리스너 등록
        this.element.addEventListener('mousedown', (event) => this.startDragging(event));
        document.addEventListener('mousemove', (event) => this.drag(event));
        document.addEventListener('mouseup', (event) => this.stopDragging(event));
        // 모바일 이벤트 리스너 등록
        this.element.addEventListener('touchstart', (event) => this.startDragging({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }), { passive: true });
        document.addEventListener('touchmove', (event) => this.drag({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        }));
        document.addEventListener('touchend', () => this.stopDragging());

        // 화면 크기 변경 시 이벤트
        window.addEventListener("resize", () => this.handleWindowResize());
    }

    setType(type) {

        const types = [
            '시계_1', '시계_2', '시계_3',
            '문_1',
        ];
        const type_index = Math.floor(Math.random() * types.length);

        // 파라미터 전달 안 받았으면 랜덤값 지정
        this.type = type == null ? types[type_index] : type;

        this.element.classList.add(this.type);

        // 통계를 위해서 넣었습니다
        if (p !== null) {
            p.data.achievement[`THINGS__${this.type}`] = (p.data.achievement[`THINGS__${this.type}`] || 0) + 1;
            p.data.achievement.things__total = (p.data.achievement.things__total || 0) + 1;
        }

        return this;
    }

    startDragging(event) {

        if (this.element.classList.contains('down')) { this.element.classList.remove('down') }

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

        // 이벤트 위치 말고 객체 위치도 필요해서
        this.startX = this.position.x;
        this.startY = this.position.y;

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
            const maxY = 96;

            this.position.x = Math.max(0, Math.min(newX, maxX));
            this.position.y = Math.max(0, Math.min(newY, maxY));

            const cell_size = 16;
            this.element.style.left = `${Math.ceil(this.position.x / cell_size) * cell_size}px`;
            this.element.style.top = `${Math.ceil(this.position.y / cell_size) * cell_size}px`;

        }
    }

    stopDragging(event) {
        // 드래그 종료 시 상태 초기화 및 이동 재개
        this.isDragging = false;
        this.element.classList.remove('drag');
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
        clearInterval(this.activateInterval);

        // 물고기 배열에서 사물 객체 제거
        const i = things.findIndex(Objet => Objet == this);
        things.splice(i, 1);

    }

}