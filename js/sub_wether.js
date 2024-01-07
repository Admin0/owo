/* 날씨 */

getFormatDate = (date) => {
    return date.getFullYear()
        + (date.getMonth() + 1).toString().padStart(2, '0')
        + (date.getDate() - 1).toString().padStart(2, '0')
        + '2100'
    // + (date.getMinutes()).toString().padStart(2, '0')
    // + (date.getHours()).toString().padStart(2, '0');
}
// console.log(getFormatDate(new Date()));

var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/1360000/NwpModelInfoService/getLdapsUnisArea'; /*URL*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + '9ck19sxjLRy2ZTrGojxG65PBo8PkGVi3jdTzD%2FIVRKzUlw2vWHWhwblqJFYKX4%2BMvyPprDRSAD1znvyPmvTpJg%3D%3D'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
queryParams += '&' + encodeURIComponent('baseTime') + '=' + encodeURIComponent(getFormatDate(new Date())); /**/
// queryParams += '&' + encodeURIComponent('baseTime') + '=' + encodeURIComponent('202401060900'); /**/
queryParams += '&' + encodeURIComponent('dongCode') + '=' + encodeURIComponent('4420057000'); /**/
queryParams += '&' + encodeURIComponent('dataTypeCd') + '=' + encodeURIComponent('Temp'); /**/
// queryParams += '&' + encodeURIComponent('dataTypeCd') + '=' + encodeURIComponent('Rain'); /**/
xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        // console.log('Status: ' + this.status + ', nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + ', nBody: ' + this.responseText);
        const weathers = JSON.parse(this.responseText).response.body.items.item;
        // console.log(weathers);
        Object.keys(weathers).forEach(weather => {
            console.log(weathers[weather].fcstTime, weathers[weather].value + ' ' + weathers[weather].unit);
            // context.setMessage(weathers[weather].fcstTime + ': ' + weathers[weather].value + ' ' + weathers[weather].unit);
        });
    }
};

// xhr.send('');