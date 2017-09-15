* 这里是一个获取URL带QUESTRING参数的JAVASCRIPT客户端解决方案，相当于asp的request.querystring，PHP的$_GET函数:

```
<Script language="javascript">
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
			}
	}
	return theRequest;
}
</Script>
```

然后我们通过调用此函数获取对应参数值：

```
<Script language="javascript">
	var Request = new Object();
	Request = GetRequest();
	var 参数1,参数2,参数3,参数N;
	参数1 = Request[''参数1''];
	参数2 = Request[''参数2''];
	参数3 = Request[''参数3''];
	参数N = Request[''参数N''];
</Script>
```

以此获取url串中所带的同名参数

---
* 正则分析法。

```
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return (r[2]); return null;
}
alert(GetQueryString("参数名1"));
alert(GetQueryString("参数名2"));
alert(GetQueryString("参数名3"));
```

其他参数获取介绍：

```
//设置或获取对象指定的文件名或路径。
alert(window.location.pathname);

//设置或获取整个 URL 为字符串。
alert(window.location.href);

//设置或获取与 URL 关联的端口号码。
alert(window.location.port);

//设置或获取 URL 的协议部分。
alert(window.location.protocol);

//设置或获取 href 属性中在井号“#”后面的分段。
alert(window.location.hash);

//设置或获取 location 或 URL 的 hostname 和 port 号码。
alert(window.location.host);

//设置或获取 href 属性中跟在问号后面的部分。
alert(window.location.search);
```