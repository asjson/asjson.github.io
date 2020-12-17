$(function(){
    for(var name in Index_Event_Class){
		EventDispatcher.addEventListener(name,eval("Index_Event_Class." + name));
	}

	pageInit();
});

var Index_Event_Class = /** @class */ (function () {
	function Index_Event_Class() {
	}
	
	Index_Event_Class.local_OnGoLoginPage = function(data){
		var params = "";
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			params = data.message;

		var urlStr = "login.html";
		if(params!=""){
			urlStr+=("?"+params);
		}
		window.location.href = urlStr;
	}

	Index_Event_Class.local_OnGoHomePage = function(data){
		var params = "";
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			params = data.message;

		var urlStr = "home.html";
		if(params!=""){
			urlStr+=("?"+params);
		}
		window.location.href = urlStr;
	}
	

	Index_Event_Class.local_OnLogout= function(data){
		var params = "";
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			params = data.message;
		
		var messageObj = {key:"wallet_access_token",defaultObject:""};
		EventDispatcher.dispatchEvent({type:"onSetKV",message:messageObj});

		window.localStorage.removeItem("walletToken");
		window.localStorage.removeItem("walletUserInfo");

		window.location.href = "login.html";
	}

	return Index_Event_Class;
}());

//页面初始化完成调用函数
function pageInit(){

}