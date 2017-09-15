
纹理填充只要几个像素的小图

```
UIView *testView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 200, 50)];
testView.backgroundColor = [UIColor colorWithPatternImage: [UIImage imageNamed:@"纹理图片.png"]];
```