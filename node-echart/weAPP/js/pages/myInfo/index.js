$(function(){
    for(var name in Myinfo_Event_Class){
        EventDispatcher.addEventListener(name,eval("Myinfo_Event_Class." + name));
    }

    pageInit();
});

var Myinfo_Event_Class = /** @class */ (function () {
	function Myinfo_Event_Class() {
	}

	return Myinfo_Event_Class;
}());

//页面初始化完成调用函数
function pageInit(){

}

function myInfopage() {
  var walletUserInfo1 = window.localStorage.getItem("walletUserInfo");
  var userInfo1 = JSON.parse(walletUserInfo1)
  console.log(userInfo1);
  var nickName = userInfo1.nickName;
  var username = userInfo1.username
  $(".up .oText").text(nickName);
  var avatarStr = userInfo1.avatar==""?"./images/touxiang.png":userInfo1.avatar;
  $(".photo .ImgSrc").attr('src', avatarStr);
  $(".itemAll .use4 .userinfo").text(nickName);
  $(".itemAll .wrap4 .phone").text(username);
}
myInfopage();