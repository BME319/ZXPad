/**********************全局变量************************/
//var UserId = "PID201505210002";
//var serverIP = '10.12.43.94:8089';
localStorage.setItem('DownloadAddress',"http://10.13.22.66:8011/cdmisAPP-debug.apk") ;
var UserId = localStorage.getItem("PatientId");
var serviceName = 'Services.asmx';
var ImageAddressIP = "http://10.13.22.66:8088";  //webserviceIP
var ImageAddressFile = "/PersonalPhoto";
var ImageAddress = ImageAddressIP + ImageAddressFile + "/" + UserId + ".jpg";
var DoctorId = localStorage.getItem('DoctorId');
/**********************初始页面************************/
$(document).on("pageshow", "#InvitationInfoPage", function () {	

	UserId = localStorage.getItem("PatientId");
	var width1 = 0.25*($("#InvitationInfoPage").width());
	var width2 = 0.25*($("#InvitationInfoPage").width());
	$("#Downloadcode").empty();
	$("#Invitationcode").empty();
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
			}
			else
			{
				$(document).on("pageshow", "#InvitationInfoPage", function() {
					$('#InvitatoinPhoneNo').val($('#PhoneNumber').val());
				});			
			}
		},
		error: function(msg) {
			alert("Error:GetPhoneNoByUserId");
		}
	});
	
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
	
	
});

function SetMstUser(UserId, UserName)
{
	$.ajax({
		type: "POST",
		dataType: "xml",

		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetMstUserUM',
		async: false,
		data:
		{
			UserId:	UserId,
			UserName:	UserName,
			Password: "123456"	,
			Class:	 "Patient",
			PatientClass:	"",
			EndDate: 20201212,
			revUserId:	localStorage.getItem("UserId"),
			TerminalName:		localStorage.getItem("TerminalName"),
			TerminalIP:		localStorage.getItem("TerminalIP"),
			DeviceType:	localStorage.getItem("DeviceType"),
					},
		beforeSend: function () {
		},
		success: function (result) {
			
		},
		error: function (msg) {
			alert("SetMstUser出错啦！");
		}
	});
	/*
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetMstUser',
		async: false,
		data:
		{
			UserId:	UserId,
			UserName:	UserName,
			Password: "123456"	,
			Class:	 "Patient",
			PatientClass:	"",
			DoctorClass: 1,	
			StartDate: 0,	
			EndDate: 20201212,
			LastLoginDateTime:	" ",
			revUserId:	localStorage.getItem("UserId"),
			TerminalName:		localStorage.getItem("TerminalName"),
			TerminalIP:		localStorage.getItem("TerminalIP"),
			DeviceType:	localStorage.getItem("DeviceType"),
					},
		beforeSend: function () {
		},
		success: function (result) {
			
		},
		error: function (msg) {
			alert("SetMstUser出错啦！");
		}
	});	*/
}


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

function SendInvitation() {
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
			//alert(InvitatoinPhoneNo);
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
					if (Flag == 1)
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
								}
							},
							error: function (msg) {
								alert("Error: GetNoByNumberingType");
							}
						});
								  }
								  else
								  {
									  alert("此手机号已被使用，请输入新的手机号码");
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
			alert("请输入手机号");
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
	var width1 = 368/378*0.45*0.45*$(this).width();
	var width2 = 368/378*0.45*0.45*$(this).width();
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


	
function GetNewPatientID() {
		  $.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetNoByNumberingType',
		async: false,
		data:
		{
			NumberingType: 1
		},
		beforeSend: function () {
		},
		success: function (result) {
			//alert($(result).text());
			$('#UserId').attr('value', $(result).text());
			$('#UserId').attr('text', $(result).text());
			$('#InvalidFlag').attr('value', 1);
			localStorage.setItem('PatientId', $(result).text());

		},
		error: function (msg) {
			alert("GetNewPatientID出错啦！");
		}
		  });
}

