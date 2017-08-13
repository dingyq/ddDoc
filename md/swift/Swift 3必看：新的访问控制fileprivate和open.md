在swift 3中新增加了两种访问控制权限 `fileprivate`和 `open`。下面将对这两种新增访问控制做详细介绍。

 * **fileprivate**

在原有的swift中的 private其实并不是真正的私有，如果一个变量定义为private，在同一个文件中的其他类依然是可以访问到的。这个场景在使用extension的时候很明显。

```
class User {
    private var name = "private"
}

extension User{
    var accessPrivate: String {
        return name
    }
}
```

这样带来了两个问题：

当我们标记为private时，意为真的私有还是文件内可共享呢？

当我们如果意图为真正的私有时，必须保证这个类或者结构体在一个单独的文件里。否则可能同文件里其他的代码访问到。

由此，在swift 3中，新增加了一个 fileprivate来显式的表明，这个元素的访问权限为文件内私有。过去的private对应现在的fileprivate。现在的private则是真正的私有，离开了这个类或者结构体的作用域外面就无法访问。

* **open**

**open**则是弥补public语义上的不足。
现在的pubic有两层含义：

这个元素可以在其他作用域被访问
这个元素可以在其他作用域被继承或者override
继承是一件危险的事情。尤其对于一个framework或者module的设计者而言。在自身的module内，类或者属性对于作者而言是清晰的，能否被继承或者override都是可控的。但是对于使用它的人，作者有时会希望传达出这个类或者属性不应该被继承或者修改。这个对应的就是 `final`。

`final`的问题在于在标记之后，在任何地方都不能override。而对于lib的设计者而言，希望得到的是在module内可以被override，在被import到其他地方后其他用户使用的时候不能被override。

这就是 open产生的初衷。通过open和public标记区别一个元素在其他module中是只能被访问还是可以被override。

下面是例子：

```
/// ModuleA:

// 这个类在ModuleA的范围外是不能被继承的，只能被访问
public class NonSubclassableParentClass {

    public func foo() {}

    // 这是错误的写法，因为class已经不能被继承，
    // 所以他的方法的访问权限不能大于类的访问权限
    open func bar() {}

    // final的含义保持不变
    public final func baz() {}
}

// 在ModuleA的范围外可以被继承
open class SubclassableParentClass {
    // 这个属性在ModuleA的范围外不能被override
    public var size : Int

    // 这个方法在ModuleA的范围外不能被override
    public func foo() {}

    // 这个方法在任何地方都可以被override
    open func bar() {}

    ///final的含义保持不变
    public final func baz() {}
}

/// final的含义保持不变
public final class FinalClass { }
/// ModuleB:

import ModuleA

// 这个写法是错误的，编译会失败
// 因为NonSubclassableParentClass类访问权限标记的是public，只能被访问不能被继承
class SubclassA : NonSubclassableParentClass { }

// 这样写法可以通过，因为SubclassableParentClass访问权限为 `open`.
class SubclassB : SubclassableParentClass {

    // 这样写也会编译失败
    // 因为这个方法在SubclassableParentClass 中的权限为public，不是`open'.
    override func foo() { }

    // 这个方法因为在SubclassableParentClass中标记为open，所以可以这样写
    // 这里不需要再声明为open，因为这个类是internal的
    override func bar() { }
}

open class SubclassC : SubclassableParentClass {
    // 这种写法会编译失败，因为这个类已经标记为open
    // 这个方法override是一个open的方法，则也需要表明访问权限
    override func bar() { } 
}

open class SubclassD : SubclassableParentClass {
    // 正确的写法，方法也需要标记为open
    open override func bar() { }    
}

open class SubclassE : SubclassableParentClass {
    // 也可以显式的指出这个方法不能在被override
    public final override func bar() { }    
}
```

* 总结

现在的访问权限则依次为：**open，public，internal，fileprivate，private**。
有的人会觉得访问权限选择的增加加大了语言的复杂度。但是如果我们思考swift语言的设计目标之一就是一门安全的语言（“Designed for Safety”）就能理解这次的改动。更加明确清晰的访问权限控制可以使程序员表达出更准确的意图，当然也迫使在编码时思考的更加深入。
