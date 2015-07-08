var ThisUserId = localStorage.getItem('UserId'); //医生
var TheOtherId = localStorage.getItem("PatientId"); //患者
var flag = localStorage.getItem("PanelFlag");

//var piUserId = "a";
//var piTerminalName = "a";
//var piTerminalIP = "a";
//var piDeviceType = 100;

var ClickFlag = true;

var DocHeight = $(document).height();
var InitialHt = $("#SMSContent").height(); //初始高度
var InitialTop = $("#OutField").position().top; //初始位置
var MaxHt = 0; //输入框最大高度

//ws
var ws; //websocket
var wsServerIP = serverIP.substring(0, 11) + ":4141/chat"; 
var SocketCreated = false;
var isUserloggedout = false;

$(document).ready(function(event){
  $('#SMSHeader').html(localStorage.getItem("PatientName"));
  $('#GenaralField').height(GetHeight()-450); //设定文档高度
  if (flag == "Panel")
  {
  SetSMSRead(ThisUserId, TheOtherId);//改写阅读状态
  }
  GetSMSDialogue(ThisUserId, TheOtherId);
  document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
  
  var SMSBtn = document.getElementById('SMSbtn');	
  SMSBtn.addEventListener("mouseover", ChangeFlagToF, false);
  SMSBtn.addEventListener("mouseout", ChangeFlagToT, false);
  $('#SMSContent').val("");
  document.getElementById('SMSContent').style.height = "47px"; //设定文本域初始高度
  WsPush(); //websocket
})

document.getElementById('SMSbtn').onclick = submitSMS;

//改写Panel调用flag并改写消息数
function ChangePanelFlag ()
{
	localStorage.setItem('PanelFlag',"HomePage"); 
	//修改消息数
	var PatientId = localStorage.getItem("PatientId");
	var Count = GetSMSCountForOne(localStorage.getItem("DoctorId"), PatientId);
	$('#PatientListTbody').find('tr').each(function() 
	{
		var piPatientId = $(this).find('td:first').find('div').find('ul').find('li:eq(1)').find('p').attr("value");
		if (piPatientId == PatientId)
		{
			var Count = GetSMSCountForOne(localStorage.getItem("DoctorId"), PatientId);
			$(this).find('td:last').find('div').find('ul').find('li:first').find('span').find('font').html(Count);														
		}
	});
	var TotalCount = GetSMSCountForAll(localStorage.getItem("DoctorId"));
	$('#SMSBox').find('span').find('font').html(TotalCount);	
}

//点击实时计数产生的图标触发
function AddFunction()
{
	var PatientId = localStorage.getItem("PatientId");
	SetSMSRead(localStorage.getItem('UserId'), PatientId);
	localStorage.setItem('PanelFlag',"Panel"); //Panel调用flag
}


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
	flag = localStorage.getItem("PanelFlag");
	if (flag == "Panel")
	{
		TheOtherId = localStorage.getItem("PatientId");
		if (DataArry[0] == TheOtherId)
		{
			CreateSMS("Receive", DataArry[1], DataArry[2]);
			document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
			SetSMSRead(ThisUserId, TheOtherId);//改写阅读状态
		}
	}
	else
	{
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
					var Str = '<ul  data-role="listview" data-inset="true"><li data-role="list-divider">'+Arry[2]+' <span class="ui-li-count" style="background-color:#C00"><font color="white">' + Count + '</font></span></li><li><a href="#SMSPanel" class="SMS" onclick = "AddFunction()" value="'+DataArry[0]+'"><p>'+Arry[1]+'</p></a> </li></ul>';					
					$(this).find('td:last').find('div').append(Str);
					$(this).parent().trigger('create');
					
					//总收件箱
					var TotalCount = GetSMSCountForAll(localStorage.getItem("DoctorId"));
					$('#SMSBox').find('span').find('font').html(TotalCount);
				}
			});
		}
	}
 };

 function WSonClose() {
 };

 function WSonError() {
	console.log("远程连接中断。", "ERROR");
 };

//autogrow初始化
$("#SMSContent").textinput({
	autogrow: true
});

