每个语言都有自己的推荐风格。显然OC与Swift有着不同的风格。当我们开始写Swift，首先要注意的就是按照Swift的风格写，而不是沿用OC的风格。

* 省略句末的分号

swift推崇简洁的语法。如果一行里只有一句代码，句末不要写分号。

```
// bad
title = "swift 3";

// good
title = "swift 3"

```

* 省略self.

不在闭包里的时候调用自身的属性或者方式时省略self.。这点社区也产生过讨论，有人建议需要强制的声明self.，但是苹果大声的拒绝了。所以让代码更简洁一点吧。

```
// bad
self.title = "swift 3"

// good
title = "swift 3"
```

* 注意类型标注的格式

当我们给一个变量或者属性标注类型时的语法是这样的：

```
var a: Type
var dict: [String: Any]

```

注意冒号后面有一个空格，如果是字典key的冒号后面有一个空格。
冒号后面紧跟着类型是不规范的写法。

```
// bad
var name:String
var dict: [String:Any]
var dict: [String : Any]
```

当然你可以利用[SwiftLint](https://github.com/realm/SwiftLint)帮你检查。

*  注意函数声明背后的空格

一个标准的函数语法是这样的：

```
overrid func viewDidLoad() {
	super.viewDidLoad()
}
```

注意函数实现 { 前有一个空格

```
// bad
class Uer{
	subscript(index: Int) -> T{
		return objects[index]
	}
}

// good
class User {
	subscript(index: Int) -> T {
		return objects[index]
	}
}

```

* 二元操作符前后有空格

```
// bad
var sum = 1+2
// good
var sum = 1 + 2

// 注意函数返回类型 -> 符号前后的空格
// bad
func greet(person: String, day: String)->String {
	return "Hello \(person), today is \(day)."
}

// good
func greet(person: String, day: String) -> String {
	return "Hello \(person), today is \(day)."
}
```

* 闭包、函数实现不要写在一行里

```
// bad
var joke : JokeItem? {
	didSet {
		if let _ = joke { updateUI()}
	}
}

// good
var joke : JokeItem? {
	didSet {
		if let _ = joke { 
			updateUI()
		}
	}
}

```

* 对象初始化不要显式调用init

通过()直接就是调用对象的初始化方法，不需要调用init

```
// bad
let url1 = NSURL.init(string: "github.com")

// good
let url1 = NSURL(string: "github.com")

```

* 函数命名

oc的第一个参数名是省略的，所以会把第一个参数名带到方法名上。swift 3以后调整为在调用时第一个参数名会展示。所以函数命名时不要把第一个参数相关命名放在函数名上。

```
// bad
func bindWith(data: String) {

}

// bad
func bind(withData: String) {

}

bind(withData: "swift")
```

然而这里直接把介词去掉显得更加简洁：

```
func bind(data: String) {

}

bind(data: "swift")
```

