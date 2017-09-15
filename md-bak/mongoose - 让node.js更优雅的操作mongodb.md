## mongoose介绍
Mongoose是MongoDB的一个对象模型工具，既类似ORM，让node.js操作mongodb更加方便。

#####mongoose安装

`npm install mongoose`

#####mongoose学习笔记

**连接数据库**

```
var mongoose = require('mongoose');
mongoose.connect("mongodb://ykq:123456@localhost:27017/test");
```
**定义Schema**

这里Schema理解为数据库模型骨架，首先定义Schema，后面再由Schema生成模型。

```
var UserSchema = new Schema({
	username : { type: String, default: '' ,trim : true},
	password : { type: String, default: '' ,trim : true},
	email: { type: String, default: '' }
},{collection: 'user'});

```

Schema结构体中采用key-value形式，key代表数据库字段，value代表类型及其他设置。

允许的Schema类型有：

```
String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
```

**创建模型Model**

```
var User = mongoose.model('User', UserSchema);
```

**创建完模型即可对数据库进行增删改查了：**

* 添加一条数据

```
var u= new User({username:"test",password:"123456",email:"123@qq.com"});
u.save(function(err){});
```
* 删除一条数据

```
User.remove({ username: 'test' }, function (err) {
});
```
* 修改一条数据

```
User.update({ username: 'test' }, { email: '456@qq.com' }, { multi: true }, function (err, numberAffected, raw) {
});
```
* 查询一条数据mongoose查询支持链式操作：

```
User
.find({ username: 'test' })
.limit(10)
.select('username email')
.exec(callback);
```

##总结：

mongoose确实是一个很棒的node.js模块，使用它能让你的代码量减少，代码结构更加整洁、整齐。

建议实际项目中为每一张表创建一个模型文件，将定义模型、数据验证、数据操作都封装在这个模型里，然后通过控制层来调用这个模型来完成数据的操作。

除了上面的学习笔记，mongoose还有包括数据验证、中间件、插件等功能，这里就先不多说了。

官方文档：http://mongoosejs.com