//固定文本框下边框与添加滚动条
$("#SMSContent").resize(function(){
	var PresentTop = $("#OutField").position().top; //获取当前位置
	var PresentHt = $("#SMSContent").height(); //获取当前始高度
	var t = document.getElementById('SMSContent'); 
	var h = t.scrollHeight; 
	if (PresentHt < 170)
	{
		$( "#SMSContent" ).textinput( "option", "autogrow", true );
		if (PresentHt != InitialHt)
		{
			var temp = PresentHt - InitialHt;
			InitialHt = PresentHt; //改变比较值
			$("#OutField").css("top", PresentTop - temp);
		}
	}
	else
	{
		if (MaxHt == 0)
		{
			MaxHt = PresentHt;
		}
		$( "#SMSContent" ).textinput( "option", "autogrow", false );
		h = h > MaxHt ? MaxHt : h;
		
		if (PresentHt != InitialHt)
		{
			var temp = PresentHt - InitialHt;
			InitialHt = PresentHt; //改变比较值
			$("#OutField").css("top", PresentTop - temp);
		}
	}
});

//退格到最大高度内后恢复autogrow
document.onkeydown = function (event) 
{				
	var e = event || window.event || arguments.callee.caller.arguments[0]; 
	var t = document.getElementById('SMSContent'); 
	
	if(e && e.keyCode == 8)
	{ 
		var a = document.getElementById('SMSContent').scrollTop;
		if ((a == 0) && ($("#SMSContent").height() <= MaxHt))
		{
			$( "#SMSContent" ).textinput( "option", "autogrow", true );
		}
	}
}


//获取服务器IP
function getLocalmachineIPAddress()
{
	var Ip = "";
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/getLocalmachineIPAddress',
		async: false,
		beforeSend: function() {
		},
		success: function(result) {     	  	  
			Ip = $(result).text();		  
		},
		error: function(msg) {
			alert("getLocalmachineIPAddress出错啦！");
		}
	});
	return Ip;	  
}

//获取文档高度
function GetHeight()
{
	var DocHeight = $(document).height();
	var DocWidth = $(document).width();
		
	var ret = (DocHeight < DocWidth)?DocHeight:DocWidth;
	return ret;
}

//获取短信对话
function GetSMSDialogue(Reciever, SendBy)
{
	var Day1 = ""; //上一次天日期
	var Day2 = "";//本次日期
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSDialogue',
	async: false,
	data: 
	{
		Reciever: Reciever,
		SendBy: SendBy
	},
	beforeSend: function() {
	},
	success: function(result) {     
	  $(result).find('Table1').each(function() {	  
		  var Time = $(this).find("SendDateTime").text();
		  var Day2 = Time.substring(1, 11);
		  if (Day2 != Day1)
		  {
			  var Temp = Time.substring(1, 17);
		  }
		  else
		  {
			  var Temp = Time.substring(12, 17);
		  }	    		  
		  Day1 = Time.substring(1, 11);
		  var Type = $(this).find("IDFlag").text();
		  var Content = $(this).find("Content").text();
		  CreateSMS(Type, Temp, Content);
	  })
	},
	error: function(msg) {
	  alert("GetSMSDialogue出错啦！");
	}
  });
}

//将短信按格式输出
function CreateSMS(Type, Time, Content)
{
	
	var ReiceiveStr = '<table width="100%"><tr><td colspan="2" align="center">' + Time + '</td></tr><tr><td><div class="ForReceive"><div class="ReceiveTri"></div>' + Content + '</div></td><td width="20px"></td></tr></table>';

	var SendStr = '<table width="100%"><tr><td colspan="2" align="center">' + Time + '</td></tr><tr><td width="20px"></td><td><div class="ForSend"><div class="SendTri"></div>' + Content + '</div></td></tr></table>';

	if (Type == "Send")
	{
		$('#MainField').append(SendStr);
	}
	else
	{
		$('#MainField').append(ReiceiveStr);
	}
}




