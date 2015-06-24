//GetSMSList 获取消息列表
function GetSMSList (DoctorId, CategoryCode)
{
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSList',
	async: false,
	data: 
	{
		DoctorId: DoctorId,
		CategoryCode: CategoryCode
	},
	beforeSend: function() {
	},
	success: function(result) {		
		$(result).find('Table1').each(function() {			
			var PatientId = $(this).find("PatientId").text();
			var PatientName = $(this).find("PatientName").text();
			var Count = $(this).find("Count").text();
			var Content = $(this).find("Content").text();
			if ((Content == "")||(Content == null))
			{
				Content = "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;";
			}
			var SendDateTime = ($(this).find("SendDateTime").text()).substring(1, 11);		
			var TempStr = "";
			if (Count != "0")
			{
				TempStr = '<div class="circle" id="CountTd">' + Count + '</div>';
			}
			var SMSListStr = '<li><a href="#"><table width="100%" frame="below" style="table-layout: fixed;"><tr><td rowspan="2" width="30px">' + TempStr + '</td><td width="50px" align="left" id = ' + PatientId + '>' + PatientName + '</td><td align="left">'+ SendDateTime + '</td></tr><tr><td colspan="2" class="SMStd">' + Content+ '</td></tr></table></a></li>';
			$('#SMSListUl').append(SMSListStr);						  
		})
		 $('#SMSListUl').listview("refresh");
	},
	error: function(msg) {
	  alert("GetSMSList出错啦！");
	}
  });
}


//SetSMSRead 将某一用户收到的所有消息设为已读状态
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

//将某一条消息设为已读
function ChangeReadStatus(MessageNo)
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

//获取消息对话
function GetSMSDialogue(Reciever, SendBy, DevType)
{
	var Day1 = ""; //比较时间
	var Day2 = "";//比较时间
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
		  CreateSMS(Type, Temp, Content, DevType);
	  })
	},
	error: function(msg) {
	  alert("GetSMSDialogue出错啦！");
	}
  });
}

//使消息按预定样式显示
function CreateSMS(Type, Time, Content, DevType)
{
	var Str = "";
	if (DevType == "Phone")
	{
		Str = "Phone";
	}
	var ReiceiveStr = '<table width="100%"><tr><td colspan="2" align="center">' + Time + '</td></tr><tr><td><div class="ForReceive"><div class="ReceiveTri"></div>' + Content + '</div></td><td width="20px"></td></tr></table>';

	var SendStr = '<table width="100%"><tr><td colspan="2" align="center">' + Time + '</td></tr><tr><td width="20px"></td><td><div class="ForSend"><div class="SendTri"></div>' + Content + '</div></td></tr></table>';

	if (Type == "Send")
	{			
		$('#MainField' + Str).append(SendStr);
	}
	else
	{
		$('#MainField' + Str).append(ReiceiveStr);
	}
}


//发送消息
function submitSMS(DevType)
{
	var Str = "";
	if (DevType == "Phone")
	{
		Str = "Phone";
	}
	var Content = $("#SMSContent" + Str).val();
	if ((Content != "")&&(Content != null))//不能为空
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
					CreateSMS("Send", GetLatestSMS(TheOtherId, ThisUserId)[4], Content, DevType);
					document.getElementById('SMSContent' + Str).value = "";
					document.getElementById('MainField' + Str).scrollTop = document.getElementById('MainField'+ Str).scrollHeight;
				}
				else
				{
					alert("发送失败！");
				}
			},
			error: function(msg) {
			  alert("submitSMS出错啦！");
			}
		});
	}
	document.getElementById('SMSContent' + Str).style.height = "47px";//将文本域变为初始大小
	$('#MainField' + Str).attr("class", "NormalField");
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
	return Token;
}

