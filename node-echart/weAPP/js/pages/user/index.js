$(function(){
    for(var name in User_Event_Class){
        EventDispatcher.addEventListener(name,eval("User_Event_Class." + name));
    }

    pageInit();
});

var User_Event_Class = /** @class */ (function () {
	function User_Event_Class() {
	}

	return User_Event_Class;
}());

//页面初始化完成调用函数
function pageInit(){

}

function userpage() {
  var walletUserInfo1 = window.localStorage.getItem("walletUserInfo");
  var userInfo1 = JSON.parse(walletUserInfo1)
  console.log(userInfo1);
  var nickName = userInfo1.nickName;
  $(".up .oText").text(nickName);
  var avatarStr = userInfo1.avatar==""?"./images/touxiang.png":userInfo1.avatar;
  $(".photo .ImgSrc").attr('src', avatarStr);
}
userpage();