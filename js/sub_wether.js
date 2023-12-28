/* Javascript 샘플 코드 */


var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/1360000/NwpModelInfoService/getLdapsUnisArea'; /*URL*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'ck19sxjLRy2ZTrGojxG65PBo8PkGVi3jdTzD%2FIVRKzUlw2vWHWhwblqJFYKX4%2BMvyPprDRSAD1znvyPmvTpJg%3D%3D'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /**/
queryParams += '&' + encodeURIComponent('baseTime') + '=' + encodeURIComponent('202312280300'); /**/
queryParams += '&' + encodeURIComponent('dongCode') + '=' + encodeURIComponent('1100000000'); /**/
queryParams += '&' + encodeURIComponent('dataTypeCd') + '=' + encodeURIComponent('Temp'); /**/
xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        console.log('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
    }
};

xhr.send('');