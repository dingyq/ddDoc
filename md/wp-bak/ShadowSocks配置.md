* Step 1. Install Shadowsocks GUI application

	For Windows 7 or earlier, download shadowsocks-win-2.3.zip
	
	For Windows 8 or later, download shadowsocks-win-dotnet4.0-2.3.zip
	
	Alternatively, you may download the latest version from developer's website: http://sourceforge.net/projects/shadowsocksgui/files/dist/
	
	Once downloaded, extract the .zip file and launch Shadowsocks.exe

* Step 2. Shadowsocks GUI settings

	Enter settings exactly as shown below.
	
	Note that you can simply copy-paste fields marked in yellow:

	1.1.1.1
	
	443
	
	YWI5YTg1Mj
	
	aes-256-cfb
	
	1080

	Then click OK.

* Step 3. Browser proxy settings

	At this point you may right-click the Shadowsocks tray icon and
	Enable System Proxy. Then right-click the icon again
	and enable Mode -> Global. This will update system-wide proxy
	settings – this will work for Google Chrome as well as Microsoft Internet Explorer.
	
	Alternatively, manual browser configuration is possible:

	Proxy type: SOCKS v5
	
	Proxy IP (Socks Host): 127.0.0.1
	
	Port: 1080

	How to configure Proxy in Mozilla Firefox: http://www.tomsguide.com/faq/id-1847788/configure-proxy-settings-mozilla-firefox.html
	
	How to configure Proxy in Google Chrome: https://support.google.com/chrome/answer/96815
	
	Done! You can now use a service to test your IP, for example: ping.pe.