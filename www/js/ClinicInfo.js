  
  
  		  //临床信息同步的下拉选项改变 监控
  $('#syn_Hospital').change(function(){ 
	      HospitalChange($(this).children('option:selected').val());  //下拉框切换体征
	   });	
  
 function OpenClinicInfoPanel()
{
	//弹出框，正在加载中
   $( "#ClinicInfoPanel" ).panel("open");
   document.getElementById("historyButton").style.display = "none";
    document.getElementById("history_loading").style.display = "block";
    setTimeout(function(){Clinic_initialization();},200);
	
	var opt = {
        preset: 'date', //日期
        theme: 'jqm', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'clickpick', //日期选择模式
        dateFormat: 'yyyy-MM-dd', // 日期格式
        setText: '确定', //确认按钮名称
        cancelText: '取消',//取消按钮名籍我
        dateOrder: 'yymmdd', //面板中日期排列格式
        dayText: '日', monthText: '月', yearText: '年', //面板中年月日文字
        //endYear:2020 //结束年份
    };
    
    $('input:jqmData(role="datebox")').mobiscroll(opt);
}
  
  
  //时间轴界面初始化
 function Clinic_initialization()
{  
   
  //同步部分
   syn_initial(); 
   
    //时间轴部分
	document.getElementById("historyUl").innerHTML="";
   document.getElementById("AdmissionDateMark").value = "1897-01-01 00:00:00";  
   document.getElementById("ClinicDateMark").value = "1897-01-01 00:00:00";  
   var Clinic_length=GetMoreClinic();
   if(Clinic_length > 0){
		  var target = document.getElementById("demo");
		  target.style.display = "block";
		  var target = document.getElementById("norecord");
		  target.style.display = "none";
      }
	  else{
		  var target = document.getElementById("demo");
		  target.style.display = "none";
		  var target = document.getElementById("norecord");
		  target.style.display = "block";
      }
   
   //显示panel
   //$( "#ClinicInfoPanel" ).panel("open");
    /**/
}
 
 function GetMoreClinicBut()
 { 
 
      document.getElementById("history_loading").style.display = "block";
	  document.getElementById("historyButton").style.display = "none";
      setTimeout(function(){GetMoreClinic();},200);
      
	  
 }
 
 
 
   //获取时间轴信息  length有什么用？
  function GetMoreClinic() {
	  var length=0;
	 document.getElementById("history_loading").style.display = "block";
	// $("#pop_historyLoading").popup("open");
	  document.getElementById("historyButton").style.display = "none";

	  var admissionDateMark = document.getElementById("AdmissionDateMark").value;
	  var clinicDateMark = document.getElementById("ClinicDateMark").value;

	  $.ajax({

		  url:  'http://'+serverIP+'/'+serviceName+'/GetClinicalNewMobile',
		  type: "GET",
		  dataType: "json",
		  async: false,
		  data: { UserId: localStorage.getItem('PatientId'), AdmissionDate: admissionDateMark, ClinicDate: clinicDateMark, Num: 1},//localStorage.getItem('PatientId')
		  success: function (res) {

			  document.getElementById("AdmissionDateMark").value = res.AdmissionDateMark;  
			  document.getElementById("ClinicDateMark").value = res.ClinicDateMark;

				  length=res.History.length;
				  if (res.History.length > 0) {
					  var str = '';
					  for (var i = 0; i < res.History.length; i++) {
						  str += '<li><h3>' + res.History[i].Time + '</h3> <div class="cbp_tmlabel" id="' + res.History[i].Color + '">';
						  str += '<span class="tag-' + res.History[i].Color + '">' + res.History[i].Tag + '</span>  ';
					 
						  for (var j = 0; j < res.History[i].ItemGroup.length; j++) {
							  if ((res.History[i].ItemGroup[j].Type == "入院") || (res.History[i].ItemGroup[j].Type == "出院") || (res.History[i].ItemGroup[j].Type == "门诊") || (res.History[i].ItemGroup[j].Type == "急诊") || (res.History[i].ItemGroup[j].Type == "当前住院中") || (res.History[i].ItemGroup[j].Type == "转科")) {
								  str += ' <p class="Item" id="">' + res.History[i].ItemGroup[j].Time + '<span style="margin-left:20px;">' + res.History[i].ItemGroup[j].Event + '</span></p>';
							  }
							  else {
							  str += '<p><a href="javascript:void(0);"  class="Itemhref" id=' + res.History[i].ItemGroup[j].KeyCode +' onclick="OpenClinicInfoDetail(this.id);">' + res.History[i].ItemGroup[j].Time + '&nbsp;&nbsp;' + res.History[i].ItemGroup[j].Event + '</a></p>';
							  }
						  }
						  str += '</li>';
					  }
					  
					  document.getElementById("history_loading").style.display = "none";
					  $("#historyUl").append(str);
					 //setTimeout(function(){$("#pop_historyLoading").popup("close");},50); 
					  document.getElementById("historyButton").style.display = "block";
					  //$("#historyButton").show();
				  }
				  
				  else {
					  //$("#historyButton").hide();
		              document.getElementById("historyButton").style.display = "none";
				  }
                      document.getElementById("history_loading").style.display = "none";
			 	},
	error: function (msg) {
		alert("GetMoreClinic 出错啦！");
	}
   });

	  return length;
  }
  
  
  //获取时间轴点击 显示详细信息弹窗
  function OpenClinicInfoDetail(keycode) {
	  //拆解keycode
	   //alert(keycode);
	  var keycode_split=keycode.split("|",3);
	  var Type = keycode_split[0];
	  var VisitId = keycode_split[1];
	  var DateT = keycode_split[2];
	  var TypeStr="类别："
	  
	  //基本信息
	  document.getElementById("ClinicalDetail_PatientId").innerHTML=localStorage.getItem('PatientId');
	  document.getElementById("ClinicalDetail_NowDate").innerHTML=DateT.substr(0,10); 
	  $.ajax({
		  url:  'http://'+serverIP+'/'+serviceName+'/GetPatBasicInfo',
		  type: "GET",
		  dataType: "xml",
		  async: false,
		  data: { UserId: localStorage.getItem('PatientId')},
		  success: function (res) {
				  document.getElementById("ClinicalDetail_UserName").innerHTML=$(res).find('UserName').text();

		  }
	  });
	  
	  //表格thead
	  document.getElementById("table-column-toggle-tbody").innerHTML="";
	  document.getElementById("table-ClinicInfoDetailByType-thead").innerHTML="";
	  document.getElementById("table-ClinicInfoDetailByType-tbody").innerHTML=""; 
	  if(Type=="DrugRecord")
	  {
		  TypeStr+="用药信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>长期医嘱标志</th><th data-priority='2'>药嘱类别</th><th>药嘱内容</th><th data-priority='4'>药品一次使用剂量</th><th data-priority='5'>剂量单位</th><th data-priority='6'>给药途径</th><th data-priority='7'>开始时间</th><th data-priority='8'>结束时间</th><th data-priority='9'>执行频率描述</th></tr>";
			   
	  }
	  else if(Type=="DiagnosisInfo")
	  {
		  TypeStr+="诊断信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>诊断类型</th><th data-priority='2'>诊断种类</th><th>诊断名称</th><th data-priority='4'>描述</th><th  data-priority='5'>记录时间</th></tr>";
	  }
	  else if(Type=="ExaminationInfo")
	  {
		  TypeStr+="检查信息";
		  
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='2'>检查类型</th><th data-priority='2'>检查日期</th><th>检查项目名称</th><th data-priority='4'>检查参数</th><th data-priority='5'>检查所见</th><th data-priority='6'>印象</th><th data-priority='7'>建议</th><th data-priority='8'>是否阳性</th><th data-priority='9'>检查结果状态</th><th data-priority='10'>报告日期</th><th data-priority='11'>图像地址</th></tr>";

	  }
	  else
	  {
		  TypeStr+="化验信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>化验类型</th><th>化验项目名称</th><th data-priority='6'>化验日期</th><th data-priority='4'>化验结果状态</th><th data-priority='5'>报告日期</th><th data-priority='3'>具体参数</th></tr>";
	  }
	  document.getElementById("DetailType").innerHTML=TypeStr;
	  
	  //表格内容
	  $.ajax({
		  url:  'http://'+serverIP+'/'+serviceName+'/GetClinicInfoDetail',
		  type: "GET",
		  dataType: "xml",
		  async: false,
		  data: { UserId: localStorage.getItem('PatientId'), Type: Type, VisitId: VisitId, Date: DateT }, //"PID201506180001"localStorage.getItem('PatientId')
		  success: function (res) {
			  
				  $(res).find('Table1').each(function() {
					  
					  
					  if(Type=="DrugRecord")
					  {
						  var RepeatIndicator=$(this).find("RepeatIndicator").text();
						  var OrderClass=$(this).find("OrderClass").text();
						  var OrderContent=$(this).find("OrderContent").text();
						  var Dosage=$(this).find("Dosage").text();
						  var DosageUnits=$(this).find("DosageUnits").text();
						  var Administration=$(this).find("Administration").text();
						  var StartDateTime=$(this).find("StartDateTime").text();
						  var StopDateTime=$(this).find("StopDateTime").text();
						  var Frequency=$(this).find("Frequency").text();
		  
						  var trcontent="<tr><td>"+RepeatIndicator+"</td><td>"+OrderClass+"</td><td>"+OrderContent+"</td><td>"+Dosage+"</td><td>"+DosageUnits+"</td><td>"+Administration+"</td><td>"+StartDateTime+"</td><td>"+StopDateTime+"</td><td>"+Frequency+"</td></tr>";
					  
						  $("#table-column-toggle-tbody").append(trcontent);
					  }
					  
					  else if(Type=="DiagnosisInfo")
					  {
						  
						  var DiagnosisTypeName=$(this).find("DiagnosisTypeName").text();
						  var TypeName=$(this).find("TypeName").text();
						  var DiagnosisName=$(this).find("DiagnosisName").text();
						  var Description=$(this).find("Description").text();
						  var RecordDateShow=$(this).find("RecordDateShow").text();
						  var trcontent= "<tr><td>"+DiagnosisTypeName+"</td><td>"+TypeName+"</td><td>"+DiagnosisName+"</td><td>"+Description+"</td><td>"+RecordDateShow+"</td></tr>";
						  $("#table-column-toggle-tbody").append(trcontent);
						  
					  }
					  
					  else if(Type=="ExaminationInfo")
					  {
						  var ExamTypeName=$(this).find("ExamTypeName").text();
						  var ExamDate=$(this).find("ExamDate").text();
						  var ItemName=$(this).find("ItemName").text();
						  var ExamPara=$(this).find("ExamPara").text();
						  var Description=$(this).find("Description").text();
						  var Impression=$(this).find("Impression").text();
						  var Recommendation=$(this).find("Recommendation").text();
						  var IsAbnormal=$(this).find("IsAbnormal").text();
						  var Status=$(this).find("Status").text();
						  var ReportDate=$(this).find("ReportDate").text();
						  var ImageURL=$(this).find("ImageURL").text();
						  //var SortNo=$(this).find("SortNo").text();
						  //var ItemCode=$(this).find("ItemCode").text();
						  
						 var trcontent="<tr><td>"+ExamTypeName+"</td><td>"+ExamDate+"</td><td>"+ItemName+"</td><td>"+ExamPara+"</td><td>"+Description+"</td><td>"+Impression+"</td><td>"+Recommendation+"</td><td>"+IsAbnormal+"</td><td>"+Status+"</td><td>"+ReportDate+"</td><td>"+ImageURL+"</td></tr>";
						 //<td id='ClinicInfoDetailByType-ExaminationInfo'><a id = "+localStorage//.getItem('PatientId')+"|"+VisitId+"|"+SortNo+"|"+ItemCode+' onclick="OpenClinicInfoDetailExam(this.id);">详细</a></td>
			  
						  $("#table-column-toggle-tbody").append(trcontent);
					  }
					  
					  else if(Type=="LabTestInfo")
					  {
						  var LabItemTypeName=$(this).find("LabItemTypeName").text();
						  var LabItemName=$(this).find("LabItemName").text();
						  var LabTestDate=$(this).find("LabTestDate").text();
						  var Status=$(this).find("Status").text();
						  var ReportDate=$(this).find("ReportDate").text();
						  var SortNo=$(this).find("SortNo").text();
						  var LabItemCode=$(this).find("LabItemCode").text();
						  var trcontent="<tr><td>"+LabItemTypeName+"</td><td>"+LabItemName+"</td><td>"+LabTestDate+"</td><td>"+Status+"</td><td>"+ReportDate+"</td><td id='ClinicInfoDetailByType-LabTestInfo'><a id = "+localStorage.getItem('PatientId')+"|"+VisitId+"|"+SortNo+"|"+LabItemCode+' onclick="OpenClinicInfoDetailLab(this.id);">详细</a></td></tr>';

						  $("#table-column-toggle-tbody").append(trcontent);
					  }
					  else
					  {
						  alert("Wrong Type!");
					  }
						  
				  }); 
			  }
		  });
	  $("#table-column-toggle").table("refresh");
	  
	  if(Type=="LabTestInfo")
	  {
		    document.getElementById("detail_detail_overflow").style.display = "block";
			document.getElementById("detail_overflow").style.height=200;
	  }
	  else
	  {
		  document.getElementById("detail_detail_overflow").style.display = "none";
		  document.getElementById("detail_overflow").style.height=160;
	  }
	  //$( "#ClinicInfoDetail-form" ).panel("open");
	  //$( "#ClinicInfoDetail-form" ).trigger( "updatelayout" );
	  
	  //
	  $("#ClinicalDetailPop").popup("open");
  }
  
  
  
  //显示化验子表详细信息  检查不再显示子表
  
