## 代码顺序

好的顺序，代码清晰，方便查找，提高效率。 

### import顺序一般如下，并且分组

```
React
ReactNative

Redux
ReactRedux

第三方库
自定义组件
图片
公共样式
业务组件及其样式
Actions
```

### 方法的顺序如下

```
getDefaultProps  
getInitialState 
componentWillMount 
componentDidMount 
componentWillReceiveProps 
shouldComponentUpdate 
componentWillUpdate 
componentDidUpdate 
componentWillUnmount

其他方法

render

```

## 几种数组遍历

```
普通for循环
for(j = 0; j < arr.length; j++) {

} 
```

```
优化版for循环
for(j = 0,len=arr.length; j < len; j++) {

}
将长度缓存起来，避免重复获取数组长度
性能最优
```

```
弱化版for循环
for(j = 0; arr[j]!=null; j++) {

}
这种方法其实严格上也属于for循环，只不过是没有使用length判断，而使用变量本身判断
实际上，这种方法的性能要远远小于普通for循环
```

```
foreach循环
arr.forEach(function(e){  

});
实际上性能比普通for循环弱
```

```
foreach变种
Array.prototype.forEach.call(arr,function(el){  

});
由于foreach是Array型自带的，对于一些非这种类型的，无法直接使用(如NodeList)，所以才有了这个变种，使用这个变种可以让类似的数组拥有foreach功能。

实际性能要比普通foreach弱
```

```
//forin循环
for(j in arr) {

}
这个循环很多人爱用，但实际上，经分析测试，在众多的循环遍历方式中

它的效率是最低的
```

```
map遍历
arr.map(function(n){  

});
这种方式也是用的比较广泛的，虽然用起来比较优雅，但实际效率还比不上foreach
```

```
// forof遍历(需要ES6支持)
for(let value of arr) {  

});
这种方式是es6里面用到的，性能要好于forin，但仍然比不上普通for循环
```

## 使用对象替代switch case

```
// bed
 renderStatusStamp(status) {
    switch (status) {
      case '-1':
        return <Image source={images.icons.orderStatusCancel} />;
      case '0':
        return <Image source={images.icons.orderStatus0} />;
      case '1':
        return <Image source={images.icons.orderStatusWillPay} />;
      case '10':
        return <Image source={images.icons.orderStatus1} />;
      case '20':
        return <Image source={images.icons.orderStatus2} />;
      case '30':
        return <Image source={images.icons.orderStatus3} />;
      case '40':
        return <Image source={images.icons.orderStatus4} />;
      case '50':
        return <Image source={images.icons.orderStatus5} />;
      case '60':
        return <Image source={images.icons.orderStatus6} />;
      case '70':
        return <Image source={images.icons.orderStatus7} />;
      default:
        return null;
    }
  }

// good
renderStatusStamp(status) {
    const stampContainer = {
      '0': <Image source={images.icons.orderStatus0} />,
      '1': <Image source={images.icons.orderStatusWillPay} />,
      '10': <Image source={images.icons.orderStatus1} />,
      '20': <Image source={images.icons.orderStatus2} />,
      '30': <Image source={images.icons.orderStatus3} />,
      '40': <Image source={images.icons.orderStatus4} />,
      '50': <Image source={images.icons.orderStatus5} />,
      '60': <Image source={images.icons.orderStatus6} />,
      '70': <Image source={images.icons.orderStatus7} />,
      '-1': <Image source={images.icons.orderStatusCancel} />,
    };
    return stampContainer[status];
  }
```

减少代码，结构清晰。

## 关于平台区分

```
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
```

这是创建一个demo 默认的代码。要比三目运算符好一些。

## 命名规范

事件处理函数的命名：采用 “handle” + “EventName” 的方式来命名

事件函数作为属性时的命名： on +EventName 与handle对应

```
<Component onClick={this.handleClick} />
```

## let var const


### 字符串

```
// bad
const a = "foobar";
const b = 'foo' + a + 'bar';

// acceptable
const c = `foobar`;

// good
const a = 'foobar';       // 静态字符串
const b = `foo${a}bar`;   // 动态字符串
```


### 解构赋值

```
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

### 函数的参数如果是对象的成员，优先使用解构赋值。

```
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;
}

// good
function getFullName(obj) {
  const { firstName, lastName } = obj;
}

// best
function getFullName({ firstName, lastName }) {
}

```

### 如果函数返回多个值，优先使用对象的解构赋值，而不是数组的解构赋值。

```
// bad
function processInput(input) {
  return [left, right, top, bottom];
}

// good
function processInput(input) {
  return { left, right, top, bottom };
}

const { left, right } = processInput(input);

```

## 对象

### 对象尽量静态化，一旦定义，就不得随意添加新的属性。如果添加属性不可避免，要使用Object.assign方法

```
// bad
const a = {};
a.x = 3;

// if reshape unavoidable
const a = {};
Object.assign(a, { x: 3 });

// good
const a = { x: null };
a.x = 3;

```

```
var ref = 'some value';

// bad
const atom = {
  ref: ref,

  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  ref,

  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};

```

## 数组

### 使用 Array.from 方法，将类似数组的对象转为数组。

```
const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```

### 使用扩展运算符（…）拷贝数组

```
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

## 函数

### 箭头函数

```
// bad
[1, 2, 3].map(function (x) {
  return x * x;
});

// good
[1, 2, 3].map((x) => {
  return x * x;
});

// best
[1, 2, 3].map(x => x * x);
```

### 使用默认值语法设置函数参数的默认值

```
// bad
function handleThings(opts) {
  opts = opts || {};
}

// good
function handleThings(opts = {}) {
  // ...
}
```

### 这条比较实用，用的很多。

Map 结构

```
let map = new Map(arr);

for (let key of map.keys()) {
  console.log(key);
}

for (let value of map.values()) {
  console.log(value);
}

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
```

## 模块

使用import取代require 

使用export取代module.exports

如果模块只有一个输出值，就使用export default，如果模块有多个输出值，就不使用export default，export default与普通的export不要同时使用。 

如果模块默认输出一个函数，函数名的首字母应该小写。 

如果模块默认输出一个对象，对象名的首字母应该大写

## PureComponent

当`props`或者`state`改变的时候，会执行`shouldComponentUpdate`方法来判断是否需要重新render组建，我们平时在做页面的性能优化的时候，往往也是通过这一步来判断的。`Component`默认的`shouldComponentUpdate`返回的是true，如下：

```
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

而`PureComponent`的`shouldComponentUpdate`是这样的：

```
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```

相当于`PureComponent`帮我们判断如果`props`或者`state`没有改变的时候，就不重复render，这对于纯展示组件，能节省不少比较的工作。
