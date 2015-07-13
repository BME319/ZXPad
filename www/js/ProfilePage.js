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
	
	/*document.getElementById("AlertUserName").style.display = "none";
	//document.getElementById("SexStyle").style.display = "none";
	document.getElementById("AlertSex").style.display = "none";
	//document.getElementById("BirthStyle").style.display = "none";
	document.getElementById("AlertBirth").style.display = "none";
	//document.getElementById("IDStyle").style.display = "none";
	document.getElementById("AlertID").style.display = "none";
	//document.getElementById("PhoneStyle").style.display = "none";	//2015-5-22 ZCY增加
	document.getElementById("AlertPhone").style.display = "none";	//2015-5-22 ZCY增加
	document.getElementById("AlertHeight").style.display = "none";	//2015-6-3 ZCY增加
	document.getElementById("AlertWeight").style.display = "none";	//2015-6-3 ZCY增加
	document.getElementById("AlertEmergencyPhone").style.display = "none";//2015-6-3 ZCY增加
	
	
	GetTypeList("SexType");
	GetTypeList("AboBloodType");
	GetTypeList("InsuranceType");

	if (localStorage.getItem("NewPatientFlag") == 'true') {
		//alert('Get new PID.');
		GetNewPatientID();
		//localStorage.setItem('NewPatientFlag',true);
	}
	else {
				
		//localStorage.setItem('NewPatientFlag',false);
		GetDetailInfo(UserId);
		GetBasicInfo(UserId);
		GetUserBasicInfo(UserId);
	}*/
	
	
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

