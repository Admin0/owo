var tag = [
  "김주임이_과로로_쓰러졌다...인수인계_파일은_어디있지?",
  "집에가고싶다증후군_강력한귀소본능을느낌(심한경우_집에서도_환상통을겪음)",
  "실어증입니다_일하기싫어증",
  "사람은_일을_하면_포악해진다",
  "암오케_거친세상에뛰어든건_나니까", "거친세상에뛰어든건나지만_존나힘들다",
  "지치고_고된_아침",
  "분실물을_찾습니다...이름:주말",
  "주말_리필_좀_해주세요_나_단골인데",
  "내_귀중한_일요일은_어디로_간_거야",
  "주말은_왜_일주일에_이틀밖에_없을까?",
  "1년차_나는능히할수있다_3년차_나는능이버섯이다",
  "월요병_심할경우_일요일_출근해_잠깐일하면_도움돼",

  "사람이_5인이상_모이면_반드시_쓰레기가있다",
  "지금_남_걱정할때가_아니야",
  "할줄아는게있으면_회사에들키지마세요", "어제보다_나은_내일은_토요일뿐이야",
  "인생_살아만_있으면_어떻게든_된다", "그래_네_말이_맞단다", "미래의_나에게_맡긴다",
  "극복한_것이_커리어가_된다", "행복은_장소가_아니라_방향",
  "월요일을_두려워마라_나만의_화요일을_만들어라",
  "나의_일이_나를_정의한다",
  "열정을_쫓아라_그러면_일이_즐거워진다",
  "목표는_항상_높게_실천은_당장",
  "성공은_준비된_사람에게_찾아온다",
  "오늘의_노력은_내일의_성과를_만든다",
  "실패는_성공의_어머니다",
  "고통은_성장의_기회이다",
  "협업은_힘이다",
  "책임감을_가져라",
  "팀은_모두가_승리할수_있을때_가장강하다",
  "변화는_성장의_시작이다",
  "성공은_자기_관리에서_시작된다",
  "일하는_동안_항상_배우고_발전하라",
  "도전은_새로운_기회를_만든다",
  "성취감은_노력의_결과",
  "일은_삶을_풍요롭게_만들기_위한_수단",
  "자신의_업무에_자부심을_가져라",

  // 속담
  "일찍_일어나는_새가_더_피곤하다", "고생끝에_골병든다", "헌신하면_헌신짝_된다", "참고참으면_참나무된다", "가는말이_고우면_사람을_얕본다",
  "내일할수있는일은_내일의나에게맡긴다", "동정할거면_돈으로주세요", "재주는_내가부리고_돈은_통장이챙긴다", "원수는_회사에서_만난다", "티끌_모아_티끌", "호이가_계속되면_둘리로_안다",

  // 스트레스 덜 받는 마법의 말투
  "오히려_좋아", "그럴수도_있지", "가보자고", "모든_삶은_실험이다",

  // 챗GPT: 유머가 있는 직장인 해시태그 100개 추천에서 몇개 추려냄 2023 (구글 바드는 다른 사이트 링크만 뱉는 만행을 저지름)
  "나만_빼고_다_놀고_있어ㅠ", "커피_없으면_출근_안_함", "이번_월급날엔_뭘_지르지?",
  "오늘도_쌓인_업무,_내일로_미루자", "눈치보며_일하는_나의_룰", "회의_중에_뇌가_절전_모드", "빈_컵에_마음을_담아서",
  "오늘의_할_일:_생존", "오늘도_야근의_늪에_빠졌다", "화장실이_유일한_안식처", "금요일_오후_5시를_기다리며", "자리에_앉으면_모든_것이_시작된다",
  "좋은_아이디어는_화장실에서_떠오른다", "퇴근_후에도_일은_끝나지_않아", "이번달도_월급루팡", "뒷담화의_달인", "눈치껏_일해봐야_뭐해",
  "회의는_끝이_없다", "오늘도_살아남았다_출근한_나에게_박수", "불금에는_야근이_죄악",
  "오늘도_자리에_물건을_뿌리고_나갔다", "칼퇴는_내가_제일_잘해", "최고의_아이디어는_퇴근길에_떠오른다", "자리에_앉으면_곧_졸림_모드_ON", "빨리_퇴근하고_싶은_마음,_불타오르게",
  "월급이_나의_무기", "초조한_눈치보기_대회", "점심시간_행복의_시간", "카페인은_나의_에너지_드링크", "회의는_나의_수면제",
  "잠깐만...쉴까?", "누군가에게_물어봐도_모르는_업무", "아무도_할줄_모르는데_왜_내가_담당자야?", "일_못하는_척_하는_나의_기술",
  "퇴근_후에도_생존은_계속된다", "열일은_내_스타일", "퇴근은_나만의_미로", "빈_회의실은_나의_휴식처", "회의는_언제_끝날까?",
  "퇴근_후에도_일은_계속된다", "매일매일_똑같은_업무_똑같은_일상", "금요일_오전_마음만은_퇴근_모드", "출근길에_증말_어지러워", "자리에_앉으면_무한정_졸림",
  "카페인_중독자의_일상", "오늘도_재택근무의_유혹", "내일은_쉴까",
  "오늘도_나는_일하는_중", "금요일에는_정말_일_안_하고_싶다", "일은_나를_미치게_만든다", "여긴어디_나는누구?",
];

function dice(n, s, b) {
  var out = 0;
  for (let i = 0; i < n; i++) {
    out += Math.ceil(Math.random() * s);
  }
  return out + b;
}

function tag_manager(target, times) {
  var t;
  for (var i = 0; i < times; i++) {
    let n = dice(1, tag.length, -1);
    let tag_msg = document.createElement("span");
    tag_msg.classList.add("tag");
    tag_msg.innerHTML = "#" + tag[n];
    target.appendChild(tag_msg);
  }
}

// type tag
const $target = document.getElementById("type");
$target.addEventListener("th.endType", function (e) {
  setTimeout(() => {
    let i = $target.innerText.length;
    function backspace(msg) {
      // console.log(msg);
      if (i > 0) {
        $target.innerText = `${msg.substring(0, i)}`;
        i--;
        setTimeout(backspace, dice(3, 5, 20), msg);
      } else {
        setTimeout(() => {
          TypeHangul.type("#type", {
            text: tag[dice(1, tag.length, -1)],
            append: true,
            intervalType: 65,
            humanize: 0.25,
          });
        }, 500);
      }
    }
    backspace($target.innerText);
  }, 3000);
});
TypeHangul.type("#type", {
  text: tag[dice(1, tag.length, -1)],
  append: true,
  intervalType: 65,
  humanize: 0.25,
});