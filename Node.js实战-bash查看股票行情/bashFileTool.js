/**
 * 将股票与相应行情生成bash文本
 * 
 * @author yongqiang
 * @version 2017-10-22
 *
 */

const kUseGap = true;
const kVCount = 14;
const kStart = '\033';
const kRed = '31';
const kGreen = '32';
const kRedBg = '41';
const kGreenBg = '42';
const kDefaultBg = '49';
const kReset = kStart+'[0m';
const kNewLine = '\r\n';

const kDivisorFactor = 1000

// 默认保留3位小数，如：3，会在3后面补上00.即3.00 
var formatToDecimal = function(x, precision) { 
	var factor = 10;
	if (precision == 2) {
		factor = 100;
	} else {
		factor = 1000;
		precision = 3;
	}

	var f = parseFloat(x); 
  	if (isNaN(f)) { 
    	return false; 
  	}
  	var f = Math.round(x)/factor; 
  	var s = f.toString(); 
  	var rs = s.indexOf('.'); 
  	if (rs < 0) { 
    	rs = s.length; 
    	s += '.'; 
  	} 
  	while (s.length <= rs + precision) { 
    	s += '0';
  	} 
  	return s; 
}

var bashFileTool = {};

bashFileTool.generate = function(stock, kLineArr) {
	console.log(kLineArr);
	var marketStr = 'HK';
	var marketType = stock.market_type;
	if (marketType == 1) { 
		marketStr = 'HK';
	} else if (marketType == 2) { 
		marketStr = 'US';
	} else {
		marketStr = 'CN';
	}
	var titleStr = kNewLine+' '+stock.stock_code+'.'+marketStr+' '+stock.stock_name+' ';

	if (kLineArr.length < 10) {
		return titleStr;
	}
	var todayQuote = kLineArr[kLineArr.length - 1];
	var yesQuote = kLineArr[kLineArr.length - 2];
	var mChange = todayQuote.close - yesQuote.close;
	var foreColor = kRed;
	if (mChange < 0) {
		foreColor = kGreen;
	}
	titleStr += kStart+'['+foreColor+';49m'+formatToDecimal(todayQuote.close)+' '+formatToDecimal(mChange)+' '+formatToDecimal((mChange/yesQuote.close)*kDivisorFactor*100)+'%'+kReset+kNewLine;

	var resultStr = titleStr + kNewLine;

	// 绘制横纵坐标系
	var invalidVC = 2;
	var validVC = kVCount-invalidVC;
	var highAndLow = this.retrieveLowestAndHighestPrice(kLineArr);
	var low = highAndLow.low;
	var high = highAndLow.high;
	var highStr = formatToDecimal(high);
	var middle = (low + high)/2
	var unit = (high - low)/(validVC-2);
	var leftHolder = this.makeupToHighWithSpace(highStr, '');

	for (var i = 0; i < kVCount; i++) {
		var str = ' ';
		if (i == 1) {
			str += formatToDecimal(high)+' +';
		} else if (i == Math.floor(validVC/2)) {
			var mStr = formatToDecimal(middle); 
			str += this.makeupToHighWithSpace(highStr, mStr);
			str += mStr+' +';
		} else if (i == kVCount-invalidVC-1) {
			var lowStr = formatToDecimal(low);
			str += this.makeupToHighWithSpace(highStr, lowStr);
			str += lowStr+' +';
		} else if (i == kVCount-invalidVC+1) {
			str += leftHolder+'  ';
		} else {
			str += leftHolder+' |';
		}

		var gap = '';
		var gapB = '';
		if (kUseGap) {
			gap = ' ';
			gapB = '_';
		}
		var factor = 10;
		for (var j = 0; j < kLineArr.length; j++) {
			var quote = kLineArr[j];
			if (i == kVCount-invalidVC) {
				var c = '_';
				if (j%factor == 0 && j!= 0) {
					c = '|'
				}
				str += c+gapB;
			} else if (i == kVCount-invalidVC+1) {
				if (j%factor == 0) {
					var date = new Date(quote.time*1000);
					var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/';
					var D = (date.getDate()<10? '0'+date.getDate() : date.getDate());
					str += (M+D);
					var cc = factor*2-5;
					if (gap == '') {
						cc = factor-5;
					}
					for (var k = 0; k < cc; k++) {
						str += ' ';
					}
				}
			} else {
				var line1 = Math.floor((high-quote.open)/unit)+2;
				var line2 = Math.floor((high-quote.close)/unit)+2;
				if (i <= Math.max(line1, line2) && i >= Math.min(line1, line2)) {
					if (quote.close > quote.open) {
						str += kStart+'['+kRedBg+'m '+kReset+gap;
					} else if (quote.close < quote.open) {
						str += kStart+'['+kGreenBg+'m '+kReset+gap;
					} else {
						str += kStart+'['+kDefaultBg+'m-'+kReset+gap;
					}
				} else {
					str += ' '+gap;
				}
			}
		}
		str += kNewLine;
		resultStr += str;
	}

	return resultStr + kNewLine;
}

bashFileTool.retrieveLowestAndHighestPrice = function (kLineArr) {
	var low = Number.MAX_VALUE;
	var high = 0;
	for (var key in kLineArr) {
		var quote = kLineArr[key];
		if (low > quote.low) {
			low = quote.low;
		}
		if (high < quote.high) {
			high = quote.high;
		}
	}
	return {
		'low': low,
		'high': high
	}
}

bashFileTool.makeupToHighWithSpace = function(high, target) {
	var str = '';
	var dif = high.length - target.length;
	for (var i = 0; i < dif; i++) {
		str += ' ';
	}
	return str;
}

module.exports = bashFileTool;