function OpenClinicInfoDetailLab(TypeId) {

	  var TypeId_split=TypeId.split("|",4);
	  var UserId = TypeId_split[0];
	  var VisitId = TypeId_split[1];
	  var SortNo = TypeId_split[2];
	  var ItemCode = TypeId_split[3];
	  
	  document.getElementById("table-ClinicInfoDetailByType-tbody").innerHTML="";
	  document.getElementById("table-ClinicInfoDetailByType-thead").innerHTML="<tr><td>参数名称</td><td>参数值</td><td>单位</td><td>是否正常</td></tr>";
	  
	  
	  $.ajax({
		  url:  'http://'+serverIP+'/'+serviceName+'/GetLabTestDtlList',
		  type: "GET",
		  dataType: "xml",
		  async: false,
		  data: { UserId: UserId, VisitId: VisitId, SortNo: SortNo, ItemCode: ItemCode },//"PID201506180001"
		  success: function (res) {
			  
				  $(res).find('Table1').each(function() {
					  
						  var Name=$(this).find("Name").text();
						  var Value=$(this).find("Value").text();
						  var Unit=$(this).find("Unit").text();
						  var IsAbnormal=$(this).find("IsAbnormal").text();
					  
						  var trcontent="<tr><td>"+Name+"</td><td>"+Value+"</td><td>"+Unit+"</td><td>"+IsAbnormal+"</td></tr>";

					  
						  $("#table-ClinicInfoDetailByType-tbody").append(trcontent);
				  }); 
			  }
		  });
	  $("#table-ClinicInfoDetailByType").table("refresh");
	  $( "#ClinicInfoDetail-form" ).trigger( "updatelayout" );
  }
  

  
  //进入页面调取初始化函数
