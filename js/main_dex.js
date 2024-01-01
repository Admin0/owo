// 도전과제를 위한 통계량 초기화
const statistic = {
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

    // 도전 과제
    discover_all_cat: false,
    discover_all_pisces: false,
    discover_irochi: false,
    discover_irochi_10: false,
    discover_irochi_100: false
}

const dex_cats = [
    { off_name: '미발견', off_desc: '만나지 못했습니다' },

    { id: '우유', name: `${setClass('우유', 'special')}`, desc: `분홍색 젤리를 가진 귀여운 젖소 무늬 고양이 <br><br>${setClass("온순", "var")}한 성격 <br>2020년 10월 15일 ${setClass("여수시", "var")}에서 Lv. 0.5일 때 만남<br>집사를 좋아함` },
    { id: '흰냥이', name: '흰냥이', desc: '누구에게나 추천하고싶은 안정적인 바닐라맛 고양이' },
    { id: '깜냥이', name: '깜냥이', desc: '자세히 보면 개체마다 조금씩 명도가 다르다' },
    { id: '치즈', name: '치즈', desc: '작은 호랑이 같은 모습이 멋지다' },
    { id: '고등어', name: '고등어', desc: '누구나 좋아하는 냥이계의 스테디셀러' },
    { id: '젖소', name: '젖소', desc: '애교가 많은 귀염둥이' },
    { id: '턱시도', name: '턱시도', desc: '알맞은 복장을 입은 고양이는 어디에서나 환영받는다' },
    { id: '유령', name: '유령', desc: '근처에 다가가면 서늘한 기운이 든다' },
];

const dex_pisces = [
    { off_name: '미발견', off_desc: '발견하지 못했습니다' },

    { id: 'dex', name: `${setClass('냥냥 도감', 'special')}`, desc: '냥냥몬을 만나면 자동으로 기록해주는 하이테크한 도구란다!' },

    { id: 'fish', name: '생선', desc: '굽고, 볶고, 날것으로도 먹을 수 있는 만능 식재료 <br> 고양이도 좋아한다' },
    { id: 'fish_rich', name: '다금바리', desc: '상상속의 생선' },

    { id: 'cucumber', name: '오이', desc: '고양이의 유전자에 도망가라는 명령이 각인되어있는 사악한 채소<br>제압 후 냉국으로 요리하면 맛있다' },

    { id: 'mineral', name: '광물', desc: '채굴하면 한덩이에 8 광물이 통장에 입금된다 <br> 소환마법에도 필요한 주요 자원' },
    { id: 'mineral_rich', name: '희귀한 광물', desc: '광물 덩어리가 더 큰 희귀한 광물' },
    { id: 'mineral_rare', name: '풍부한 광물', desc: '낮은 확률로 발견되는 황금색 광물 <br> 색이 다른 광물과는 또다른 클래식한 느낌의 골-든 광물' },
    { id: 'mineral_richrare', name: '풍부한 희귀 광물', desc: '수식어가 두 개나 붙은 초레어 광물 <br>여기에 색까지 다르다면? 당신의 로또 당첨 운, 색이 다른 풍부한 희귀 광물로 대체되었다' },

    { id: 'yarnball', name: '털실 공', desc: '둥글게 말려있는게 잠자는 고양이를 닮은 귀여운 장난감' },

    { id: 'potion_hp', name: '체력 회복 물약', desc: '' },
    { id: 'potion_hp_rich', name: '체력 회복 물약', desc: '' },
    { id: 'potion_mp', name: '활력 회복 물약', desc: '' },
    { id: 'potion_mp_rich', name: '활력 회복 물약', desc: '' },

    { id: 'waterbottle', name: '물병', desc: '세워놓으면 본능을 참지 못하고 냥냥펀치를 날린다' },
    { id: 'shavedice', name: '빙수', desc: '' },
]

const dex_achievement = [
    { off_name: '미달성', off_desc: '달성하지 못했습니다' },

    { id: 'discover_all_cat', name: '냥냥몬 마스터가 될거야', desc: `귀하는 ${setClass('냥냥 도감', 'special')} 고양이 부문을 훌륭하게 완성했습니다!` },
    { id: 'discover_all_pisces', name: '고양이 말고 다른 거', desc: `귀하는 ${setClass('냥냥 도감', 'special')} 고양이 말고 다른 거 부문을 훌륭하게 완성했습니다!` },
    { id: 'discover_irochi', name: '이로치', desc: '색이 다른 물건을 발견했습니다' },
    { id: 'discover_irochi_10', name: '샤이니', desc: '색이 다른 물건을 10 번 발견했습니다' },
    { id: 'discover_irochi_100', name: '색이 다른', desc: '색이 다른 물건을 100 번 발견했습니다' },
]