//ws
var ws; //websocket
var wsServerIP = serverIP.substring(0, 11) + ":4141/chat"; 
var SocketCreated = false;
var isUserloggedout = false;

$(document).ready(function(event){
	WsPush();
})


//消息推送
window.onunload = function () //断开连接
{
	SocketCreated = false;
	isUserloggedout = true;
	ws.close();
}

function WsPush ()
//window.onload = function() //建立连接
{
	try
	{
		if ("WebSocket" in window) 
		{
			//alert(1);
			ws = new WebSocket("ws://" + wsServerIP);
		}
		else if("MozWebSocket" in window) 
		{
			alert(2);
			ws = new MozWebSocket("ws://" + wsServerIP);
		}
		else
		{
			alert("当前浏览器不支持WebSocket");
		}
	
		SocketCreated = true;
		isUserloggedout = false;
	} 
	catch (ex) 
	{
		console.log(ex, "ERROR");
		return;
	}
	ws.onopen = WSonOpen;
	ws.onmessage = WSonMessage;
	ws.onclose = WSonClose;
	ws.onerror = WSonError;
}


 function WSonOpen() {
	ws.send("login:" + ThisUserId);   
 };

 function WSonMessage(event) {
	var DataArry = event.data.split("||");
	if (DataArry[0].substring(0, 3) != "log")
	{
		$('#PatientListTbody').find('tr').each(function() 
		{
			var piPatientId = $(this).find('td:first').find('div').find('ul').find('li:eq(1)').find('p').attr("value");
			if (piPatientId == DataArry[0])
			{
				var Arry = GetLatestSMS(localStorage.getItem("DoctorId"), DataArry[0]);
				var Count;
				var piCount = $(this).find('td:last').find('div').find('ul').find('li:first').find('span').find('font').html();
				if (typeof(piCount) == "undefined")
				{
					Count = "1";									
				}
				else
				{
					Count = GetSMSCountForOne(localStorage.getItem("DoctorId"), DataArry[0]);
					$(this).find('td:last').find('div').empty();
				}
				var Str = '<ul  data-role="listview" data-inset="true"><li data-role="list-divider">'+Arry[2]+' <span class="ui-li-count" style="background-color:#C00"><font color="white">' + Count + '</font></span></li><li><a href="" class="SMS" value="'+DataArry[0]+'"><p>'+Arry[1]+'</p></a> </li></ul>';					
				$(this).find('td:last').find('div').append(Str);
				$(this).parent().trigger('create');
			}
		});
	}
 };

 function WSonClose() {
 };

 function WSonError() {
	console.log("远程连接中断。", "ERROR");
 };


//获取最近发送的一条消息
function GetLatestSMS(DoctorId, PatientId)
{
	var SMSArry = new Array();
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestSMS',
		async: false,
		data: 
		{
			DoctorId: DoctorId,
			PatientId: PatientId
		},
		beforeSend: function() {
	   },
		success: function(result) {  	  
			var MessageNo = $(result).find("MessageNo").text();	
			var Content = $(result).find("Message").find("Content").text();	
			var SendDateTime = $(result).find("Message").find("SendDateTime").text();	
			var SendByName = $(result).find("Message").find("SendByName").text();	
			var Flag = $(result).find("Message").find("Flag").text(); 
			var Time;
			if(Flag == "1")
			{
				Time = SendDateTime.substring(1, 17);
			}
			else
			{
				Time = SendDateTime.substring(12, 17);
			}	
			SMSArry[0] = MessageNo;
			SMSArry[1] = Content;
			SMSArry[2] = SendDateTime;
			SMSArry[3] = SendByName;
			SMSArry[4] = Time;
		},
		error: function(msg) {
		  alert("GetLatestSMS出错啦！");
		}
	});
	return  SMSArry;
}


//获取某一用户未读消息总数
function GetSMSCountForAll(DoctorId)
{
	var Count;
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSCountForAll',
		async: false,
		data: 
		{
			DoctorId: DoctorId
		},
		beforeSend: function() {
		},
		success: function(result) {
			Count = $(result).find("int").text();  
		},
		error: function(msg) {
		  alert("GetSMSCountForAll出错啦！");
		}
  });
  return Count;
}


//获取一对一未读消息数
function GetSMSCountForOne (Reciever, SendBy)
{
	var Count;
 	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSCountForOne',  
		async: false,
		data: 
		{
			Reciever: Reciever,
			SendBy: SendBy
		},
		
		beforeSend: function() {
		},
		success: function(result) {          	  
			Count = $(result).find("int").text();
		},
		error: function(msg) {
		  alert("GetSMSCountForOne出错啦！");
		}
   });
   return Count;
}