function syn_initial()
{   
   var syn_HospitalCode="";
   //获取医院下拉框
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://' + serverIP + '/' + serviceName + '/GetHospitalList',
	async: false,
	data:
	{ },
	beforeSend: function () {
	},
	success: function (result) {
		var str_Hospital='';
		$(result).find('Table1').each(function(){	
		   var syn_HosCode= $(this).find("Code").text();
		   var syn_HosName= $(this).find("Name").text(); 
		   str_Hospital+='<option value="'+syn_HosCode+'" id="">'+ syn_HosName+'</option>';
		});

		$('#syn_Hospital').append(str_Hospital); 
		$("#syn_Hospital").selectmenu('refresh', true);  
		
		syn_HospitalCode=$(result).find('Table1').first().find("Code").text();
	},
	error: function (msg) {
		alert("initialization GetHospitalList出错啦！");
	}
   });

   //获取最近已有就诊ID
   $.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://' + serverIP + '/' + serviceName + '/getLatestHUserIdByHCode',
	async: false,
	data:
	{UserId:localStorage.getItem('PatientId'),//"PID201506170005"
	 HospitalCode:syn_HospitalCode},
	beforeSend: function () {
	},
	success: function (result) {
		
		  document.getElementById("syn_ID").value=$(result).find('string').text();

	},
	error: function (msg) {
		alert("initialization GetHospitalList出错啦！");
	}
   });

}

 //同步：就诊医院与最新就诊id的联动
