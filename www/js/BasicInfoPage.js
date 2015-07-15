/**********************全局变量************************/
//var UserId = "PID201505210002";
//var serverIP = '10.12.43.94:8089';
  localStorage.setItem('DownloadAddress',"http://10.13.22.66:8011/cdmisAPP-debug.apk") ;
  var UserId = localStorage.getItem("PatientId");
  var serviceName = 'Services.asmx';
  var ImageAddressIP = "http://10.13.22.66:8088";  //webserviceIP
  var ImageAddressFile = "PersonalPhoto";
  //var ImageAddress = ImageAddressIP + ImageAddressFile + "/" + UserId + ".jpg";
  var DoctorId = localStorage.getItem('DoctorId');
  var TerminalIP = window.localStorage.getItem("TerminalIP");
  var TerminalName = window.localStorage.getItem("TerminalName");
  var DeviceType = window.localStorage.getItem("DeviceType");
  var revUserId  = window.localStorage.getItem("UserId");

/**********************初始页面************************/
$(document).ready(function (event) {
	
	document.getElementById("AlertUserName").style.display = "none";
	document.getElementById("AlertSex").style.display = "none";
	document.getElementById("AlertBirth").style.display = "none";
	document.getElementById("AlertID").style.display = "none";
	document.getElementById("AlertPhone").style.display = "none";	//2015-5-22 ZCY增加
	document.getElementById("AlertHeight").style.display = "none";	//2015-6-3 ZCY增加
	document.getElementById("AlertWeight").style.display = "none";	//2015-6-3 ZCY增加
	document.getElementById("AlertEmergencyPhone").style.display = "none";//2015-6-3 ZCY增加
	
	GetTypeList("SexType");
	GetTypeList("AboBloodType");
	GetInsuranceTypeList();

	GetDetailInfo(UserId);
	GetBasicInfo(UserId);
	GetUserBasicInfo(UserId);
	
});

/**********************重置信息************************/
function ResetInfo()
{
	document.getElementById("AlertUserName").style.display = "none";
	document.getElementById("AlertSex").style.display = "none";
	document.getElementById("AlertBirth").style.display = "none";
	document.getElementById("AlertID").style.display = "none";
	document.getElementById("AlertPhone").style.display = "none";
	document.getElementById("AlertHeight").style.display = "none";
	document.getElementById("AlertWeight").style.display = "none";
	document.getElementById("AlertEmergencyPhone").style.display = "none";

	GetDetailInfo(UserId);
	GetBasicInfo(UserId);
	GetUserBasicInfo(UserId);
}

