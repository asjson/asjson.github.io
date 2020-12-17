  function open1(){
    // 出现浮动层
    // $(".ljzf_but").click(function(){
      $(".ftc_wzsf").show();
    // });
    // 关闭浮动
    $(".close").click(function(){
      $(".ftc_wzsf").hide();
      $(".mm_box li").removeClass("mmdd");
      $(".mm_box li").attr("data","");
      i = 0;
    });
    // function handToggle(){
    //   $(".ftc_wzsf").hide();
    //   $(".mm_box li").removeClass("mmdd");
    //   $(".mm_box li").attr("data","");
    //   i = 0;
    // }
    // 数字显示隐藏
    $(".xiaq_tb").click(function(){
      $(".numb_box").slideUp(500);
    });
    $(".mm_box").click(function(){
      $(".numb_box").slideDown(500);
    });
    // ----
    var i = 0;
    $(".nub_ggg li .zf_num").click(function(){
      if(i<6){
        $(".mm_box li").eq(i).addClass("mmdd");
        $(".mm_box li").eq(i).attr("data",$(this).text());
        i++
        if (i==6) {
          setTimeout(function(){
            var data = "";
            $(".mm_box li").each(function(){
              data += $(this).attr("data");
              PayOrder(data);
               var inputkey = data;
            });
            alert("支付成功"+data);
          },100);
        };
      }
      // handToggle();
    });
    $(".nub_ggg li .zf_del").click(function(){
      if(i>0){
        i--
        $(".mm_box li").eq(i).removeClass("mmdd");
        $(".mm_box li").eq(i).attr("data","");
      }
    });

    $(".nub_ggg li .zf_empty").click(function(){
      $(".mm_box li").removeClass("mmdd");
      $(".mm_box li").attr("data","");
      i = 0;
    });
};