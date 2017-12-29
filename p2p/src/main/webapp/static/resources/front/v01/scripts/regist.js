var isPhoneRegist,isUserRegist;
$(function(){
		utils.initInput();
		if(utils.getUrlParam('useCode')){
			$('.from-ext').attr('class','from fadeOutUpBig');
			$('#useCode').val(utils.getUrlParam('useCode')).attr('disabled',true);
		};
		var phone;
		$('.code').one('click',function(){
			$('.from-ext').attr('class','from fadeOutUpBig');
		});
		//极验
		var handlerPopup = function (captchaObj) {
		    $(".btn").bind('click',function () {
		    	if($(this).hasClass('disabled'))return;
		    	regist(captchaObj);
		    });
		    // 将验证码加到id为captcha的元素里
		    captchaObj.appendTo("#popup-captcha");
		    // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
		};
		// 验证开始需要向网站主后台获取id，challenge，success（是否启用failback）
		var url = "front/startCaptchaAction.do?t=" + (new Date()).getTime();
		$.ajax({
		    url: url, // 加随机数防止缓存
		    type: "get",
		    dataType: "json",
		    success: function (data) {
		        // 使用initGeetest接口
		        // 参数1：配置参数
		        // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
		        initGeetest({
		            gt: data.gt,
		            challenge: data.challenge,
		            product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
		            offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
		            // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
		        }, handlerPopup);
		    }
		});
		
		//获取验证码
		$('#getMsgCode').click(function(){
			phone = $('#phone').val();
			if(phone==''){
				showError('请输入手机号',$('#phone'));
				return;
			};
			addAssignmentDebt(phone);
		});
		
	});

function getCode(){
	var timenow = new Date(); 
	$("#imgCode").attr("src","imageCode.do?pageId=reg&d="+timenow);
}

function addAssignmentDebt(phone){
	utils.Dialog(true);
	$('.claimm-from').show();
	$('.claimm-from .close').click(function(){
		utils.Dialog();
		$('.claimm-from').hide();
	});
	$('#claimm-price').val('');
	$('#claimm-submit').unbind('click').bind('click',function(){
		var code = $('#claimm-price').val();
		if (code == '') {
			utils.alert('请输入图中验证码');
			return;
		}
		var param = {code:code,type:"reg_checkCode"};
		utils.ajax({
			url:'checkMobilePhoneCode.do',
			data:JSON.stringify(param),
			dataType:'json',
			success:function(data){
				utils.Dialog();
				$('.claimm-from').hide();
				if(data.error=='0'){
					utils.getSmsCode($('#getMsgCode'),phone,'regist');
				}else{
					utils.alert(data.msg);
				}
			}
		})
	})
}

function regist(captchaObj){
	var phone = $('#phone').val();
	var username = phone;
	var pwd = $('#pwd').val();
	var msgCode = $('#msgcode').val();
	var useCode = $('#useCode').val();
//	if(username==''){
//		showError('请输入用户名',$('#username'));
//		return;
//	};
	if(phone==''){
		showError('请输入手机号',$('#phone'));
		return;
	};
	if(utils.isPhone(phone)){
		showError('请输入正确手机号',$('#phone'));
		return;
	};
	if(pwd==''){
		showError('请输入登录密码',$('#pwd'));
		return;
	};
	if(msgCode==''){
		showError('请输入短信验证码',$('#msgcode'));
		return;
	};
	if(!$('#getMsgCode').data('randomCode')){
		utils.alert('请获取短信验证码！');
		return;
	};
	if(!$('#agree').is(':checked')){
		utils.alert('请勾选服务协议');
		return;
	}
	$('.btn').text('注册中...').addClass('disabled');
	captchaObj.show();
	 captchaObj.onSuccess(function(){
		 var param={
				 name:username,
				 pwd:pwd,
				 cellPhone:phone,
				 code:msgCode,
//				 randomCode:$('#getMsgCode').data('randomCode'),
//				 recivePhone:$('#getMsgCode').data('recivePhone'),
				 refferee:useCode,
				 pageId:'regist'
		 };
			utils.ajax({
		        url:'front/register.do',
		        data:JSON.stringify(param),
		        dataType:'json',
		        success: function(data){
		        	if(data.error =='0'){
		        		utils.alert('注册成功！',function(){
		        			window.location.href=utils.getBasePath()+'login.html';
		        		})
		        	}else{
		        		utils.alert(data.msg);
		        	}
		        	$('.btn').text('注册').removeClass('disabled');
		        }
		    })
	 });
	
}
//验证手机号是否注册
function chosePhone(obj){
	isPhoneRegist = false;
	var phone = $(obj).val();
	if(phone == ''){
		showError("请输入手机号码",$(obj));return;
	};
	var param={cellPhone:phone};
	utils.ajax({
        url:'isExistPhone.do',
        data:JSON.stringify(param),
        dataType:'json',
        success: function(data){
        	if(data.error =='0'){
        		utils.toast('手机号已经注册!');
        		isPhoneRegist = true;
        	}else if(data.error =='3'){
        		isPhoneRegist = false;
        	}else{
        		utils.alert(data.msg);
        	}
        }
    });
};
//验证用户名是否存在
function choseUser(obj){
	isUserRegist = false;
	var name = $(obj).val();
	if(name == ''){
		showError("请输入用户名",$(obj));return;
	};
	var param={username:name};
	utils.ajax({
        url:'front/isExistUserName.do',
        data:JSON.stringify(param),
        dataType:'json',
        success: function(data){
        	if(data.error =='0'){
        		showError('用户名已经注册!',$(obj));
        		isUserRegist = true;
        	}else if(data.error =='3'){
        		isUserRegist = false;
        	}else{
        		utils.alert(data.msg);
        	}
        }
    });
}
//错误提示
function showError(msg,obj){
	$('.error-msg').text(msg).addClass('show');
	obj.parent('.from').addClass('error');
	obj.focus(function(){
		obj.parent('.from').removeClass('error');
		$('.error-msg').removeClass('show');
	});
}
//查看平台服务协议
function AgreeMent(val){
	var id = '31';
	if(val == 1){
		id='12';
		$('.AgreeMent .title').text('风险提示书');
	}else{
		$('.AgreeMent .title').text('普金资本服务协议');
	}
	utils.Dialog(true);
	$('.AgreeMent').fadeIn();
	$('.AgreeMent .close').click(function(){
		$('.AgreeMent').hide();
		utils.Dialog();
	});
	$('.AgreeMent .popup-area').empty();
	var param={TypeId:id}; 
	utils.ajax({
        url:'querytips.do',
        data:JSON.stringify(param),
        dataType:'json',
        success: function(data){
        	if(data.error == '0'){
        		$('.AgreeMent .popup-area').html(data.content);
        		
        	}
        }
    })
}