/**********************保存信息************************/
function SaveInfo()
{
	var UserId = localStorage.getItem("PatientId");
	var UserName = document.getElementById("UserName").value;
	var Gender = document.getElementById("SexType").value;
	var Birthday = document.getElementById("Birthday").value;
	var Height = document.getElementById("Height").value;
	var Weight = document.getElementById("Weight").value;
	var PhoneNumber = document.getElementById("PhoneNumber").value;
	var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
	var lengthIDNo = $("#IDNo").val().length;
	var reg = /^\d+(?=\.{0,1}\d+$|$)/
	var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;	//2015-5-22 ZCY增加
	//var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;	//2015-5-22 ZCY增加
	var isMob = /^1[3|4|5|7|8][0-9]\d{8}$/;
 
	if (Gender == "0" || Gender == "" || Birthday == "" || UserName == "")	//2015-5-22 ZCY更改
	{
		if (UserName == "") {
			document.getElementById("AlertUserName").style.display = "block";
		}
		else {
			document.getElementById("AlertUserName").style.display = "none";
		}
		if (Gender == "0" || Gender == "") {
			//document.getElementById("SexStyle").style.display = "block";
			document.getElementById("AlertSex").style.display = "block";
		}
		else {
			//document.getElementById("SexStyle").style.display = "none";
			document.getElementById("AlertSex").style.display = "none";
		}
		if (Birthday == "") {
			//document.getElementById("BirthStyle").style.display = "block";
			document.getElementById("AlertBirth").style.display = "block";
		}
		else {
			//document.getElementById("BirthStyle").style.display = "none";
			document.getElementById("AlertBirth").style.display = "none";
		}
		return false;
	}
	else
	{
		document.getElementById("AlertUserName").style.display = "none";
		document.getElementById("AlertSex").style.display = "none";
		document.getElementById("AlertBirth").style.display = "none";
	}
	
	if(!reg.test(Height) && Height != ""){ 
		document.getElementById("AlertHeight").style.display = "block";
    } 
	else 
	{
		document.getElementById("AlertHeight").style.display = "none";
	}
	
	if(!reg.test(Weight) && Weight != ""){
		document.getElementById("AlertWeight").style.display = "block";
    } 
	else
	{
		document.getElementById("AlertWeight").style.display = "none";
	}
	
	if (lengthIDNo != 15 && lengthIDNo != 18 && lengthIDNo != 0)	//2015-5-22 ZCY更改
	{
		document.getElementById("AlertID").style.display = "block";
	}
	else
	{
		document.getElementById("AlertID").style.display = "none";
	}
	
	if (!isMob.test(PhoneNumber) && !isPhone.test(PhoneNumber) && PhoneNumber != "")
	{
		document.getElementById("AlertPhone").style.display = "block";
	}
	else
	{
		document.getElementById("AlertPhone").style.display = "none";
	}
	
	if (!isMob.test(EmergencyContactPhoneNumber) && !isPhone.test(EmergencyContactPhoneNumber) && EmergencyContactPhoneNumber != "")
	{
		document.getElementById("AlertEmergencyPhone").style.display = "block";
	}
	else
	{
		document.getElementById("AlertEmergencyPhone").style.display = "none";
	}
	
	if (Gender != "0" && Gender != "" && Birthday != "" && UserName != "" && (reg.test(Height) || Height == "") && (reg.test(Weight) || Weight == "") && (lengthIDNo == 15 || lengthIDNo == 18 || lengthIDNo == 0) && (isMob.test(PhoneNumber) || isPhone.test(PhoneNumber) || PhoneNumber == "") && (isMob.test(EmergencyContactPhoneNumber) || isPhone.test(EmergencyContactPhoneNumber) || EmergencyContactPhoneNumber == ""))
	{
		$.mobile.loading('show', {  
			text: '保存信息中...', //加载器中显示的文字  
			textVisible: true, //是否显示文字  
			theme: 'a',        //加载器主题样式a-e  
			textonly: false,   //是否只显示文字  
			html: ""           //要显示的html内容，如图片等  
		}); 
		var IDNo = document.getElementById("IDNo").value;
		var BloodType = document.getElementById("AboBloodType").value;
		//var Height = document.getElementById("Height").value;
		//var Weight = document.getElementById("Weight").value;
		var InsuranceType = document.getElementById("InsuranceType").value;
		//var InsuranceType = $("#InsuranceType").find("option:selected").text();
		if(InsuranceType == "")
		{
			InsuranceType = 0;
		}
		if(BloodType == "")
		{
			BloodType = 0;
		}
		//var PhoneNumber = document.getElementById("PhoneNumber").value;
		var HomeAddress = document.getElementById("HomeAddress").value;
		var Nationality = document.getElementById("Nationality").value;
		var Occupation = document.getElementById("Occupation").value;
		var EmergencyContact = document.getElementById("EmergencyContact").value;
		//var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
		var DoctorId = localStorage.getItem("DoctorId");
		//var InvalidFlag = document.getElementById("InvalidFlag").value;
		//var PhoneNo = document.getElementById("PhoneNo").value;
		/*
		var revUserId = "zcy";
		var TerminalName = "zcy-PC";
		var TerminalIP = "10.12.43.35";
		var DeviceType = "1";*/
		var ItemSeq = "1";
		var Description = null;
		var SortNo = "1";
		var Birthday = Birthday.replace("-", "");
		var Birthday = Birthday.replace("-", "");
		UserId = localStorage.getItem("PatientId");
		/*if (localStorage.getItem("NewPatientFlag") == 'true') {

			InvalidFlag = 0;
			SetPsDoctorDetailOnPat("HM1", UserId,"",1);
			localStorage.setItem('NewPatientFlag',false);
		}*/
		var InvalidFlag = 0;
		SetBasicInfo(UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact001_1", ItemSeq, IDNo, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag1 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact001_2", ItemSeq, Occupation, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag2 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact001_3", ItemSeq, Nationality, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag3 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_1", ItemSeq, PhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag4 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_2", ItemSeq, HomeAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag5 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_3", ItemSeq, EmergencyContact, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag6 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_4", ItemSeq, EmergencyContactPhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag7 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "BodySigns", "Height", ItemSeq, Height, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag8 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "BodySigns", "Weight", ItemSeq, Weight, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag9 = document.getElementById("Flag").value;

		/*if (Flag == "true" && Flag1 == "true" && Flag2 == "true" && Flag3 == "true" && Flag4 == "true" && Flag5 == "true" && Flag6 == "true" && Flag7 == "true" && Flag8 == "true" && Flag9 == "true") {
			alert("基本信息保存成功！")
		}
		else {
			alert("基本信息保存失败！")
		}*/
		setTimeout(function(){
			$.ajax({
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,
			  url: 'http://' + serverIP + '/' + serviceName + '/GetAllRoleMatch',
			  async: false,
			  data:
			  {
				  UserId: UserId
			  },
			  beforeSend: function () {
			  },
			  success: function (result) {
				  $(result).find('Table1').each(function () {
					  var RoleClass = $(this).find("RoleClass").text();
					  if(RoleClass != 'Patient')
					  {
						  SetDoctorInfo(UserId, UserName, Birthday, Gender, IDNo, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact001_1", ItemSeq, IDNo, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact001_2", ItemSeq, Occupation, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact001_3", ItemSeq, Nationality, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact002_1", ItemSeq, PhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact002_2", ItemSeq, HomeAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact002_3", ItemSeq, EmergencyContact, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "Contact", "Contact002_4", ItemSeq, EmergencyContactPhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "BodySigns", "Height", ItemSeq, Height, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  SetDoctorInfoDetail(UserId, "BodySigns", "Weight", ItemSeq, Weight, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
						  
					  }
				  })
				  $.mobile.loading('hide');
			  },
			  error: function (msg) {
				  $.mobile.loading('hide');
				  alert("GetAllRoleMatch出错啦！");
			  }
		  });
		},1000);
	}
}

//获取病人基本信息
function GetBasicInfo(UserId) {
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetPatBasicInfo',
		async: false,
		data:
		{
			UserId: UserId
		},
		beforeSend: function () {
		},
		success: function (result) {
			var UserName = $(result).find("PatientBasicInfo").find("UserName").text();
			var Gender = $(result).find("PatientBasicInfo").find("Gender").text();
			var BloodType = $(result).find("PatientBasicInfo").find("BloodType").text();
			var InsuranceType = $(result).find("PatientBasicInfo").find("InsuranceType").text();
			var Birthday = $(result).find("PatientBasicInfo").find("Birthday").text();
			var BloodTypeText = $(result).find("PatientBasicInfo").find("BloodTypeText").text();
			var InsuranceTypeText = $(result).find("PatientBasicInfo").find("InsuranceTypeText").text();
			var Module = $(result).find("PatientBasicInfo").find("Module").text();

			$("#UserId").val(UserId);
			$("#UserName").val(UserName);
			var Birthday = Birthday.substring(0, 4) + "-" + Birthday.substring(4, 6) + "-" + Birthday.substring(6, 8);
			$("#Birthday").val(Birthday);
			$("#SexType").val(Gender);
			$('#SexType').selectmenu('refresh');
			$("#AboBloodType").val(BloodType);
			$('#AboBloodType').selectmenu('refresh');
			$("#InsuranceType").val(InsuranceType);
			$('#InsuranceType').selectmenu('refresh');
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("GetPatBasicInfo出错啦！");
		}
	});
}

//获取病人详细信息
function GetDetailInfo(UserId) {
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetPatientDetailInfo',
		async: false,
		data:
		{
			UserId: UserId
		},
		beforeSend: function () {
		},
		success: function (result) {
			var UserId = $(result).find("PatientDetailInfo1").find("UserId").text();
			var PhoneNumber = $(result).find("PatientDetailInfo1").find("PhoneNumber").text();
			var HomeAddress = $(result).find("PatientDetailInfo1").find("HomeAddress").text();
			var Occupation = $(result).find("PatientDetailInfo1").find("Occupation").text();
			var Nationality = $(result).find("PatientDetailInfo1").find("Nationality").text();
			var EmergencyContact = $(result).find("PatientDetailInfo1").find("EmergencyContact").text();
			var EmergencyContactPhoneNumber = $(result).find("PatientDetailInfo1").find("EmergencyContactPhoneNumber").text();
			var PhotoAddress = $(result).find("PatientDetailInfo1").find("PhotoAddress").text();
			var Module = $(result).find("PatientDetailInfo1").find("Module").text();
			var IDNo = $(result).find("PatientDetailInfo1").find("IDNo").text();
			var Height = $(result).find("PatientDetailInfo1").find("Height").text();
			var Weight = $(result).find("PatientDetailInfo1").find("Weight").text();

			if (PhotoAddress == '') {
				PhotoAddress = ImageAddressIP + '/' + ImageAddressFile + '/add.jpg';
			}
			else 
			{
				PhotoAddress = ImageAddressIP + '/' + ImageAddressFile + '/'+PhotoAddress;
			}
			$("#Photo").attr("src", PhotoAddress);
			$("#PhoneNumber").val(PhoneNumber);
			$("#HomeAddress").val(HomeAddress);
			$("#Occupation").val(Occupation);
			$("#Nationality").val(Nationality);
			$("#EmergencyContact").val(EmergencyContact);
			$("#EmergencyContactPhoneNumber").val(EmergencyContactPhoneNumber);
			$("#IDNo").val(IDNo);
			$("#Height").val(Height);
			$("#Weight").val(Weight);

		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("GetPatientDetailInfo出错啦！");
		}
	});
}


