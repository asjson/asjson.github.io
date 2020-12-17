var NativeCallJs = /** @class */ (function () {
	function NativeCallJs() {
	}
	
	NativeCallJs.init = function(data,devId){
		window.localStorage.setItem("curDevice",devId);
		window.localStorage.setItem("interactData",JSON.stringify(data));
		JsCallNative.onInit({code:"0",msg:""});
	}
	
	NativeCallJs.login = function(){
		var data = JsCallNative.onGetKV({key:"wallet_access_token",defaultObject:""});
		if(data!=null&&data!=""){
			EventDispatcher.dispatchEvent({type:"local_OnGoHomePage",message:""});
			JsCallNative.onLogin({code:"0",msg:""});
		}else{
			EventDispatcher.dispatchEvent({type:"local_OnGoLoginPage",message:""});
		}
	}
	
	NativeCallJs.goLogin = function(authCode){
		EventDispatcher.dispatchEvent({type:"local_GoLogin",message:authCode});
	}
	
	NativeCallJs.logout = function(){
		EventDispatcher.dispatchEvent({type:"local_OnLogout",message:""});
		JsCallNative.onLogout({code:"0",msg:""});
	}
	
	NativeCallJs.pay = function(orderId){
		var data = JsCallNative.onGetKV({key:"wallet_access_token",defaultObject:""});
		if(data!=null&&data!=""){
			EventDispatcher.dispatchEvent({type:"local_OnGoHomePage",message:"orderId="+orderId});
		}else{
			EventDispatcher.dispatchEvent({type:"local_OnGoLoginPage",message:""});
		}
	}
	
	NativeCallJs.openWindow = function(){
		var data = JsCallNative.onGetKV({key:"wallet_access_token",defaultObject:""});
		if(data!=null&&data!=""){
			EventDispatcher.dispatchEvent({type:"local_OnGoHomePage",message:""});
		}else{
			EventDispatcher.dispatchEvent({type:"local_OnGoLoginPage",message:""});
		}
	}
	
	return NativeCallJs;
}());

var InteractEvent = (function () {
    function InteractEvent() {
    }

	InteractEvent.onLogin = function(data){
		var result = {code:"0",msg:""};
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			result = data.message;

		JsCallNative.onLogin(result);
	}
	
	InteractEvent.getAuthCode = function(data){
		var result = {code:"0",msg:""};
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			result = data.message;

		JsCallNative.getAuthCode(result);
	}

	InteractEvent.onSetKV = function(data){
		var reqData = {};
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			reqData = data.message;
			
		JsCallNative.onSetKV(reqData);
	}

	InteractEvent.onCloseWindows = function(data){
		var reqData = {};
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			reqData = data.message;
			
		JsCallNative.onCloseWindows(reqData);
	}
	

	return InteractEvent;
}());

!function () {
	for(var name in NativeCallJs){
		bridge.register(name, eval("NativeCallJs." + name));
	}
	 
	for(var name in InteractEvent){
		EventDispatcher.addEventListener(name,eval("InteractEvent." + name));
	}

	
}();

var JsCallNative = (function () {
    function JsCallNative() {
    }
	
	JsCallNative.onInit = function(data){
		bridge.call("onInit", data);
	}
	
	JsCallNative.onLogin = function(data){
		bridge.call("onLogin", data);
	}
	
	JsCallNative.onLogout = function(data){
		bridge.call("onLogout", data);
	}
	
	JsCallNative.onPay = function(data){
		bridge.call("onPay", data);
	}
	
	JsCallNative.onSetKV = function(data){
		bridge.call("onSetKV", data);
	}
	
	JsCallNative.onGetKV = function(data){
		var result = bridge.call("onGetKV", data);
		return result;
	}
	
	JsCallNative.onCloseWindows = function(data){
		bridge.call("onCloseWindows", data);
	}
	
	JsCallNative.onGetLoginCode = function(data){
		bridge.call("onGetLoginCode", data);
	}
	
	JsCallNative.getAuthCode = function(data){
		bridge.call("getAuthCode", data);
	}
	
	return JsCallNative;
}());



