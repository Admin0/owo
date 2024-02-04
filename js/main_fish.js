class Fish {
    constructor(pos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }, type) {
        this.element = document.createElement('div');
        this.element.className = 'pisces';
        document.getElementById('basket').appendChild(this.element);
        // document.body.appendChild(this.element);

        // 본체 이미지를 표시할 공간
        this.figure = document.createElement('figure');
        this.element.appendChild(this.figure);

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
            y: Math.max(128, Math.min(pos.y, maxY))
        };

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.setType(type);

        // 방향 설정
        this.element.classList.add(Math.random() > .5 ? 'left' : 'right');

        // 고양이 객체와 충돌 이벤트 감지
        // this.activateInterval = setInterval(() => this.activateWithCat(cats), 100);

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

        // 생선 정보 창 업데이트
        this.updateInfoWindow();
    }

    setType(type) {

        const types = [
            'fish', 'fish', 'fish', 'fish', 'fish',
            'cucumber', 'cucumber', 'cucumber', 'cucumber', 'cucumber',
            'mineral', 'mineral', 'mineral', 'mineral', 'mineral', 'mineral_rich', 'mineral_rich', 'mineral_rich',
            'yarnball',
            'waterbottle', 'waterbottle', 'waterbottle', 'waterbottle', 'waterbottle',
            '동전',
            'potion_health', 'potion_vigor',
        ];
        const type_index = Math.floor(Math.random() * types.length);

        // type을 지정받은 경우 초기화
        const breakDown = () => {
            // 기존 클래스 삭제
            this.element.classList.remove(this.type, 'irochi');

            // 체력 바 삭제
            if (this.element.hpBar != null) { this.element.hpBar.remove(); }

            // 필터 제거
            this.figure.style.filter = 'none';

            // 이펙트 제거
            if (this.element.effect != null) { this.element.effect.remove(); }
        }
        if (type != null) { breakDown(); }

        // 파라미터 전달 안 받았으면 랜덤값 지정
        this.type = type == null ? types[type_index] : type;

        // 야생의 색이 다른 생선이 나타났다!
        if (Math.random() < 1 / 64) {
            // if (Math.random() < 1 / 2) {
            this.figure.style.filter = `hue-rotate(${Math.ceil(Math.random() * 5) * 60}deg`;
            this.irochi = true;
            this.element.classList.add('irochi');

            p.data.achievement.PISCES__irochi = (p.data.achievement.PISCES__irochi || 0) + 1;

            // 도전 과제
            if (this.type === 'yarnball') { achievement.getAchievement('샤이니_이로치'); }
        }

        // 이동 관련 값 설정
        this.speed = 0;
        this.angle = 0;

        // 특별한 타입이면 요소 추가
        events.fishBuildUp(this);

        this.element.classList.add(this.type);
        this.updateInfoWindow();

        // 통계를 위해서 넣었습니다
        if (p !== null) {
            p.data.achievement[`PISCES__${this.type}`] = (p.data.achievement[`PISCES__${this.type}`] || 0) + 1;
            p.data.achievement.PISCES__total = (p.data.achievement.PISCES__total || 0) + 1;
        }

        return this;
    }

    startDragging(event) {

        // .massive 일때 이벤트 무시
        if (this.element.classList.contains('massive')) {
            skills.splitMassiveFish(undefined, this, { n: 9, length: 0, breakup: true });
            return;
        }

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

        // 이벤트 위치 말고 객체 위치도 필요해서
        this.startX = this.position.x;
        this.startY = this.position.y;

        // 드래그 이력 저장
        this.dragHistory = [];
        // }

        // 물건을 들면 이벤트 발생
        switch (this.type) {
            case 'waterbottle':
            case 'potion_health_bottle':
            case 'potion_vigor_bottle':
            case 'potion_poison_bottle':
            case 'dex':
                // 물병은 세워놓는다
                this.element.classList.remove('down');
                break;

            default:
                break;
        }
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
            this.position.y = Math.max(128, Math.min(newY, maxY));

            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${this.position.y}px`;

            // 털실 공을 굴려보자
            this.lastDragX = event.clientX;
            this.lastDragY = event.clientY;

            this.activateWithCat(cats);

            // 드래그 이력 추가
            this.dragHistory.push({ x: event.clientX, y: event.clientY, time: performance.now() });

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

            // 털실 공을 굴려보자 (이동이 전혀 없어도 위치 반환이 필요해서)
            if (event !== undefined) {
                this.lastDragX = event.clientX;
                this.lastDragY = event.clientY;
            }

            // 이벤트 위치 말고 객체 위치도 필요해서
            this.lastX = this.position.x;
            this.lastY = this.position.y;

            // 드래그 종료되기 100ms 전의 위치에서 현재 위치까지의 거리 계산
            const deltaX = this.lastDragX - startPos.x;
            const deltaY = this.lastDragY - startPos.y;

            // 마우스 커서의 이동 거리를 속도로 계산
            const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / (performance.now() - startPos.time) * 9.8;

            // 마우스 커서의 이동 각도 계산
            const angle = Math.atan2(deltaY, deltaX);

            // 이동 시작
            this.startSliding({ v: speed, a: angle });

            // 드롭 이벤트
            this.dropToFish(pisces);
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
        clearInterval(this.activateInterval);

        // 물고기 배열에서 생선 객체 제거
        const i = pisces.findIndex(fish => fish == this);
        pisces.splice(i, 1);

        // 객체를 삭제할 때 메모리에서도 해제하려고 넣었는데 작동하는지는 몰?루 --> 에러 생기네;;
        // for (var key in this) {
        //     if (this.hasOwnProperty(key)) {
        //         this[key] = null;
        //     }
        // }
    }

    // Cat 객체를 전달받아 activate 메서드 호출
    activateWithCat(cats) {
        cats.forEach(cat => {
            // 유령 냥이는 생선과의 활성화가 없다
            // if (cat.element.classList.contains('유령')) return;

            const catRect = cat.element.getBoundingClientRect();
            const catPosition = { x: catRect.left, y: catRect.top }
            const distance = this.calculateDistance(catPosition);

            // 생선과의 거리가 일정 이내일 경우 동작을 수행
            // 고양이를 옮길때는 이벤트 제외 (생선을 옮길때는 이벤트 실행)
            if (distance > 32
                || cat.element.classList.contains('drag')
                || this.element.classList.contains('ghost')) { return; }


            // 충돌한 cat이 이전과 같을 때 충돌 지점에서 거리가 어느정도 떨어지지 않았다면 이벤트
            const prevCollidedDistance = () => { return this.calculateDistance(this.prevCollidedPosition || { x: 0, y: 0 }); }
            if (this.prevCollidedCat === cat && prevCollidedDistance() < 32) { return; }

            // 생선을 들고있는 경우(drag)에는 손에서 떨어뜨림
            if (this.element.classList.contains('drag')) {
                this.stopDragging();

                // left click 이벤트 방지
                p.fishInterceptedByCat = true;
            }

            // 세부 동작은 별도 함수 호출
            if (cat.skin !== '유령') {
                events.fishActivateWithCat(this, cat, catRect);
            } else {
                events.fishActivateWithGhost(this, cat, catRect);
            }

        });
    }
    activateWithFish(pisces) {
        pisces.forEach(fish => {
            const fishRect = fish.element.getBoundingClientRect();
            const fishPosition = { x: fishRect.left, y: fishRect.top }
            const distance = this.calculateDistance(fishPosition);

            // 생선과의 거리가 일정 이내일 경우 동작을 수행
            // 생선을 옮길때는 이벤트 제외
            // 본인일 경우 제외
            if (distance > 32
                || fish.element.classList.contains('drag')
                || this.element.classList.contains('drag')
                || fish == this) { return; }

            // 충돌한 fish이 이전과 같을 때 충돌 지점에서 거리가 어느정도 떨어지지 않았다면 이벤트
            const prevCollidedDistance = () => { return this.calculateDistance(this.prevCollidedPosition || { x: 0, y: 0 }); }
            if (this.prevCollidedfish === fish && prevCollidedDistance() < 64) { return; }

            const v_new = this.speed * 4 / 5;
            const a_this = this.angle - Math.PI / 4 + Math.PI / 2 * Math.random(); // 가만히있는 거
            const a_target = this.angle + Math.PI - Math.PI / 4 + Math.PI / 2 * Math.random(); // 움직이는 거

            switch (fish.type) {
                case 'fish':
                case 'fish_rich':
                    break;

                case 'cucumber':
                    break;

                case 'mineral_richrare':
                case 'mineral_rich':
                    // 이전에 충돌한 fish, position 정보 업데이트
                    this.prevCollidedfish = fish;
                    this.prevCollidedPosition = this.getPosition();

                    // 움직임 시작
                    fish.startSliding({ v: v_new, a: a_this });
                    this.startSliding({ v: v_new, a: a_target });

                    // 내구도 업데이트
                    fish.updateHp(-2 - this.speed / 2);
                    this.updateHp(-2 - this.speed / 2);

                    break;

                case 'mineral_rare':
                case 'mineral':
                    break;

                case '동전':
                    if (!fish.element.classList.contains('massive')) { return }

                    skills.splitMassiveFish(this, fish, { length: 0 });
                    // this.startSliding({ v: v_new, a: a_target });
                    break;

                case 'waterbottle':
                    events.스트라이크(this);
                case 'potion_health':
                case 'potion_vigor':
                case 'potion_poison':
                case 'potion_health_bottle':
                case 'potion_vigor_bottle':
                case 'potion_poison_bottle':
                    // 충돌 하고나서 일정 거리 안 떨어지면 다시 충돌 불가
                    // 물병이 쓰러져 있는 상태에서는 충돌 불가
                    if (fish.element.classList.contains('down')) { break; }

                case '택배': case '큰_택배':
                case 'yarnball':
                    // 이전에 충돌한 fish, position 정보 업데이트
                    this.prevCollidedfish = fish;
                    this.prevCollidedPosition = this.getPosition();

                    // 움직임 시작
                    fish.startSliding({ v: v_new, a: a_this });
                    this.startSliding({ v: v_new, a: a_target });

                    // 내구도 업데이트
                    fish.updateHp(-2 - this.speed / 2);
                    this.updateHp(-2 - this.speed / 2);

                    break;

                default:
                    break;
            }

        });
    }

    dropToFish(pisces) {
        pisces.forEach(fish => {
            const fishPosition = { x: fish.lastX, y: fish.lastY }
            const distance = this.calculateDistance(fishPosition);

            // 생선과의 거리가 일정 이내일 경우 동작을 수행
            // 본인일 경우 제외
            if (distance > 16
                || fish == this) { return; }

            switch (fish.type) {

                case '택배상자': case '큰_택배상자':
                    const fishPos = { x: fish.lastX, y: fish.lastY }
                    // console.log(fishPos, this.calculateDistance(fishPos));
                    if (this.calculateDistance(fishPos) < 16) {
                        fish.element.classList.add('throw', 'down');
                        this.remove();
                        setTimeout(() => {
                            fish.element.classList.remove('throw');
                            fish.setType('택배상자_쓰레기통');
                        }, 500);
                    }
                    break;

                case '택배상자_쓰레기통': case '큰_택배상자_쓰레기통':
                    fish.element.classList.add('throw');
                    this.remove();
                    setTimeout(() => {
                        fish.element.classList.remove('throw');
                    }, 500);
                    break;

                default:
                    break;
            }

        });
    }
    // 생선과의 거리를 계산하는 유틸리티 메서드
    // calculateDistance(point1, point2) {
    //     const deltaX = point1.x - point2.x;
    //     const deltaY = point1.y - point2.y;
    //     return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // }

    // 생각해보니 본인은 넣을 필요가 없는데?
    calculateDistance(position) {
        return Math.sqrt((position.x - this.position.x) ** 2 + (position.y - this.position.y) ** 2);
    }

    moveFish(params = { f: 0 }) {
        // 마찰에 따른 가속도 설정
        this.speed = this.speed > 0 ? this.speed -= params.f : 0;
        if (this.speed == 0) { this.stopMoving(); this.element.classList.remove('move'); this.updateInfoWindow(); return; }

        const deltaX = this.speed * Math.cos(this.angle);
        const deltaY = this.speed * Math.sin(this.angle);

        const rect = this.element.getBoundingClientRect();
        const newX = rect.left + deltaX;
        const newY = rect.top + deltaY;

        this.position.x = newX;
        this.position.y = newY;

        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;

        // 생선 방향 클래스 업데이트
        this.element.classList.remove('left', 'right');
        this.element.classList.add(Math.cos(this.angle) > 0 ? 'right' : 'left', 'move');

        this.updateInfoWindow();

        // 생선들끼리의 충돌이벤트 감지
        // if (this.hp != null) 
        if (this.speed > 3) this.activateWithFish(pisces);

        // 화면 경계를 벗어나면 방향을 바꿈
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        if (newX < 0 || newX + rect.width > window.innerWidth) {
            this.angle = Math.PI - this.angle;
            // 벽에 부딪히면 체력 감소
            this.updateHp(-3 - this.speed / 10);
        }
        if (newY < 128 || newY + rect.height > window.innerHeight) {
            this.angle = -this.angle;
            // 벽에 부딪히면 체력 감소
            this.updateHp(-3 - this.speed / 10);
        }
    }
    /**
     * 
     * @param {*} v velocity를 정의합니다.
     * @param {*} a angle를 정의합니다.
     */
    startSliding(vector = { v: Math.random() * 5 + 3, a: Math.random() * 2 * Math.PI }) {
        this.stopMoving();
        let v = vector.v;
        const a = vector.a;

        // 일정한 간격으로 생선 이동
        this.moveFishInterval = setInterval(() => this.moveFish({ f: getFriction() }), 30);

        const getFriction = () => {
            switch (this.type) {
                case 'yarnball':
                    return 0.1;

                case 'mineral_rich':
                case 'mineral_richrare':
                    return 1.0;

                case 'dex':
                    return 1.0;

                case '큰_택배':
                    return 2.0;

                default:
                    return 0.5;
            }
        }

        // 속도에 따라 이벤트 발생
        if (v > 5) {
            switch (this.type) {
                case 'potion_health':
                case 'potion_vigor':
                case 'potion_poison':
                    this.element.classList.add('down');
                    switch (this.type) {
                        case 'potion_health':
                            this.setType('potion_health_bottle');
                            break;
                        case 'potion_vigor':
                            this.setType('potion_vigor_bottle');
                            break;
                        case 'potion_poison':
                            this.setType('potion_poison_bottle');
                            break;
                    }
                    break;

                case 'waterbottle':
                case 'potion_poison_bottle':
                case 'potion_health_bottle':
                case 'potion_vigor_bottle':
                    // 속도가 빠르면 물병이 쓰러진다
                    this.element.classList.add('down');
                    break;
                case 'dex':
                    // 속도가 빠르면 도감이 펼쳐진다
                    this.element.classList.add('down');
                    events.showDex(500);
                    break;

                default:
                    break;
            }
        }

        // 값 업데이트 
        this.speed = v;
        this.angle = a;

        return this;
    }

    stopMoving() {
        clearInterval(this.moveFishInterval);
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
        if (this.hp != undefined) tableHTML += addRowToTable('hp', `${Math.round(this.hp)}/${this.hp_max}`);
        tableHTML += addRowToTable('position', `x: ${Math.floor(this.position.x)}, y: ${Math.floor(this.position.y)}`);
        tableHTML += addRowToTable('vector', `v: ${this.speed != null ? this.speed.toFixed(1) : '-.-'}, a: ${this.angle != null ? this.angle.toFixed(1) : '-.-'}`);

        // 현재 생선 객체의 클래스 리스트 가져오기
        const classList = Array.from(this.element.classList);
        tableHTML += addRowToTable('class', classList.join(', '));

        // 테이블을 닫음
        tableHTML += '</table>';

        // 정보 창에 HTML 설정
        this.infoWindow.innerHTML = tableHTML;
    }

    kill(cat) {    // remove는 바로 삭제, kill은 이벤트 발생 후 삭제
        if (this.element.classList.contains('ghost')) { return }
        this.element.classList.add('ghost');

        // kill 이미지 없는 거는 반짝거리는 효과
        [
            'yarnball',
            'mineral', 'mineral_rare',
            'waterbottle', 'potion_health_bottle', 'potion_vigor_bottle', 'potion_poison_bottle',
            'stone_moon', '화석', '천년퍼즐',
        ].forEach(e => {
            if (this.type === e) {
                this.figure.animate({ filter: ['brightness(1)', 'brightness(5)'] }, {
                    duration: 200,
                    animationDirection: 'alternate',
                    iterations: Infinity,
                    composite: 'add',
                });
                return;
            }
        });


        if (this.type === '택배') {
            skills.splitMassiveFish(cat, this, { n: 5, breakup: false, type: [] });

            if (Math.random() < (context.getDevMode() ? 1 : .1)) {
                this.setType('택배상자');
                this.element.classList.remove('ghost');
                return;
            }
        }

        if (this.type === '큰_택배') {
            // 가구 추가
            things.push(new Objet(this.position));

            // 상자
            if (Math.random() < (context.getDevMode() ? 1 : .1)) {
                this.setType('큰_택배상자');
                this.element.classList.remove('ghost');
                return;
            }
        }

        setTimeout(() => {
            // 해당 객체 삭제
            this.remove();

            switch (this.type) {
                case 'mineral_richrare':
                    skills.splitMassiveFish(undefined, this, { n: 2, length: 32, breakup: true, type: ['mineral', 'stone_moon', '화석', '천년퍼즐'] });

                case 'mineral_rich':
                    p.data.achievement.pisces_break_mineral || 1;
                    achievement.getAchievement('마인크래프트');
                    skills.splitMassiveFish(undefined, this, {
                        n: 3, length: 32, breakup: true, type: ['mineral', 'stone_moon', '화석', '천년퍼즐'], chance: 1 / 8
                    });
                    break;

                default:
                    break;
            }

        }, 500);
    }
    updateHp(val) {
        if (this.hp == undefined) { return }
        const hp = this.hp;
        const hp_max = this.hp_max;
        if (hp + val < hp_max && hp + val > 0) {
            this.hp += val;
        } else {
            if (val > 0) {
                this.hp = hp_max;
            } else {
                this.hp = 0;
                const i = pisces.findIndex(fish => fish == this);

                // 효과 후 생선 객체 제거
                this.kill();
                p.updateParameterValues();

            }
        }
        this.updateHpBar();
    }
    updateHpBar() {
        if (this.hpBar == undefined) { return; }
        const hp = this.hp;
        const hp_max = this.hp_max;
        // 테이블을 생성하고 헤더를 추가
        let tableHTML = hp / hp_max * 100 > 50 ? '<table class="high"><tr>' : hp / hp_max * 100 > 25 ? '<table class="mid"><tr>' : '<table class="low"><tr>';

        for (let i = 0; i < Math.ceil(hp_max / 10); i++) {
            if (i < Math.ceil(hp / 10)) {
                tableHTML += '<td class="on"></td>';
            } else {
                tableHTML += '<td class=""></td>';
            }
        }

        // 테이블을 닫음
        tableHTML += '</tr></table>';

        // 정보 창에 HTML 설정
        this.hpBar.innerHTML = tableHTML;
    }
}