//获取下拉框内容
function GetTypeList(Category) {
	$("#" + Category).append('<option value=0>--请选择--</option>');

	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetTypeList',
		async: false,
		data:
		{
			Category: Category
		},
		beforeSend: function () {
		},
		success: function (result) {
			$(result).find('Table1').each(function () {
				var Type = $(this).find("Type").text();
				var Name = $(this).find("Name").text();
				$("#" + Category).append('<option value=' + Type + '>' + Name + '</option>');
			})
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("GetTypeList出错啦！");
		}
	});
}

//获取医保下拉框内容
function GetInsuranceTypeList() {
	$("#InsuranceType").append('<option value=0>--请选择--</option>');

	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetInsuranceType',
		async: false,
		data:
		{
		},
		beforeSend: function () {
		},
		success: function (result) {
			$(result).find('Table1').each(function () {
				var Code = $(this).find("Code").text();
				var Name = $(this).find("Name").text();
				//alert(Code);
				//alert(Name);
				$("#InsuranceType").append('<option value=' + Code + '>' + Name + '</option>');
			})
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("GetInsuranceType出错啦！");
		}
	});
}

//获取全部基本信息
function GetUserBasicInfo(UserId) {
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetUserBasicInfo',
		async: false,
		data:
		{
			UserId: UserId
		},
		beforeSend: function () {
		},
		success: function (result) {
			var DoctorId = $(result).find("PatientALLBasicInfo").find("DoctorId").text();
			var InvalidFlag = $(result).find("PatientALLBasicInfo").find("InvalidFlag").text();
			$("#DoctorId").val(DoctorId);
			$("#InvalidFlag").val(InvalidFlag);
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("GetPatBasicInfo出错啦！");
		}
	});
}
//保存基本信息到Ps.BasicInfo
function SetBasicInfo(UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType) {
	//alert(UserId+'||'+UserName+'||'+Birthday+'||'+Gender+'||'+BloodType+'||'+IDNo+'||'+DoctorId+'||'+InsuranceType+'||'+InvalidFlag+'||'+revUserId+'||'+TerminalName+'||'+TerminalIP+'||'+DeviceType);
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetPatBasicInfo',
		async: false,
		data:
		{
			UserId: UserId,
			UserName: UserName,
			Birthday: Birthday,
			Gender: Gender,
			BloodType: BloodType,
			IDNo: IDNo,
			DoctorId: DoctorId,
			InsuranceType: InsuranceType,
			InvalidFlag: InvalidFlag,
			revUserId: revUserId,
			TerminalName: TerminalName,
			TerminalIP: TerminalIP,
			DeviceType: DeviceType
		},
		beforeSend: function () {
		},
		success: function (result) {
			var Flag = $(result).find("boolean ").text();
			$("#Flag").val(Flag);
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("SetPatBasicInfo出错啦！");
		}
	});
}