////获取下拉框内容
//function GetTypeList(Category) {
//	$("#" + Category).append('<option value=0>--请选择--</option>');
//
//	$.ajax({
//		type: "POST",
//		dataType: "xml",
//		timeout: 30000,
//		url: 'http://' + serverIP + '/' + serviceName + '/GetTypeList',
//		async: false,
//		data:
//		{
//			Category: Category
//		},
//		beforeSend: function () {
//		},
//		success: function (result) {
//			$(result).find('Table1').each(function () {
//				var Type = $(this).find("Type").text();
//				var Name = $(this).find("Name").text();
//				$("#" + Category).append('<option value=' + Type + '>' + Name + '</option>');
//			})
//		},
//		error: function (msg) {
//			alert("GetTypeList出错啦！");
//		}
//	});
//}
//
////获取病人基本信息
//function GetBasicInfo(UserId) {
//	$.ajax({
//		type: "POST",
//		dataType: "xml",
//		timeout: 30000,
//		url: 'http://' + serverIP + '/' + serviceName + '/GetPatBasicInfo',
//		async: false,
//		data:
//		{
//			UserId: UserId
//		},
//		beforeSend: function () {
//		},
//		success: function (result) {
//			var UserId = $(result).find("PatientBasicInfo").find("UserId").text();
//			var UserName = $(result).find("PatientBasicInfo").find("UserName").text();
//			var Gender = $(result).find("PatientBasicInfo").find("Gender").text();
//			var BloodType = $(result).find("PatientBasicInfo").find("BloodType").text();
//			var InsuranceType = $(result).find("PatientBasicInfo").find("InsuranceType").text();
//			var Birthday = $(result).find("PatientBasicInfo").find("Birthday").text();
//			var BloodTypeText = $(result).find("PatientBasicInfo").find("BloodTypeText").text();
//			var InsuranceTypeText = $(result).find("PatientBasicInfo").find("InsuranceTypeText").text();
//			var Module = $(result).find("PatientBasicInfo").find("Module").text();
//
//			$('#UserId').attr('value', UserId);
//			$('#UserName').attr('value', UserName);
//			//document.getElementById('UserName').innerText = UserName;
//			var Birthday = Birthday.substring(0, 4) + "-" + Birthday.substring(4, 6) + "-" + Birthday.substring(6, 8);
//			$("#Birthday").val(Birthday);
//			$("#SexType").val(Gender);
//			$('#SexType').selectmenu('refresh');
//			$("#AboBloodType").val(BloodType);
//			$('#AboBloodType').selectmenu('refresh');
//			$("#InsuranceType").val(InsuranceType);
//			$('#InsuranceType').selectmenu('refresh');
//		},
//		error: function (msg) {
//			alert("GetPatBasicInfo出错啦！");
//		}
//	});
//}
//
////获取病人详细信息
//function GetDetailInfo(UserId) {
//	$.ajax({
//		type: "POST",
//		dataType: "xml",
//		timeout: 30000,
//		url: 'http://' + serverIP + '/' + serviceName + '/GetPatientDetailInfo',
//		async: false,
//		data:
//		{
//			UserId: UserId
//		},
//		beforeSend: function () {
//		},
//		success: function (result) {
//			var UserId = $(result).find("PatientDetailInfo1").find("UserId").text();
//			var PhoneNumber = $(result).find("PatientDetailInfo1").find("PhoneNumber").text();
//			var HomeAddress = $(result).find("PatientDetailInfo1").find("HomeAddress").text();
//			var Occupation = $(result).find("PatientDetailInfo1").find("Occupation").text();
//			var Nationality = $(result).find("PatientDetailInfo1").find("Nationality").text();
//			var EmergencyContact = $(result).find("PatientDetailInfo1").find("EmergencyContact").text();
//			var EmergencyContactPhoneNumber = $(result).find("PatientDetailInfo1").find("EmergencyContactPhoneNumber").text();
//			var PhotoAddress = $(result).find("PatientDetailInfo1").find("PhotoAddress").text();
//			var Module = $(result).find("PatientDetailInfo1").find("Module").text();
//			var IDNo = $(result).find("PatientDetailInfo1").find("IDNo").text();
//			var Height = $(result).find("PatientDetailInfo1").find("Height").text();
//			var Weight = $(result).find("PatientDetailInfo1").find("Weight").text();
//
//			if (PhotoAddress != ImageAddress) {
//				PhotoAddress = ImageAddressIP + ImageAddressFile + '/add.jpg';
//			}
//			$("#Photo").attr("src", PhotoAddress);
//			$("#PhoneNumber").val(PhoneNumber);
//			$("#HomeAddress").val(HomeAddress);
//			$("#Occupation").val(Occupation);
//			$("#Nationality").val(Nationality);
//			$("#EmergencyContact").val(EmergencyContact);
//			$("#EmergencyContactPhoneNumber").val(EmergencyContactPhoneNumber);
//			$("#IDNo").val(IDNo);
//			$("#Height").val(Height);
//			$("#Weight").val(Weight);
//
//		},
//		error: function (msg) {
//			alert("GetPatientDetailInfo出错啦！");
//		}
//	});
//}
//
///**********************重置信息************************/
//function ResetInfo() {
//	document.getElementById("AlertUserName").style.display = "none";
//	document.getElementById("AlertSex").style.display = "none";
//	document.getElementById("AlertBirth").style.display = "none";
//	document.getElementById("AlertID").style.display = "none";
//	document.getElementById("AlertPhone").style.display = "none";
//	document.getElementById("AlertHeight").style.display = "none";
//	document.getElementById("AlertWeight").style.display = "none";
//	document.getElementById("AlertEmergencyPhone").style.display = "none";
//
//	if (localStorage.getItem("NewPatientFlag") == 'true') {
//		//alert('Get new PID.');
//		GetNewPatientID();
//		//localStorage.setItem('NewPatientFlag',true);
//	}
//	else {
//				
//		//localStorage.setItem('NewPatientFlag',false);
//		GetDetailInfo(UserId);
//		GetBasicInfo(UserId);
//		GetUserBasicInfo(UserId);
//	}
//}
//
///**********************保存信息************************/
//function SaveInfo() {
//	var UserName = document.getElementById("UserName").value;
//	var Gender = document.getElementById("SexType").value;
//	var Birthday = document.getElementById("Birthday").value;
//	var Height = document.getElementById("Height").value;
//	var Weight = document.getElementById("Weight").value;
//	var PhoneNumber = document.getElementById("PhoneNumber").value;
//	var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
//	var lengthIDNo = $("#IDNo").val().length;
//	var reg = /^\d+(?=\.{0,1}\d+$|$)/
//	var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;	//2015-5-22 ZCY增加
//	var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;	//2015-5-22 ZCY增加
// 
//	if (Gender == "0" || Gender == "" || Birthday == "" || UserName == "")	//2015-5-22 ZCY更改
//	{
//		//alert("打*为必填信息，请完善基本信息！");
//		if (UserName == "") {
//			document.getElementById("AlertUserName").style.display = "block";
//		}
//		else {
//			document.getElementById("AlertUserName").style.display = "none";
//		}
//		if (Gender == "0" || Gender == "") {
//			//document.getElementById("SexStyle").style.display = "block";
//			document.getElementById("AlertSex").style.display = "block";
//		}
//		else {
//			//document.getElementById("SexStyle").style.display = "none";
//			document.getElementById("AlertSex").style.display = "none";
//		}
//		if (Birthday == "") {
//			//document.getElementById("BirthStyle").style.display = "block";
//			document.getElementById("AlertBirth").style.display = "block";
//		}
//		else {
//			//document.getElementById("BirthStyle").style.display = "none";
//			document.getElementById("AlertBirth").style.display = "none";
//		}
//		return false;
//	}
//	else
//	{
//		document.getElementById("AlertUserName").style.display = "none";
//		document.getElementById("AlertSex").style.display = "none";
//		document.getElementById("AlertBirth").style.display = "none";
//	}
//	
//	if(!reg.test(Height) && Height != ""){ 
//        //alert("身高格式不正确，请重新输入!");
//		document.getElementById("AlertHeight").style.display = "block";
//    } 
//	else 
//	{
//		document.getElementById("AlertHeight").style.display = "none";
//	}
//	
//	if(!reg.test(Weight) && Weight != ""){
//        //alert("体重格式不正确，请重新输入!");
//		document.getElementById("AlertWeight").style.display = "block";
//    } 
//	else
//	{
//		document.getElementById("AlertWeight").style.display = "none";
//	}
//	
//	if (lengthIDNo != 15 && lengthIDNo != 18 && lengthIDNo != 0)	//2015-5-22 ZCY更改
//	{
//		//alert("证件号码格式不正确，请重新输入！");
//		//document.getElementById("IDStyle").style.display = "block";
//		document.getElementById("AlertID").style.display = "block";
//	}
//	else
//	{
//		document.getElementById("AlertID").style.display = "none";
//	}
//	
//	if (!isMob.test(PhoneNumber) && !isPhone.test(PhoneNumber) && PhoneNumber != "")
//	{
//		//alert("联系电话格式不正确，请重新输入！");
//		document.getElementById("AlertPhone").style.display = "block";
//	}
//	else
//	{
//		document.getElementById("AlertPhone").style.display = "none";
//	}
//	
//	if (!isMob.test(EmergencyContactPhoneNumber) && !isPhone.test(EmergencyContactPhoneNumber) && EmergencyContactPhoneNumber != "")
//	{
//		//alert("紧急联系电话格式不正确，请重新输入！");
//		document.getElementById("AlertEmergencyPhone").style.display = "block";
//	}
//	else
//	{
//		document.getElementById("AlertEmergencyPhone").style.display = "none";
//	}
//	
//	if (Gender != "0" && Gender != "" && Birthday != "" && UserName != "" && (reg.test(Height) || Height == "") && (reg.test(Weight) || Weight == "") && (lengthIDNo == 15 || lengthIDNo == 18 || lengthIDNo == 0) && (isMob.test(PhoneNumber) || isPhone.test(PhoneNumber) || PhoneNumber == "") && (isMob.test(EmergencyContactPhoneNumber) || isPhone.test(EmergencyContactPhoneNumber) || EmergencyContactPhoneNumber == ""))
//	{
//		var IDNo = document.getElementById("IDNo").value;
//		var BloodType = document.getElementById("AboBloodType").value;
//		//var Height = document.getElementById("Height").value;
//		//var Weight = document.getElementById("Weight").value;
//		var InsuranceType = document.getElementById("InsuranceType").value;
//		//var InsuranceType = $("#InsuranceType").find("option:selected").text();
//		if(InsuranceType == "")
//		{
//			InsuranceType = 0;
//		}
//		//var PhoneNumber = document.getElementById("PhoneNumber").value;
//		var HomeAddress = document.getElementById("HomeAddress").value;
//		var Nationality = document.getElementById("Nationality").value;
//		var Occupation = document.getElementById("Occupation").value;
//		var EmergencyContact = document.getElementById("EmergencyContact").value;
//		//var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
//		var DoctorId = localStorage.getItem("DoctorId");
//		var InvalidFlag = document.getElementById("InvalidFlag").value;
//		/*
//		var revUserId = "zcy";
//		var TerminalName = "zcy-PC";
//		var TerminalIP = "10.12.43.35";
//		var DeviceType = "1";*/
//		var ItemSeq = "1";
//		var Description = null;
//		var SortNo = "1";
//		var Birthday = Birthday.replace("-", "");
//		var Birthday = Birthday.replace("-", "");
//		UserId = localStorage.getItem("PatientId");
//		//var UserName =$('#UserName').val();
//		if (localStorage.getItem("NewPatientFlag") == 'true') {
//
//			InvalidFlag = 0;
//			SetPsDoctorDetailOnPat("HM1", UserId,"",1);
//			localStorage.setItem('NewPatientFlag',false);
//		}
//		SetMstUser(UserId, UserName);
//		SetBasicInfo(UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType);
//		
//		var Flag = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact001_1", ItemSeq, IDNo, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag1 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact001_2", ItemSeq, Occupation, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag2 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact001_3", ItemSeq, Nationality, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag3 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact002_1", ItemSeq, PhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag4 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact002_2", ItemSeq, HomeAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag5 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact002_3", ItemSeq, EmergencyContact, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag6 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "Contact", "Contact002_4", ItemSeq, EmergencyContactPhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag7 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "BodySigns", "Height", ItemSeq, Height, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag8 = document.getElementById("Flag").value;
//		SetDetailInfo(UserId, "BodySigns", "Weight", ItemSeq, Weight, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
//		var Flag9 = document.getElementById("Flag").value;
//
//		/*if (Flag == "true" && Flag1 == "true" && Flag2 == "true" && Flag3 == "true" && Flag4 == "true" && Flag5 == "true" && Flag6 == "true" && Flag7 == "true" && Flag8 == "true" && Flag9 == "true") {
//			alert("基本信息保存成功！")
//		}
//		else {
//			alert("基本信息保存失败！")
//		}*/
//	}
//}
//
//
//
////获取全部基本信息
//function GetUserBasicInfo(UserId) {
//	$.ajax({
//		type: "POST",
//		dataType: "xml",
//		timeout: 30000,
//		url: 'http://' + serverIP + '/' + serviceName + '/GetUserBasicInfo',
//		async: false,
//		data:
//		{
//			UserId: UserId
//		},
//		beforeSend: function () {
//		},
//		success: function (result) {
//			var DoctorId = $(result).find("PatientALLBasicInfo").find("DoctorId").text();
//			var InvalidFlag = $(result).find("PatientALLBasicInfo").find("InvalidFlag").text();
//			$("#DoctorId").val(DoctorId);
//			$("#InvalidFlag").val(InvalidFlag);
//		},
//		error: function (msg) {
//			alert("GetPatBasicInfo出错啦！");
//		}
//	});
//}
////保存基本信息到Ps.BasicInfo
//function SetBasicInfo(UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType) {
//	$.ajax({
//		type: "POST",
//		dataType: "xml",
//		timeout: 30000,
//		url: 'http://' + serverIP + '/' + serviceName + '/SetPatBasicInfo',
//		async: false,
//		data:
//		{
//			UserId: UserId,
//			UserName: UserName,
//			Birthday: Birthday,
//			Gender: Gender,
//			BloodType: BloodType,
//			IDNo: IDNo,
//			DoctorId: DoctorId,
//			InsuranceType: InsuranceType,
//			InvalidFlag: InvalidFlag,
//			revUserId: revUserId,
//			TerminalName: TerminalName,
//			TerminalIP: TerminalIP,
//			DeviceType: DeviceType
//		},
//		beforeSend: function () {
//		},
//		success: function (result) {
//			var Flag = $(result).find("boolean ").text();
//			$("#Flag").val(Flag);
//		},
//		error: function (msg) {
//			alert("SetPatBasicInfo出错啦！");
//		}
//	});
//}
//
////保存详细信息到PsDetailInfo
//function SetDetailInfo(Patient, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType) {
//	$.ajax({
//		type: "POST",
//		dataType: "xml",
//		timeout: 30000,
//		url: 'http://' + serverIP + '/' + serviceName + '/SetPatBasicInfoDetail',
//		async: false,
//		data:
//		{
//			Patient: Patient,
//			CategoryCode: CategoryCode,
//			ItemCode: ItemCode,
//			ItemSeq: ItemSeq,
//			Value: Value,
//			Description: Description,
//			SortNo: SortNo,
//			revUserId: revUserId,
//			TerminalName: TerminalName,
//			TerminalIP: TerminalIP,
//			DeviceType: DeviceType
//		},
//		beforeSend: function () {
//		},
//		success: function (result) {
//			Flag = $(result).find("boolean ").text();
//			$("#Flag").val(Flag);
//		},
//		error: function (msg) {
//			alert("SetPatBasicInfoDetail出错啦！");
//		}
//	});
//}



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
								 //增加下拉框  
								 if(OptionCategory!="")
								 {
									  if(ControlType==7)
									  {
										  if (OptionCategory == "Cm.MstHypertensionDrug")
										  {
											//高血压药物
											OptionList = GetHypertensionDrugTypeNameList(Value);
										  }
										  if (OptionCategory == "Cm.MstDiabetesDrug")
										  {
											//糖尿病药物
											OptionList = GetDiabetesDrugTypeNameList(Value);
										  }
										  if (OptionCategory == "")
										  {
											//合并用药
											OptionList = GetOptionList(OptionCategory,Value);
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
										var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist">' + OptionList + '</select></div>';
										//var ModuleDetailInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist">' + OptionList + '</select></div>';							
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
						.attr("data-role", "none")
						.css("width", "78%");
						
					$(".chosen-container li input").attr("data-role", "none");
						
					$(".chzn-select").attr("disabled","disabled");
					$(".dropdrowlist").attr("disabled","disabled");
					$(".dropdownlist").attr("disabled","disabled");
					$(".textbox").attr("disabled","disabled");
					$("#saveModuleInfo").attr("disabled","disabled");			    				
					$(".mainInfo").trigger("create");  //jquery mobile渲染	
				
			   }, 
		       error: function(msg) {alert("GetItemInfoByPIdAndModule Error!");}
		     });
		  }
		  
		  //function GetItemInfoByPIdAndModule(UserId,CategoryCode,CategoryName){
