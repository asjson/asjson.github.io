$(function(){
    for(var name in Home_Event_Class){
        EventDispatcher.addEventListener(name,eval("Home_Event_Class." + name));
    }

    pageInit();
});

var Home_Event_Class = /** @class */ (function () {
	function Home_Event_Class() {
	}

	return Home_Event_Class;
}());

//页面初始化完成调用函数
function pageInit(){
    var userMsg = window.localStorage.getItem("walletUserInfo");
    if(userMsg==null){
        //这里写未登录提示跳转去登录
        return;
    }
    var data = JSON.parse(userMsg)
    $(".up .oText").text(data.nickName);
    var payPsd = data.payPsd;
    var TCB = dealNumber(payPsd);
    var TCB1 = dealNumber(36925800);
    if(payPsd!== "") {
      $(".wrapper_2 .child1 .spaMoney").text(TCB);
    } else {
      $(".wrapper_2 .child1 .spaMoney").text(TCB1);
    }

    var avatarStr = data.avatar==""?"./images/touxiang.png":data.avatar;
    $(".photo .ImgSrc").attr('src', avatarStr);
    
    var requestObj = GetRequest();
    if(requestObj==null||requestObj==""||!requestObj.hasOwnProperty("orderId"))
        return;
    
    var orderId = requestObj.orderId;
    if(orderId!=null&orderId!=""){
        onAssignPayData(orderId);
    }
    // CurrencyList();
    MyCurrency();
    CollectionList();
    CollectItemList();
    // CurrencyList();
}

function downShow(){
    $('#half').popup();
}

//关闭支付弹框
function closePayPopup(){
    EventDispatcher.dispatchEvent({type:"onPay",message:{code:"1",msg:"用户取消支付"}});
}

//返回URL传参
function GetRequest() {
    var url = location.search ;
    url = decodeURI(url);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0].replace(/\s/g,"")]=unescape(strs[i].split("=")[1].replace(/\s/g,""));
        }
    }
    return theRequest;
}


// 货币换算超过3位数显示逗号,并且取两位小数
function dealNumber(money){
    if(money && money!=null){
        money = String(money);
        var left=money.split('.')[0],right=money.split('.')[1];
        right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
        var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('')+right;
    }else if(money===0){   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return '0.00';
    }else{
        return "";
    }
};

//  +++++++++++++++++++++++++++
    var myscroll = new iScroll("wrapper", {
        onScrollMove: function () { //拉动时
            //上拉加载
            if (this.y < this.maxScrollY) {
                $(".pull-loading").html("释放加载");
                $(".pull-loading").addClass("loading");
            } else {
                $(".pull-loading").html("上拉加载");
                $(".pull-loading").removeClass("loading");
            }
        },
        onScrollEnd: function () { //拉动结束时
            //上拉加载
            if ($(".pull-loading").hasClass('loading')) {
                $(".pull-loading").html("加载中...");
                pullOnLoad();
            }
        }
//        onRefresh: function () {
//            $('.pull-loading').html("上拉加载");
//        }
    });
    //上拉加载函数,ajax
    var num = 0;
    var page = 5; //每次加载4条
    function pullOnLoad() {
        setTimeout(function () {
            /*$.ajax({
                url: "json/data.json",
                type: "get",
                dataType: 'json',
                success: function (data) {
                    var data_length = data.length;//数据的总长度
                    var remainder = data_length % page;//余数
                    if ( data_length >= (num+page)){
                        for (var j = num; j < num + page; j++){
                            var text = data[j].text;
                            $("#scroller ul").append("<li>"+ text +"</li>");
                        }
                        num+=page;
                    }else if (remainder != 0 && data_length-num == remainder){
                        for (var j = num; j < num + remainder; j++){
                            var text = data[j].text;
                            $("#scroller ul").append("<li>"+ text +"</li>");
                        }
                        num+=page;
                    }else{
                        $('.pull-loading').html("没有了哟");
                    }
                    myscroll.refresh();
                },
                error: function () {
                    console.log("出错了");
                }
            });*/

            for (var j = 0; j < 5; j++){
                $(".scroller .content").append('<div class="otems">老夫聊发少年狂，不小心，选错行。误入IT，两眼泪茫茫</div>');
            }
            myscroll.refresh();

        }, 1000);
    }
//  +++++++++++++++++++++++++++

