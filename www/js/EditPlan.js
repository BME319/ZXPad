
	//var PatientId;
	//var Module = "M1";

		 //传入值
        var PatientId = localStorage.getItem("PatientId");
        var Module = localStorage.getItem("ModuleType");
        var PlanStatus = localStorage.getItem("PlanStatus");

        var piUserId = localStorage.getItem('UserId');
        var piTerminalName = localStorage.getItem('TerminalName');
        var piTerminalIP = localStorage.getItem('TerminalIp');
        var piDeviceType = localStorage.getItem('DeviceType');
        var DoctorId = localStorage.getItem('UserId');

        //初始值 全局变量
        var chart_imp = ""; ;
        var NowPlanNo = "";
        var StartDate = 0;
        var EndDate = 0;
		
	//写死
	var PLType = 1;
	var Status = 3;
	
	var PlanNo;
 	function editPlan(){
		
		PlanNo = GetExecutingPlanNoByModule(PatientId,Module);
		
		getTargetInfo();
		
		
	  }
	  
	  //从数据库中获取患者某个模块下正在执行的计划
	 function GetExecutingPlanNoByModule(PatientId,Module){
      var option = "";
	  $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetExecutingPlanByModule',
		async:false,
		data: {PatientId:PatientId,
			   Module:Module},//输入变量
		beforeSend: function(){},
		success: function(result) { 
			 //存在正在执行的计划，则直接读取
			option=$(result).text();
			if (option != "")
			{
				//
			}
			else 
			{
				option = "";
			}					    
	    }, 
	    error: function(msg) {alert("获取正在执行的计划出错！");}
	  });
      return option;	
  }	
  
	function getTargetInfo(){
	
		$("#SBPValue").val(GetTargetBP(PLType,PlanNo,1));
		$("#DBPValue").val(GetTargetBP(PLType,PlanNo,2));
		
		$("#curSBPValue").val(GetCurrentSBP(PatientId));
		$("#curDBPValue").val(GetCurrentDBP(PatientId));
		
		$("#EndDate").val(GetPlanEndDate(PlanNo));
		//$("#nav1").click();
		
      $("#SBPValue").css("width","120px").parent().css("width","120px");
	  $("#DBPValue").css("width","120px").parent().css("width","120px");
	  $("#curSBPValue").css("width","120px").parent().css("width","120px");
	  $("#curDBPValue").css("width","120px").parent().css("width","120px");
	  $("#EndDate").css("width","120px").parent().css("width","120px");
	}
	
	function resetTarget(){
		getTargetInfo();
	}
	
	function saveTarget(){
		//不进行数据库操作，只跳转到下一个界面
		//panelnav2();
//		$("#nav1").addClass("ui-btn-active");
		var curSBPValue = $("#curSBPValue").val();
		var curDBPValue = $("#curDBPValue").val();
		if(curSBPValue==""||curDBPValue==""){
			alert("当前收缩压和舒张压必填！");
		}
		else{
			panelnav2();
			$("#nav1").addClass("ui-btn-active");
		}
	}
	
	function gotoTarget(){
		panelnav1();
		$("#nav1").removeClass("ui-btn-active");
	}
	
	function saveLifeStyle(){
		//不进行数据库操作，只跳转到下一个界面
		panelnav3();
		$("#nav2").addClass("ui-btn-active");
	}
	
	function gotoLifeStyle(){
		panelnav2();
		$("#nav2").removeClass("ui-btn-active");
		if($("#nav3").hasClass("ui-btn-active"))
		{
			$("#nav3").removeClass("ui-btn-active");	
		}
	}
	
	 function panelnav1(){
	 	$("#editContent1").show();
		$("#editContent2").hide();
		$("#editContent3").hide();
	 }
	 
	 function panelnav2(){
	 	$("#editContent1").hide();
		$("#editContent2").show();
		$("#editContent3").hide();
		loadLifeStyle();
	 }
	 
	 function panelnav3(){
	 	$("#editContent1").hide();
		$("#editContent2").hide();
		$("#editContent3").show();
		loadDrugList();
		getPatientDrugRecord();
	 }
	 
	 //从数据库中读取用户当前收缩压值
  function GetCurrentSBP(PatientId){
	
      var option = "";
	  $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestSbpByPatientId',
		async:false,
		data: {PatientId:PatientId,
			   ItemType:"Bloodpressure",
			   ItemCode:"Bloodpressure_1"},//输入变量
		beforeSend: function(){},
		success: function(result) { 
			 //存在收缩压的值，则直接读取
			option=$(result).text();
			if (option != "")
			{
				//
			}
			else 
			{
				option = "请输入";
			}					    
	    }, 
	    error: function(msg) {alert("获取当前收缩压出错 为什么!");}
	  });
      return option;	
  }	
  
  //从数据库中读取用户当前舒张压值
  function GetCurrentDBP(PatientId){
	  var option;
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestDbpByPatientId',
		  async:false,
		  data: {PatientId:PatientId,
				 ItemType:"Bloodpressure",
				 ItemCode:"Bloodpressure_2"},//输入变量
		  beforeSend: function(){},
		  success: function(result) { 
			  option=$(result).text();
			  if (option != "")
			  {
				  //
			  }
			  else 
			  {
				  option = "请输入";
			  }		    
		  }, 
		  error: function(msg) {alert("Get Current Dbp Error!");}
	  });
	  return option;	
  }
  
 	//从数据库中读取用户当前计划的目标收缩压值和舒张压值    PLType 1：用原来的PlanNo，无需新建，在原计划上修改，插数据即可
  function GetTargetBP(Type, PlanNo, Id){
	  var option;
	  if(Type == 1)
	  {
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetValueByPlanNoAndId',
			  async:false,
			  data: {PlanNo:PlanNo,
					 Id:Id},//输入变量
			  beforeSend: function(){},
			  success: function(result) { 
				  option=$(result).text();	
				  if (option != "")
				  {
					//
				  }
				  else 
				  {
					  option = "请输入";
				  }    
			  }, 
			  error: function(msg) {alert("Get Target Sbp Error!");}
		  });
		  return option;	
	  }
  }
  
  //得到计划信息
  function GetPlanEndDate(PlanNo){
	  var option = "";
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetPlanInfo',
		  async:false,
		  data: {PlanNo:PlanNo},
		  beforeSend: function(){},
		  success: function(result) {
			  var ret =  $.trim($(result).text()).split(/\s+/);
			  if(ret != "")
			  {  
			  	  //$("#StartDate").val(ret[1]); //StartDate
				  option = ret[2].substring(0,4) + "-" + ret[2].substring(4,6) + "-" + ret[2].substring(6,8);   //EndDate				  
			  }
			  else
			  {		
				  alert("结束日期获取失败");
			  }				    
		  }, 
		  error: function(msg) {alert("GetPlanEndDate Error!");}
	  });
	  return option;	
  }
  
  //插入目标收缩压和舒张压
  function InsertTargetBP(NewPlanNo,Id,Type,Code,Value,Origin)
  {
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetTarget',
		  async:false,
		  data: {Plan:NewPlanNo,
				 Id:Id,
				 Type: Type,
				 Code: Code,
				 Value:Value,
				 Origin:Origin,
				 Instruction:"",
				 Unit:"mmhg",
				 piUserId: localStorage.getItem('UserId'),
				 piTerminalName: localStorage.getItem('TerminalName'),
				 piTerminalIp: localStorage.getItem('TerminalIp'),
				 piDeviceType: localStorage.getItem('DeviceType')
				 },//输入变量
		  beforeSend: function(){},
		  success: function(result) {  
			  //alert("1");
		  },
		  error: function(msg) {alert("SetTargetError!");}
	  }); 
  }
  
  function SetPlan(PlanNo, PatientId, StartDate, EndDate, Module, Status, DoctorId, piUserId, piTerminalName, piTerminalIP, piDeviceType){
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetPlan',
		  async:false,
		  data: {PlanNo:PlanNo,
				 PatientId:PatientId,
				 StartDate:StartDate,
				 EndDate:EndDate,
				 Module:Module,
				 Status:Status,
				 DoctorId:DoctorId,
				 piUserId:piUserId,
				 piTerminalName:piTerminalName,
				 piTerminalIP:piTerminalIP,
				 piDeviceType:piDeviceType},
		  beforeSend: function(){},
		  success: function(result) {
			  var ret =  $(result).text();
			  if(ret == 1)
			  {   
				  //
			  }
			  else
			  {		
				  alert("更新结束时间失败");
			  }				    
		 }, 
		 error: function(msg) {alert(" SetPlan Error!");}
     });	
  }

  //加载生活方式列表
  function loadLifeStyle(){
	  $("#LifeStyleBody").empty(); 
	  var sid = "";
	  var strs = "";
	  var changes = "";
	  var effect = 0;
	  $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetLifeStyleDetail',
		async:false,
		data: {Module:Module},
		success: function(result) {  
			$(result).find('Table1').each(function(){		
			  sid = $(this).find("StyleId").text();
			  changes = $(this).find("CurativeEffect").text();
			  strs='<tr><td><div class="checkboxRound"><input type="checkbox" name="LifeStyle" id="' 
				+ sid + '" value="' + sid + '" data-role="none" />' 
				+ '<label for="' + sid + '"></label></div></td><td>' 
				+ $(this).find("Name").text() + '</td><td>' 
				+ $(this).find("Instruction").text() + '</td><td>' 
				+ changes + $(this).find("Unit").text() + '</td><td>' 
				+ $(this).find("SideEffect").text() + '</td></tr>';
			  $("#LifeStyleBody").append(strs);  	
		  });		
		}, 
		error: function(msg) {alert("Error! loadLifeStyle");}
	  });
	  
	  if(PLType == 1)
	  {
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetPsTaskByType',
			  async:false,
			  data: {PlanNo:PlanNo, Type:"LifeStyle"},
			  success: function(result) {  
				  $(result).find('Table1').each(function(){		
					sid = $(this).find("Code").text();
					$("input:checkbox[id='" + sid +"']").attr('checked', 'true');
				});		
			  }, 
			  error: function(msg) {alert("Error! loadLifeStyle");}
		  });	  
	  }
  }
  
  //加载以往的“药物治疗”记录
  function loadDrugList(){	  
	  $("#LastDrugListDiv").empty();
	  var strdl = "";
	  if(PLType == 1)
	  {
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetPsTaskByType',
			  async:false,
			  data: {PlanNo:PlanNo, Type:"Drug"},
			  success: function(result) {  
			      if($(result).find('Table1').length > 0){
					  strdl += '<h4>△上次计划中使用的药品：';
			          $(result).find('Table1').each(function(){		
					      strdl += $(this).find("CodeName").text() + '（' + $(this).find("Instruction").text() + '）；';
				      });
					  strdl = strdl.substr(0, strdl.length - 1);
					  strdl += '</h4>';
	                  $("#LastDrugListDiv").append(strdl);
				  }
			  }, 
			  error: function(msg) {alert("Error! loadDrugList");}
		  });
		  
	  }
  }
  
  //获得患者的药嘱记录
  function getPatientDrugRecord(){
	  
	  $("#popupDrugDiv").empty(); 
	  var strdr = "";
	  var content = "";
	  var drugId = "";
	  var otherDetail = "";
	  var divsty;
	  $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetPatientDrugRecord',
		async:false,
		data: {PatientId:PatientId,Module:Module},
		success: function(result) {  
			if($(result).find('Table1').length > 0){
				strdr += '<fieldset data-role="controlgroup">';
	
				$(result).find('Table1').each(function(){
					content = $(this).find("DrugName").text() + '—' + $(this).find("Administration").text() 
						+ '—' + $(this).find("Frequency").text() + '，1次' + $(this).find("Dosage").text() + $(this).find("DosageUnits").text();
					drugId = $(this).find("VisitId").text() + '#' + $(this).find("OrderNo").text() + '#' + $(this).find("OrderSubNo").text();
					otherDetail = $(this).find("OrderCode").text()
						+ '#' + $(this).find("CurativeEffect").text() + '#' + $(this).find("SideEffect").text() 
						+ '#' + $(this).find("Instruction").text() + '#' + $(this).find("Unit").text();
					
					strdr += '<input type="checkbox" name="drugrecord" id="' + drugId + '" value="' + otherDetail +'">'
						+'<label for="' + drugId +'">' + content + '</label>';  	
				});
				strdr += '</fieldset>';
				divsty = {height:'250px',width:'400px',overflow:'auto'};
				$("#popupDrugDiv").css(divsty);
				$("#popupDrugDiv").append(strdr); 
				$("#popupDrugDiv").trigger("create");	
			}
			else{
				$("#drugBtn").css("visibility", "hidden");
				$("#drugTitle").text("药物治疗：该患者暂无药嘱");
			}
		}, 
		error: function(msg) {alert("Error! getPatientDrugRecord");}
	  });
  }
  
  //选择药嘱，生成药物治疗列表
  function setPsDrug(){
	  $("#DrugListTable").empty();
	  var druginfo = "";
	  var druginfo2 = "";
	  var strpd = "";
	  var drugeffect = 0;
	  strpd += '<thead><tr><th></th><th>用法</th><th>频次及用量</th><th>说明</th><th>效果</th><th>副作用</th></tr></thead><tbody id="DrugListBody">';
	  $("input[name='drugrecord']:checked").each(function () {
		  druginfo = this.value.toString().split('#');
		  druginfo2 = $(this).siblings(0).text().split('—');
		  strpd += '<tr><td style="display:none;">' + druginfo[0] + '</td><td>' 
		  		  + druginfo2[0] +'</td><td>'
				  + druginfo2[1] + '</td><td>'
		          + druginfo2[2] + '</td><td>' 
				  + druginfo[3] + '</td><td>' 
				  + druginfo[1] + druginfo[4] + '</td><td>' 
				  + druginfo[2] + '</td></tr>';
		  drugeffect += parseInt(druginfo[1] != ""? druginfo[1]: "0");	    	
	  });
	  
	  strpd += '</tbody>';
	  $("#DrugListTable").empty();
	  $("#DrugListTable").append(strpd);  
	  
  }  
  
  
  
  //创建计划，插入Ps.Task
  function setPsTask(){
	  
	  var SBPValue = $("#SBPValue").val();
		var DBPValue = $("#DBPValue").val();
		
		var curSBPValue = $("#curSBPValue").val();
		var curDBPValue = $("#curDBPValue").val();
		
		var StartDate = new Date().Format("yyyyMMdd");
		var EndDate = $("#EndDate").val().replace(/-/g,"");
		
		if(PlanNo == "")
		{
		}
		else
		{
			editPlanStatus(PlanNo);
		}
		NewPlanNo = GetNewPlanNo();
		SetPlan(NewPlanNo, PatientId, StartDate, EndDate, Module, Status, DoctorId, piUserId, piTerminalName, piTerminalIP, piDeviceType);
		
		InsertTargetBP(NewPlanNo,1,"Bloodpressure","Bloodpressure_1",SBPValue,curSBPValue);
		InsertTargetBP(NewPlanNo,2,"Bloodpressure","Bloodpressure_2",DBPValue,curDBPValue);
		//alert(NewPlanNo);
		InsertCurBP(curSBPValue,"Bloodpressure_1");
			InsertCurBP(curDBPValue,"Bloodpressure_2");
	  
	var task_str = "";
	//task_str += 'VitalSign#Bloodpressure|Bloodpressure_1#@' + 'VitalSign#Bloodpressure|Bloodpressure_2#@';
	task_str += 'VitalSign#Bloodpressure|Bloodpressure_1#@' + 'VitalSign#Bloodpressure|Bloodpressure_2#@'+ 'VitalSign#Pulserate|Pulserate_1#@';

	$("input[name='LifeStyle']:checked").each(function () {
		task_str = task_str + this.name.toString() + '#' + this.value.toString() + '#@'; 
	});
	
	
	//$("input[name='Drug']:checked").each(function () {
	//	task_str = task_str + this.name.toString() + '#' + this.value.toString() + '@'; 
	//});
	if($("#DrugListTable").find("tbody"))
	{
		for(var i = 0; i < $("#DrugListTable").find("tbody").find("tr").length; i++){
			task_str = task_str + 'Drug#' + $("#DrugListBody tr:eq(" + i + ") td:eq(0)").text().trim() + '#' 
				+ $("#DrugListBody tr:eq(" + i + ") td:eq(2)").text().trim() + '，' + $("#DrugListBody tr:eq(" + i + ") td:eq(3)").text().trim() + '@';		
		}
	}
	
	if(task_str != ""){
		task_str = task_str.substring(0,task_str.length-1);	
	}
	
	taskTemp = task_str.split('@');
	taskLength = taskTemp.length;
	//alert(task_str.length);
	
	if(task_str != ""){
		$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/CreateTask',
			async:false,
			data: {PlanNo: NewPlanNo,
				   Task: task_str,
				   UserId: piUserId,
				   TerminalName: piTerminalName,
				   TerminalIP: piTerminalIP,
				   DeviceType: piDeviceType
				   },
			success: function(result) { 
				 if($(result).text()){
					 //$.mobile.changePage("#StartPlanPage");
					 
					 //SetCompliance
					 //var DDate = new Date().Format("yyyyMMdd");
					 SetCompliance(PatientId,StartDate,NewPlanNo,0);
					 //SetComplianceDetail
					 var Parent = PatientId + "||" + StartDate + "||" + NewPlanNo;
					 var i;
					 //for (i=1;i<=taskLength;i++){
//						 SetComplianceDetail(Parent,i,0);
//					 }

					for (i=1;i<=taskLength;i++){
						 if(i==1||i==2){
							SetComplianceDetail(Parent,i,1);
						 }
						 else{							 
						 	SetComplianceDetail(Parent,i,0);
						 }
					 }
					 	
					 	
					 $("#nav3").addClass("ui-btn-active");				 
					 location.reload();
				 }  
				 else{
					 alert("任务创建失败");
				 }
			},
			error: function(msg) {alert("Error! setPsTask");}
		});
	}
	else{alert("请选择任务")};
  }  
  
  function SetCompliance(PatientId,DDate,NewPlanNo,Compliance){
	   $.ajax({  
		  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetCompliance',
		  async:false,
		  data: {PatientId:PatientId,
		         DDate:DDate,
				 PlanNo:NewPlanNo,
		         Compliance:Compliance,
				 revUserId:piUserId,
		         TerminalName:piTerminalName,
				 TerminalIP:piTerminalIP,
		         DeviceType:piDeviceType,
				 },//输入变量
		  success: function(result) { 
		  	//ret = $(result).text();
		  },
		  error: function(msg) {alert("SetComplianceError!");}
	  });
  }
  
  function SetComplianceDetail(Parent,Id,Status){
	   $.ajax({  
		  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetComplianceDetail',
		  async:false,
		  data: {Parent:Parent,
		         Id:Id,
				 Status:Status,	         
				 CoUserId:piUserId,
		         CoTerminalName:piTerminalName,
				 CoTerminalIP:piTerminalIP,
		         CoDeviceType:piDeviceType,
				 },//输入变量
		  success: function(result) { 
		  	//ret = $(result).text();
		  },
		  error: function(msg) {alert("SetComplianceError!");}

	  });
  }
  
  function GetNewPlanNo(){
	  var ret;
	  $.ajax({  
		  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetNo',
		  async:false,
		  data: {NumberingType:15,
		         TargetDate:""
				 },//输入变量
		  success: function(result) { 
		  	ret = $(result).text();
		  },
		  error: function(msg) {alert("GetNewPlanNoError!");}
	  });
	  return ret;
  }
  
  function editPlanStatus(PlanNo){
	  $.ajax({  	  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/PlanStart',
		  async:false,
		  data: {	PlanNo: PlanNo,
				   Status: 4,
				   piUserId: piUserId,
				   piTerminalName: piTerminalName,
				   piTerminalIP: piTerminalIP,
				   piDeviceType: piDeviceType
				 },//输入变量
		  success: function(result) { 
		  	//ret = $(result).text();
		  },
		  error: function(msg) {alert("editPlanStatusError!");}
	  });
	  //return ret;
  }
  
  //日期格式转换
  Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//插入当前收缩压 Ps.VitalSign
    function InsertCurBP(CurSbp,ItemCode)
    {
		var ret = false;
	  //var CurSbp=$('#TextInput1').val();

		  var RecordDate ="";
		  var RecordTime = "";
		  
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
			  async:false,
			  data: {},
			  beforeSend: function(){},
			  success: function(result) {
				  RecordDate =  $(result).text().slice(0,10).replace(/-/g,"");	
				  RecordTime = $(result).text().slice(11,16).replace(/:/g,"");	 
			  }, 
			  error: function(msg) {alert("GetServerTimeError!");}
		  });
	  
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/SetPatientVitalSigns',
			  async:false,
			  data: {UserId:localStorage.getItem('PatientId'),
					 RecordDate:RecordDate,
					 RecordTime:RecordTime,
					 ItemType:"Bloodpressure",
					 ItemCode:ItemCode,
					 Value:CurSbp,
					 Unit:"mmHg",
					 revUserId:localStorage.getItem('UserId'),
					 TerminalName:localStorage.getItem('TerminalName'),
					 TerminalIp:localStorage.getItem('TerminalIp'),
					 DeviceType:localStorage.getItem('DeviceType')
					 },//输入变量
			  beforeSend: function(){},
			  success: function(result) {
				 ret =  $(result).text();
//				  //alert(RecordDate);
//				  var SBP = CurSbp;
//				  GetDescription(SBP); 
		 
			 },
			 error: function(msg) {alert("InsertcurBPError!");
			 
			 ret =false;} 
		  });
	  return ret;
    }  
