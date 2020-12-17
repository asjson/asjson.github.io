// import dsbridge from './dsbridge.js';
// document.write("<script language=javascript src='js/dsbridge.js'></script>");
// +---------------安卓调用H5---------------+
// var dsBridge = require('./dsbridge.js');
var bridge = {
    default:this,// for typescript
    call: function (method, args, cb) {
      var ret = '';
      if (typeof args == 'function') {
        cb = args;
        args = {};
      }
      var arg={data:args===undefined?null:args}
      if (typeof cb == 'function') {
        var cbName = 'dscb' + window.dscb++;
        window[cbName] = cb;
        arg['_dscbstub'] = cbName;
      }
      arg = JSON.stringify(arg)
        //if in webview that dsBridge provided, call!
        if(window._dsbridge){
         ret=  _dsbridge.call(method, arg)
       }else if(window._dswk||navigator.userAgent.indexOf("_dsbridge")!=-1){
         ret = prompt("_dsbridge=" + method, arg);
       }
       return  JSON.parse(ret||'{}').data
     },
     register: function (name, fun, asyn) {
      var q = asyn ? window._dsaf : window._dsf
      if (!window._dsInit) {
        window._dsInit = true;
            //notify native that js apis register successfully on next event loop
            setTimeout(function () {
              bridge.call("_dsb.dsinit");
            }, 0)
          }
          if (typeof fun == "object") {
            q._obs[name] = fun;
          } else {
            q[name] = fun
          }
        },
        registerAsyn: function (name, fun) {
          this.register(name, fun, true);
        },
        hasNativeMethod: function (name, type) {
          return this.call("_dsb.hasNativeMethod", {name: name, type:type||"all"});
        },
        disableJavascriptDialogBlock: function (disable) {
          this.call("_dsb.disableJavascriptDialogBlock", {
            disable: disable !== false
          })
        }
      };
      !function () {
        if (window._dsf) return;
        var _close=window.close;
        var ob = {
        //保存JS同步方法
        _dsf: {
          _obs: {}
        },
        //保存JS异步方法
        _dsaf: {
          _obs: {}
        },
        dscb: 0,
        dsBridge: bridge,
        close: function () {
          if(bridge.hasNativeMethod('_dsb.closePage')){
           bridge.call("_dsb.closePage")
         }else{
           _close.call(window)
         }
       },
       _handleMessageFromNative: function (info) {
        var arg = JSON.parse(info.data);
        var ret = {
          id: info.callbackId,
          complete: true
        }
        var f = this._dsf[info.method];
        var af = this._dsaf[info.method]
        var callSyn = function (f, ob) {
          ret.data = f.apply(ob, arg)
          bridge.call("_dsb.returnValue", ret)
        }
        var callAsyn = function (f, ob) {
          arg.push(function (data, complete) {
            ret.data = data;
            ret.complete = complete!==false;
            bridge.call("_dsb.returnValue", ret)
          })
          f.apply(ob, arg)
        }
        if (f) {
          callSyn(f, this._dsf);
        } else if (af) {
          callAsyn(af, this._dsaf);
        } else {
                //with namespace
                var name = info.method.split('.');
                if (name.length<2) return;
                var method=name.pop();
                var namespace=name.join('.')
                var obs = this._dsf._obs;
                var ob = obs[namespace] || {};
                var m = ob[method];
                if (m && typeof m == "function") {
                  callSyn(m, ob);
                  return;
                }
                obs = this._dsaf._obs;
                ob = obs[namespace] || {};
                m = ob[method];
                if (m && typeof m == "function") {
                  callAsyn(m, ob);
                  return;
                }
              }
            }
          }
          for (var attr in ob) {
            window[attr] = ob[attr]
          }
          bridge.register("_hasJavascriptMethod", function (method, tag) {
           var name = method.split('.')
           if(name.length<2) {
             return !!(_dsf[name]||_dsaf[name])
           }else{
           // with namespace
           var method=name.pop()
           var namespace=name.join('.')
           var ob=_dsf._obs[namespace]||_dsaf._obs[namespace]
           return ob&&!!ob[method]
         }
       })
        }();
dsBridge.register("init", eval("init"));

// 初始化
function init(data,devId) {

  dsBridge.call("onInit", {code:"0",msg:"  devId:"+devId+"  appid:"+data.appid});
}

// 登录
dsBridge.register("login", eval("login"));

function login(){
  JudgeLogin(true);
}

