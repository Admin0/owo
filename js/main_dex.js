class Dex {
    constructor(id, name, desc) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.completed = false;
    }
}

const dex_cats = [
    new Dex('우유', setClass('우유', 'text special'), `분홍색 젤리를 가진 귀여운 젖소 무늬 고양이. <br><br>${setClass("온순", "text var")}한 성격. <br>2020년 10월 15일 ${setClass("여수시", "text var")}에서 Lv. 0.5일 때 만남.<br>집사를 좋아함.`),
    new Dex('흰냥이', '흰냥이', '누구에게나 추천하고싶은 안정적인 바닐라맛 고양이.'),
    new Dex('깜냥이', '깜냥이', '자세히 보면 개체마다 조금씩 명도가 다르다.'),
    new Dex('치즈', '치즈', '작은 호랑이 같은 모습이 멋지다.'),
    new Dex('고등어', '고등어', '누구나 좋아하는 냥이계의 스테디셀러.'),
    new Dex('젖소', '젖소', '애교가 많은 귀염둥이.'),
    new Dex('턱시도', '턱시도', '알맞은 복장을 입은 고양이는 어디에서나 환영받는다.'),
    new Dex('유령', '유령 냥이', '집사와의 추억이 미련으로 남아 성불하지 못했다. <br> 근처에 다가가면 서늘한 기운이 든다.'),
    new Dex('샴', '샴', '위엄있는 얼굴이지만 사실은 여린 고양이. (미구현)'),
    new Dex('스핑크스', '스핑크스', '으악 옷을 업어 야옹아!(미구현)'),
    new Dex('페르시안', '페르시안', '(미구현)'),
    new Dex('렉돌', '렉돌', '(미구현)'),
    new Dex('메인쿤', '메인쿤', '(미구현)'),
    new Dex('벵갈', '벵갈', '(미구현)'),
    new Dex('삵', '삵', '삵은 철망 사이에 끼어서 노는 습성이 있으므로 안심하셔도 됩니다. (미구현)'),
    new Dex('칡', '칡', '우리 다시 만날 수 있을까요? 저는 "칡" 입니다. (미구현)'),
    new Dex('스라소니', '스라소니', '(미구현)'),
    new Dex('러시안블루', '러시안 블루', '(미구현)'),
    new Dex('스코티시폴드', '스코티시 폴드', '동그란 얼굴과 시무룩한 귀떼기가 몹시 사랑스럽다. (미구현)'),
    new Dex('노르웨이숲', '노르웨이 숲', '(미구현)'),
    new Dex('터키시앙고라', '터키시 앙고라', '(미구현)'),
    new Dex('사바나', '사바나', '(미구현)'),
    new Dex('우주비행사', '우주비행사', '사실 최초의 우주 고양이는 젖소무늬였다.<br>1963년, 고양이 최초로 우주에 다녀온 펠리세트를 기리며.'),
    new Dex('달빛냥이', '달빛 냥이', '살며시 다가가 고백하고 싶어지는 야옹이.<br> 새끼 때는 종종 깜냥이로 오해한다.'),
    new Dex('파일럿', '파일럿 냥이', '(미구현)'),
];

const dex_pisces = [
    new Dex('dex', `${setClass('냥냥 도감', 'text special')}`, '냥냥몬을 만나면 자동으로 기록해주는 하이테크한 도구란다!'),

    new Dex('fish', '생선', '굽고, 볶고, 날것으로도 먹을 수 있는 만능 식재료 <br> 고양이도 좋아한다.'),
    new Dex('fish_rich', '다금바리', '상상속의 생선.'),

    new Dex('cucumber', '오이', '고양이의 유전자에 도망가라는 명령이 각인되어있는 사악한 채소.<br>제압 후 냉국으로 요리하면 맛있다.'),

    new Dex('mineral', '광물', '우주에서 지구로 떨어진 운석에 섞여있던 광물. <br> 채굴하면 한덩이에 8 광물이 통장에 입금된다.'),
    new Dex('mineral_rich', '풍부한 광물', ' 더 큰 광물 덩어리. 부수면 작은 광물로 쪼개진다.'),
    new Dex('mineral_rare', '희귀한 광물', '낮은 확률로 발견되는 황금색 광물. <br> 색이 다른 광물과는 또다른 클래식한 느낌의 골-든 광물.'),
    new Dex('mineral_richrare', '풍부한 희귀 광물', '수식어가 두 개나 붙은 초레어 광물. <br>여기에 색까지 다르다면? 당신의 로또 당첨 운, 색이 다른 풍부한 희귀 광물로 대체되었다.'),
    new Dex('stone_moon', '달맞이 돌', '어느 특정 냥냥이를 진화시키는 이상한 돌. 하늘처럼 파랗다.'),

    new Dex('yarnball', '털실 공', '둥글게 말려있는 게 마치 잠자는 고양이를 닮은 귀여운 장난감.'),
    new Dex('potion_hp', '체력 회복 물약', '(미구현)'),
    new Dex('potion_hp_rich', '체력 회복 물약', '(미구현)'),
    new Dex('potion_mp', '활력 회복 물약', '(미구현)'),
    new Dex('potion_mp_rich', '활력 회복 물약', '(미구현)'),

    new Dex('waterbottle', '물병', '세워놓으면 본능을 참지 못하고 냥냥펀치를 날린다.'),
    new Dex('shavedice', '빙수', '(미구현)'),

]