// 货币列表
// function CurrencyList() {
//     var timeParam = Math.floor(new Date().getTime()/1000);
//     var myData = {
//         "version": "1.0",
//         "method":"token.list.query",
//         "timestamp": timeParam,
//         "performer_app_id": "",
//         "performer_user_id": "",
//     };
//     $.ajax({
//     method: "post",
//     url: "http://192.168.1.121:8888/wallet/token/list/query",
//     data: myData,
//     dataType: "json",
//     async: true,
//     contentType: "application/x-www-form-urlencoded",
//     headers:{
//         'Accept-Language': 'zh'
//     },
//     success: function (data) {
//         console.log(data);
//         var codes = data.code;
//         var Wodata = data.data;
//         console.log("货币列表：");
//         console.log(Wodata);

//         var otimestamp = data.timestamp;
//         var otems="";
//         for(var i = 0; i < Wodata.length; i++) {
//           console.log(i);
//           var Ndata = Wodata[i];
//           var total_supply = Ndata.total_supply;
//           var y = Ndata.decimals;
//           var one_sup = Math.pow(10,y);
//           var coin = total_supply/one_sup;
//           var coin1 = dealNumber(coin);
//           otems += '<div class=\"content\"><div class=\"otems\"><div class=\"pic\"><img src=\"'+Ndata.icon_url+'\"></div><div class=\"txt1\">'+Ndata.name+'</div><div class=\"txt2\" onclick=\"pay()\">'+coin1+'</div></div></div>';
//         }
//           $('#home .wrapper').html(otems);
//     },
//     error: function (data) {
//         console.log("请求失败！")
//     }
// });
// }



// 我的货币
function MyCurrency() {
    var Token1  = window.localStorage.getItem("walletToken");
    var walletUserInfo = window.localStorage.getItem("walletUserInfo");
    var userInfo = JSON.parse(walletUserInfo);
    var uidParam = userInfo.userId;
    var appId = "1561527878813";

    var timeParam = Math.floor(new Date().getTime()/1000);
    var weData = {
        "version": "1.0",
        "method":"person.token.list.query",
        "timestamp": timeParam,
        "performer_app_id": appId,
        "performer_user_id": uidParam,
        "symbols": ""
    };
    $.ajax({
    method: "post",
    url: "http://192.168.1.121:8888/wallet/person/token/list/query",
    data: weData,
    dataType: "json",
    async: true,
    contentType: "application/x-www-form-urlencoded",
    headers:{
      'Authorization': "Bearer " + Token1,
      'Accept-Language': 'zh'
    },
    success: function (data) {
      console.log("1111111111");
      console.log(data);
      console.log(data.timestamp);
      console.log("1111111111");
    },
    error: function (data) {
        console.log("请求失败！")
    }
   });
}
// 获取藏品列表
function CollectionList() {
    var walletUserInfo = window.localStorage.getItem("walletUserInfo");
    var userInfo = JSON.parse(walletUserInfo);
    var uidParam = userInfo.userId;
    var appId = "1561527878813";

    var page_num = 1;
    var page_size = 10;

    var timeParam = Math.floor(new Date().getTime()/1000);
    console.log(timeParam);
    var Data1 = {
        "version": "1.0",
        "method":"collectible.list.query",
        "timestamp": timeParam,
        "performer_app_id": appId,
        "performer_user_id": uidParam,
        "page_num": page_num,
        "page_size": page_size
    };
  $.ajax({
    method: "post",
    url: "http://192.168.1.121:8888/wallet/collectible/list/query",
    data: Data1,
    dataType: "json",
    async: true,
    contentType: "application/x-www-form-urlencoded",
    headers:{
      'Accept-Language': 'zh'
    },
    success: function (data) {
      console.log("-----------");
      console.log(data);
      console.log("--------------");
    },
    error: function (data) {
        console.log("请求失败！")
    }
   });  
}
// 获取用户藏品道具列表
function CollectItemList(){
    var Token2  = window.localStorage.getItem("walletToken");
    var walletUserInfo = window.localStorage.getItem("walletUserInfo");
    var userInfo = JSON.parse(walletUserInfo);
    var uidParam = userInfo.userId;
    var appId = "1561527878813";

    var page_num = 1;
    var page_size = 10;

    var timeParam = Math.floor(new Date().getTime()/1000);
    var weData = {
        "version": "1.0",
        "method":"person.collectible.item.list.query",
        "timestamp": timeParam,
        "performer_app_id": appId,
        "performer_user_id": uidParam,
        "page_num": page_num,
        "page_size": page_size,
        "collectible_ids": ""
    };
    $.ajax({
    method: "post",
    url: "http://192.168.1.121:8888/wallet/person/collectible/item/list/query",
    data: weData,
    dataType: "json",
    async: true,
    contentType: "application/x-www-form-urlencoded",
    headers:{
      'Authorization': "Bearer " + Token2,
      'Accept-Language': 'zh'
    },
    success: function (data) {
      console.log("********************");
      console.log(data);
      var insetData = data.data;
      console.log(insetData);
      $("#profile .wrapper").html('');
      var wrap = $('<div class="content"></div>');
      for(var i = 0; i < insetData.length; i++ ){
          var category = insetData[i].category;
          var icon_url = category.icon_url;
          var title =  category.title;

          var properties = insetData[i].properties;
          var rarity = properties.rarity;
          var generation = properties.generation;
          var level = properties.level; 
          var cst = properties.cst;
          console.log(rarity);
        //   if(rarity==="common") {
        //     rarity==="普通"
        //   }
        //   else if(rarity==="rare"){
        //     rarity==="稀有"
        //   }
        //   else if(rarity==="epic"){
        //     rarity==="史诗"
        //   }
        //   else if(rarity==="legendary"){
        //     rarity==="传奇"
        //   }
        //   else if(rarity==="mythical"){
        //     rarity==="神话"
        //   }

          var otems = '<div class="otems">'+
                '<div class="pic">'+
                '<img src="'+icon_url+'">'+
                '</div>'+
                '<div class="txt1">'+
                    '<div class="txt1_1">'+ title +'</div>'+
                    '<div class="txt1_2">'+
                    '<span class="span1">'+ rarity +'</span>'+
                    '<span class="span2">'+ generation + '代' + '</span>'+
                    '<span>'+ level + '星' + '</span>'+
                    '</div>'+  
                '</div>'+
                '<div class="txt2">'+cst+'</div>'+
           '</div>';
           $(wrap).append(otems);
      }
      $("#profile .wrapper").append(wrap);
      console.log("******************");
    },
    error: function (data) {
        console.log("请求失败！")
    }
   });

}