/*************************************慢性信息页面函数*************************/
		//页面由不可编辑状态切换到可编辑状态
			function edit(){
				
				$(".chzn-select").removeAttr("disabled").parent().removeClass("ui-state-disabled");
				$(".dropdrowlist").removeAttr("disabled").parent().removeClass("ui-state-disabled");
				$(".dropdownlist").removeAttr("disabled").parent().removeClass("ui-state-disabled");
				$(".textbox").removeAttr("disabled").parent().removeClass("ui-state-disabled");	
						
				$("#saveModuleInfo").removeAttr("disabled").parent().removeClass("ui-state-disabled");
				$("#editModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");
			}
			
		//函数GetItemInfoByPIdAndModule：获得患者某个购买模块的详细信息		
		  function GetItemInfoByPIdAndModule(UserId,CategoryCode,CategoryName){
			$.ajax({  
		        type: "POST",
		        dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetItemInfoByPIdAndModule',
				async:false,
		        data: {PatientId:UserId,CategoryCode:CategoryCode},
				beforeSend: function(){},
		        success: function(result) { 
					
					 $(".mainInfo").append('<h2>' + CategoryName + '详细信息</h2>');
					 $(result).find('Table1').each(function() {
						 var ItemCode = $(this).find("ItemCode").text();
						 if(ItemCode!="InvalidFlag")
						 {
							 if(ItemCode=="Doctor")
							 {
								 var ItemName = $(this).find("ItemName").text(); //负责医生
								 //alert(ItemName);
								 var ParentCode = $(this).find("ParentCode").text(); //ParentCode：为空，没有父级标题
								 var Value = $(this).find("Value").text(); //暂时不用
								 var Description = $(this).find("Description").text(); //负责医生姓名，不可编辑
								 var DoctorInfo = '<div data-role="fieldcontain"><label>' + ItemName + '</label><label>' + Description + '</label></div>';
								 $(".mainInfo").append(DoctorInfo);
							 }
							 else
							 {
								 var ItemName = $(this).find("ItemName").text(); //问卷内容
								 var ParentCode = $(this).find("ParentCode").text(); //ParentCode
								 var ControlType = $(this).find("ControlType").text(); //
								 var OptionCategory = $(this).find("OptionCategory").text(); //
								 //alert(OptionCategory);
								 var Value = $(this).find("Value").text(); //
								 var Content = $(this).find("Content").text(); //
								 var ItemSeq = $(this).find("ItemSeq").text();
								 //增加下拉框  
								 if(OptionCategory!="")
								 {
									  if(ControlType==7)
									  {
										  var DrugType = Value.split(",")[0];
										  var DrugName = Value.split(",")[1];
										  if (OptionCategory == "Cm.MstHypertensionDrug")
										  {
											//高血压药物
											OptionList = GetHypertensionDrugTypeNameList(DrugType);
											OptionDetailList = GetHypertensionDrugNameList(DrugType,DrugName);
										  }
										  if (OptionCategory == "Cm.MstDiabetesDrug")
										  {
											//糖尿病药物
											OptionList = GetDiabetesDrugTypeNameList(DrugType);
											OptionDetailList = GetDiabetesDrugNameList(DrugType,DrugName);
										  }
										  if (OptionCategory == "")
										  {
											//合并用药
											OptionList = GetOptionList(OptionCategory,Value);
											OptionDetailList = GetOptionList(OptionCategory,"");
										  }
									  }
									  else if(ControlType==2)
									  {
										  var OptionList = GetMultiOptionList(OptionCategory,Value);
									  }
									  else
									  {
										  var OptionList = GetOptionList(OptionCategory,Value);
									  }
								 }
								 
								 
								 if(ParentCode=="")
								 {
									 var ModuleInfo = '<label><strong>' + ItemName + '</strong></label>';
									 $(".mainInfo").append(ModuleInfo);
		
								 }
								 else
								 {	
									if(ControlType==1 || ControlType==3)	//下拉框
									{
										var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist">' + OptionList + '</select></div>';							
									}
									if(ControlType==5)	//自由文本
									{
										var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<input type="text" class="textbox" value=' + Content + '></div>';							
									}
									if(ControlType==7)	//两层单选
									{
										//var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist">' + OptionList + '</select></div>';
										if (OptionCategory == "Cm.MstHypertensionDrug")
										{
										  //高血压药物
										  	HPDrugList = OptionList;
											HPDrugListDetail = OptionDetailList;
											if(ItemSeq==1)
											{
												var ModuleInfo = '<div class="' + ItemCode + '" id="HypertensionDrugList1" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" id="HypertensionOptionList1" onChange="GetHypertensionOptionDetailList(this.value, 1)"  style="margin-right:8px;" data-role="none">' + OptionList + '</select>' + '<select class="dropdownlist" id="HypertensionOptionDetailList1" data-role="none">' + OptionDetailList + '</select><button style="float:right;" class="ui-btn ui-btn-inline" onclick="AddHypertensionDrugList();" >添加</button><button style="float:right;" class="ui-btn ui-btn-inline" onclick="DeleteHypertensionDrugList();" >删除</button></div>';	
											}
											else
											{
												$("#HypertensionDrugList" + (ItemSeq - 1)).after('<div class="M1004_1 ui-field-contain" id="HypertensionDrugList' + ItemSeq + '" data-role="fieldcontain"><label></label><select class="dropdownlist" id="HypertensionOptionList' + ItemSeq + '" onChange="GetHypertensionOptionDetailList(this.value, ' + ItemSeq + ')"  style="margin-right:8px;" >' + HPDrugList + '</select><select class="dropdownlist" id="HypertensionOptionDetailList' + ItemSeq + '">' + HPDrugListDetail + '</select></div>');
												HPNumber = ItemSeq;
												localStorage.setItem('HPNumber', HPNumber);
												$(".dropdownlist")
													.attr("data-role", "none")
													.css("width", "25%")
													.css("height", "40px");
											}
										}
										if (OptionCategory == "Cm.MstDiabetesDrug")
										{
										  //糖尿病药物
										    DADrugList = OptionList;
											DADrugListDetail = OptionDetailList;
											if(ItemSeq==1)
											{
												var ModuleInfo = '<div class="' + ItemCode + '" id="DiabetesDrugList1" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" id="DiabetesOptionList1" onChange="GetDiabetesOptionDetailList(this.value, 1)"  style="margin-right:8px;" data-role="none">' + OptionList + '</select>' + '<select class="dropdownlist" id="DiabetesOptionDetailList1" data-role="none">' + OptionDetailList + '</select><button style="float:right;" class="ui-btn ui-btn-inline" onclick="AddDiabetesDrugList();" >添加</button><button style="float:right;" class="ui-btn ui-btn-inline" onclick="DeleteDiabetesDrugList();" >删除</button></div>';	
											}
											else
											{
												$("#DiabetesDrugList" + (ItemSeq - 1)).after('<div class="M1004_2 ui-field-contain" id="DiabetesDrugList' + ItemSeq + '" data-role="fieldcontain"><label></label><select class="dropdownlist" id="DiabetesOptionList' + ItemSeq + '" onChange="GetDiabetesOptionDetailList(this.value, ' + ItemSeq + ')"  style="margin-right:8px;" data-role="none">' + DADrugList + '</select><select class="dropdownlist" id="DiabetesOptionDetailList' + ItemSeq + '" data-role="none">' + DADrugListDetail + '</select></div>');
												DANumber = ItemSeq;
												localStorage.setItem('DANumber', DANumber);
												$(".dropdownlist")
													.attr("data-role", "none")
													.css("width", "25%")
													.css("height", "40px");
											}
										}
										if (OptionCategory == "")
										{
										  //合并用药
										  var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" data-role="none"  style="margin-right:8px;" >' + OptionList + '</select>' + '<select class="dropdownlist" id="DiabetesOptionDetailList" data-role="none">' + OptionDetailList + '</select></div>';	
										}				
									}
									if(ControlType==2)		//复选框
									{	
									 	var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="chzn-select" multiple data-role="none">' + OptionList + '</select></div>';
									}
									
									$(".mainInfo").append(ModuleInfo);
								 }
							
							 
						 }	
					 }
					});	
					
					
					$('.chzn-select').chosen({
						placeholder_text_multiple: ""
					});
					$(".chosen-container")
						//.attr("data-role", "none")
						.css("width", "78%")
						.css("height", "40px");
						
					$(".chosen-container li input").attr("data-role", "none");
					$(".dropdownlist")
//						.attr("data-role", "none")
						.css("width", "25%")
						.css("height", "40px");
					$(".dropdrowlist")
						//.attr("data-role", "none")
						.css("width", "78%")
						.css("height", "40px");
					$(".textbox")
						.css("height", "40px");
						
					//$(".chzn-select").attr("disabled","disabled");
//					$(".dropdrowlist").attr("disabled","disabled");
//					$(".dropdownlist").attr("disabled","disabled");
//					$(".textbox").attr("disabled","disabled");
//					$("#saveModuleInfo").attr("disabled","disabled");

					$("#editModuleInfo").attr("disabled","disabled");			    				
					$(".mainInfo").trigger("create");  //jquery mobile渲染	
				
			   }, 
		       error: function(msg) {alert("GetItemInfoByPIdAndModule Error!");}
		     });
		  }
		  

		
		//生成带值的下拉框
			function GetOptionList(Type,Value){
				var options;
				$.ajax({  
		        type: "POST",
		        dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetTypeList',
				async:false,
		        data: {Category:Type},
				beforeSend: function(){},
		        success: function(result) { 
					if(Value!="")
					{
						options = '<option value="0">请选择</option>';
					 	$(result).find('Table1').each(function() {
						 	var Type = $(this).find("Type").text();
						 	var Name = $(this).find("Name").text(); 
							if(Type==Value)
							{
								options = options + '<option value="' + Type + '" selected="selected">' + Name + '</option>';
							}
						 	else
							{
						 		options = options + '<option value="' + Type + '">' + Name + '</option>';
							}
						})
					}
					else		//Value==""时，将下拉框中Value为0的项选中
					{
						options = '<option value="0" selected="selected">请选择</option>';
					 	$(result).find('Table1').each(function() {
						 	var Type = $(this).find("Type").text();
						 	var Name = $(this).find("Name").text(); 							 
						 	options = options + '<option value="' + Type + '">' + Name + '</option>';
						})
					}				    
		       }, 
		       error: function(msg) {alert("Error!");}
		     });
			 return options;	
			}
			
			//生成多选下拉框
			function GetMultiOptionList(Type,Value){
				var options;
				$.ajax({  
		        type: "POST",
		        dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetTypeList',
				async:false,
		        data: {Category:Type},
				beforeSend: function(){},
		        success: function(result) { 
					if(Value!="")
					{
						var EachValue = Value.split(",");
						var i = 0;
						var Length = $(result).find('Table1').length;
						for(var j= 0; j < Length; j++)
						{
							 var Type = $(result).find('Type').eq(j).text();
							 var Name = $(result).find('Name').eq(j).text();
							 if(Type==EachValue[i])
							 {
								options = options + '<option value="' + Type + '" selected="selected">' + Name + '</option>';
								if(i<EachValue.length)
								{
									i++;
								}
							 }
							 else
							 {
								options = options + '<option value="' + Type + '">' + Name + '</option>';
							 }
						 }
					}
					else		//Value==""时，将下拉框中Value为0的项选中
					{
						//options = '<option value="0">请选择</option>';
					 	$(result).find('Table1').each(function() {
						 	var Type = $(this).find("Type").text();
						 	var Name = $(this).find("Name").text(); 							 
						 	options = options + '<option value="' + Type + '">' + Name + '</option>';
						})
					}				    
		       }, 
		       error: function(msg) {alert("Error!");}
		     });
			 return options;	
			}
			
			//高血压药物类型下拉框
			function GetHypertensionDrugTypeNameList(Value){
				var options;
				$.ajax({  
		        type: "POST",
		        dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetHypertensionDrugTypeNameList',
				async:false,
		        data: {},
				beforeSend: function(){},
		        success: function(result) { 
					if(Value!="")
					{
						options = '<option value="0">请选择</option>';
					 	$(result).find('Table1').each(function() {
						 	var Type = $(this).find("Type").text();
						 	var Name = $(this).find("TypeName").text(); 
							if(Type==Value)
							{
								options = options + '<option value="' + Type + '" selected="selected">' + Name + '</option>';
							}
						 	else
							{
						 		options = options + '<option value="' + Type + '">' + Name + '</option>';
							}
						})
					}
					else		//Value==""时，将下拉框中Value为0的项选中
					{
						options = '<option value="0" selected="selected">请选择</option>';
					 	$(result).find('Table1').each(function() {
						 	var Type = $(this).find("Type").text();
						 	var Name = $(this).find("TypeName").text(); 							 
						 	options = options + '<option value="' + Type + '">' + Name + '</option>';
						})
					}				    
		       }, 
		       error: function(msg) {alert("GetHypertensionDrugTypeNameListError!");}
		     });
			 return options;	
			}
			
			//高血压药物名称下拉框
			function GetHypertensionDrugNameList(Type,Value){
				var options;
				if(Type == "")
				{
					options = '<option value="0">请选择</option>'
				}
				else
				{
					$.ajax({  
					type: "POST",
					dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/GetHypertensionDrugNameList',
					async:false,
					data: {Type:Type},
					beforeSend: function(){},
					success: function(result) { 
						if(Value!="")
						{
							options = '<option value="0">请选择</option>';
							$(result).find('Table1').each(function() {
								var Code = $(this).find("Code").text();
								var Name = $(this).find("Name").text(); 
								if(Code==Value)
								{
									options = options + '<option value="' + Code + '" selected="selected">' + Name + '</option>';
								}
								else
								{
									options = options + '<option value="' + Code + '">' + Name + '</option>';
								}
							})
						}
						else		//Value==""时，将下拉框中Value为0的项选中
						{
							options = '<option value="0" selected="selected">请选择</option>';
							$(result).find('Table1').each(function() {
								var Code = $(this).find("Code").text();
								var Name = $(this).find("Name").text(); 							 
								options = options + '<option value="' + Code + '">' + Name + '</option>';
							})
						}				    
				   }, 
				   error: function(msg) {alert("GetHypertensionDrugNameListError!");}
				 });
			 }
			 return options;	
			}
			
			//糖尿病药物类型下拉框
			function GetDiabetesDrugTypeNameList(Value){
				var options;
				$.ajax({  
				type: "POST",
				dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetDiabetesDrugTypeNameList',
				async:false,
				data: {},
				beforeSend: function(){},
				success: function(result) { 
					if(Value!="")
					{
						options = '<option value="0">请选择</option>';
						$(result).find('Table1').each(function() {
							var Type = $(this).find("Type").text();
							var Name = $(this).find("TypeName").text(); 
							if(Type==Value)
							{
								options = options + '<option value="' + Type + '" selected="selected">' + Name + '</option>';
							}
							else
							{
								options = options + '<option value="' + Type + '">' + Name + '</option>';
							}
						})
					}
					else		//Value==""时，将下拉框中Value为0的项选中
					{
						options = '<option value="0" selected="selected">请选择</option>';
						$(result).find('Table1').each(function() {
							var Type = $(this).find("Type").text();
							var Name = $(this).find("TypeName").text(); 							 
							options = options + '<option value="' + Type + '">' + Name + '</option>';
						})
					}				    
			   }, 
			   error: function(msg) {alert("GetDiabetesDrugTypeNameListError!");}
			 });
			 return options;	
			}
			
			//糖尿病药物名称下拉框
			function GetDiabetesDrugNameList(Type,Value){
				var options;
				if(Type == "")
				{
					options = '<option value="0">请选择</option>'
				}
				else
				{
					$.ajax({  
					type: "POST",
					dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/GetDiabetesDrugNameList',
					async:false,
					data: {Type:Type},
					beforeSend: function(){},
					success: function(result) { 
						if(Value!="")
						{
							options = '<option value="0">请选择</option>';
							$(result).find('Table1').each(function() {
								var Code = $(this).find("Code").text();
								var Name = $(this).find("Name").text(); 
								if(Code==Value)
								{
									options = options + '<option value="' + Code + '" selected="selected">' + Name + '</option>';
								}
								else
								{
									options = options + '<option value="' + Code + '">' + Name + '</option>';
								}
							})
						}
						else		//Value==""时，将下拉框中Value为0的项选中
						{
							options = '<option value="0" selected="selected">请选择</option>';
							$(result).find('Table1').each(function() {
								var Code = $(this).find("Code").text();
								var Name = $(this).find("Name").text(); 							 
								options = options + '<option value="' + Code + '">' + Name + '</option>';
							})
						}				    
				   }, 
				   error: function(msg) {alert("GetDiabetesDrugNameListError!");}
				 });
			 }
			 return options;	
			}
			
			//表单提交，保存编辑过的健康信息
			function save(){
				var  DoctorId = localStorage.getItem('DoctorId');
				var UserId = localStorage.getItem("PatientId");

			  $.ajax({  
		        type: "POST",
		        dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetItemInfoByPIdAndModule',
				async:false,
		        data: {PatientId:UserId,CategoryCode:"M1"},
				beforeSend: function(){},
		        success: function(result) { 
				//&& ""!=result.trim()
				var UserId = localStorage.getItem("PatientId");
				 var Flag = 1;
				 var test = $(result).find('Table1').length;
				 //test= 0;
				 //alert(test);
					if(test != 0)
					{
						//alert("13");
						//不为空的操作 已经购买过M1
					 $(result).find('Table1').each(function() {
						 var ItemCode = $(this).find("ItemCode").text();
						 var ControlType = $(this).find("ControlType").text();
						 //alert(ItemCode);
						 if(ItemCode!="InvalidFlag")
						 {
							 if(ItemCode=="Doctor")
							 {
								 //负责医生不可编辑，无需执行任何操作
							 }
							 else
							 {
								 //var ItemCode = $(this).find("ItemCode").text(); //问卷内容
								 var ParentCode = $(this).find("ParentCode").text(); //ParentCode
								 var ItemSeq = $(this).find("ItemSeq").text(); //
								 var Description = $(this).find("Description").text(); //
								 var SortNo = $(this).find("SortNo").text(); //
								 var OptionCategory = $(this).find("OptionCategory").text();
								 var value;			 
								 if(ParentCode=="")
								 {
									 //该条记录为父级标题，无需执行任何操作
								 }
								 else
								 {						 	
								 	//按ItemCode从界面对应元素取值
									//var div = $("."+ItemCode);	
//									if(div.find('select').length)
//									{
//										//alert("1");
//										 value = div.find('select').val();
//									}
//									else
//									{
//										value = div.find('input').val();
//									}
//								 	//更新数据
//									SetPatBasicInfoDetail(CategoryCode,ItemCode,ItemSeq,value,Description,SortNo);
									
									var div = $("."+ItemCode);	
									if(div.find('select').length)
									{
												//alert("1");
										if(ControlType!=7)
										{
											if(ControlType==2)
											{
												value = div.find('select').val();
												if(value != null)
												{
													value = value.toString();
												}
											}
											else
											{
												value = div.find('select').val();
											}
										}
										else
										{
											var div = $("."+ItemCode);	
											if (OptionCategory == "Cm.MstHypertensionDrug")
											{
											  //高血压药物
												var HPNumber = localStorage.getItem('HPNumber');
												for(i=1;i<=HPNumber;i++)
												{
													var DrugType = div.find('#HypertensionOptionList'+i).val();
													var DrugName = div.find('#HypertensionOptionDetailList'+i).val();
													
													value = DrugType + ',' + DrugName;
													SetPatBasicInfoDetail(CategoryCode,ItemCode,i,value,"",1);
												}
											}
											if (OptionCategory == "Cm.MstDiabetesDrug")
											{
											  //糖尿病药物
												var DANumber = localStorage.getItem('DANumber');
												for(i=1;i<=DANumber;i++)
												{
													var DrugType = div.find('#DiabetesOptionList' + i).val();
													var DrugName = div.find('#DiabetesOptionDetailList' + i).val();
													value = DrugType + ',' + DrugName;
													SetPatBasicInfoDetail(CategoryCode,ItemCode,i,value,"",1);
												}
											}
										}
									}
									else
									{
										value = div.find('input').val();
										var reg = /^\d+(?=\.{0,1}\d+$|$)/;
										if(!reg.test(value) && value != "")
										{
											Flag = 0;
										}
									}
									if(Flag == 1)
									{
										if(ControlType!=7)
										{
											SetPatBasicInfoDetail(CategoryCode,ItemCode,1,value,"",1);
										}
										$(".chzn-select").attr("disabled","disabled").parent().addClass("ui-state-disabled");
										$(".dropdrowlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
										$(".dropdownlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
										$(".textbox").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
										$("#editModuleInfo").removeAttr("disabled","disabled").parent().removeClass("ui-state-disabled");	
										$("#saveModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");
									}
								 }					
							 }
						 }	
						 		 
					})
					if(Flag == 0)
				   {
					  alert('体格检查输入格式不正确！');
					  return;
				   }	
					}
					else
					{
						//为空的操作  还未购买过M1
						//alert("in123");
						/*//插入是否购买
                        SetPatBasicInfoDetail("M1", "InvalidFlag", 1, "0", "", 1);
 						//插入 医生详细信息表 负责患者信息
                        SetPsDoctorDetailOnPat("M1", UserId,"",1);
                        //插入 患者详细信息表 负责医生信息                           
                        SetPatBasicInfoDetail("M1", "Doctor", 1, DoctorId, "", 1);
						//插入患者详细信息表中的模块关注详细信息
						//SetPatBasicInfoDetail("M1",ItemCode,1,value,"",1);
						SetNewModuleInfo("M1");*/
						
						//插入是否购买
                        SetPatBasicInfoDetail("M1", "InvalidFlag", 1, "0", "", 1);
 						//插入 医生详细信息表 负责患者信息
                        //SetPsDoctorDetailOnPat("HM1", UserId,"",1);
                        //插入 患者详细信息表 负责医生信息                           
                        SetPatBasicInfoDetail("HC", "Doctor", 1, DoctorId, "", 1);
						//插入患者详细信息表中的模块关注详细信息
						//SetPatBasicInfoDetail("M1",ItemCode,1,value,"",1);
						SetNewModuleInfo("M1");	
						SetNewModuleInfo2("M1");
										
					}
					//全部更新成功后
					
					if(Flag == 1)
					{
						$(".chzn-select").attr("disabled","disabled").parent().addClass("ui-state-disabled");
						$(".dropdrowlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
						$(".dropdownlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
						$(".textbox").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
						$("#editModuleInfo").removeAttr("disabled","disabled").parent().removeClass("ui-state-disabled");	
						$("#saveModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
					}
					    
		       }, 
		       error: function(msg) {alert("Error!");}
		     });
			 $(".chzn-select").attr("disabled","disabled").parent().addClass("ui-state-disabled");
			$(".dropdrowlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
			$(".dropdownlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
			$(".textbox").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
			$("#editModuleInfo").removeAttr("disabled","disabled").parent().removeClass("ui-state-disabled");	
			$("#saveModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");
			}
			
			function SetNewModuleInfo(CategoryCode){
				
				$.ajax({  								
		        	type: "POST",
		        	dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/GetMstInfoItemByCategoryCode',
					async:false,
		        	data: {CategoryCode:CategoryCode},
					beforeSend: function(){},
		        	success: function(result) { 
						var Flag = 1;	
						$(result).find('Table1').each(function() {
						 	var ItemCode = $(this).find("Code").text();
							var ControlType = $(this).find("ControlType").text();
							var Name = $(this).find("Name").text();
							var OptionCategory = $(this).find("OptionCategory").text();
						 //alert(ItemCode);	
						 //alert(ItemCode.split("_").length);
						 	if(ItemCode.split("_").length==2)
							{	
							//alert("length1");
								var div = $("."+ItemCode);	
								if(div.find('select').length)
								{
											//alert("1");
									if(ControlType!=7)
									{
										if(ControlType==2)
										{
											value = div.find('select').val();
											if(value != null)
											{
												value = value.toString();
											}
										}
										else
										{
											value = div.find('select').val();
										}
									}
								}
								else
								{
									value = div.find('input').val();
									var reg = /^\d+(?=\.{0,1}\d+$|$)/;
									if(!reg.test(value) && value != "")
									{
										Flag = 0;
									}
								}	
								
							}
							else
							{
								//alert("length2");
								value = "";
							}
							if(Flag == 1)
							{
								SetPatBasicInfoDetail(CategoryCode,ItemCode,1,value,"",1);
							}
						 })	
						 if(Flag == 0)
						 {
							alert('体格检查输入格式不正确！');
							return;
						 }	
						 else
						 {
							$(".chzn-select").attr("disabled","disabled").parent().addClass("ui-state-disabled");
							$(".dropdrowlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
							$(".dropdownlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
							$(".textbox").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
							$("#editModuleInfo").removeAttr("disabled","disabled").parent().removeClass("ui-state-disabled");	
							$("#saveModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
						 }	 
		      		}, 
		       		error: function(msg) {alert("GetMstInfoItemByCategoryCodeError!");}
		     	}); 
			}
			
			function SetNewModuleInfo2(CategoryCode){
				
				$.ajax({  								
		        	type: "POST",
		        	dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/GetMstInfoItemByCategoryCode',
					async:false,
		        	data: {CategoryCode:CategoryCode},
					beforeSend: function(){},
		        	success: function(result) { 
						$(result).find('Table1').each(function() {
						 	var ItemCode = $(this).find("Code").text();
							var ControlType = $(this).find("ControlType").text();
							var Name = $(this).find("Name").text();
							var OptionCategory = $(this).find("OptionCategory").text();
						 //alert(ItemCode);	
						 //alert(ItemCode.split("_").length);
						 	if(ItemCode.split("_").length==2)
							{	
							//alert("length1");
								if(ControlType ==7)
								{
									var div = $("."+ItemCode);	
									if (OptionCategory == "Cm.MstHypertensionDrug")
									{
									  //高血压药物
										var HPNumber = localStorage.getItem('HPNumber');
										for(i=1;i<=HPNumber;i++)
										{
											var DrugType = div.find('#HypertensionOptionList'+i).val();
											var DrugName = div.find('#HypertensionOptionDetailList'+i).val();
											
											value = DrugType + ',' + DrugName;
											SetPatBasicInfoDetail(CategoryCode,ItemCode,i,value,"",1);
										}
									}
									if (OptionCategory == "Cm.MstDiabetesDrug")
									{
									  //糖尿病药物
										var DANumber = localStorage.getItem('DANumber');
										for(i=1;i<=DANumber;i++)
										{
											var DrugType = div.find('#DiabetesOptionList' + i).val();
											var DrugName = div.find('#DiabetesOptionDetailList' + i).val();
											value = DrugType + ',' + DrugName;
											SetPatBasicInfoDetail(CategoryCode,ItemCode,i,value,"",1);
										}
									}
								}
							}
							else
							{
								//alert("length2");
								value = "";
								SetPatBasicInfoDetail(CategoryCode,ItemCode,1,value,"",1);
							}
						 })	

						$(".chzn-select").attr("disabled","disabled").parent().addClass("ui-state-disabled");
						$(".dropdrowlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
						$(".dropdownlist").attr("disabled","disabled").parent().addClass("ui-state-disabled");
						$(".textbox").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
						$("#editModuleInfo").removeAttr("disabled","disabled").parent().removeClass("ui-state-disabled");	
						$("#saveModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");	 
		      		}, 
		       		error: function(msg) {alert("GetMstInfoItemByCategoryCodeError!");}
		     	}); 
			}
			
			
			//修改健康模块中的一条信息
			function SetPatBasicInfoDetail(CategoryCode,ItemCode,ItemSeq,value,Description,SortNo){
				var UserId = localStorage.getItem("PatientId");
				$.ajax({  								
		        	type: "POST",
		        	dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/SetPatBasicInfoDetail',
					async:false,
		        	data: {Patient:UserId,CategoryCode:CategoryCode,ItemCode:ItemCode,ItemSeq:ItemSeq,Value:value,Description:Description,SortNo:SortNo,revUserId:revUserId,TerminalName:TerminalName,TerminalIP:TerminalIP,DeviceType:DeviceType},
					beforeSend: function(){},
		        	success: function(result) { 							 
		      		}, 
		       		error: function(msg) {alert("Error!");}
		     	});
			}
			
			
			
			//插入 医生详细信息表 负责患者信息
			function SetPsDoctorDetailOnPat(CategoryCode,Value,Description,SortNo){
								var  DoctorId = localStorage.getItem('DoctorId');
				$.ajax({  								
		        	type: "POST",
		        	dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/SetPsDoctorDetailOnPat',
					async:false,
		        	data: {Doctor:DoctorId,CategoryCode:CategoryCode,Value:Value,Description:Description,SortNo:SortNo,piUserId:revUserId,piTerminalName:TerminalName,piTerminalIP:TerminalIP,piDeviceType:DeviceType},
					beforeSend: function(){},
		        	success: function(result) { 
						//alert("2");								 
		      		}, 
		       		error: function(msg) {alert("SetPsDoctorDetailOnPatError!");}
		     	});
			}
			
			//函数GetItemInfoFromDict：从字典表获得患者未购买模块的详细信息		
		  function GetItemInfoFromDict(UserId,CategoryCode,CategoryName){
		
			$.ajax({  
		        type: "POST",
		        dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/GetMstInfoItemByCategoryCode',
				async:false,
		        data: {CategoryCode:CategoryCode},
				beforeSend: function(){},
		        success: function(result) { 

					 $(".mainInfo").append('<h2>' + CategoryName + '详细信息</h2><button style="float:right;" class="ui-btn ui-btn-inline" onclick="SynBasicInfoDetail();" >从临床信息中同步数据</button>');
					 $(result).find('Table1').each(function() {
						 var GroupHeaderFlag = $(this).find("GroupHeaderFlag").text();
						 var ItemCode = $(this).find("Code").text();
						 
						 if(GroupHeaderFlag == 1)
						 {	 
							 var ItemName = $(this).find("Name").text(); //问卷内容父级标题
							 var ModuleInfo = '<label class="' + ItemCode + '"><strong>' + ItemName + '</strong></label>';
							 $(".mainInfo").append(ModuleInfo);				 						 
						 }	
						 else
						 {
							
							 var ItemName = $(this).find("Name").text(); //问卷内容子标题
							 //var ParentCode = $(this).find("ParentCode").text(); //ParentCode
							 var ControlType = $(this).find("ControlType").text(); //
							 
							
							 var OptionCategory = $(this).find("OptionCategory").text(); //
								 //alert(OptionCategory);
								 //var Value = $(this).find("Value").text(); //
								 //var Content = $(this).find("Content").text(); //
								 //增加下拉框  
								 //if(OptionCategory!="")
								 //{
							 //var OptionList = GetOptionList(OptionCategory,"");
							  if(ControlType==7)
							  {
								  if (OptionCategory == "Cm.MstHypertensionDrug")
								  {
									//高血压药物
									OptionList = GetHypertensionDrugTypeNameList("");
									OptionDetailList = GetHypertensionDrugNameList("","");
								  }
								  if (OptionCategory == "Cm.MstDiabetesDrug")
								  {
									//糖尿病药物
									OptionList = GetDiabetesDrugTypeNameList("");
									OptionDetailList = GetDiabetesDrugNameList("","");
								  }
								  if (OptionCategory == "")
								  {
									//合并用药
									OptionList = GetOptionList(OptionCategory,"");
									OptionDetailList = GetOptionList(OptionCategory,"");
								  }
							  }
							  else if(ControlType==2)
							  {
								  var OptionList = GetMultiOptionList(OptionCategory,"");

							  }
							  else
							  {
								  var OptionList = GetOptionList(OptionCategory,"");
							  }
								 //}
								 
								 
								 //if(ParentCode=="")
								 //{
								//	 var ModuleInfo = '<label><strong>' + ItemName + '</strong></label>';
								//	 $(".mainInfo").append(ModuleInfo);
		
								// }
								// else
								 //{	
								 	if(ControlType==1)	//下拉框
									{
										 //var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<label>' + ControlType + '</label></div>';	
										 var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist">' + OptionList + '</select></div>';							
									}
									if(ControlType==5)		//自由文本
									{	
									 	var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<input type="text" class="textbox" value=' + " " + '></div>';
									}
									if(ControlType==7)	//两层下拉框
									{
										if (OptionCategory == "Cm.MstHypertensionDrug")
										{
										  //高血压药物
										  	HPDrugList = OptionList;
											HPDrugListDetail = OptionDetailList;
											var ModuleInfo = '<div class="' + ItemCode + '" id="HypertensionDrugList1" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" id="HypertensionOptionList1" onChange="GetHypertensionOptionDetailList(this.value, 1)" style="margin-right:8px;" >' + OptionList + '</select>' + '<select class="dropdownlist" id="HypertensionOptionDetailList1">' + OptionDetailList + '</select><button style="float:right;" class="ui-btn ui-btn-inline" onclick="AddHypertensionDrugList();" >添加</button><button style="float:right;" class="ui-btn ui-btn-inline" onclick="DeleteHypertensionDrugList();" >删除</button></div>';	
											localStorage.setItem('HPNumber', 1);	
										}
										if (OptionCategory == "Cm.MstDiabetesDrug")
										{
										  //糖尿病药物
										    DADrugList = OptionList;
											DADrugListDetail = OptionDetailList;
											var ModuleInfo = '<div class="' + ItemCode + '" id="DiabetesDrugList1" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" id="DiabetesOptionList1" onChange="GetDiabetesOptionDetailList(this.value, 1)" style="margin-right:8px;" >' + OptionList + '</select>' + '<select class="dropdownlist" id="DiabetesOptionDetailList1" style="margin-right:8px;" > ' + OptionDetailList + '</select><button style="float:right;" class="ui-btn ui-btn-inline" onclick="AddDiabetesDrugList();" >添加</button><button style="float:right;" class="ui-btn ui-btn-inline" onclick="DeleteDiabetesDrugList();" >删除</button></div>';
											localStorage.setItem('DANumber', 1);		
										}
										if (OptionCategory == "")
										{
										  //合并用药
										  var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" style="margin-right:8px;" >' + OptionList + '</select>' + '<select class="dropdownlist" id="DiabetesOptionDetailList" style="margin-right:8px;" >' + OptionDetailList + '</select></div>';	
										}
									}
									if(ControlType==2)		//复选框
									{	
									 	var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="chzn-select" multiple data-role="none" style="margin-right:8px;" >' + OptionList + '</select></div>';
										//var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist" multiple="multiple">' + OptionList + '</select></div>';
									}
									$(".mainInfo").append(ModuleInfo);
								// }
							
							 
						 }
					});	
					//$(".dropdrowlist").attr("disabled","disabled");
					//$(".textbox").attr("disabled","disabled");
					
					//$("#saveModuleInfo").removeAttr("disabled","disabled").parent().removeClass("ui-state-disabled");	
					//$("#editModuleInfo").attr("disabled","disabled").parent().addClass("ui-state-disabled");	
					//editModuleInfo
					
					
					$('.chzn-select').chosen({
						placeholder_text_multiple: ""
					});
					$(".chosen-container")
						//.attr("data-role", "none")
						.css("width", "78%")
						.css("height", "40px");
					$(".dropdownlist")
						.attr("data-role", "none")
						.css("width", "25%")
						.css("height", "40px");
					$(".dropdrowlist")
						//.attr("data-role", "none")
						.css("width", "78%")
						.css("height", "40px");
					$(".textbox")
						.css("height", "40px");
					$(".chosen-container li input").attr("data-role", "none");
						
					

					
					$("#editModuleInfo").attr("disabled","disabled");			    				
					$(".mainInfo").trigger("create");  //jquery mobile渲染	
			   }, 
		       error: function(msg) {alert("Error!");}
		     });
		  }
		  
		  function GetHypertensionOptionDetailList(type, i)
		  {
			OptionDetailList = GetHypertensionDrugNameList(type,"");
			$("#HypertensionOptionDetailList" + i + " option").remove();
			$("#HypertensionOptionDetailList" + i).append(OptionDetailList);
		  }
		  
		  function GetDiabetesOptionDetailList(type, i)
		  {
			OptionDetailList = GetDiabetesDrugNameList(type,"");
			$("#DiabetesOptionDetailList" + i + " option").remove();
			$("#DiabetesOptionDetailList" + i).append(OptionDetailList);
		  }
		  
		  function AddHypertensionDrugList()
		  {
			$("#HypertensionDrugList" + HPNumber).after('<div class="M1004_1 ui-field-contain" id="HypertensionDrugList' + (HPNumber + 1) + '" data-role="fieldcontain"><label></label><select class="dropdownlist" id="HypertensionOptionList' + (HPNumber + 1) + '" onChange="GetHypertensionOptionDetailList(this.value, ' + (HPNumber + 1) + ')" style="margin-right:8px;" >' + HPDrugList + '</select><select class="dropdownlist" id="HypertensionOptionDetailList' + (HPNumber + 1) + '" style="margin-right:8px;" >' + HPDrugListDetail + '</select></div>');
          	HPNumber = HPNumber + 1;
			localStorage.setItem('HPNumber', HPNumber);
			$(".dropdownlist")
				.attr("data-role", "none")
				.css("width", "25%")
				.css("height", "40px");
    	  }
		  
		  function DeleteHypertensionDrugList()
		  {
		  	if (HPNumber == 1) {
         		return;
          	}
			$("#HypertensionDrugList" + HPNumber).remove();
			HPNumber = HPNumber - 1;
			localStorage.setItem('HPNumber', HPNumber);
		  }
		  
		  function AddDiabetesDrugList()
		  {
			$("#DiabetesDrugList" + DANumber).after('<div class="M1004_2 ui-field-contain" id="DiabetesDrugList' + (DANumber + 1) + '" data-role="fieldcontain"><label></label><select class="dropdownlist" id="DiabetesOptionList' + (DANumber + 1) + '" onChange="GetDiabetesOptionDetailList(this.value, ' + (DANumber + 1) + ')" style="margin-right:8px;" >' + DADrugList + '</select><select class="dropdownlist" id="DiabetesOptionDetailList' + (DANumber + 1) + '" style="margin-right:8px;" >' + DADrugListDetail + '</select></div>');
          	DANumber = DANumber + 1;
			localStorage.setItem('DANumber', DANumber);
			$(".dropdownlist")
				.attr("data-role", "none")
				.css("width", "25%")
				.css("height", "40px");
    	  }
		  
		  function DeleteDiabetesDrugList()
		  {
		  	if (DANumber == 1) {
         		return;
          	}
			$("#DiabetesDrugList" + DANumber).remove();
			DANumber = DANumber - 1;
			localStorage.setItem('DANumber', DANumber);
		  }
		  
		  	

		  function SynBasicInfoDetail(){
			  $.ajax({  								
		        	type: "POST",
		        	dataType: "xml",
					timeout: 30000,  
					url: 'http://'+ serverIP +'/'+serviceName+'/SynBasicInfoDetail',
					async:false,
		        	data: {UserId:UserId},
					beforeSend: function(){},
		        	success: function(result) { 
						//alert("2");
						 $(result).find('Table1').each(function() {
							//var Name1 = $(this).find("Name1").text();
							 var Value1 = $(this).find("Value1").text();
								 $(".M1001_09").find("select").val(Value1);
								 $(".M1001_09").find("select").css("background-color","#95CACA");
								 
							  var Value2 = $(this).find("Value2").text();			 			 
								 $(".M1001_05").find("select").val(Value2);
								 	 $(".M1001_05").find("select").css("background-color","#95CACA");
									 
								  var Value3 = $(this).find("Value3").text();
								 $(".M1001_06").find("select").val(Value3);
							 $(".M1001_06").find("select").css("background-color","#95CACA");
							 
						 });
						  $(result).find('Table2').each(function() {
							 var Code = $(this).find("Code").text();
							 //alert(Code);
							 var Name = $(this).find("Name").text();
						 	 if(Code=="62.00028"){
								 $(".M1006_10").find("input").val(Name);
								  $(".M1006_10").find("input").css("background-color","#95CACA");
							 }
							 if(Code=="62.2713"){
								 $(".M1006_08").find("input").val(Name);
								 $(".M1006_08").find("input").css("background-color","#95CACA");
							 }
							  if(Code=="62.63704"){
								 $(".M1006_09").find("input").val(Name);
								 $(".M1006_09").find("input").css("background-color","#95CACA");
							 }
							  if(Code=="JY0277"){
								 $(".M1006_11").find("input").val(Name);
								 $(".M1006_11").find("input").css("background-color","#95CACA");
							 }
						 });
						 								 
		      		}, 
		       		error: function(msg) {alert("SynBasicInfoDetailError!");}
		     	});
			  }