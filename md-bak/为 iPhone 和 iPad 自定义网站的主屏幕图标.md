在网站根目录放一张命名为 apple-touch-icon.png 的 57 × 57 像素图片即可达到基本目的。

如果需要更精确的控制：

* **在网站 head 部分添加以下语句，其中 href 属性值是图片的路径。**

	`<link rel="apple-touch-icon" href="/custom_icon.png"/>`

* **为满足不同分辨率设备的显示效果，可以添加三个不同分辨率的图片：**

	57 × 57 像素用于前三代 iPhone 和 iPod touch 
	
	72 × 72 像素用于 iPad ，114 × 114 像素用于采用 Retina display 的 iPhone 4 和 iPod touch 等后续产品。通过 sizes 属性控制：

	```
	<link rel="apple-touch-icon" href="touch-icon-iphone.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="touch-icon-ipad.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="touch-icon-iphone4.png" />
	```