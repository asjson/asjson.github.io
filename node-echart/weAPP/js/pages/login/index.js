$(function(){
    for(var name in Login_Event_Class){
        EventDispatcher.addEventListener(name,eval("Login_Event_Class." + name));
    }

    pageInit();
});

var Login_Event_Class = /** @class */ (function () {
	function Login_Event_Class() {
	}

    Login_Event_Class.local_GoLogin = function(data){
		var params = "";
		if(data.hasOwnProperty("type")&&data.hasOwnProperty("message"))
			params = data.message;
        
        goLogin(params);
	}

	return Login_Event_Class;
}());

//页面初始化完成调用函数
function pageInit(){
    
}

//获取验证码
function getVCode(){
    var data_code = {
        "signName": "XWG用户中心",
        "templateCode": "SMS_172800186",
        "username": $("#exampleInput").val()
    };
    $.ajax({
        method: "post",
        url: "http://192.168.1.121:8888/appauth/login/createSmsValidata",
        data: data_code,
        dataType: "json",
        async: true,
        contentType: "application/x-www-form-urlencoded",
        success: function (data) {
            var resultCode = data.code;
            if(resultCode == "0") { 
                var phoneCode = data.data;
                $("#exampleInput1").val(phoneCode)
            }
        },
        error: function (data) {
            console.log('请求失败！');
        }
    });
}

//前往登录
function goLogin(data){
    
    var eData = {
        "code": data,
        "smsCode": $("#exampleInput1").val(),
        "username": $("#exampleInput").val()
    };
    $.ajax({
        method: "post",
        url: "http://192.168.1.121:8888/appauth/login/thirdMoblieToken",
        data: eData,
        dataType: "json",
        async: true,
        contentType: "application/x-www-form-urlencoded",
        success: function (data) {
            var resultCode = data.code;
            if(resultCode == "0") {  
                EventDispatcher.dispatchEvent({type:"onLogin",message:{code:"0",msg:""}});
                var token = data.data.access_token;
                // var saveToke = JSON.stringify(token);
                window.localStorage.setItem("walletToken",token);

                var messageObj = {key:"wallet_access_token",defaultObject:token};
                EventDispatcher.dispatchEvent({type:"onSetKV",message:messageObj});

                getUserMsg(token);
            } else {
                alert(data.message);
            }
        },
        error: function (data) {
            EventDispatcher.dispatchEvent({type:"onLogin",message:{code:"1",msg:"请求失败！"}});
        }
    });
}

//获取用户基础信息
function getUserMsg(token){
     $.ajax({
        method: "get",
        url: "http://192.168.1.121:8888/appauth/current/user",
        data: "",
        dataType: "json",
        async: true,
        contentType: "application/x-www-form-urlencoded",
        headers:{
          'Authorization': "Bearer " + token,
          'Accept-Language': 'zh'
        },
        success: function (data) {
          var resultCode = data.code;
          if(resultCode == "0") { 
              var objes = data.data;
              var objData = JSON.stringify(objes);
              window.localStorage.setItem("walletUserInfo",objData);

              window.location.href = "home.html";
          }
        },
        error: function (data) {
           console.log('请求失败！');
        }
    });
}

function loginUp() {
    // 预加载
    loading1();
    // EventDispatcher.dispatchEvent({type:"getAuthCode",message:{code:"0",msg:$("#exampleInput").val()}});
    var dataCode = {
        "client_id": "1561527878813",
        "client_secret": "e31ac1bb84934aaa9e46d5daf08301d9",
        "username": $("#exampleInput").val()
      };

      $.ajax({
        method: "post",
        url: "http://192.168.1.121:8888/appauth/login/thirdAuthCode",
        data: dataCode,
        dataType: "json",
        async: true,
        contentType: "application/x-www-form-urlencoded",
        success: function (data) {
          var authCode = data.data;
          goLogin(authCode);
          // 请求成功3s后移除加载。。
          setTimeout(function(){
            removeLoading('test');
          },3000);

        },
        error: function (data) {
           console.log('请求失败！');
        }
    });
}