// 支付订单
function PayOrder(inputPsd) {
    var pay1 =  window.localStorage.getItem("pay");
    var pay2 = JSON.parse(pay1);

    console.log("zzs==============================================="+pay2.payid);
    var Token3  = window.localStorage.getItem("walletToken");
    var walletUserInfo = window.localStorage.getItem("walletUserInfo");
    var userInfo = JSON.parse(walletUserInfo);
    var uidParam = userInfo.userId;
    var appId = "1561527878813";
    // 取值
    var order2 = window.localStorage.getItem("obj");
    var homedata = JSON.parse(order2);
    var order_id = homedata.order_no;
    var timeParam = Math.floor(new Date().getTime()/1000);
    var weData = {
        "version": "1.0",
        "method":"person.payment.pay",
        "timestamp": timeParam,
        "performer_app_id": appId,
        "performer_user_id": uidParam,
        "order_no": order_id,
        "pin": ""
    };
    $.ajax({
    method: "post",
    url: "http://192.168.1.121:8888/wallet/person/payment/pay",
    data: weData,
    dataType: "json",
    async: true,
    contentType: "application/x-www-form-urlencoded",
    headers:{
      'Authorization': "Bearer " + Token3,
      'Accept-Language': 'zh'
    },
    success: function (data) {
      console.log("********************");
      console.log(data);
      console.log("******************");
    },
    error: function (data) {
        console.log("请求失败！")
    }
   }); 
}

// 创建临时 RSA 密钥对
function KeyPair(){
    var Token4  = window.localStorage.getItem("walletToken");
    var walletUserInfo = window.localStorage.getItem("walletUserInfo");
    var userInfo = JSON.parse(walletUserInfo);
    var uidParam = userInfo.userId;
    var appId = "1561527878813";

    var timeParam = Math.floor(new Date().getTime()/1000);
    var weData = {
        "version": "1.0",
        "method":"person.key.create",
        "timestamp": timeParam,
        "performer_app_id": appId,
        "performer_user_id": uidParam
    };
    $.ajax({
    method: "post",
    url: "http://192.168.1.121:8888/wallet/person/key/create",
    data: weData,
    dataType: "json",
    async: true,
    contentType: "application/x-www-form-urlencoded",
    headers:{
      'Authorization': "Bearer " + Token4,
      'Accept-Language': 'zh'
    },
    success: function (data) {
      console.log("********************");
      console.log(data);
      // 公钥 ID
      var payid = data.data.id;
      // 密钥对
      var paypem = data.data.pem;

      var pay = JSON.stringify({payid,paypem});
      // 取值
      window.localStorage.setItem("pay",pay);
      
      console.log("******************");
    },
    error: function (data) {
      console.log("请求失败！")
    }
   });
}

// function Onkeydown(){
//   $('.mm_box').
// }