const dex_achievement = [
    new Dex('discover_8_cat', '냥냥몬 마스터가 될거야', `${setClass('냥냥 도감', 'text special')} 중 태초마을의 고양이 8 마리를 모두 발견했다.`),
    new Dex('discover_all_cat', '냥냥몬 마스터', `귀하는 ${setClass('냥냥 도감', 'text special')} 고양이 부문을 훌륭하게 완성했습니다!`),
    new Dex('고양이_별', '고양이 별', `모든 고양이가 고양이 별로 떠났다. <br> ${setClass('성좌 냥냥이', 'text special')}가 당신을 원망했다...`),
    new Dex('살려야한다', '살려야한다', `30분 동안 모든 고양이가 생존했다. (미구현)`),

    new Dex('discover_all_pisces', '고양이 말고 다른 거', `귀하는 ${setClass('냥냥 도감', 'text special')} 고양이 말고 다른 거 부문을 훌륭하게 완성했습니다!`),
    new Dex('마인크래프트', '마인크래프트', `큰 광물을 부숴서 작은 광물을 발견했다.`),

    new Dex('샤이니', '샤이니', '색이 다른 물건을 10 번 발견했다. 반짝이는 효과가 예쁘다.'),
    new Dex('이로치', '이로치', '색이 다른 물건을 1000 번 발견했다.'),
    new Dex('샤이니_이로치', '샤이니 이로치', '털실 공은 색이 모두 다르지만, 한번 더 색이 달라진 털실 공을 발견했다. <br> 원래는 무슨 색이였을까?'),

    new Dex('똑같은_영웅도_환영', '똑같은 영웅도 환영', '똑같은 고양이만 6 마리를 입양했다. (유령 냥이 제외)'),
    new Dex('좌우대칭', '좌우대칭', '화면 틈새에 낀 고양이를 구출했다. <br> 참고: 칡은 철망 사이에 끼어서 노는 습성이 있으므로 안심하셔도 됩니다.(미구현)'),
    new Dex('레벨5', '레벨 5', '고양이를 최고 레벨까지 길렀다. (미구현)'),
    new Dex('다마고치', '다마고치', '고양이 알에서 아기 고양이가 태어났다. (미구현)'),

    new Dex('스트라이크', '스트라이크', '물병 10 개를 한 번에 쓰러뜨렸다. (미구현)'),
    new Dex('거대_괴수_냥냥이', '거대 괴수 냥냥이', '고양이를 이용해 물병 10 개를 한 번에 쓰러뜨렸다. (미구현)'),
    new Dex('머리_치워_머리', '머리 치워 머리', '메시지 창을 다른 곳으로 치웠다.'),

    new Dex('펠리세트', '펠리세트', '한 마리의 고양이가 지구 궤도로 진출했다. (미구현)'),
    new Dex('오버플로우', '오버플로우', '한 게임 안에서 999 회가 넘는 안내 메시지를 보았다.'),

];

