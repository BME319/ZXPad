/**********************全局变量************************/
 //var UserId = "PID201505210002";
 //var serverIP = '10.12.43.94:8089';
 	var UserId = localStorage.getItem("PatientId");
 var serviceName = 'Services.asmx';
 var ImageAddressIP = "http://192.168.191.6/";
 var ImageAddressFile = "CDFiles/PersonalPhoto/Patient";
 var ImageAddress = ImageAddressIP + ImageAddressFile + "/" + UserId + ".jpg";

/**********************初始页面************************/
$(document).ready(function(event){
	document.getElementById("SexStyle").style.display = "none";
	document.getElementById("AlertSex").style.display = "none";
	document.getElementById("BirthStyle").style.display = "none";
	document.getElementById("AlertBirth").style.display = "none";
	document.getElementById("IDStyle").style.display = "none";
	document.getElementById("AlertID").style.display = "none";
	document.getElementById("PhoneStyle").style.display = "none";	//2015-5-22 ZCY增加
	document.getElementById("AlertPhone").style.display = "none";	//2015-5-22 ZCY增加
		
	GetTypeList("SexType");
	GetTypeList("AboBloodType");
	GetTypeList("InsuranceType");

	GetDetailInfo(UserId);
 	GetBasicInfo(UserId);
	GetUserBasicInfo(UserId);
});

//获取下拉框内容
function GetTypeList (Category)
{
	$("#"+Category).append('<option value=0>--请选择--</option>');
	
	$.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetTypeList',
    async: false,
	data: 
	{
		Category: Category
	},
    beforeSend: function() {
    },
    success: function(result) {
		$(result).find('Table1').each(function() {
			var Type = $(this).find("Type").text();
			var Name = $(this).find("Name").text();
			$("#"+Category).append('<option value='+Type+'>'+Name+'</option>');
		})	  
    },
    error: function(msg) {
      alert("GetTypeList出错啦！");
    }
  });
}

//获取病人基本信息
function GetBasicInfo (UserId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetPatBasicInfo',
    async: false,
	data: 
	{
		UserId: UserId
	},
    beforeSend: function() {
   },
    success: function(result) {      	  
		var UserId = $(result).find("PatientBasicInfo").find("UserId").text();
		var UserName = $(result).find("PatientBasicInfo").find("UserName").text();
        var Gender = $(result).find("PatientBasicInfo").find("Gender").text();
        var BloodType = $(result).find("PatientBasicInfo").find("BloodType").text();
        var InsuranceType = $(result).find("PatientBasicInfo").find("InsuranceType").text();
        var Birthday = $(result).find("PatientBasicInfo").find("Birthday").text();
        var BloodTypeText = $(result).find("PatientBasicInfo").find("BloodTypeText").text();
        var InsuranceTypeText = $(result).find("PatientBasicInfo").find("InsuranceTypeText").text();
        var Module = $(result).find("PatientBasicInfo").find("Module").text();

		document.getElementById('UserId').innerText = UserId;
		document.getElementById('UserName').innerText = UserName;
		var Birthday = Birthday.substring(0,4) + "-" + Birthday.substring(4,6) + "-" + Birthday.substring(6,8);
		$("#Birthday").val(Birthday);
		$("#SexType").val(Gender);
		$('#SexType').selectmenu('refresh');
		$("#AboBloodType").val(BloodType); 
		$('#AboBloodType').selectmenu('refresh');
		$("#InsuranceType").val(InsuranceType); 
		$('#InsuranceType').selectmenu('refresh');
    },
    error: function(msg) {
      alert("GetPatBasicInfo出错啦！");
    }
  });
}

//获取病人详细信息
function GetDetailInfo (UserId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetPatientDetailInfo',
    async: false,
	data: 
	{
		UserId: UserId
	},
    beforeSend: function() {
   },
    success: function(result) {          	  
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

		if (PhotoAddress != ImageAddress)
		{
			PhotoAddress = ImageAddressIP + ImageAddressFile + '/add.jpg';
		}
		$("#Photo").attr("src",PhotoAddress);
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
    error: function(msg) {
      alert("GetPatientDetailInfo出错啦！");
    }
  });
}

/**********************重置信息************************/
function ResetInfo()
{
	var UserId = document.getElementById("UserId").innerText;
	GetDetailInfo(UserId);
 	GetBasicInfo(UserId);
}

