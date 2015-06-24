//GetSMSList ��ȡ������Ϣ�б�
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
	  alert("GetSMSList��������");
	}
  });
}


//SetSMSRead ��д�Ķ�״̬��������
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
	  alert("SetSMSRead��������");
	}
  });
}

//��д�Ķ�״̬��һ����
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
	  alert("ChangeReadStatus��������");
	}
  });
}

//��ȡ���ŶԻ�
function GetSMSDialogue(Reciever, SendBy, DevType)
{
	var Day1 = ""; //��һ��������
	var Day2 = "";//��������
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
	  alert("GetSMSDialogue��������");
	}
  });
}

//�����Ű���ʽ����
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


//���Ͷ���
function submitSMS(DevType)
{
	var Str = "";
	if (DevType == "Phone")
	{
		Str = "Phone";
	}
	var Content = $("#SMSContent" + Str).val();
	if ((Content != "")&&(Content != null))//�������ݲ���Ϊ��
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
					alert("����ʧ�ܣ�");
				}
			},
			error: function(msg) {
			  alert("��������");
			}
		});
	}
	document.getElementById('SMSContent' + Str).style.height = "47px";//�ı�����Ϊ��ʼ��С
	$('#MainField' + Str).attr("class", "NormalField");
}
//��ȡToken
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
			  alert("GetToken��������");
			}
		});
	return Token;
}

//��ȡ�������͵�һ����Ϣ
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
		  alert("GetLatestSMS��������");
		}
	});
	return  SMSArry;
}

//��ȡ���ͱ�־
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
			  alert("GetSMSFlag��������");
			}
		});
	return SMSFlag;
}

//��д����״̬
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
			  alert("ChangePushStatus��������");
			}
		});
	return ret;
}

//��Ϣ����(Pad)
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
					//if (TheOtherId != Arry[5])//ǡ��Ϊ��ǰPatient��ֱ�����ͣ�����������ת����ӦPatient
					//{
					$("#SMSListUl").find("li").each(function() 
					{
						var Id = $(this).find("tr:first").find("td:eq(1)").attr("id");
						if (Id == Arry[5])
						{
							$(this).trigger("click");
							
							//������Ϣ�б�������һ����Ϣ������Ϣ
							$(this).find("tr:first").find("td:eq(2)").html(Arry[2].substring(1, 11));//ʱ��
							$(this).find("tr:last").find("td:first").html(Arry[1]);//����
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
	
	var UserId = ThisUserId;  //��ǰ�û�
	var Token = GetToken(UserId);
	RongIMClient.connect(Token, {
		onSuccess: function (x) {
			//alert("connected��userid��" + x)
			UserId = x;
		},
		onError: function (x) {
			window.console.log(x.getMessage())
		}
	});

	ins = RongIMClient.getInstance();
	
	document.getElementById('SMSbtn').onclick = function () {
		submitSMS(DevType);
		TheOtherToken = GetToken(TheOtherId); //ͬʱΪ���շ�����Token
		var TargetId = TheOtherId; //������Id
		var Type = RongIMClient.ConversationType.setValue(4); //Ĭ��˽��
		var NewArry = GetLatestSMS(TheOtherId, ThisUserId);
		var ContentStr = NewArry[0] + "||" + NewArry[1] + "||" + NewArry[2] + "||" + NewArry[3] + "||" + NewArry[4] + "||" + ThisUserId;
		ins.sendMessage(Type, TargetId, RongIMClient.TextMessage.obtain(ContentStr || Date.now()), null, {
			onSuccess: function () {
				//confirm("send successfully");
			}, onError: function (x) {
				alert(x.getMessage());
				confirm("send fail")
			}
		});
	}
};

//����ʱ�ı������������������̿ռ�	
function InTxt(DevType) //��ʼ����
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

function OutOfTxt(DevType) //��������
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

function ChangeFlagToF() //�������Ϸ��Ͱ�ť
{
	ClickFlag = false;
}

function ChangeFlagToT() //�����뿪���Ͱ�ť
{
	ClickFlag = true;
}

//��Ϣ����(Phone)
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
	
	var UserId = ThisUserId;  //��ǰ�û�
	var Token = GetToken(UserId);
	GetToken(TheOtherId); //ͬʱΪ���շ�����Token
	RongIMClient.connect(Token, {
		onSuccess: function (x) {
			//alert("connected��userid��" + x)
			UserId = x;
		},
		onError: function (x) {
			window.console.log(x.getMessage())
		}
	});

	ins = RongIMClient.getInstance();
	
	var TargetId = TheOtherId; //������Id!!!!!!!!!!!!!!!
	document.getElementById('SMSbtn' + Str).onclick = function () {
		submitSMS(DevType);
		
		var Type = RongIMClient.ConversationType.setValue(4); //Ĭ��˽��
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

//����������Ϣ���ֵĺ���
//��ȡ����һ����Ϣ�����룺ҽ��Id������Id���������ͣ����飬��5��Ԫ�أ�����Ϊ����Ϣ���ţ���Ϣ���ݣ�����ʱ�䣬����������������ʱ��
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
		  alert("GetLatestSMS��������");
		}
	});
	return  SMSArry;
}



//��ȡҽ���ܵ�δ����Ϣ�������룺ҽ��Id
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
		  alert("GetSMSCountForAll��������");
		}
  });
  return Count;
}



//��ȡҽ����ĳһ���ߵ�δ����Ϣ�������룺ҽ��Id������Id
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
		  alert("GetSMSCountForOne��������");
		}
   });
   return Count;
}
	

	