// 도전과제를 위한 통계량 초기화
const achievement = {
    // p.data.achievement
    data: {
        // version check (로딩시 값 다르면 초기화 혹은 값 추가하는 코드 삽입)
        version: 2.3,

        // 입양한 야옹이들
        cat_summoned_우유: 0,
        cat_summoned_흰냥이: 0,
        cat_summoned_깜냥이: 0,
        cat_summoned_치즈: 0,
        cat_summoned_고등어: 0,
        cat_summoned_턱시도: 0,
        cat_summoned_젖소: 0,
        cat_summoned_유령: 0,
        cat_summoned_total: 0,

        // 소환한 아이템들
        pisces_summoned_dex: 0,
        pisces_summoned_fish: 0,
        pisces_summoned_fish_rich: 0,
        pisces_summoned_cucumber: 0,
        pisces_summoned_mineral: 0,
        pisces_summoned_mineral_rich: 0,
        pisces_summoned_mineral_rare: 0,
        pisces_summoned_mineral_richrare: 0,
        pisces_summoned_stone_moon: 0,
        pisces_summoned_yarnball: 0,
        pisces_summoned_waterbottle: 0,
        pisces_summoned_total: 0,

        pisces_summoned_irochi: 0,

        // 고양이 별로 떠난 냥이
        // 망가뜨린 물건
        cat_dead: 0,
        cat_dead_all: 0,
        pisces_break_mineral: 0,

    },

    // 도전 과제 달성 유무 도감에 업데이트, 그리고 업적 달성 시 화면에 표시하는 기능
    updateAchievementsAll() {
        dex_achievement.forEach(achievement => {
            // console.log(p.data.achievement[`${achievement.id}__completedEventTriggered`]);
            if (p.data.achievement[`${achievement.id}__completed`] === true || p.data.achievement[`${achievement.id}__completed`] === 1) {

                // 업적 달성 표시
                achievement.element.classList.add('discovered');

                if (!p.data.achievement[`${achievement.id}__completedEventTriggered`]) { // 새로운 조건 추가
                    // 최초 이벤트 발생 로직을 여기에 추가
                    context
                        .setMessage('')
                        .setMessage(`*** 도전 과제 달성: ${setClass(achievement.name, 'text var')} ***`)
                        .setMessage('');

                    // 최초 이벤트가 발생했음을 표시
                    p.data.achievement[`${achievement.id}__completedEventTriggered`] = true;
                }
            }
        });
    },

    // 도전 과제를 달성하게 하는 코드
    getStatistic(id) {
        return p.data.achievement[id];
    },

    // 도전 과제를 달성하게 하는 코드
    getAchievement(id) {
        if (p.data.achievement[`${id}__completed`] === true) return;
        p.data.achievement[`${id}__completed`] = true;
        this.updateAchievementsAll();
    },

    // 도전 과제 달성을 확인하는 메서드
    checkAchievement() {

        if (document.querySelector('#dex .cats') === null) { return }

        // 고양이
        p.data.achievement.discover_8_cat__completed = true;
        p.data.achievement.discover_all_cat__completed = true;
        dex_cats.forEach((cat, i) => {
            if (cat.completed || this.getStatistic(`cat_summoned_${cat.id}`) > 0) {
                cat.element.classList.add('discovered');
                cat.completed = true;

            }
            p.data.achievement.discover_all_cat__completed *= cat.completed;

            // 태초마을 8 마리
            if (i >= 8) { return }
            p.data.achievement.discover_8_cat__completed *= cat.completed;
        });

        // 고양이 말고 다른 거
        p.data.achievement.discover_all_pisces__completed = true;
        dex_pisces.forEach(pisces => {
            if (pisces.completed || this.getStatistic(`pisces_summoned_${pisces.id}`) > 0) {
                pisces.element.classList.add('discovered');
                pisces.completed = true;
            }
            p.data.achievement.discover_all_pisces__completed *= pisces.completed;
        });

        // 도전 과제
        // console.log(this.getStatistic('pisces_summoned_irochi'));
        if (this.getStatistic('pisces_summoned_irochi') >= 10) this.getAchievement('샤이니');
        if (this.getStatistic('pisces_summoned_irochi') >= 1000) this.getAchievement('이로치');

        this.updateAchievementsAll();
    },
}

document.addEventListener("click", (event) => {
    const keepElements = document.querySelectorAll('#dex, #context, #messages');
    const isClickedOnKeeps = Array.from(keepElements).some(keepElement => keepElement.contains(event.target));
    if (document.querySelector('#dex.on') != null)
        if (!isClickedOnKeeps) events.hideDex();
});