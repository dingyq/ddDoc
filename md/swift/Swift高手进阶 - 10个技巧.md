* 扩展(Extension)

任务： 求数字的平方。

```
// 菜鸟版
func square(x: Int) -> Int { return x * x }
var squaredOfFive = square(x: 5)
square(x: squaredOfFive) // 625
```
为了求5的四次方我们被迫创建变量 squaredOfFive — 高手可不喜欢被迫定义一个无用的变量。

```
// 高手版
extension Int {  
	var squared: Int { return self * self }
}
5.squared // 25
5.squared.squared // 625
```

---
* 泛型(Generics)

任务：打印输出数组内所有的元素。

```
// 菜鸟版
var stringArray = ["苍老师", "范老师", "优衣库"]
var intArray = [1, 3, 4, 5, 6]
var doubleArray = [1.0, 2.0, 3.0]
func printStringArray(a: [String]) {         
	for s in a {              
		print(s)        
	}
}
 
func printIntArray(a: [Int]) { 
	for i in a { 
		print(i) 
	} 
}
func printDoubleArray(a: [Double]) {for d in a { print(d) } }
```

居然要定义这么多函数？ 菜鸟能忍高手不能忍！！！

```
// 高手版
func printElementFromArray(a: [T]) {        
	for element in a {            
		print(element)        
	} 
}
```
---
* For 遍历 vs While 遍历

任务：打印 5 次 陆家嘴

```
// 菜鸟版
var i = 0while 5 > i {     
	print("陆家嘴")      
	i += 1 
}
```
被迫定义了变量 i 来确保打印 陆家嘴 5 次。
注意定义越多的变量，越多的潜在风险，越多的生活问题。这就是蝴蝶效应，你难道想X生活不和谐？

```
// 高手版
for _ in 1...5 {     
	print("陆家嘴") 
}
```
上面的代码实在是简洁，美妙。

---
* Gaurd let vs if let

任务 : 让我们写个欢迎新用户的程序。

```
var myUsername: Double?
var myPassword: Double?
// 菜鸟版
func userLogIn() {     
	if let username = myUsername {          
  		if let password = myPassword {               
			print("优衣库欢迎, \(username)"!)          
		}     
	}
}
```
这些令人讨厌的嵌套代码，我们要消灭它

```
// 高手版
func userLogIn() {
	guard let username = myUsername, let password = myPassword           
	else { return }         
		print("优衣库欢迎, \(username)!") 
	}
```
注意这里如果myUsername 或 myPassword nil，都会提前结束，否则就会打印 “优衣库欢迎, XXX”

---
* 计算属性 vs 函数

任务：计算圆的直径

```
// 菜鸟版
func getDiameter(radius: Double) -> Double { return radius * 2}
 
func getRadius(diameter: Double) -> Double { return diameter / 2}
 
getDiameter(radius: 10) // return 20
 
getRadius(diameter: 200) // return 100
 
getRadius(diameter: 600) // return 300
```
上面我们创建了2个毫无关系的函数，可是直径和周长两者真的没有关系吗？

```
// 高手版
var radius: Double = 10
var diameter: Double {
	get { return radius * 2}
	set { radius = newValue / 2} 
}
radius // 10
diameter // 20
diameter = 1000radius // 500
```
现在半径和直径相互依赖，真实地反应了两者的关系。
记得上面说的蝴蝶效应吗？ 越少的依赖，代码越简洁，问题越少，生活越美好！

---
* 枚举 - 类型安全

任务：卖门票

```
// 菜鸟版
switch "Adult" {
	case "Adult": print("请付 50 元")   
	case "Child": print("请付 25 元")   
	case "Senior": print("请付 30 元")   
	default: print("你确认不是僵尸吗，哥们?") 
}
```
“Adult”, “Child”, “Senior” 这里都是硬编码，你每次需要输入手动输入这些字符，记得我们上面讲到的吗？ 手动键入越少，错误越少，生活越美好。

```
// 高手版
enum People { case adult, child, senior }
switch People.adult {
	case .adult: print("请付 50 元")   
	case .child: print("请付 25 元")   
	case .senior: print("请付 30 元")   
	default: print("你确认不是僵尸吗，哥们?")
}
```

这样你就避免了不小心输入错误的问题，因为 “.adult”, “.child”, “.senior” 被定义成了enum'， 任何不在预定义范围内的实例都会被Xcode毫不留情的指出来，合理利用集成开发环境是高手必备的。

---
* 空合运算符

任务： 用户选择微博主体颜色。

```
// 菜鸟版
var userChosenColor: String?
var defaultColor = "Red"
var colorToUse = ""
if let Color = userChosenColor {
	colorToUse = Color 
} else {
	colorToUse = defaultColor 
}
```
这也太臃肿了吧，让我们来减减肥。

```
// 高手
var colorToUse = userChosenColor ?? defaultColor
```
稍微解释一下, 如 userChosenColor 为 nil, 则选择 defaultColor， 否则则userChosenColor.
其实空合运算符是对以下代码的简短表达方法。

```
a != nil ? a! : b
```

---

* 三目运算符

Ex) 有鸡冠头的人身高增加5厘米。

```
// 菜鸟版
var currentHeight = 185
var hasSpikyHair = true
var finalHeight = 0
if hasSpikyHair {
	finalHeight = currentHeight + 5
} else {
	finalHeight = currentHeight
}
```
太啰嗦，还是需要减减肥！

```
// 高手版
finalHeight = currentHeight + (hasSpikyHair ? 5: 0)
```

如果是鸡冠头，就增加 5 厘米高度，否则增加 0 厘米。

---
* 函数式编程

任务： 获取偶数。

```
// 菜鸟版
var newEvens = [Int]()
for i in 1...10 {
	if i % 2 == 0 {
		newEvens.append(i)
	} 
}
print(newEvens) // [2, 4, 6, 8, 10]
```

这种for循环真是冗长，让人看的昏昏欲睡。

```
// 高手版
var evens = Array(1...10).filter { $0 % 2 == 0 }  
print(evens) 
// [2, 4, 6, 8, 10]
```
有没有感觉函数式编程让你看起来聪明多了。

---
* 闭包 vs 函数

任务： 求两个数字的和。

```
// 菜鸟版
func sum(x: Int, y: Int) -> Int {
	return x + y 
}
var result = sum(x: 5, y: 6) // 11
```

为了这个功能我还需要记住函数名 和 变量名？ 能不能少一个呢？

```
// 高手版
var sumUsingClosure: (Int, Int) -> (Int) = { $0 + $1 } 
sumUsingClosure(5, 6) // 11
```