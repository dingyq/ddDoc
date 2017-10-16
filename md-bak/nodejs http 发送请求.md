```
// GET请求
var http = require('http');
var qs = require('querystring');
var data = {
	a: 123,
	time: new Date().getTime()
};//这是需要提交的数据
var content = qs.stringify(data);
var options = {
	hostname: '127.0.0.1',
	port: 10086,
	path: '/pay/pay_callback?' + content,
	method: 'GET'
};
var req = http.request(options, function (res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	});
});
req.on('error', function (e) {
	console.log('problem with request: ' + e.message);
});
req.end();

// POST请求
var http = require('http');
var qs = require('querystring');
var post_data = {
	a: 123,
	time: new Date().getTime()
};//这是需要提交的数据

var content = qs.stringify(post_data);
var options = {
	hostname: '127.0.0.1',
	port: 10086,
	path: '/pay/pay_callback',
	method: 'POST',
	headers: {
	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
};
var req = http.request(options, function (res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	});
});

req.on('error', function (e) {
	console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(content);
req.end();
```