// 判断是否登录
function JudgeLogin(code1){
  var userToc = window.localStorage.getItem("token");
  var IsToken = JSON.parse(userToc);
  console.log(IsToken)
  if(IsToken.length > 0) {
    window.location.href = "home.html";
    // if(code1){
    //   dsBridge.call("onLogin", {code:"0",msg:""});
    // }
  } else {
    alert("请输入完整信息");
    // window.location.href = "index.html";
  }
}


// 前往登录:
// 去登录，发送请求，获取tock存取
dsBridge.register("goLogin", eval("goLogin"));

function goLogin(authCode) {
  // dsBridge.call("onLogin", {code:"0",msg:authCode});
  // console.log(authCode);
  // window.location.href= "index.html"
  var aa = window.localStorage.getItem("iData");
  var obj = JSON.parse(aa)
  console.log('++++++++')
  console.log(obj)
  var eData = {
    "code": authCode,
    "smsCode": obj.smsCode,
    "username": obj.username
  };
  console.log('-------------')
   $.ajax({
      method: "post",
      url: "http://192.168.1.121:8888/appauth/login/thirdMoblieToken",
      data: eData,
      dataType: "json",
      async: true,
      contentType: "application/x-www-form-urlencoded",
      success: function (data) {
        console.log('成功')
        console.log(data);
        var code = data.code;
        if(code === 0) {
          dsBridge.call("onLogin", {code:"0",msg:""});
        } else {
          dsBridge.call("onLogin", {code:"1",msg:"msg"});
        }
        var token = data.data.access_token;
        var saveToke = JSON.stringify(token);
        window.localStorage.setItem("token",saveToke);
        
        // console.log(toke);
        // console.log(saveToke);
        // bridge.call("onLogin", {code:"0",msg:data});
        getUserMsg(token);
        JudgeLogin();
      },
      error: function (data) {
        console.log('请求失败！');
        bridge.call("onLogin", {code:"1",msg:"请求失败！"});
      }
    });
}

    // 获取用户基础信息
   function getUserMsg(token) {
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
          console.log("*********");
          console.log(data);
          console.log(data.data);
          var objes = data.data;
          var objData = JSON.stringify(objes);
          window.localStorage.setItem("objes",objData);

          // window.location.href = "home.html";
          // console.log("*********");
          bridge.call("onPay", {code:"0",msg:"123"});
        },
        error: function (data) {
           console.log('请求失败！');
        }
      });

   }
// dsBridge.register("getAuthCode", eval("getAuthCode"));

// 告诉安卓我需要授权码
// var userName;
function getAuthCode(username) {
  dsBridge.call("getAuthCode", {code:"0",msg:username});
}

// 点击退出按钮
function exitBtn() {
  var user1 = window.localStorage.getItem("token");
  var Token1 = JSON.parse(user1);
  if(Token1.length > 0) {
    window.localStorage.removeItem("token");
    dsBridge.call("onLogout", {code:"0",msg:"退出登录"});
  }

}

// 退出登录:
dsBridge.register("logout", eval("logout"));
function logout(){
  // dsBridge.call("onLogout", {code:"0",msg:"退出登录"});
  exitBtn()
}


// 支付:

dsBridge.register("pay", eval("pay"));

function pay(orderId){
  JudgeLogin(true);
  downShow();
  // $('#half').popup();
}

// var oneBtn = pay(true);
// $(oneBtn).click(function(event) {
//   $('#half').popup();
// });
// 手动触发覆盖式的底部弹出层
function downShow() {
 $('#half').popup();
}

// 打开窗口:
dsBridge.register("openWindow", eval("openWindow"));
function openWindow(){
  JudgeLogin(true);
}
// 关闭窗口:
function goback() {
    dsBridge.call("onCloseWindows",{code:"0",msg:""});
    console.log('666666')
}

// +---------------H5调用安卓-----------------+
// onInit: 初始化回调
function onInit() {
  // bridge.call("onInit", {code:"0",msg:"5555"});
}
// onLogin: 登录回调
// dsBridge.register("onLogin", eval("onLogin"));
function onLogin() {
  JudgeLogin(true);
}

// onLogout: 退出登录回调
// onPay: 支付回调

// bridge.call("onInit", {code:"0",msg:""});
// dsBridge.call("onLogin", {code:"0",msg:""});
// dsBridge.call("onLogout", {code:"0",msg:""});
// dsBridge.call("onPay", {code:"0",msg:""});

// 存值:
// dsBridge.call("onSetKV",{key:"xx",defaultObject:xx});

// 取值:
// dsBridge.call("onGetKV",{key:"xx",defaultObject:""});
// 返回值即为取的值
// (var result = dsBridge.call(“onGetKV”,{key:”test”,defaultObject:””});)

