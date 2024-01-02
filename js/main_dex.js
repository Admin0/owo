class Dex {
    constructor(id, name, desc) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.completed = false;
    }
}

const dex_cats = [
    new Dex('우유', setClass('우유', 'special'), `분홍색 젤리를 가진 귀여운 젖소 무늬 고양이 <br><br>${setClass("온순", "var")}한 성격 <br>2020년 10월 15일 ${setClass("여수시", "var")}에서 Lv. 0.5일 때 만남<br>집사를 좋아함`),
    new Dex('흰냥이', '흰냥이', '누구에게나 추천하고싶은 안정적인 바닐라맛 고양이'),
    new Dex('깜냥이', '깜냥이', '자세히 보면 개체마다 조금씩 명도가 다르다'),
    new Dex('치즈', '치즈', '작은 호랑이 같은 모습이 멋지다'),
    new Dex('고등어', '고등어', '누구나 좋아하는 냥이계의 스테디셀러'),
    new Dex('젖소', '젖소', '애교가 많은 귀염둥이'),
    new Dex('턱시도', '턱시도', '알맞은 복장을 입은 고양이는 어디에서나 환영받는다'),
    new Dex('유령', '유령', '근처에 다가가면 서늘한 기운이 든다'),
];

const dex_pisces = [
    new Dex('dex', `${setClass('냥냥 도감', 'special')}`, '냥냥몬을 만나면 자동으로 기록해주는 하이테크한 도구란다!'),

    new Dex('fish', '생선', '굽고, 볶고, 날것으로도 먹을 수 있는 만능 식재료 <br> 고양이도 좋아한다'),
    new Dex('fish_rich', '다금바리', '상상속의 생선'),

    new Dex('cucumber', '오이', '고양이의 유전자에 도망가라는 명령이 각인되어있는 사악한 채소<br>제압 후 냉국으로 요리하면 맛있다'),

    new Dex('mineral', '광물', '채굴하면 한덩이에 8 광물이 통장에 입금된다 <br> 소환마법에도 필요한 주요 자원'),
    new Dex('mineral_rich', '희귀한 광물', '광물 덩어리가 더 큰 희귀한 광물'),
    new Dex('mineral_rare', '풍부한 광물', '낮은 확률로 발견되는 황금색 광물 <br> 색이 다른 광물과는 또다른 클래식한 느낌의 골-든 광물'),
    new Dex('mineral_richrare', '풍부한 희귀 광물', '수식어가 두 개나 붙은 초레어 광물 <br>여기에 색까지 다르다면? 당신의 로또 당첨 운, 색이 다른 풍부한 희귀 광물로 대체되었다'),

    new Dex('yarnball', '털실 공', '둥글게 말려있는게 잠자는 고양이를 닮은 귀여운 장난감'),
    new Dex('potion_hp', '체력 회복 물약', ''),
    new Dex('potion_hp_rich', '체력 회복 물약', ''),
    new Dex('potion_mp', '활력 회복 물약', ''),
    new Dex('potion_mp_rich', '활력 회복 물약', ''),

    new Dex('waterbottle', '물병', '세워놓으면 본능을 참지 못하고 냥냥펀치를 날린다'),
    new Dex('shavedice', '빙수', ''),

]

const dex_achievement = [
    new Dex('discover_all_cat', '냥냥몬 마스터가 될거야', `귀하는 ${setClass('냥냥 도감', 'special')} 고양이 부문을 훌륭하게 완성했습니다!`),
    new Dex('discover_all_pisces', '고양이 말고 다른 거', `귀하는 ${setClass('냥냥 도감', 'special')} 고양이 말고 다른 거 부문을 훌륭하게 완성했습니다!`),

    new Dex('discover_irochi', '이로치', '색이 다른 물건을 발견했습니다'),
    new Dex('discover_irochi_10', '샤이니', '색이 다른 물건을 10 번 발견했습니다'),
    new Dex('discover_irochi_100', '색이 다른', '색이 다른 물건을 100 번 발견했습니다'),
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
        pisces_summoned_yarnball: 0,
        pisces_summoned_waterbottle: 0,
        pisces_summoned_total: 0,

        pisces_summoned_irochi: 0,

        // 고양이 별로 떠난 냥이
        cat_dead: 0,
        cat_dead_all: 0,

    },

    // 도전과제 달성을 확인하는 메서드
    checkAchievement() {
        const a = (key) => { return p.data.achievement[key] };

        if (document.querySelector('#dex .cats') === null) { return }

        // 고양이
        p.data.achievement.discover_all_cat__completed = true;
        dex_cats.forEach(cat => {
            if (cat.completed || a(`cat_summoned_${cat.id}`) > 0) {
                cat.element.classList.add('discovered');
                cat.completed = true;
            }
            p.data.achievement.discover_all_cat__completed *= cat.completed;
        });

        // 고양이 말고 다른 거
        p.data.achievement.discover_all_pisces__completed = true;
        dex_pisces.forEach(pisces => {
            if (pisces.completed || a(`pisces_summoned_${pisces.id}`) > 0) {
                pisces.element.classList.add('discovered');
                pisces.completed = true;
            }
            p.data.achievement.discover_all_pisces__completed *= pisces.completed;
        });

        // 시스템 개선이 필요하네요
        // 도전 과제
        p.data.achievement.discover_irochi__completed = a('pisces_summoned_irochi') !== 0 ? true : false;
        p.data.achievement.discover_irochi_10__completed = a('pisces_summoned_irochi') > 10 ? true : false;
        p.data.achievement.discover_irochi_100__completed = a('pisces_summoned_irochi') > 100 ? true : false;

        dex_achievement.forEach(achievement => {
            console.log(p.data.achievement[`${achievement.id}__completedEventTriggered`]);
            if (p.data.achievement[`${achievement.id}__completed`] === true || p.data.achievement[`${achievement.id}__completed`] === 1) {

                // 업적 달성 표시
                achievement.element.classList.add('discovered');

                if (!p.data.achievement[`${achievement.id}__completedEventTriggered`]) { // 새로운 조건 추가
                    // 최초 이벤트 발생 로직을 여기에 추가
                    context
                        .setMessage('')
                        .setMessage(`도전과제 ${achievement.name}을(를) 달성했습니다.`);

                    // 최초 이벤트가 발생했음을 표시
                    p.data.achievement[`${achievement.id}__completedEventTriggered`] = true;
                }
            }
        });
    }
}