function onAssignPayData(orderId){
    var walletToken  = window.localStorage.getItem("walletToken");
    if(walletToken==null){
        //这里写未登录提示跳转去登录
        return;
    }
    var walletUserInfo = window.localStorage.getItem("walletUserInfo");
    if(walletUserInfo==null){
        //这里写未登录提示跳转去登录
        return;
    }
    var userInfo = JSON.parse(walletUserInfo)
    var uidParam = userInfo.userId;
    
    // 安卓放开此操作
    // var interactData = window.localStorage.getItem("interactData");
    // if(interactData==null){
    //     return;
    // }

    // var interactJsonData = JSON.parse(interactData);
    // var appId = interactJsonData.appid;

    // H5放开此操作
    var appId = "1561527878813";
    
    var timeParam = Math.floor(new Date().getTime()/1000);
    var eData = {
        "order_no": orderId,
        "version": "1.0",
        "timestamp": timeParam,
        "performer_app_id": appId,
        "performer_user_id": uidParam,
        "method":"person.order.info.query"
    };
    // 取值 并页面赋值
    // var sucData;
    // var dingdan;
    // var dingdan2 = window.localStorage.getItem("sucData");
    // var homedata = JSON.parse(dingdan2);
    // var money = homedata.total_amount;
    // var orderNo = homedata.order_no;
    // var payeeId = homedata.payee_id;
    // $("#half .cellWrap .cell1 .p1").text(money);
    // $("#half .cellWrap .cell2 .orderInfo").text(orderNo);
    // $("#half .cellWrap .cell3 .orderUser").text(payeeId);
    // downShow(); 

    $.ajax({
        method: "post",
        url: "http://192.168.1.121:8888/wallet/person/order/info/query",
        data: eData,
        dataType: "json",
        async: true,
        contentType: "application/x-www-form-urlencoded",
        headers:{
          'Authorization': "Bearer " + walletToken,
          'Accept-Language': 'zh'
        },
        success: function (data) {
            console.log(data);
            var resultCode = data.code;
            console.log("时间：")
            console.log(data.timestamp);
            if(resultCode == "0") {  
                var resData = data.data;
				var status = resData.status;
                
                // sucData = data.data;
                // dingdan = JSON.stringify(sucData);
                // window.localStorage.setItem("sucData", dingdan);
               // 取值
                // var dingdan2 = window.localStorage.getItem("sucData");
                // var homedata = JSON.parse(dingdan2);
                // var money = homedata.total_amount;
                // $("#half .cellWrap .cell1 .p1").text(money);
				var emsg = "";
				if(status=="SUCCESS"){
					emsg = "订单已完成支付,请勿重复提交!";
				}else if(status=="CLOSED"){
					emsg = "订单已关闭!";
				}
				
				if(emsg!=""){
					EventDispatcher.dispatchEvent({type:"onPay",message:{code:1,msg:emsg}});
					return;
				}
				
				var obj = new Object();
				var division = 100000000;
				obj.order_no = resData.order_no;		//订单编号
				obj.total_amount = parseFloat((resData.total_amount/division).toFixed(2));//订单金额
				obj.symbol = resData.symbol; // 货币类型
				obj.fee_amount = parseFloat((resData.fee_amount/division).toFixed(2));	//手续费用
				obj.fee_symbol = resData.fee_symbol;	//手续费通证符号
				obj.payer_paid_amount = parseFloat((resData.payer_paid_amount/division).toFixed(2));	//付款人实付金额
				obj.payee_id = resData.payee_id;	//收款用户id
				obj.subject = resData.subject;		//交易标题
				obj.body = resData.body;			//交易描述
				obj.status = resData.status;		//交易状态 WAIT_PAY待支付 PAID已支付 SUCCESS订单成功，收款人已收款 CLOSED订单关闭
                //这里写存储跟页面赋值
                var dingdan = JSON.stringify(obj);
                console.log("dingdan:"+dingdan);
                window.localStorage.setItem("obj", dingdan);
               // 取值
                var dingdan2 = window.localStorage.getItem("obj");
                var homedata = JSON.parse(dingdan2);
                var totalAmount = homedata.total_amount;
                var subject = homedata.subject;
                var descrip = homedata.body;
                var symbol = homedata.symbol;
                console.log("homedata");
                console.log(homedata);
                // var n = getNum(3698789213);
                var n = dealNumber(totalAmount);
                $("#half .cellWrap .cell1 .p1").text(n);
                $("#half .cellWrap .cell1 .p2").text(symbol);
                $("#half .cellWrap .cell2 .orderInfo").text(subject);
                $("#half .cellWrap .cell3 .orderDesc").text(descrip);
                downShow();
            } else {
                alert(data.message);
            }
        },
        error: function (data) {
            EventDispatcher.dispatchEvent({type:"onPay",message:{code:"1",msg:"请求失败！"}});
        }
    });
}

//关闭钱包窗口
function closeWalletWindow(){
    EventDispatcher.dispatchEvent({type:"onCloseWindows",message:{code:"0",msg:""}});
}