//获取最新一条消息
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
/*
//消息推送(Pad)
function PadMessagePush(DevType) 
{		
	RongIMClient.init(AppKey);

	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			window.console.log(status.getValue(), status.getMessage(), new Date())
		}
	});
	
	RongIMClient.getInstance().setOnReceiveMessageListener({
		onReceived: function (data) {				
			if (data.getContent() != "")
			{
				var Arry = data.getContent().split("||");
				var SMSFlag = GetSMSFlag(Arry[0]);
				if (SMSFlag == 3)
				{
					//if (TheOtherId != Arry[5])//恰好为当前Patient，直接推送，否则首先跳转到对应Patient
					//{
					$("#SMSListUl").find("li").each(function() 
					{
						var Id = $(this).find("tr:first").find("td:eq(1)").attr("id");
						if (Id == Arry[5])
						{
							$(this).trigger("click");
							
							//列表相应更新
							$(this).find("tr:first").find("td:eq(2)").html(Arry[2].substring(1, 11));//时间
							$(this).find("tr:last").find("td:first").html(Arry[1]);//内容
						}
					});
					//}
					CreateSMS("Receive", Arry[4], Arry[1], DevType);
					ChangeReadStatus(Arry[0]); 
					document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
					ChangePushStatus(Arry[0]);						
				}
			}
		}
	});
	
	var UserId = ThisUserId;  //当前用户
	var Token = GetToken(UserId);
	RongIMClient.connect(Token, {
		onSuccess: function (x) {
			//alert("connected，userid＝" + x)
			UserId = x;
		},
		onError: function (x) {
			window.console.log(x.getMessage())
		}
	});

	ins = RongIMClient.getInstance();
	
	document.getElementById('SMSbtn').onclick = function () {
		submitSMS("Pad"); //2015-6-8
		TheOtherToken = GetToken(TheOtherId); //同时为接收方申请Token
		var TargetId = TheOtherId; //收信人Id
		var Type = RongIMClient.ConversationType.setValue(4); //默认私聊
		var NewArry = GetLatestSMS(TheOtherId, ThisUserId);
		var ContentStr = NewArry[0] + "||" + NewArry[1] + "||" + NewArry[2] + "||" + NewArry[3] + "||" + NewArry[4] + "||" + ThisUserId;
		ins.sendMessage(Type, TargetId, RongIMClient.TextMessage.obtain(ContentStr || Date.now()), null, {
			onSuccess: function () {
				//confirm("send successfully");
			}, onError: function (x) {
				//alert(x.getMessage());
				//confirm("send fail")
			}
		});
	}
};
*/
//输入时文本框上移以留出软键盘空间	
function InTxt(DevType) //开始输入
{
	//alert(1);
	var Str = ""; 
	if (DevType == "Phone")
	{
		Str = "Phone";
	}
	$('#MainField' + Str).attr("class", "ShortField");
	document.getElementById('MainField'+ Str).scrollTop = document.getElementById('MainField'+ Str).scrollHeight;
}

function OutOfTxt(DevType) //输入完成
{
	//alert(2);
	var Str = ""; 
	if (DevType == "Phone")
	{
		Str = "Phone";
	}
	if (ClickFlag)
	{
		$('#MainField' + Str).attr("class", "NormalField");
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
/*
//消息推送(Phone)
function PhoneMessagePush(DevType) 
{	 
	var  Str = "Phone";
	
	RongIMClient.init(AppKey);

	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			window.console.log(status.getValue(), status.getMessage(), new Date())
		}
	});
	
	RongIMClient.getInstance().setOnReceiveMessageListener({
		onReceived: function (data) {				
			if (data.getContent() != "")
			{
				var Arry = data.getContent().split("||");
				var SMSFlag = GetSMSFlag(Arry[0]);					
				if (SMSFlag == 3)
				{
					CreateSMS("Receive",Arry[4], Arry[1], DevType);
					ChangeReadStatus(Arry[0]);
					document.getElementById('MainField' + Str).scrollTop = document.getElementById('MainField' + Str).scrollHeight;
					ChangePushStatus(Arry[0]);					
				}
			}
		}
	});
	
	var UserId = ThisUserId;  //当前用户
	var Token = GetToken(UserId);
	GetToken(TheOtherId); //同时为接收方申请Token
	RongIMClient.connect(Token, {
		onSuccess: function (x) {
			//alert("connected，userid＝" + x)
			UserId = x;
		},
		onError: function (x) {
			window.console.log(x.getMessage())
		}
	});

	ins = RongIMClient.getInstance();
	
	var TargetId = TheOtherId; 
	document.getElementById('SMSbtn' + Str).onclick = function () {
		submitSMS("Phone");	//2015-6-8
		
		var Type = RongIMClient.ConversationType.setValue(4); //默认私聊
		var NewArry = GetLatestSMS(TheOtherId, ThisUserId);
		var ContentStr = NewArry[0] + "||" + NewArry[1] + "||" + NewArry[2] + "||" + NewArry[3] + "||" + NewArry[4] + "||" + ThisUserId;
		ins.sendMessage(Type, TargetId, RongIMClient.TextMessage.obtain(ContentStr || Date.now()), null, {
			onSuccess: function () {
				//confirm("send successfully");
			}, onError: function () {
				confirm("send fail")
			}
		});
	}
};

*/
//获取最新一条消息
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
	

	