function HospitalChange(selectedValue)
{
	document.getElementById("syn_ID").value="";
	//获取最近已有就诊ID
   $.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://' + serverIP + '/' + serviceName + '/getLatestHUserIdByHCode',
	async: false,
	data:
	{UserId:localStorage.getItem('PatientId'),
	 HospitalCode:selectedValue},
	beforeSend: function () {
	},
	success: function (result) {
		
		  document.getElementById("syn_ID").value=$(result).find('string').text();
	},
	error: function (msg) {
		alert("initialization HospitalChange出错啦！");
	}
   });
}




function synchronization()
{ 
   //PatientId 全局变量？
   var syn_Hospital = document.getElementById("syn_Hospital").value;
   var syn_ID = document.getElementById("syn_ID").value;
   var syn_StartDate = document.getElementById("syn_StartDate").value; //输出形式""或"2015-07-03"

   if (syn_StartDate == "")
   {
	  syn_StartDate = "1900-01-01";
   }
  
   //输入有效性验证
   var mark=0;
   if(syn_ID =="")
   { 
       //$("#syn_ID").placeholder="就诊ID必填"
	   
	   $("#AlertSyn_ID").popup("open");
	   setTimeout(function(){$("#AlertSyn_ID").popup("close");},1000);
	   $("#syn_ID").focus();
	   //document.getElementById("AlertSyn_ID").style.display = "block";
   }
   else
   {
	   mark=1;
	   //document.getElementById("AlertSyn_ID").style.display = "none";
   }
   
   if(mark==1)
   {
       //$("#AlertSynInfoText").val()="加载中...";
	   //document.getElementById("AlertSynInfoText").innerHTML="加载中...";
       $("#AlertSynInfo").popup("open");
       setTimeout(function(){synchronization_continue( syn_ID,syn_StartDate,syn_Hospital);},200); 
       //synchronization_continue( syn_ID,syn_StartDate,syn_Hospital);
   }
}


