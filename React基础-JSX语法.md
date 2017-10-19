JSX是React的核心组成部分，它使用XML标记的方式去直接声明界面，界面组件之间可以互相嵌套。可以理解为在JS中编写与XML类似的语言,一种定义带属性树结构（DOM结构）的语法，它的目的不是要在浏览器或者引擎中实现，它的目的是通过各种编译器将这些标记编译成标准的JS语言。

虽然你可以完全不使用JSX语法，只使用JS语法，但还是推荐使用JSX，可以定义包含属性的树状结构的语法，类似HTML标签那样的使用，而且更便于代码的阅读。

使用JSX语法后，你必须要引入babel的JSX解析器，把JSX转化成JS语法，这个工作会由babel自动完成。同时引入babel后，你就可以使用新的es6语法，babel会帮你把es6语法转化成es5语法，兼容更多的浏览器。

我们从最简单的一个官网例子helloworld开始：

```
  <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Hello React!</title>
      <script src="vendor-js/react.js"></script>
      <script src="vendor-js/react-dom.js"></script>
      <script src="vendor-js/babel-core/browser.min.js"></script>
    </head>
    <body>
      <div id="example"></div>
      <script type="text/babel">
        ReactDOM.render(
          <h1>Hello, world!</h1>,
          document.getElementById('example')
        );
      </script>
    </body>
  </html>
```

在这个简单的例子中，看不出来有任何jsx语法的地方，其中`<h1>Hello,world</h1>`就是使用到了jsx语法。HTML 语言直接写在 JavaScript 语言之中，不加任何引号，这就是 JSX 的语法，它允许 HTML 与 JavaScript 的混写。如果转化成纯JavaScript 的话，就是:

```
    <script type="text/javascript">
      ReactDOM.render(
        React.DOM.h1(null,'hello,world!'),
        document.getElementById('example')
      );
    </script>
```

在上述JSX语法中有两个要注意的地方：

* `<script>` 标签的 type 属性为 text/babel，这是React 独有的 JSX 语法，跟 JavaScript 不兼容。凡是在页面中直接使用 JSX 的地方，都要加上 type="text/babel"。

* 一共用了三个库： react.js 、react-dom.js 和 browser.min.js ，它们必须首先加载。其中，react.js 是 React 的核心库，react-dom.js 是提供与 DOM 相关的功能， browser.min.js的作用是将 JSX 语法转为 JavaScript 语法。


	将 JSX 语法转为 JavaScript 语法，这一步很消耗时间。现在前端项目，都会使用前端工程化，不会直接在html页面中直接写js代码，写好的js代码都会使用工具进行编译压缩等。这样的话，我们的jsx也会通过编译直接转化成js语法，让浏览器直接使用。

ReactDOM.render 是 React 的最基本方法，将模板转为HTML语言，并插入指定的 DOM 节点。

### JSX的特点：

1. 类XML语法容易接受，结构清晰
2. 增强JS语义
3. 抽象程度高，屏蔽DOM操作，跨平台
4. 代码模块化

### JSX基本语法规则：

