# countdown.js

## Example

//jinh.kr/owo/

## Usage

```js
// Countdown 클래스 객체 생성 후 메서드를 이용하여 정보 설정,
// start() 매서드를 이용하여 화면에 카운터를 출력합니다.
new Countdown()
  .setTarget(".countdown")                          // .countdown 요소에 타이머 설정.
  .setTime("12:00")                                 // 오늘 12:00 시간까지로 설정.
  .setOptions({ timer_head: "h", timer_tail: "c" }) // 시~센티초까지의 시간 설정 ('d', 'h', 'm', 's', 'c' 중에서 선택)
  .start();
```
```js
// .set() 메서드는 setTarget(), setTime(), SetOptions() 메서드를 한번에 호출하는 효과입니다.
new Countdown().set(".countdown", 1.5, { timer_head: "d", timer_tail: "s" }).start();

// Countdown 클래스의 컨스트럭터를 이용할 수 있습니다. set() 메서드와 동일한 방법으로 사용합니다.
new Countdown(".countdown", "+1", { timer_head: "h", timer_tail: "s" }).start();
```
```js
// get() 메서드를 이용하여 남은 시간을 출력할 수 있습니다.
const countdown = new Countdown().set(".countdown", "12:00", { timer_head: "h", timer_tail: "c" });
countdown.get();
// > {string} 00:00:00:00:00
// 순서는 일:시:분:초:센티초 입니다.

// get() 메서드에 파라미터를 입력하면 구분자가 ':'에서 원하는 문자열로 변경됩니다.
countdown.get('-');
// > {string} 00-00-00-00-00

// 그 외에도 다양한 유사 메서드가 있습니다.
countdown.getDays();
countdown.getHours();
countdown.getMins();
countdown.getSecs();
```
# stare.js

[[downloads](https://github.com/admin0/owo/)]

## Usage

```js
new stare("#stare");
```

```js
new stare("#stare", { angle: 15, perspective: 1000 });
```

```js
new stare("#stare").angle(15).persfective(1000);
```

## Open-source License
```
PF스타더스트

(c)campanula913 https://blog.naver.com/campanula913/221366697603
```