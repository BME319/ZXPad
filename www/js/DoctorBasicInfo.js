/**********************全局变量************************/
 //var DoctorId = "D003";
 //var serverIP = '10.12.43.94:8089';
 //var serviceName = 'Services.asmx';
 var DoctorId = localStorage.getItem("DoctorId");
 //var ImageAddressIP = "http://10.13.22.66:8088";  //webserviceIP
 var ImageAddressIP = "http://121.43.107.106:8088";  //webserviceIP
 var ImageAddressFile = "/PersonalPhoto";
 var ImageAddress = ImageAddressIP + ImageAddressFile + "/" + DoctorId + ".jpg";
 var pictureSource;   // picture source
 var destinationType; // sets the format of returned value
 var TerminalIP = window.localStorage.getItem("TerminalIP");
 var TerminalName = window.localStorage.getItem("TerminalName");
 var DeviceType = window.localStorage.getItem("DeviceType");
 var revUserId  = window.localStorage.getItem("UserId");
 
/**********************初始页面************************/
$(document).ready(function(event){
	GetDetailInfo(DoctorId);
 	GetBasicInfo(DoctorId);
	GetTypeList("SexType");
	$("#SexType").selectmenu("refresh");
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

//获取医生基本信息
function GetBasicInfo (DoctorId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetDoctorInfo',
    async: false,
	data: 
	{
		UserId: DoctorId
	},
    beforeSend: function() {
   },
    success: function(result) {      	  
		$(result).find('Table1').each(function() {
			var DoctorId = $(this).find("DoctorId").text();
			var DoctorName = $(this).find("DoctorName").text();
			var Birthday = $(this).find("Birthday").text();
			var Gender = $(this).find("Gender").text();
			
			document.getElementById('DoctorId').innerText = DoctorId;
			document.getElementById('DoctorName').innerText = DoctorName;
			document.getElementById('Birthday').innerText = Birthday;
//			switch (Gender)
//			{
//			case "1":
//			  SexType = "男性";
//			  break;
//			case "2":
//			  SexType = "女性";
//			  break;
//			case "3":
//			  SexType = "其他";
//			  break;
//			default:
//			  SexType = "未知";
//			}
			$("#SexType").val(Gender);
			$("#SexType").selectmenu("refresh");
		})	
    },
    error: function(msg) {
      alert("GetDoctorInfo出错啦！");
    }
  });
}

//获取医生详细信息
function GetDetailInfo (DoctorId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetDoctorDetailInfo',
    async: false,
	data: 
	{
		Doctor: DoctorId
	},
    beforeSend: function() {
   },
    success: function(result) {          	  
        var IDNo = $(result).find("DoctorDetailInfo1 ").find("IDNo").text();
		var PhotoAddress = $(result).find("DoctorDetailInfo1").find("PhotoAddress").text();
        var UnitName = $(result).find("DoctorDetailInfo1").find("UnitName").text();
        var JobTitle = $(result).find("DoctorDetailInfo1 ").find("JobTitle").text();
		var Level = $(result).find("DoctorDetailInfo1 ").find("Level").text();
	
		if (PhotoAddress == "")
		{
			PhotoAddress = ImageAddressIP + ImageAddressFile + '/add.jpg';
		}
		else PhotoAddress = ImageAddressIP + ImageAddressFile + '/'+PhotoAddress;

		$("#Photo").attr("src",PhotoAddress);
		document.getElementById('IDNo').innerText = IDNo;
		document.getElementById('UnitName').innerText = UnitName;
		document.getElementById('JobTitle').innerText = JobTitle;
		document.getElementById('Level').innerText = Level;
		
    },
    error: function(msg) {
      alert("GetDoctorDetailInfo出错啦！");
    }
  });
}

function EditInfo(){
	document.getElementById("DoctorName").readOnly = false;
	$("#SexType").removeAttr("disabled");
	$("#SexType").selectmenu("enable");
	$("#SexType").selectmenu("refresh");
	document.getElementById("Birthday").readOnly = false;
	document.getElementById("IDNo").readOnly = false;
	document.getElementById("UnitName").readOnly = false;
	document.getElementById("JobTitle").readOnly = false;
	document.getElementById("Level").readOnly = false;
	document.getElementById("SaveInfo").disabled = false;
	document.getElementById("EditInfo").disabled = "disabled";
}

