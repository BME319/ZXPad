/**********************全局变量************************/
 //var DoctorId = "D001";
 //var serverIP = '10.12.43.94:8089';
 //var serviceName = 'Services.asmx';
 var DoctorId;
 var ImageAddressIP = "http://192.168.191.6/";
 var ImageAddressFile = "CDFiles/PersonalPhoto/Doctor";
 var ImageAddress = ImageAddressIP + ImageAddressFile + "/" + DoctorId + ".jpg";
 var pictureSource;   // picture source
 var destinationType; // sets the format of returned value
 
/**********************初始页面************************/
$(document).ready(function(event){
	GetDetailInfo(DoctorId);
 	GetBasicInfo(DoctorId);
});

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
			switch (Gender)
			{
			case "1":
			  SexType = "男性";
			  break;
			case "2":
			  SexType = "女性";
			  break;
			case "3":
			  SexType = "其他";
			  break;
			default:
			  SexType = "未知";
			}
			document.getElementById('SexType').innerText = SexType;
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
	
		if (PhotoAddress != ImageAddress)
		{
			PhotoAddress = ImageAddressIP + ImageAddressFile + '/add.jpg';
		}
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

/**********************更换头像************************/
// Wait for device API libraries to load
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
function onPhotoDataSuccess(imageData) {
  var Photo = document.getElementById('Photo');
  imageURI = "data:image/jpeg;base64," + imageData;
  
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
	options.fileName = UserId + ".jpg";
	options.mimeType = "image/jpeg";

	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";
	options.params = params;
	var ft = new FileTransfer();
	var URI = ImageAddressIP + "upload.php";
	ft.upload(imageURI, URI, win, fail, options);
}

function win(r) {
	var PhotoAddress = ImageAddress;
	var revUserId = "zcy";
	var TerminalName = "zcy-PC";
	var TerminalIP = "10.12.43.35";
	var DeviceType = "1";
	var ItemSeq = "1";
	var Description = null;
	var SortNo = "1";
	SetDetailInfo(UserId, "Contact", "Contact001_4", ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
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