//			$.ajax({  
//		        type: "POST",
//		        dataType: "xml",
//				timeout: 30000,  
//				url: 'http://'+ serverIP +'/'+serviceName+'/GetItemInfoByPIdAndModule',
//				async:false,
//		        data: {PatientId:UserId,CategoryCode:CategoryCode},
//				beforeSend: function(){},
//		        success: function(result) { 
//					
//					 $(".mainInfo").append('<h2>' + CategoryName + '详细信息</h2>');
//					 $(result).find('Table1').each(function() {
//						 var ItemCode = $(this).find("ItemCode").text();
//						 if(ItemCode!="InvalidFlag")
//						 {
//							 if(ItemCode=="Doctor")
//							 {
//								 var ItemName = $(this).find("ItemName").text(); //负责医生
//								 //alert(ItemName);
//								 var ParentCode = $(this).find("ParentCode").text(); //ParentCode：为空，没有父级标题
//								 var Value = $(this).find("Value").text(); //暂时不用
//								 var Description = $(this).find("Description").text(); //负责医生姓名，不可编辑
//								 var DoctorInfo = '<div data-role="fieldcontain"><label>' + ItemName + '</label><label>' + Description + '</label></div>';
//								 $(".mainInfo").append(DoctorInfo);
//							 }
//							 else
//							 {
//								 var ItemName = $(this).find("ItemName").text(); //问卷内容
//								 var ParentCode = $(this).find("ParentCode").text(); //ParentCode
//								 var ControlType = $(this).find("ControlType").text(); //
//								 var OptionCategory = $(this).find("OptionCategory").text(); //
//								 //alert(OptionCategory);
//								 var Value = $(this).find("Value").text(); //
//								 var Content = $(this).find("Content").text(); //
//								 //增加下拉框  
//								 if(OptionCategory!="")
//								 {
//								 	var OptionList = GetOptionList(OptionCategory,Value);
//								 }
//								 
//								 
//								 if(ParentCode=="")
//								 {
//									 var ModuleInfo = '<label><strong>' + ItemName + '</strong></label>';
//									 $(".mainInfo").append(ModuleInfo);
//		
//								 }
//								 else
//								 {	
//								 	if(ControlType==1)	//下拉框
//									{
//										var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdrowlist">' + OptionList + '</select></div>';							
//									}
//									else		//自由文本
//									{	
//									 	var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<input type="text" class="textbox" value=' + Content + '></div>';
//									}
//									$(".mainInfo").append(ModuleInfo);
//								 }
//							
//							 
//						 }	
//					 }
//					});	
//					$(".dropdrowlist").attr("disabled","disabled");
//					$(".textbox").attr("disabled","disabled");
//					$("#saveModuleInfo").attr("disabled","disabled");			    				
//					$(".mainInfo").trigger("create");  //jquery mobile渲染	
//				
//			   }, 
//		       error: function(msg) {alert("Error!");}
//		     });
//		  }
		
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
				 var test = $(result).find('Table1').length;
				 test= 0;
				 //alert(test);
					if(test != 0)
					{
						//alert("13");
						//不为空的操作 已经购买过M1
					 $(result).find('Table1').each(function() {
						 var ItemCode = $(this).find("ItemCode").text();
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
								 var value;			 
								 if(ParentCode=="")
								 {
									 //该条记录为父级标题，无需执行任何操作
								 }
								 else
								 {						 	
								 	//按ItemCode从界面对应元素取值
									var div = $("."+ItemCode);	
									if(div.find('select').length)
									{
										//alert("1");
										 value = div.find('select').val();
									}
									else
									{
										value = div.find('input').val();
									}
								 	//更新数据
									SetPatBasicInfoDetail(CategoryCode,ItemCode,ItemSeq,value,Description,SortNo);
								 }					
							 }
						 }	
						 		 
					})
					
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
									if(ControlType==7)
									{
										var DrugType = div.find('select').val();
										if (OptionCategory == "Cm.MstHypertensionDrug")
										{
										  //高血压药物
										 	var DrugName = div.find('#HypertensionOptionDetailList').val();
										}
										if (OptionCategory == "Cm.MstDiabetesDrug")
										{
										  //糖尿病药物
										  	var DrugName = div.find('#DiabetesOptionDetailList').val();
										}
										value = DrugType + ',' + DrugName;
									}
									else if(ControlType==2)
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
			
			
			//修改健康模块中的一条信息
			function SetPatBasicInfoDetail(CategoryCode,ItemCode,ItemSeq,value,Description,SortNo){
				
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

					 $(".mainInfo").append('<h2>' + CategoryName + '详细信息</h2>');
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
											var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" onChange="GetHypertensionOptionDetailList(this.value)">' + OptionList + '</select>' + '<select class="dropdownlist" id="HypertensionOptionDetailList">' + OptionDetailList + '</select></div>';		
										}
										if (OptionCategory == "Cm.MstDiabetesDrug")
										{
										  //糖尿病药物
											var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist" onChange="GetDiabetesOptionDetailList(this.value)">' + OptionList + '</select>' + '<select class="dropdownlist" id="DiabetesOptionDetailList">' + OptionDetailList + '</select></div>';		
										}
										if (OptionCategory == "")
										{
										  //合并用药
										  var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="dropdownlist">' + OptionList + '</select>' + '<select class="dropdownlist" id="DiabetesOptionDetailList">' + OptionDetailList + '</select></div>';	
										}
									}
									if(ControlType==2)		//复选框
									{	
									 	var ModuleInfo = '<div class="' + ItemCode + '" data-role="fieldcontain"><label>' + ItemName + '</label>' + '<select class="chzn-select" multiple data-role="none">' + OptionList + '</select></div>';
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
						.attr("data-role", "none")
						.css("width", "78%")
						.css("height", "40px");
					$(".dropdownlist")
						.attr("data-role", "none")
						.css("width", "25%")
						.css("height", "40px");
					$(".dropdrowlist")
						.attr("data-role", "none")
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
		  
		  function GetHypertensionOptionDetailList(type)
		  {
			OptionDetailList = GetHypertensionDrugNameList(type,"");
			$("#HypertensionOptionDetailList option").remove();
			$("#HypertensionOptionDetailList").append(OptionDetailList);
		  }
		  
		  function GetDiabetesOptionDetailList(type)
		  {
			OptionDetailList = GetDiabetesDrugNameList(type,"");
			$("#DiabetesOptionDetailList option").remove();
			$("#DiabetesOptionDetailList").append(OptionDetailList);
		  }