function SaveInfo() {
	var DoctorName = $("#DoctorName").val();
	var SexType = $("#SexType").val();
	var birth = $("#Birthday").val();
	var IDNo = $("#IDNo").val();
	var UnitName = $("#UnitName").val();
	var JobTitle = $("#JobTitle").val();
	var Level = $("#Level").val();
	var ItemSeq = "1";
	var Description = null;
	var SortNo = "1";
	var regIDNo = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	var Birthday = birth.replace(/[^0-9]/ig,""); 
	alert(Birthday);
	if (DoctorName != "" && SexType != "" && Birthday != "" && IDNo != "")
	{
		if (regIDNo.test(IDNo))
		{
			document.getElementById("AlertName").style.display = "none";
			document.getElementById("AlertSex").style.display = "none";
			document.getElementById("AlertBirth").style.display = "none";
			document.getElementById("AlertID").style.display = "none";
			SetDoctorInfo(DoctorId, DoctorName, Birthday, SexType, IDNo, 0, revUserId, TerminalName, TerminalIP, DeviceType)
		var Flag = document.getElementById("Flag").value;
		if (Flag != "true")
		{
		  document.getElementById("showlabel1").innerHTML = "基本信息修改失败，请检查网络连接后重试";
		  document.getElementById("showlabel1").style.display = "block";
		}
		SetPatDetailInfo(DoctorId, "Contact", "Contact001_5", ItemSeq, UnitName, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		if (Flag != "true")
		{
		  document.getElementById("showlabel1").innerHTML = "信息修改失败，请检查网络连接后重试";
		  document.getElementById("showlabel1").style.display = "block";
		}
		SetPatDetailInfo(DoctorId, "Contact", "Contact001_1", ItemSeq, IDNo, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		if (Flag != "true")
		{
		  document.getElementById("showlabel1").innerHTML = "信息修改失败，请检查网络连接后重试";
		  document.getElementById("showlabel1").style.display = "block";
		}
		SetPatDetailInfo(DoctorId, "Contact", "Contact001_6", ItemSeq, JobTitle, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		if (Flag != "true")
		{
		  document.getElementById("showlabel1").innerHTML = "信息修改失败，请检查网络连接后重试";
		  document.getElementById("showlabel1").style.display = "block";
		}
		SetPatDetailInfo(DoctorId, "Contact", "Contact001_7", ItemSeq, Level, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		if (Flag != "true")
		{
		  document.getElementById("showlabel1").innerHTML = "信息修改失败，请检查网络连接后重试";
		  document.getElementById("showlabel1").style.display = "block";
		}
		if (Flag == "true")
		{
			document.getElementById("DoctorName").readOnly = true;
			document.getElementById("SexType").disabled = true;
			document.getElementById("Birthday").readOnly = true;
			document.getElementById("IDNo").readOnly = true;
			document.getElementById("UnitName").readOnly = true;
			document.getElementById("JobTitle").readOnly = true;
			document.getElementById("Level").readOnly = true;
			document.getElementById("SaveInfo").disabled = "disabled";
			document.getElementById("EditInfo").disabled = false;	
			document.getElementById("alert").innerHTML = "信息修改成功！";
			$("#popdiv").popup("open");
		}
	}
	else
	{
		document.getElementById("AlertID").innerHTML = "请输入正确的15/18位身份证号码"
		document.getElementById("AlertID").style.display = "block";	
	}
	}
	else if (DoctorName == "")
	{
		document.getElementById("AlertName").style.display = "block";
	}
	else if (SexType == "")
	{
		document.getElementById("AlertSex").style.display = "block";
	}
	else if (Birthday == "")
	{
		document.getElementById("AlertBirth").style.display = "block";
	}
	else if (IDNo == "")
	{
		document.getElementById("AlertID").innerHTML = "身份证号必填"
		document.getElementById("AlertID").style.display = "block";
	}
	
		
	
}

		/**********************修改密码***********************/	
function ChangePassword() {
			document.getElementById("showlabel").style.display = "none";
			var OldPassword = $("#OldPassword").val();
			var NewPassword = $("#NewPassword").val();
			var ConfirmPassword = $("#ConfirmPassword").val();
			var UserId = window.localStorage.getItem("DoctorId");
			//alert(UserId);
			//var Key = window.localStorage.getItem("Key");
			var Device = window.localStorage.getItem("Device");
			//alert(Key);
			//alert(Device);
			//var OldPassword = "#*bme319*#";
			
			if (OldPassword != "" && NewPassword != "" && ConfirmPassword != "" && NewPassword == ConfirmPassword)
			{
				$.ajax({
					type: "POST",
					timeout: 30000,
						//contentType: "application/json;charset=utf-8",
					url: 'http://'+ serverIP +'/'+serviceName+'/ChangePassword',
					data: { UserId: UserId, OldPassword: OldPassword, NewPassword: NewPassword, revUserId: revUserId, TerminalName: TerminalName, TerminalIP: TerminalIP, DeviceType: DeviceType},
					dataType: 'xml',
					async: false,
					beforeSend: function() {},
					success: function(result) {
						var test = $(result).find("int").text();
						window.localStorage.setItem("AutoLogOn","No");
						if (test == 1)
						{
							document.getElementById("alert").innerHTML = "密码修改成功";
							$("#popdiv").popup("open");
						}
						else if (test == 2)
						{
							document.getElementById("showlabel").innerHTML = "新密码设置失败，请联系管理员重置密码";
							document.getElementById("showlabel").style.display = "block";
						}
						else if (test == 3)
						{
							document.getElementById("showlabel").innerHTML = "旧密码错误，请输入正确的旧密码";
							document.getElementById("showlabel").style.display = "block";
						}
						else if (test == 4)
						{
							document.getElementById("showlabel").innerHTML = "密码已过期，请联系管理员重置密码";
							document.getElementById("showlabel").style.display = "block";
						}
					},
					error: function(msg) {
							alert("Error: ChangePassword");	
						}
				});
			}
			else if (OldPassword == "")
			{
				document.getElementById("alert").innerHTML = "旧密码不能为空！";
				$("#popdiv").popup("open");
                $("#OldPassword").focus();
			}
			else if (NewPassword == "")
			{
				document.getElementById("alert").innerHTML = "新密码不能为空！";
				$("#popdiv").popup("open");
                $("#NewPassword").focus();
			}
			else if (ConfirmPassword == "")
			{
				document.getElementById("alert").innerHTML = "请再次输入新密码！";
				$("#popdiv").popup("open");
                $("#ConfirmPassword").focus();
			}
			else if (NewPassword != ConfirmPassword)
			{
				document.getElementById("alert").innerHTML = "两次输入的密码不同，请再次确认新密码！";
				$("#popdiv").popup("open");
				$("#ConfirmPassword").focus();
			}
		}
		
/**********************更换头像************************/
// Wait for device API libraries to load
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

/*
// Called when a photo is successfully retrieved
function onPhotoDataSuccess(imageData) {
  var Photo = document.getElementById('Photo');
  imageURI = "data:image/jpeg;base64," + imageData;
  
  //window.location.href = "#MainPage";
 
  Photo.style.width = '100px';
  Photo.style.height = '100px';
  Photo.src = imageURI;
  alert('...' + imageURI );
  uploadPhoto(imageURI);
}*/

function onPhotoDataSuccess(imageData) {
  var Photo = document.getElementById('Photo');
  //alert("0");
  imageURI = "data:image/jpeg;base64," + imageData;
  //alert("1");
  window.location.href = "#MainPage";
 
  Photo.style.width = '100px';
  Photo.style.height = '100px';
  Photo.src = imageURI;
  
  uploadPhoto(imageURI);
}


// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {   
  var Photo = document.getElementById('Photo');
  
  window.location.href = "#MainPage";

  Photo.style.width = '100px';
  Photo.style.height = '100px';
  Photo.src = imageURI;
  //alert('/////'+ imageURI);
  uploadPhoto(imageURI);
}


// 调用相机
function capturePhoto() {
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
	saveToPhotoAlbum: true,
	destinationType: destinationType.DATA_URL });
}

// 调用相册
function getPhoto(source) {
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
	destinationType: destinationType.FILE_URI,
	sourceType: source });
}

