/**********************全局变量************************/
var UserId = localStorage.getItem("PatientId");
 var TerminalIP = window.localStorage.getItem("TerminalIP");
 var TerminalName = window.localStorage.getItem("TerminaName");
 var DeviceType = window.localStorage.getItem("DeviceType");
 var revUserId  = window.localStorage.getItem("UserId");

/**********************Send Invitation************************/
var wait = 60;
function Time() {
	$("#SendInvitation").attr("disabled",true);
	if (wait == 0) {
		$("#SendInvitation").attr("disabled",false);
		$("#SendInvitation").val("生成邀请码").button("refresh");
		wait = 60;

	}
	else {
		$("#SendInvitation").attr("disabled",true);
		$("#SendInvitation").val("重新生成邀请码(" + wait + ")").button("refresh");
		wait--;
		setTimeout(function () { Time() }, 1000);
	}

}

function PanelSendInvitation() {
				//alert(1);
		var InvitatoinPhoneNo = $("#InvitatoinPhoneNo").val();
		var width1 = 0.9*$("#Downloadcode").width();
		var width2 = 0.9*$("#Invitationcode").width();
		var SetFlag1 = 0;
		var SetFlag2 = 0;

		//document.getElementById("download").style.display = "none";
		//document.getElementById("Invitation").style.display = "none";
		
		var myRegEmail = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
		var myRegPhone = /^\d{11}$/;

		var Downloadcode;
		if (localStorage.getItem('DownloadAddress') != null) {
Downloadcode = localStorage.getItem('DownloadAddress')
		}
		else
			Downloadcode = "http://www.baidu.com";

		if (InvitatoinPhoneNo != "") 
		{
			if (myRegPhone.test(InvitatoinPhoneNo)) {
				var Type = "PhoneNo";
			}
			else if (myRegEmail.test(InvitatoinPhoneNo)) {
				var Type = "2";
			}
			else {
				var Type = "3";
			}
			//alert(Type);
			$.ajax({
				type: "POST",
				dataType: "xml",
				timeout: 30000,
				url: 'http://' + serverIP + '/' + serviceName + '/CheckRepeat',
				async: false,
				data: { Input: InvitatoinPhoneNo, Type: Type },
				beforeSend: function () { },
				success: function (result) {
					var Flag = $(result).find("int").text();
					if (Flag == 1) {
						$("#Downloadcode").empty();
						$("#Invitationcode").empty();
						$.ajax({
							type: "POST",
							dataType: "xml",
							timeout: 30000,
							url: 'http://' + serverIP + '/' + serviceName + '/GetNoByNumberingType',
							async: false,
							data: { NumberingType: "14" },
							beforeSend: function () { },
							success: function (result) {
								//alert(1);
								var str = $(result).find("string").text();
								//alert(str);
								if (str != "") {
									//var Invitationcode = utf16to8('您的邀请码是：' + str);
									$.ajax({
										type: "POST",
										dataType: "xml",
										timeout: 30000,
										url: 'http://' + serverIP + '/' + serviceName + '/SetPsRoleMatch',
										async: false,
										data: { PatientId: UserId, RoleClass: "Patient", ActivationCode: str, ActivatedState: "1", Description: "" },
										beforeSend: function () { },
										success: function (result) {
											SetFlag1 = $(result).find("int").text();
											//alert(SetFlag1);
										},
										error: function (msg) {
											alert("Error: SetPsRoleMatch");
										}
									});
									$.ajax({
										type: "POST",
										dataType: "xml",
										timeout: 30000,
										url: 'http://' + serverIP + '/' + serviceName + '/SetPhoneNo',
										async: false,
										data: { UserId: UserId, Type: Type, Name: InvitatoinPhoneNo, piUserId: revUserId, piTerminalName: TerminalName, piTerminalIP: TerminalIP, piDeviceType: DeviceType },
										beforeSend: function () { },
										success: function (result) {
											SetFlag2 = $(result).find("int").text();
											//alert(SetFlag2);
										},
										error: function (msg) {
											alert("Error: SetPhoneNo");
										}
									});
									if (SetFlag1 == 1 && SetFlag2 == 1) {
										//alert("数据库连接失败");	
										$("#Downloadcode").qrcode({
											render: "canvas", //canvas方式
											width: width1, //宽度
											height: width1, //高度
											text: Downloadcode //任意内容
										});
										document.getElementById("download").style.display = "block";
										$("#Invitationcode").qrcode({
											render: "canvas", //canvas方式
											width: width2, //宽度
											height: width2, //高度
											text: str //任意内容
										});
										document.getElementById("Invitation").style.display = "block";
										document.getElementById("Invitation").innerHTML = '您的邀请码是：' + str;
									}
									if (SetFlag2 == 0)
									{
										document.getElementById("AlertUserId").innerHTML = "患者信息还未保存，请返回基本信息保存患者信息!";
										document.getElementById("AlertUserId").style.display = "block";
									}
								}
							},
							error: function (msg) {
								alert("Error: GetNoByNumberingType");
							}
						});
					}
					else 
					{
						$.ajax({
							  type: "POST",
							  timeout: 30000,
							  //contentType: "application/json;charset=utf-8",
							  url: 'http://'+ serverIP +'/'+serviceName+'/GetIDByInput',
							  data: { Type: Type, Name: InvitatoinPhoneNo},
							  dataType: 'xml',
							  async: false,
							  beforeSend: function() {},
							  success: function(result) {	
							  	  var checkid = $(result).find("string").text();
								  if (checkid == UserId)
								  {
									  $("#Downloadcode").empty();
									  $("#Invitationcode").empty();
									  $.ajax({
										  type: "POST",
										  dataType: "xml",
										  timeout: 30000,
										  url: 'http://' + serverIP + '/' + serviceName + '/GetNoByNumberingType',
										  async: false,
										  data: { NumberingType: "14" },
										  beforeSend: function () { },
										  success: function (result) {
											  //alert(1);
											  var str = $(result).find("string").text();
											  //alert(str);
											  if (str != "") {
												  //var Invitationcode = utf16to8('您的邀请码是：' + str);
												  $.ajax({
													  type: "POST",
													  dataType: "xml",
													  timeout: 30000,
													  url: 'http://' + serverIP + '/' + serviceName + '/SetPsRoleMatch',
													  async: false,
													  data: { PatientId: UserId, RoleClass: "Patient", ActivationCode: str, ActivatedState: "1", Description: "" },
													  beforeSend: function () { },
													  success: function (result) {
														  SetFlag1 = $(result).find("int").text();
														  //alert(SetFlag1);
													  },
													  error: function (msg) {
														  alert("Error: SetPsRoleMatch");
													  }
												  });
												  $.ajax({
													  type: "POST",
													  dataType: "xml",
													  timeout: 30000,
													  url: 'http://' + serverIP + '/' + serviceName + '/SetPhoneNo',
													  async: false,
													  data: { UserId: UserId, Type: Type, Name: InvitatoinPhoneNo, piUserId: revUserId, piTerminalName: TerminalName, piTerminalIP: TerminalIP, piDeviceType: DeviceType },
													  beforeSend: function () { },
													  success: function (result) {
														  SetFlag2 = $(result).find("int").text();
														  //alert(SetFlag2);
													  },
													  error: function (msg) {
														  alert("Error: SetPhoneNo");
													  }
												  });
												  if (SetFlag1 == 1 && SetFlag2 == 1) {
													  //alert("数据库连接失败");	
													  $("#Downloadcode").qrcode({
														  render: "canvas", //canvas方式
														  width: width1, //宽度
														  height: width1, //高度
														  text: Downloadcode //任意内容
													  });
													  document.getElementById("download").style.display = "block";
													  $("#Invitationcode").qrcode({
														  render: "canvas", //canvas方式
														  width: width2, //宽度
														  height: width2, //高度
														  text: str //任意内容
													  });
													  document.getElementById("Invitation").style.display = "block";
													  document.getElementById("Invitation").innerHTML = '您的邀请码是：' + str;
												  }
												  if (SetFlag2 == 0)
												  {
													  document.getElementById("AlertUserId").innerHTML = "患者信息还未保存，请返回基本信息保存患者信息!";
													  document.getElementById("AlertUserId").style.display = "block";
												  }
											  }
										  },
										  error: function (msg) {
											  alert("Error: GetNoByNumberingType");
										  }
									  });
								  }
								  else
								  {
									  document.getElementById("AlertUserId").innerHTML = "此手机号已被使用，请输入新的手机号!";
									  document.getElementById("AlertUserId").style.display = "block";
									  wait = 0;
								  }
							  },
							  error: function(msg) {
								  alert("Error: GetIDByInput");
							  }
						});
						
					}
				},
				error: function (msg) {
					alert("Error: CheckRepeat");
				}
			});
		}
		else 
		{
			document.getElementById("AlertUserId").innerHTML = "请输入手机号!";
			document.getElementById("AlertUserId").style.display = "block";
		}


}