JSX本身就和XML语法类似，可以定义属性以及子元素。唯一特殊的是可以用大括号来加入JavaScript表达式。遇到 HTML 标签（以 < 开头），就用 HTML 规则解析；遇到代码块（以 { 开头），就用 JavaScript 规则解析。

```
var arr = [
 <h1>Hello world!</h1>,
 <h2>React is awesome</h2>,
];
ReactDOM.render(
 <div>{arr}</div>,
 document.getElementById('example')
);
```

这个就是一个简单的html与js混用的例子。arr变量中存在html元素，div中又使用了arr这个js变量。转化成纯javascript的话：

```
var h1=React.DOM.h1(null,'Hello world!');
var h2=React.DOM.h1(null,'React is awesome');
var div=React.DOM.div(null,h1,h2);
ReactDOM.render(
 div,
 document.getElementById('example')
);
```

### React组件

我们使用jsx来将代码封装成React组件，然后像插入普通 HTML 标签一样，在其他地方插入这个组件。使用React.createClass用于生成一个组件。

```
var MyComponent=React.createClass({
  render: function() {
   return <h1>Hello world!</h1>;
 }
});
ReactDOM.render(
 <MyComponent />,
 document.getElementById('example')
);
```

上面代码中，变量 MyComponent就是一个组件类。模板插入 <MyComponent /> 时，会自动生成 MyComponent 的一个实例（下文的"组件"都指组件类的实例）。所有组件类都必须有自己的 render 方法，用于输出组件。

**React 可以渲染 HTML 标签 (strings) 或 React 组件 (classes)。**

* 在react中通常约定组件类的第一个字母必须大写，html标签都是小写。

	```
	//要渲染 HTML 标签，只需在 JSX 里使用小写字母开头的标签名。
	var myDivElement = <div className="foo" />;
	React.render(myDivElement, document.getElementById('example'));
	//要渲染 React 组件，只需创建一个大写字母开头的本地变量。
	var MyComponent = React.createClass({/*...*/});
	var myElement = <MyComponent  />;
	React.render(myElement, document.getElementById('example'));
	```

* 还有一个注意点：组件类只能包含一个顶层标签，否则会报错。

	```
	//var myDivElement =<h1>你好</h1><h1>hello</h1>;
	//上述写法是会报错的，要写成只有一个顶层标签：
	var myDivElement =<div><h1>你好</h1><h1>hello</h1></div>;
	```

**上述代码一个静态的组件，下面看一个动态组件：**

```	
	var MyComponent=React.createClass({
	  getInitialState: function() {
	       return {clickNum: 0};
	  },
	  handleClick:function(){
	    var num=this.state.clickNum;
	    num++;
	    this.setState({clickNum:num});
	  },
	  render: function() {
	   return (
	      <div>
	        <h1 onClick={this.handleClick}>Hello {this.props.name}!</h1>
	        <h2 style={{color:'red'}}>点击{this.props.name}次数：{this.state.clickNum}</h2>
	      </div>
	    );
	 }
	});
	ReactDOM.render(
	  <div>
	     <MyComponent name="张三" />
	     <hr/>
	     <MyComponent name="李四" />
	  </div>,
	 document.getElementById('example')
	);
	
```
	
上面代码中定义的MyComponent组件包含属性，状态和事件，是一个简单的比较完整的组件。使用props通过父组件进行传递值，使用state定义组件自己的状态，组件支持的大部分的DOM操作事件。

### 关于属性props：

* class 属性需要写成 className ，for 属性需要写成 htmlFor ，这是因为 class 和 for 是 JavaScript 的保留字。

* 直接在标签上使用style属性时，要写成style={{}}是两个大括号，外层大括号是告知jsx这里是js语法，和真实DOM不同的是，属性值不能是字符串而必须为对象，需要注意的是属性名同样需要驼峰命名法。即margin-top要写成marginTop。

* this.props.children 不要children作为把对象的属性名。因为this.props.children获取的该标签下的所有子标签。this.props.children 的值有三种可能：如果当前组件没有子节点，它就是 undefined ;如果有一个子节点，数据类型是 object ；如果有多个子节点，数据类型就是 array 。所以，处理 this.props.children 的时候要小心。官方建议使用React.Children.map来遍历子节点，而不用担心数据类型。

### 关于状态state：

* 组件免不了要与用户互动，React 将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI。

* getInitialState 方法用于定义初始状态，也就是一个对象，这个对象可以通过 this.state 属性读取。当用户点击组件，导致状态变化，this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。

	**由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。**
	
	**注意点：**
	如果往原生 HTML 元素里传入 HTML 规范里不存在的属性，React 不会显示它们。如果需要使用自定义属性，要加 data- 前缀。
	
	```
	<div data-custom-attribute="foo" />
	```

### PropTypes

组件的属性props可以接受任意值，字符串、对象、函数等等都可以。有时，我们需要一种机制，验证别人使用组件时，提供的参数是否符合要求。React中使用PropTypes进行参数的校验。

```
var MyTitle = React.createClass({
   propTypes: {
     title: React.PropTypes.string.isRequired,
   },
   render: function() {
     return <h1> {this.props.title} </h1>;
   }
});
```

上面的Mytitle组件有一个title属性。PropTypes 告诉 React，这个 title 属性是必须的，而且它的值必须是字符串。当我们给title传递一个数字时，控制台就会报错：

```
Warning: Failed propType: Invalid prop `title` of type `number` supplied to `MyTitle`, expected `string`.
```

此外，getDefaultProps 方法可以用来设置组件属性的默认值。

### 获取真实的DOM节点

组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。
有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性。

```
var MyComponent = React.createClass({
   handleClick: function() {
     this.refs.myTextInput.focus();
   },
   render: function() {
     return (
     <div>
       <input type="text" ref="myTextInput" />
       <input type="button" value="Focus the text input" onClick={this.handleClick} />
     </div>
     );
   }
});
```

为了获取真是DOM节点，html元素必须有一个 ref 属性，然后 this.refs.[refName] 就会返回这个真实的 DOM 节点。需要注意的是，由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性，否则会报错。

### 求值表达式

要使用 JavaScript 表达式作为属性值，只需把这个表达式用一对大括号 ( { } ) 包起来，不要用引号 ( " " )。
在编写JSX时，在 { } 中不能使用语句（if语句、for语句等等），但可以使用求值表达式，这本身与JSX没有多大关系，是JS中的特性，它是会返回值的表达式。我们不能直接使用语句，但可以把语句包裹在函数求值表达式中运用。

### 条件判断的写法

你没法在JSX中使用 if-else 语句，因为 JSX 只是函数调用和对象创建的语法糖。在 { } 中使用，是不合法的JS代码，不过可以采用三元操作表达式

```
var HelloMessage = React.createClass({ 
  render: function() { 
    return <div>Hello {this.props.name ？ this.props.name : "World"}</div>; 
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, document.body);
```

可以使用比较运算符“ || ”来书写，如果左边的值为真，则直接返回左边的值，否则返回右边的值，与if的效果相同。

```
var HelloMessage = React.createClass({ 
  render: function() { 
    return <div>Hello {this.props.name || "World"}</div>; 
  }
});
```

### 函数表达式

（ ）有强制运算的作用

```
var HelloMessage = React.createClass({ 
  render: function() { 
    return <div>Hello { 
    （function(obj){ 
        if(obj.props.name) 
          return obj.props.name 
        else 
          return "World" 
      }(this)) 
    }</div>; 
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, document.body);
```

外括号“ ）”放在外面和里面都可以执行。唯一的区别是括号放里面执行完毕拿到的是函数的引用，然后再调用“function(){}(this)()”；括号放在外面的时候拿到的事返回值。

### 组件的生命周期

组件的生命周期分成三个状态：

* Mounting：已插入真实 DOM
* Updating：正在被重新渲染
* Unmounting：已移出真实 DOM
React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数。

* componentWillMount()
* componentDidMount()
* componentWillUpdate(object nextProps, object nextState)
* componentDidUpdate(object prevProps, object prevState)
* componentWillUnmount()
此外，React 还提供两种特殊状态的处理函数。

* componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
* shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用

### 注释

JSX 里添加注释很容易；它们只是 JS 表达式而已。你只需要在一个标签的子节点内(非最外层)小心地用 {} 包围要注释的部分。

```
{/* 一般注释, 用 {} 包围 */}
```
