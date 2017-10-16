**node/express/mongo安装请自行脑补**

简单的介绍下node+express+mongodb这三个东西。

* **node**：是运行在服务器端的程序语言，表面上看过去就是javascript一样的东西，但是呢，确实就是服务器语言，个人觉得在一定层次上比c灵活，java就不提了。反正你只要认为node可以干很多事就行了，绝对不只是web开发。

* **express**：这货呢，就是node的一种框架，node有很多的开源框架，express是一个大神开发的（这尊神已经移驾到go语言的开发去了）。express可以让你更方便的操作node（因为原生的node写起来比较麻烦，而且因为node是事件驱动的，所以有很多异步回调，写多了就看着晕...）

* **mongodb**：这是一种非关系数据库（nosql），太深的东西我也不清楚，反正这货也有很强大的地方，缺点就是不适合数据一致性要求高的比如金融方面的开发。但是优点就快。
总结：也就是说node和mongodb组合起来特别适合一个应用场景——速度快，处理量大的情况。

`express hello-world -e` （-e表示支持ejs模板引擎，默认是jaden。什么事模板引擎，比如jsp...太深的我也不懂。本人比较擅长html原生的东西，像这种模板引擎我也是第一次使用，也蛮方便的哦，不过在我看来，没啥用, 我不需要，但是可能你需要...）

然后我们再下载依赖包

`npm install` （这样就会自动将项目需要的依赖modules安装到项目的modules里去了）

我们cd到hello-world目录下，是用命令

`npm start` 启动项目（也可以是node ./bin/www，旧版本直接node app.js，因为具体要看package.json里的启动配置了）

我们可以在浏览器地址栏里敲入 http://127.0.0.1:3000/ 这就是你的第一个express创建的node app。

我们研究下express创建项目

你需要了解的项目主要目录为：routes和views，你最好再在项目里新建一个目录叫models（作用后面讲）

routes里index.js配置的都是get和post请求的路径映射关系，很简单的哦。

views里index.ejs就相当于一个html文件，里面就是一些html标签和<%%>标签，感觉和jsp差不多哦。

看起来不错的样子，标准的MVC框架（models里放模型，views里面放展示，routes里面放控制）

上面我们已经生成好了app原型，接着我们设计数据库：

mongo//进入数据库

`use hello-world` //创建项目数据库

然后，我们就为这个hello-world数据库创建collection（collection就相当于oracle和mysql里的table）

```
db.createCollection("users") //创建一个集合，也就是表
db.users.insert({userid: "admin", password: "123456"}) //给users里添加一个文档，也就是一条记录账号admin，密码123456
```
ok，现在检查一下：

```
db.users.find() //如果看到你刚刚添加的文档记录，就ok咯
```

好简单的数据库集合以及文档设置好，我们就回到express创建的node项目里，我们需要：

在models下创建一个user.js,作为实体类映射数据库的users集合
在views下做几个页面（可以用ejs也可以用html，我就用ejs吧）
在routes下的index.js配置路由，也就是请求映射处理

1. 在models下创建一个user.js,作为实体类映射数据库的users集合
2. 在views下面建index.ejs, errors.ejs, login.ejs, logout.ejs, homepage.ejs。 （index是自带的，不用建）
3. 在routes下的index.js配置路由，也就是请求映射处理

ok，基本上大功告成，可以试试咯。

下面讲讲如何调试服务器端的代码：

我们最好借助一个叫`node-inspector`的工具包

```
npm i -g node-inspector //安装node-inspector
```
然后在cmd里运行

`node-inspector`

再新打开一个cmd，cd到项目hello-world目录下

```
node --debug ./bin/www （或者 node --debug-brk ./bin/www , 旧版本express创建的node程序请使用 node --debug app.js）
```

在浏览器里打开`http://127.0.0.1:8080/debug?port=5858`

再新建窗口打开`http://127.0.0.1:3000/`

就在浏览器可以调试服务器端代码。