// Called if something bad happens.
function onFail(message) {
  alert('Failed because: ' + message);
}

//上传头像
function uploadPhoto(imageURI) {
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = DoctorId + ".jpg";
	options.mimeType = "image/jpeg";
	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";
	options.params = params;
	
	var ft = new FileTransfer();
	var URI = ImageAddressIP +'/'+ "upload.php";
	ft.upload(imageURI, URI, win, fail, options);
}

function win(r) {
	var PhotoAddress =  DoctorId + ".jpg";
 	var TerminalIP = window.localStorage.getItem("TerminalIP");
 	var TerminalName = window.localStorage.getItem("TerminaName");
 	var DeviceType = window.localStorage.getItem("DeviceType");
 	var revUserId  = window.localStorage.getItem("UserId");
	var ItemSeq = "1";
	var Description = null;
	var SortNo = "1";
	SetDetailInfo(DoctorId, "Contact", "Contact001_4", ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
	CheckMstRole(DoctorId, ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
	var Flag = document.getElementById("Flag").value;
	if (Flag == "true")
	{
	  alert("头像更新成功！");
	}
	else
	{
		alert("头像地址更新失败！");
	}
}

function fail(error) {
	alert("头像更新失败！");
}


//保存详细信息到PsDetailInfo
function SetDetailInfo(Doctor, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetDoctorInfoDetail',
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
		piUserId: revUserId,
		piTerminalName: TerminalName,
		piTerminalIP: TerminalIP,
		piDeviceType: DeviceType
	},
    beforeSend: function() {
   },
    success: function(result) {
		Flag = $(result).find("boolean ").text();
		$("#Flag").val(Flag);
    },
    error: function(msg) {
      alert("SetDoctorInfoDetail出错啦！");
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
			alert("SetPsDoctor出错啦！");
		}
	});
}

//获取角色信息并保存相应患者角色基本信息
function CheckMstRole(UserId, ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType)
{
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
				if(RoleClass == 'Patient')
				{
					SetPatDetailInfo(UserId, "Contact", "Contact001_4", ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					var Flag = document.getElementById("Flag").value;
					if (Flag != "true")
					{
					  alert("医生头像地址更新失败！");
					}
				}
			})
		},
		error: function (msg) {
			alert("GetAllRoleMatch出错啦！");
		}
	});
}

//保存详细信息到PsDetailInfo
function SetPatDetailInfo(Patient, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType)
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
