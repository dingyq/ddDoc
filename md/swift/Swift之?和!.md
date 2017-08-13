Swift语言使用var定义变量，但和别的语言不同，Swift里不会自动给变量赋初始值，也就是说变量不会有默认值，所以要求使用变量之前必须要对其初始化。如果在使用变量之前不进行初始化就会报错：

```swift
var stringValue : String  
//error: variable 'stringValue' used before being initialized 
//let hashValue = stringValue.hashValue 
//                            ^ 
let hashValue = stringValue.hashValue 
```

上面了解到的是普通值，接下来`Optional`值要上场了。`Optional`其实是个`enum`，里面有`None`和`Some`两种类型。其实所谓的`nil`就是`Optional.None`, 非`nil`就是`Optional.Some`, 然后会通过`Some(T)`包装`（wrap）`原始值，这也是为什么在使用`Optional`的时候要拆包（从enum里取出来原始值）的原因, 也是PlayGround会把Optional值显示为类似`{Some "hello world"}`的原因，这里是enum Optional的定义：

```
enum Optional<T> : LogicValue, Reflectable { 
    case None 
    case Some(T) 
    init() 
    init(_ some: T) 
 
    /// Allow use in a Boolean context. 
    func getLogicValue() -> Bool 
 
    /// Haskell's fmap, which was mis-named 
    func map<U>(f: (T) -> U) -> U? 
    func getMirror() -> Mirror 
} 
```

声明为Optional只需要在类型后面紧跟一个?即可。如:

`var strValue : String?  `

一旦声明为Optional的，如果不显式的赋值就会有个默认值nil。判断一个Optional的值是否有值，可以用if来判断：

```
if strValue { 
    //do sth with strValue 
}
```
 
然后怎么使用Optional值呢？文档中也有提到说，在使用Optional值的时候需要在具体的操作，比如调用方法、属性、下标索引等前面需要加上一个?，“Optional Chaining的问号的意思是询问是否响应后面这个方法，和原来的isResponseToSelector有些类似”，如果是nil值，也就是Optional.None，固然不能响应后面的方法，所以就会跳过，如果有值，就是Optional.Some，可能就会拆包(unwrap)，然后对拆
包后的值执行后面的操作，比如：

```
let hashValue = strValue?.hashValue  
strValue是Optional的字符串，如果strValue是nil，
则hashValue也为nil，如果strValue不为nil，hashValue就是strValue字符串的哈希值
```

到这里我们看到了?的两种使用场景:
 
1. 声明Optional值变量
2. 用在对Optional值操作中，用来判断是否能响应后面的操作
 
另外，对于Optional值，不能直接进行操作，否则会报错：

```
//error: 'String?' does not have a member named 'hashValue' 
//let hashValue = strValue.hashValue 
//                ^        ~~~~~~~~~ 
 
let hashValue = strValue.hashValue 
```

上面提到Optional值需要拆包(unwrap)后才能得到原来值，然后才能对其操作，那怎么来拆包呢？拆包提到了几种方法，一种是Optional Binding， 比如：
if let str = strValue { 
    let hashValue = str.hashValue 
} 
还有一种是在具体的操作前添加!符号，好吧，这又是什么诡异的语法?!
 
直接上例子，strValue是Optional的String：

```
let hashValue = strValue!.hashValue 
```

这里的!表示“我确定这里的的strValue一定是非nil的，尽情调用吧” ，比如这种情况:

```
if strValue { 
    let hashValue = strValue!.hashValue 
} 
```

{}里的strValue一定是非nil的，所以就能直接加上!，强制拆包(unwrap)并执行后面的操作。 当然如果不加判断，strValue不小心为nil的话，就会出错，crash掉。
 
考虑下这一种情况，我们有一个自定义的MyViewController类，类中有一个属性是myLabel，myLabel是在viewDidLoad中进行初始化。因为是在`viewDidLoad`中初始化，所以不能直接声明为普通值：`var myLabel : UILabel`，因为非Optional的变量必须在声明时或者构造器中进行初始化，但我们是想在viewDidLoad中初始化，所以就只能声明为`Optional：var myLabel: UILabel?`, 虽然我们确定在viewDidLoad中会初始化，并且在ViewController的生命周期内不会置为nil，但是在对myLabel操作时，每次依然要加上!来强制拆包(?也OK)，比如:

```
myLabel!.text = "text" 
myLabel!.frame = CGRectMake(0, 0, 10, 10) 
...
```
 
对于这种类型的值，我们可以直接这么声明：`var myLabel: UILabel!`, 果然是高(hao)大(fu)上(za)的语法!, 这种是特殊的Optional，称为Implicitly Unwrapped Optionals, 直译就是隐式拆包的Optional，就等于说你每次对这种类型的值操作时，都会自动在操作前补上一个!进行拆包，然后在执行后面的操作，当然如果该值是nil，也一样会报错crash掉。
 
那么!大概也有两种使用场景
 
1. 强制对Optional值进行拆包(unwrap)
2. 声明Implicitly Unwrapped Optionals值，一般用于类中的属性