//发送短信
function submitSMS()
{
	var Content = $("#SMSContent").val();
	if ((Content != "")&&(Content != null))//短信内容不能为空
	{
		$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/SetSMS',
			async: false,
			data: 
			{
				SendBy: ThisUserId,
				Reciever: TheOtherId,		
				Content: Content,
				piUserId: piUserId,
				piTerminalName: piTerminalName,
				piTerminalIP: piTerminalIP,
				piDeviceType: piDeviceType
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				var flag = $(result).find("boolean").text();
				if (flag == "true")
				{		
					CreateSMS("Send", GetLatestSMS(TheOtherId, ThisUserId)[4], Content);
					document.getElementById('SMSContent').value = "";
					document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
					//console.log("点击发送");
					ws.send(ThisUserId + "||" + GetLatestSMS(TheOtherId, ThisUserId)[4] + "||" + Content + "||" + GetLatestSMS(TheOtherId, ThisUserId)[2]);
				}
				else
				{
					alert("发送失败！");
				}
			},
			error: function(msg) {
			  alert("出错啦！");
			}
		});
	}
	document.getElementById('SMSContent').style.height = "47px"; //设定文本域初始高度
	$('#MainField').attr("class", "NormalField");
}
	
//输入时文本框上移以留出软键盘空间
$(document).ready(function(event){	
	var ContentTxt = document.getElementById('SMSContent');
	ContentTxt.addEventListener("focus", InTxt, false);
	ContentTxt.addEventListener("blur", OutOfTxt, false);
})

function InTxt() //开始输入
{
	//$('#MainField').attr("class", "ShortField");
	//document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
	
	$('#MainField').attr("class", "ShortField");
	document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
}

function OutOfTxt() //输入完成
{
	if (ClickFlag)
	{
		//$('#MainField').attr("class", "NormalField");
		
		$('#MainField').attr("class", "NormalField");
	}
}

function ChangeFlagToF() //鼠标移上发送按钮
{
	ClickFlag = false;
}

function ChangeFlagToT() //鼠标离开发送按钮
{
	ClickFlag = true;
}

//获取Token
function GetToken (UserId)
{
	var Token;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/GetToken',
			async: false,
			data: 
			{
				UserId: UserId,
				UserName: "",
				piUserId: piUserId,
				piTerminalName: piTerminalName, 
				piTerminalIP: piTerminalIP, 
				piDeviceType: piDeviceType
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				Token = $(result).text();
			},
			error: function(msg) {
			  alert("GetToken出错啦！");
			}
		});
		//alert(Token);
	return Token;
}

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

//获取推送标志
function GetSMSFlag (MessageNo)
{
	var SMSFlag;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSFlag',
			async: false,
			data: 
			{
				MessageNo: MessageNo
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				SMSFlag = $(result).text();
			},
			error: function(msg) {
			  alert("GetSMSFlag出错啦！");
			}
		});
	return SMSFlag;
}

//改写推送状态
function ChangePushStatus (MessageNo)
{
	var ret;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/ChangePushStatus',
			async: false,
			data: 
			{
				MessageNo: MessageNo,
				piUserId: piUserId,
				piTerminalName: piTerminalName,
				piTerminalIP: piTerminalIP,
				piDeviceType: piDeviceType
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				ret = $(result).text();
			},
			error: function(msg) {
			  alert("ChangePushStatus出错啦！");
			}
		});
	return ret;
}

//改写阅读状态（一条）
/*function ChangeReadStatus(MessageNo)
{
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/ChangeReadStatus',
	async: false,
	data: 
	{
		MessageNo: MessageNo,
		revUserId: piUserId,
		pTerminalName: piTerminalName,
		pTerminalIP: piTerminalIP,
		pDeviceType: piDeviceType
	},
	beforeSend: function() {
	},
	success: function(result) {
		//var flag = $(result).find("boolean").text();  
	},
	error: function(msg) {
	  alert("ChangeReadStatus出错啦！");
	}
  });
}
*/
//SetSMSRead 改写阅读状态（多条）
function SetSMSRead (Reciever, SendBy)
{
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetSMSRead',
	async: false,
	data: 
	{
		Reciever: Reciever,
		SendBy: SendBy,
		piUserId: piUserId,
		piTerminalName: piTerminalName,
		piTerminalIP: piTerminalIP,
		piDeviceType: piDeviceType
	},
	beforeSend: function() {
	},
	success: function(result) {
		//var flag = $(result).find("boolean").text();  
	},
	error: function(msg) {
	  alert("SetSMSRead出错啦！");
	}
  });
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