/**********************保存信息************************/
function SaveInfo()
{
	var UserName = document.getElementById("UserName").innerText;
	var Gender = document.getElementById("SexType").value;
	var Birthday = document.getElementById("Birthday").value;
	var PhoneNumber = document.getElementById("PhoneNumber").value;
	var lengthIDNo = $("#IDNo").val().length;
	var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;	//2015-5-22 ZCY增加
	var isMob =/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;	//2015-5-22 ZCY增加

	if (Gender == "0" || Birthday == "")	//2015-5-22 ZCY更改
	{
		alert("打*为必填信息，请完善基本信息！");
		if (Gender == "0") 
		{
			document.getElementById("SexStyle").style.display = "block";
			document.getElementById("AlertSex").style.display = "block";
		}
		else
		{
			document.getElementById("SexStyle").style.display = "none";
			document.getElementById("AlertSex").style.display = "none";
		}
		if (Birthday == "") 
		{
			document.getElementById("BirthStyle").style.display = "block";
			document.getElementById("AlertBirth").style.display = "block";
		}	
		else
		{
			document.getElementById("BirthStyle").style.display = "none";
			document.getElementById("AlertBirth").style.display = "none";
		}
		return false;
	}
	else if(lengthIDNo != 15 && lengthIDNo != 18)	//2015-5-22 ZCY更改
	{
		alert("证件号码格式不正确，请重新输入！");
		document.getElementById("IDStyle").style.display = "block";
		document.getElementById("AlertID").style.display = "block";	
	}
	else if (isMob.test(PhoneNumber)||isPhone.test(PhoneNumber))	//2015-5-22 ZCY更改
	{
		document.getElementById("SexStyle").style.display = "none";
		document.getElementById("AlertSex").style.display = "none";
		document.getElementById("BirthStyle").style.display = "none";
		document.getElementById("AlertBirth").style.display = "none";
		document.getElementById("IDStyle").style.display = "none";
		document.getElementById("AlertID").style.display = "none";
		
		var r = confirm("是否确定保存");
		if (r==true)
  		{
			var IDNo = document.getElementById("IDNo").value;
			var BloodType = document.getElementById("AboBloodType").value;
			var Height = document.getElementById("Height").value;
			var Weight = document.getElementById("Weight").value;
			var InsuranceType = document.getElementById("InsuranceType").value;
			//var InsuranceType = $("#InsuranceType").find("option:selected").text();
			var PhoneNumber = document.getElementById("PhoneNumber").value;
			var HomeAddress = document.getElementById("HomeAddress").value;
			var Nationality = document.getElementById("Nationality").value;
			var Occupation = document.getElementById("Occupation").value;
			var EmergencyContact = document.getElementById("EmergencyContact").value;
			var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
			var DoctorId = document.getElementById("DoctorId").value;
			var InvalidFlag = document.getElementById("InvalidFlag").value;
			var revUserId = "zcy";
			var TerminalName = "zcy-PC";
			var TerminalIP = "10.12.43.35";
			var DeviceType = "1";
			var ItemSeq = "1";
			var Description = null;
			var SortNo = "1";
			var Birthday = Birthday.replace("-","");
			var Birthday = Birthday.replace("-","");
			
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

			if (Flag == "true" && Flag1 == "true" && Flag2 == "true" && Flag3 == "true" && Flag4 == "true" && Flag5 == "true" && Flag6 == "true" && Flag7 == "true" && Flag8 == "true" && Flag9 == "true")
			{
				alert("基本信息保存成功！")
			}
			else
			{
				alert("基本信息保存失败！")
			}
  		}
	}
	
	else	//2015-5-22 ZCY更改
	{
		alert("联系电话格式不正确，请重新输入！");
		document.getElementById("PhoneStyle").style.display = "block";
		document.getElementById("AlertPhone").style.display = "block";	
	}
}

//获取全部基本信息
function GetUserBasicInfo (UserId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetUserBasicInfo',
    async: false,
	data: 
	{
		UserId: UserId
	},
    beforeSend: function() {
   },
    success: function(result) {      	  
		var DoctorId = $(result).find("PatientALLBasicInfo").find("DoctorId").text();
		var InvalidFlag = $(result).find("PatientALLBasicInfo").find("InvalidFlag").text();
		$("#DoctorId").val(DoctorId);
		$("#InvalidFlag").val(InvalidFlag);
    },
    error: function(msg) {
      alert("GetPatBasicInfo出错啦！");
    }
  });
}
//保存基本信息到Ps.BasicInfo
function SetBasicInfo (UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetPatBasicInfo',
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
    beforeSend: function() {
   },
    success: function(result) {      	  
		var Flag = $(result).find("boolean ").text();
		$("#Flag").val(Flag);
    },
    error: function(msg) {
      alert("SetPatBasicInfo出错啦！");
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