function utf16to8(str) { //转码 
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}



function  showInvitationInfoPage() {
	var width1 = 0.45*0.6*$(this).width();
	var width2 = 0.45*0.6*$(this).width();

	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetPhoneNoByUserId',
		async: false,
		data: {UserId: UserId},
		beforeSend: function() {},
		success: function(result) {
			var str = $(result).find("string").text();
			if (str != "")
			{
				$("#InvitatoinPhoneNo").attr("value", str);
				$("#InvitatoinPhoneNo").attr("placeholder", "");
				$("#Downloadcode").empty();
				$("#Invitationcode").empty();
				$.ajax({
					type: "POST",
					dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/GetActivateCode',
					async: false,
					data: {UserId: UserId, RoleClass: "Patient"},
					beforeSend: function() {},
					success: function(result) {
						var str = $(result).find("string").text();
						if (str != "")
						{
							
							//var Invitationcode = utf16to8('您的邀请码是：' + str);
							var Downloadcode;
							if (localStorage.getItem('DownloadAddress') != null) 
							{
								Downloadcode = localStorage.getItem('DownloadAddress')
							}
							else
							{
								Downloadcode = "http://www.baidu.com";
							}
							$("#Downloadcode").qrcode({
								render: "canvas", //canvas方式
								width: width1, //宽度
								height:width1, //高度
								text: Downloadcode //任意内容
							});	
							document.getElementById("download").style.display = "block";
							$("#Invitationcode").qrcode({
								render: "canvas", //canvas方式
								width: width2, //宽度
								height:width2, //高度
								text: str //任意内容
							});	
							document.getElementById("Invitation").style.display = "block";
							document.getElementById("Invitation").innerHTML = '您的邀请码是：' + str;	
						}
						//alert(SetFlag2);
					},
					error: function(msg) {
						alert("Error:GetActivateCode");
					}
				});
			}
		},
		error: function(msg) {
			alert("Error:GetPhoneNoByUserId");
		}
	});
	
	
	
		
		
	
	/**********************手机号码正则验证***********************/	
	
    $("#InvitatoinPhoneNo").blur(function () {
		var PHONENUMBER = $("#InvitatoinPhoneNo").val();
		var isPhone = /^1[3|4|5|7|8][0-9]\d{4,8}$/;

		//alert(isPhone.test(PHONENUMBER));
		//alert(PHONENUMBER.length)
		if (PHONENUMBER.length == 11)
		{
			if (isPhone.test(PHONENUMBER))
			{
				document.getElementById("AlertUserId").style.display = "none";
				//alert(PHONENUMBER);
			}	
			else
			{
				//alert(PHONENUMBER.length);
				document.getElementById("AlertUserId").innerHTML = "请输入正确的手机号码";
				document.getElementById("AlertUserId").style.display = "block";
				//alert("不是正确的手机号码");
			}
		}
		else
		{
			//alert(PHONENUMBER.length);
			document.getElementById("AlertUserId").innerHTML = "请输入11位手机号码";
			document.getElementById("AlertUserId").style.display = "block";
			//alert("请输入11位手机号码");	
		}
	});

}

// JavaScript Document