//保存基本信息到Ps.DoctorInfo
function SetDoctorInfo(UserId, UserName, Birthday, Gender, IDNo, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType) 
{
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetPsDoctor',
		async: false,
		data:
		{
			UserId: UserId,
			UserName: UserName,
			Birthday: Birthday,
			Gender: Gender,
			IDNo: IDNo,
			InvalidFlag: InvalidFlag,
			revUserId: revUserId,
			TerminalName: TerminalName,
			TerminalIP: TerminalIP,
			DeviceType: DeviceType
		},
		beforeSend: function () {
		},
		success: function (result) {
			var Flag = $(result).find("boolean ").text();
			$("#Flag").val(Flag);
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("SetPsDoctor出错啦！");
		}
	});
}

//保存详细信息到PsDetailInfo
function SetDetailInfo(Patient, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetPatBasicInfoDetail',
    async: false,
	data: 
	{
		Patient: Patient,
		CategoryCode: CategoryCode,
		ItemCode: ItemCode,
		ItemSeq: ItemSeq,
		Value: Value,
		Description: Description,
		SortNo: SortNo,
		revUserId: revUserId,
		TerminalName: TerminalName,
		TerminalIP: TerminalIP,
		DeviceType: DeviceType
	},
    beforeSend: function() {
   },
    success: function(result) {
		Flag = $(result).find("boolean ").text();
		$("#Flag").val(Flag);
    },
    error: function(msg) {
      alert("SetPatBasicInfoDetail出错啦！");
    }
  });
}

//保存详细信息到PsDoctorInfoDetail
function SetDoctorInfoDetail(Doctor, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, piUserId, piTerminalName, piTerminalIP, piDeviceType) {
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetDoctorInfoDetail',
		async: false,
		data:
		{
			Doctor: Doctor,
			CategoryCode: CategoryCode,
			ItemCode: ItemCode,
			ItemSeq: ItemSeq,
			Value: Value,
			Description: Description,
			SortNo: SortNo,
			piUserId: piUserId,
			piTerminalName: piTerminalName,
			piTerminalIP: piTerminalIP,
			piDeviceType: piDeviceType
		},
		beforeSend: function () {
		},
		success: function (result) {
			Flag = $(result).find("boolean ").text();
			$("#Flag").val(Flag);
		},
		error: function (msg) {
					  $.mobile.loading('hide');
			alert("SetDoctorInfoDetail出错啦！");
		}
	});
}

//显示加载器  
function ShowLoader() {  
    $.mobile.loading('show', {  
        text: 'Loading...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'a',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });  
}  
  
//隐藏加载器  
function HideLoader()  
{    
    $.mobile.loading('hide');  
}  