function synchronization_continue(syn_ID,syn_StartDate,syn_Hospital)
{   
	   //Progressbar();
       //$.mobile.loading( "hide" );

	 $.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
url: 'http://' + synInfoIP + '/csp/' + synInfoSpace +'/Bs.WebService.cls?soap_method=GetPatient',
	//url: 'http://10.13.22.139:57772/csp/hz_mb/Bs.WebService.cls?soap_method=GetPatient',
	async: false,
	data:
	{ 
		UserId:localStorage.getItem('PatientId'),
		PatientId:syn_ID,   //实际是医院就诊号
		StartDateTime:syn_StartDate,
		HospitalCode:syn_Hospital,
	},
	beforeSend: function () {
		//滚动条显示正在加载 弹窗覆盖在上
		//alert(localStorage.getItem('PatientId'));
		//alert(syn_ID);
		//alert(syn_StartDate);
		//alert(syn_Hospital);
		 //$("#AlertSynInfoText").innerHTML="加载中...";
	     //$("#AlertSynInfo").popup("open");
	},
	success: function (result) {

         $("#AlertSynInfo").popup("close");
		 if (result != "") 
		 {
			  //同步成功，刷新临床信息时间轴（清空在加载）
			  document.getElementById("demo").style.display = "block";
		      document.getElementById("norecord").style.display = "none";
			 document.getElementById("historyUl").innerHTML="";
			 document.getElementById("history_loading").style.display = "block";
			 document.getElementById("historyButton").style.display = "none";
             setTimeout(function(){Clinic_initialization();},500);
		 }
		 else 
		 {
			  document.getElementById("AlertSynInfoText").innerHTML="数据集成失败，请重试！";
	          $("#AlertSynInfo").popup("open");
	          setTimeout(function(){$("#AlertSynInfo").popup("close");},1000);
			 //alert("数据集成失败，请重试！");
		  }
	},
	error: function (msg) {
		document.getElementById("AlertSynInfoText").innerHTML="数据集成失败，请重试！";
	    $("#AlertSynInfo").popup("open");
	    setTimeout(function(){$("#AlertSynInfo").popup("close");},1000);
		alert("initialization synchronization_continue出错啦！");
	}
});
   $("#AlertSynInfo").popup("close");
   }

  
  