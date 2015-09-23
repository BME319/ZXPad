 //“开始计划”页面初始化 
  function startPlanPageInit(){
	  GetPsTask(localStorage.getItem('NewPlanNo'));
	  GetPsTarget(localStorage.getItem('NewPlanNo'));
	
      GetBPGrades();
	  setTimeout(function(){
		  SBPBar($("#OSBP").val(),$("#TSBP").val(),SBPlist,chart_SBP_2);
		  },200);
	  setTimeout(function(){
		  DBPBar($("#ODBP").val(),$("#TDBP").val(),DBPlist,chart_DBP_2);
		  },200);
  
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
		  async:false,
		  data: {},
		  beforeSend: function(){},
		  success: function(result) {
		  	  $("#BeginDate").html($(result).text().slice(0,10));	    
		  }, 
		  error: function(msg) {alert("Error!");}
	  });	   
  }
  
  function trim(str) {  //删除左右两端的空格
      return str.replace(/(^\s*)|(\s*$)/g, "");
  } 
  
  
  //同步时间控件清零
    function Date_clear()
  {
	  document.getElementById("syn_StartDate").value="";
  }
  
  
   //进入临床信息页面调取初始化函数
function integration_initial()
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
		
		document.getElementById("syn_Hospital").innerHTML="";
		
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

   //获取最近已有最新就诊ID
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
		
		   document.getElementById("syn_ID").value="";
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


//临床信息同步——有效性验证
function integration_synchronization()
{ 
   $("#AlertSynInfoText").innerHTML="加载中...";
   $("#AlertSynInfo").popup("open");
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
	  //document.getElementById("AlertSynInfoText").innerHTML="加载中...";
      $("#AlertSynInfo").popup("open");
      setTimeout(function(){integration_synchronization_continue( syn_ID,syn_StartDate,syn_Hospital);},200);
   //integration_synchronization_continue();
   }
}


//临床信息同步——数据库操作
function integration_synchronization_continue(syn_ID,syn_StartDate,syn_Hospital)
{   

	 $.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
url:'http://' + synInfoIP + '/csp/' + synInfoSpace +'/Bs.WebService.cls?soap_method=GetPatient',
	//url: 'http://10.0.0.110:57772/csp/hz_mb/Bs.WebService.cls?soap_method=GetPatient',
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
			 document.getElementById("AdmissionDateMark").value = "1897-01-01 00:00:00";  
             document.getElementById("ClinicDateMark").value = "1897-01-01 00:00:00";
			 document.getElementById("history_loading").style.display = "block";
			 document.getElementById("historyButton").style.display = "none";
             setTimeout(function(){GetMoreClinic();},500);
			 integration_initial(); 
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
		alert("integration_synchronization_continue出错啦！");
	}
});
    $("#AlertSynInfo").popup("close");

   }



  
   //获取时间轴信息
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
		  data: { UserId: localStorage.getItem('PatientId'), AdmissionDate: admissionDateMark, ClinicDate: clinicDateMark, Num: 10},//localStorage.getItem('PatientId')
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
							  //str += '<p><a href="javascript:void(0);"  class="Itemhref" id=' + res.History[i].ItemGroup[j].KeyCode +' onclick="OpenClinicInfoDetail(this.id);">' + res.History[i].ItemGroup[j].Time + '&nbsp;&nbsp;' + res.History[i].ItemGroup[j].Event + '</a></p>';
                                //不同类型的标注
                                var type_class = "";
                                if (res.History[i].ItemGroup[j].Type == "诊断") {
                                    type_class = "Itemhref_Diagnosis";
                                }
                                else if (res.History[i].ItemGroup[j].Type == "检查") {
                                    type_class = "Itemhref_Examination";
                                }
                                else if (res.History[i].ItemGroup[j].Type == "化验") {
                                    type_class = "Itemhref_LabTest";
                                }
                                else if (res.History[i].ItemGroup[j].Type == "用药") {
                                    type_class = "Itemhref_Drug";
                                }
                                str += '<p class="' + type_class + '" ><a href="javascript:void(0)" id="' + res.History[i].ItemGroup[j].KeyCode + '" onclick="OpenClinicInfoDetail(this.id);">' + res.History[i].ItemGroup[j].Time + '&nbsp;&nbsp;' + res.History[i].ItemGroup[j].Event + '</a></p>';
                            
							  
							  }
						  }
						  str += '</li>';
					  }
					  
					  document.getElementById("history_loading").style.display = "none";
					  $("#historyUl").append(str);
					 //setTimeout(function(){$("#pop_historyLoading").popup("close");},50); 
					 
					if (res.mark_contitue == "1") {
                        //$("#historyButton").show();
                        document.getElementById("historyButton").style.display = "block";
                    }
                    else {
                        //$("#historyButton").hide();
                        document.getElementById("historyButton").style.display = "none";
                    }
					
					//只显示选择的类型
                    TypeChange();
					  //document.getElementById("historyButton").style.display = "block";
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


    //不同类型信息额才显示与隐藏（检查/化验等）
  function TypeChange() {
    $('#historyUl').find('li').each(function () {
        $(this).css({ display: 'block' });
    });

    //var type_selected = $("#type_chose").val();
	var type_selected = $("#type_chose").children('option:selected').val()
    if (type_selected == "all") {
        $('.Itemhref_Diagnosis ').css({ display: 'block' });
        $('.Itemhref_Examination ').css({ display: 'block' });
        $('.Itemhref_LabTest ').css({ display: 'block' });
        $('.Itemhref_Drug ').css({ display: 'block' });
    }
    else {
        $('.Itemhref_Diagnosis').css({ display: 'none' });
        $('.Itemhref_Examination').css({ display: 'none' });
        $('.Itemhref_LabTest').css({ display: 'none' });
        $('.Itemhref_Drug').css({ display: 'none' });
        $('.' + type_selected).css({ display: 'block' });
    }

    //空框被隐藏
    $('#historyUl').find('li').each(function () {
        var mark = 0;
        $(this).find('p').each(function () {
            if ($(this).css("display") == "block") {
                mark = 1;
            }
        });
        if (mark == 0) {
            $(this).css({ display: 'none' });
        }
    });

    }


  function OpenClinicInfoDetail(keycode) {

	  var keycode_split=keycode.split("|",3);
	  var Type = keycode_split[0];
	  var VisitId = keycode_split[1];
	  var DateT = keycode_split[2];
	  var TypeStr="类别："
	  document.getElementById("table-column-toggle-tbody").innerHTML="";
	  document.getElementById("table-ClinicInfoDetailByType-thead").innerHTML="";
	  document.getElementById("table-ClinicInfoDetailByType-tbody").innerHTML="";
	  if(Type=="DrugRecord")
	  {
		  TypeStr+="用药信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>长期医嘱标志</th><th data-priority='1'>药嘱类别</th><th>药嘱内容</th><th data-priority='1'>药品一次使用剂量</th><th data-priority='1'>剂量单位</th><th data-priority='1'>给药途径</th><th data-priority='1'>开始时间</th><th data-priority='1'>结束时间</th><th data-priority='1'>执行频率描述</th></tr>";
			   
	  }
	  else if(Type=="DiagnosisInfo")
	  {
		  TypeStr+="诊断信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>诊断类型</th><th data-priority='1'>诊断种类</th><th>诊断名称</th><th data-priority='1'>描述</th><th  data-priority='1'>记录时间</th></tr>";
	  }
	  else if(Type=="ExaminationInfo")
	  {
		  TypeStr+="检查信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>检查类型</th><th data-priority='1'>检查日期</th><th>检查项目名称</th><th data-priority='1'>检查参数</th><th data-priority='1'>检查所见</th><th data-priority='1'>印象</th><th data-priority='1'>建议</th><th data-priority='1'>是否阳性</th><th data-priority='1'>检查结果状态</th><th data-priority='1'>报告日期</th><th data-priority='1'>图像地址</th></tr>";//<th data-priority='12'>具体参数</th>
	  }
	  else
	  {
		  TypeStr+="化验信息";
		  document.getElementById("table-column-toggle-thead").innerHTML="<tr><th data-priority='1'>化验类型</th><th>化验项目名称</th><th data-priority='1'>化验日期</th><th data-priority='1'>化验结果状态</th><th data-priority='1'>报告日期</th><th data-priority='1'>具体参数</th></tr>";
	  }
	  document.getElementById("DetailType").innerHTML=TypeStr;
	  document.getElementById("NowDate").innerHTML=DateT.substr(0,10);
	  
		  
	  $.ajax({
		  url:  'http://'+serverIP+'/'+serviceName+'/GetPatBasicInfo',
		  type: "GET",
		  dataType: "xml",
		  async: false,
		  data: { UserId: localStorage.getItem('PatientId')},
		  success: function (res) {
			  
				  document.getElementById("UserName").innerHTML=$(res).find('UserName').text();

		  }
	  });
	  
	  
	  $.ajax({
		  url:  'http://'+serverIP+'/'+serviceName+'/GetClinicInfoDetail',
		  type: "GET",
		  dataType: "xml",
		  async: false,
		  data: { UserId: localStorage.getItem('PatientId'), Type: Type, VisitId: VisitId, Date: DateT },
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
						  var SortNo=$(this).find("SortNo").text();
						  var ItemCode=$(this).find("ItemCode").text();
						  
						 var trcontent="<tr><td>"+ExamTypeName+"</td><td>"+ExamDate+"</td><td>"+ItemName+"</td><td>"+ExamPara+"</td><td>"+Description+"</td><td>"+Impression+"</td><td>"+Recommendation+"</td><td>"+IsAbnormal+"</td><td>"+Status+"</td><td>"+ReportDate+"</td><td>"+ImageURL+"</td></tr>";//<td id='ClinicInfoDetailByType-ExaminationInfo'><a id = "+localStorage.getItem('PatientId')+"|"+VisitId+"|"+SortNo+"|"+ItemCode+' onclick="OpenClinicInfoDetailExam(this.id);">详细</a></td>
			  
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
		  
		  /*
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
		  
		  */
	  $("#table-column-toggle").table("refresh");
	  $( "#ClinicInfoDetail-form" ).trigger( "updatelayout" );
  }
  
  
  
  function OpenClinicInfoDetailExam(TypeId) {

	  var TypeId_split=TypeId.split("|",4);
	  var UserId = TypeId_split[0];
	  var VisitId = TypeId_split[1];
	  var SortNo = TypeId_split[2];
	  var ItemCode = TypeId_split[3];
	  
	  document.getElementById("table-ClinicInfoDetailByType-tbody").innerHTML="";
	  document.getElementById("table-ClinicInfoDetailByType-thead").innerHTML="<tr><td>参数编码名称</td><td>参数值</td><td>单位</td><td>是否正常</td></tr>";
	  
	  
	  $.ajax({
		  url:  'http://'+serverIP+'/'+serviceName+'/GetExamDtlList',
		  type: "GET",
		  dataType: "xml",
		  async: false,
		  data: { UserId: UserId, VisitId: VisitId, SortNo: SortNo, ItemCode: ItemCode },
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
		  data: { UserId: UserId, VisitId: VisitId, SortNo: SortNo, ItemCode: ItemCode },
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
  
  
  //从数据库中读取用户当前收缩压值
  function GetCurrentSBP(PatientId){
	 //alert(PatientId);
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
				$("#TextInput1").val(option);
				var SBP = option;
				GetDescription(SBP);
			}
			else 
			{
				//$("#TextInput1").val("请输入");
				$("#TextInput1").attr("placeholder","请输入");

			}					    
	    }, 
	    error: function(msg) {alert("Get Current Sbp Error!");}
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
				  $("#TextInput2").val(option);
			  }
			  else 
			  {
				$("#TextInput2").attr("placeholder","请输入");
			  }		    
		  }, 
		  error: function(msg) {alert("Get Current Dbp Error!");}
	  });
	  return option;	
  } 
   
  //从数据库中读取用户前一个计划的目标收缩压值
  function GetTargetSBP(PLType, PlanNo, Id){
	  var option;
	  if(PLType == 1 || PLType == 4)
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
					  $("#TextInput3").val(option);
				  }
				  else 
				  {
				$("#TextInput3").attr("placeholder","请输入");
				  }		    
			  }, 
			  error: function(msg) {alert("Get Target Sbp Error!");}
		  });
		  return option;	
	  }
  } 
  
  //从数据库中读取用户前一个计划的目标舒张压值
  function GetTargetDBP(PLType, PlanNo, Id){
	  var option;
	  if(PLType == 1 || PLType == 4)
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
					  $("#TextInput4").val(option);
				  }
				  else 
				  {
				$("#TextInput4").attr("placeholder","请输入");
				  }		    
			  }, 
			  error: function(msg) {alert("Get Target Dbp Error!");}
		  });
		  return option;	
	  }
  } 
  //从数据库中获取血压等级说明表的信息，Cm.MstBloodPressure
  function GetBPGrades(){  
	 $.ajax({ 
         type: "POST",
         dataType: "xml",
		 timeout: 30000,  
		 url: 'http://'+ serverIP +'/'+serviceName+'/GetBPGrades',
		 async:false,
		 beforeSend: function(){},
         success: function(result) {  				  
			 $(result).find('MstBloodPressure').each(function() {
				     SBPlist[bpi]=$(this).find("SBP").text();
				     DBPlist[bpi]=$(this).find("DBP").text();
					  //alert(SBPlist[bpi]);
					 bpi=bpi+1;		
			 }); 
			 //alert(DBPlist);
         },
         error: function(msg) {alert("Error!");}
     }); 			
  }
  
  //获取血压等级说明，进入页面能够自动读取当前血压值的时候加载，在修改当前血压值后点击保存后也加载
  function GetDescription(SBP){
	  var SBP=$("#TextInput1").val();
	  var option;
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetDescription',
		  async:false,
		  data: {SBP:SBP,
				},//输入变量
		  beforeSend: function(){},
		  success: function(result) { 
			  option=$(result).text();
			  if (option != "")
			  {
				  $("#hyperclass").val(option);
			  }
			  else 
			  {
				  alert("get description error")
			  }		    
		  }, 
		  error: function(msg) {}
	  });
	  return option;	
  }   
  
  //收缩压图	
  function SBPBar(a, b, SBPlist, chart_SBP_1){
	  if(a=="")
	  {
		a=0;
	  }
	  if(b=="")
	  {
		b=0;
	  }
	  var chart;
	  var chartData = [
		  {
			  
			  "category": "收缩压",
			  "excelent": SBPlist[1],
			  "good": SBPlist[2]-SBPlist[1],
			  "average": SBPlist[3]-SBPlist[2],
			  "poor": SBPlist[4]-SBPlist[3],
			  "bad": SBPlist[5]-SBPlist[4],
			  "limit1": a,			
			  "limit2": b,
		  }
	  ];	
	  chart = new AmCharts.AmSerialChart();
	  chart.dataProvider = chartData;
	  chart.categoryField = "category";
	  chart.rotate = false; // if you want vertical bullet chart, set rotate to false
	  chart.columnWidth = 1;//色条宽度
	  chart.startDuration = 0;//点直接显示，不用跳来跳去
	  
	  var categoryAxis = chart.categoryAxis;
	  categoryAxis.gridAlpha = 0;//点直接显示
	  categoryAxis.axisAlpha = 0;
	  //categoryAxis.labelRotation = 90;
	  var valueAxis = new AmCharts.ValueAxis();
	  valueAxis.maximum = SBPlist[SBPlist.length-1];
	  valueAxis.minimum = parseInt(SBPlist[0]);
	  
	  valueAxis.axisAlpha=0;
	  valueAxis.axiscolor="#FF0000";
	  valueAxis.gridAlpha = 0;
	  valueAxis.stackType = "regular"; // we use stacked graphs to make color fills
	  chart.addValueAxis(valueAxis);
  
	  // this graph displays the short dash, which usually indicates maximum value reached.
	  var graph1 = new AmCharts.AmGraph();
	  graph1.valueField="limit1";
	  graph1.lineColor = "#FF0000";
	  graph1.bullet="round";
	  graph1.noStepRisers = true;
	  graph1.lineAlpha = 1;
	  graph1.lineThickness = 3;
	  graph1.columnWidth = 0.5; // change this if you want wider dash
	  graph1.stackable = false; // this graph shouldn't be stacked
	  graph1.labelText = "当前";
	  chart.addGraph(graph1);
	  
	  var graph2 = new AmCharts.AmGraph();
	  graph2.valueField="limit2";
	  graph2.lineColor = "#3333FF";
	  graph2.bullet="diamond";
	  graph2.noStepRisers = true;
	  graph2.lineAlpha = 1;
	  graph2.lineThickness = 3;
	  graph2.columnWidth = 0.5; // change this if you want wider dash
	  graph2.stackable = false; // this graph shouldn't be stacked
	  graph2.labelText = "目标";
	  graph2.labelPosition = "bottom";
	  chart.addGraph(graph2);			
	  // The following graphs produce color bands色条的不同颜色
	  var field=new Array("excelent","good","average","poor","bad");
	  var color=new Array("#19d228","#b4dd1e","#f6d32b","#fb7116");
	  
	  for(var q=0;q<=field.length;q++){
		  graph = new AmCharts.AmGraph();
		  graph.valueField = field[q];
		  graph.lineColor = color[q];
		  graph.showBalloon = false;
		  graph.type = "column";
		  graph.fillAlphas = 0.8;
		  chart.addGraph(graph);
	  };
	  
	  // WRITE
	  chart.write(chart_SBP_1);
  } 
  //舒张压图
  function DBPBar(c, d, SBPlist, chart_DBP_1){
	  var c=$("#TextInput2").val();
	  var d=$("#TextInput4").val();
	  if(c=="")
	  {
		c=0;
	  }
	  if(d=="")
	  {
		d=0;
	  }
	  var chart1;
	  var chart1Data = [
		  {   
			  
			  "category": "舒张压",
			  "excelent": DBPlist[1],
			  "good": DBPlist[2]-DBPlist[1],
			  "average": DBPlist[3]-DBPlist[2],
			  "poor": DBPlist[4]-DBPlist[3],
			  "bad": DBPlist[5]-DBPlist[4],
			  "limit1": c,
			  "limit2": d,
		  }
	  ];
	  
	  chart1 = new AmCharts.AmSerialChart();
	  chart1.dataProvider = chart1Data;
	  chart1.categoryField = "category";
	  chart1.rotate = false; // if you want vertical bullet chart, set rotate to false
	  chart1.columnWidth = 1;
	  chart1.startDuration = 0;
  
	  var categoryAxis = chart1.categoryAxis;
	  categoryAxis.gridAlpha = 0;
	  categoryAxis.axisAlpha = 0;
	  var valueAxis = new AmCharts.ValueAxis();
	  valueAxis.maximum = DBPlist[DBPlist.length-1];
	  valueAxis.minimum = parseInt(DBPlist[0]);
	  valueAxis.axisAlpha = 0;
	  valueAxis.gridAlpha = 0;
	  
	  valueAxis.stackType = "regular"; // we use stacked graphs to make color fills
	  chart1.addValueAxis(valueAxis);
  
	  // this graph displays the short dash, which usually indicates maximum value reached.
	  var graph1 = new AmCharts.AmGraph();
	  graph1.valueField = "limit1";
	  graph1.lineColor = "#FF0000";
	  graph1.bullet="round";
	  // it's a step line with no risers
	  //graph.type = "step";
	  graph1.noStepRisers = true;
	  graph1.lineAlpha = 1;
	  graph1.lineThickness = 3;
	  graph1.columnWidth = 0.5; // change this if you want wider dash
	  graph1.stackable = false; // this graph shouldn't be stacked
	  graph1.labelText = "当前";
	  chart1.addGraph(graph1);
	  
	  var graph2 = new AmCharts.AmGraph();
	  graph2.valueField = "limit2";
	  graph2.lineColor = "#3333FF";
	  graph2.bullet="diamond";
	  // it's a step line with no risers
	  //graph.type = "step";
	  graph2.noStepRisers = true;
	  graph2.lineAlpha = 1;
	  graph2.lineThickness = 3;
	  graph2.columnWidth = 0.5; // change this if you want wider dash
	  graph2.stackable = false; // this graph shouldn't be stacked
	  graph2.labelText = "目标";
	  graph2.labelPosition = "bottom";
	  chart1.addGraph(graph2);
  
	  // The following graphs produce color bands色条的不同颜色
	  var field=new Array("excelent","good","average","poor","bad");
	  var color=new Array("#19d228","#b4dd1e","#f6d32b","#fb7116");
	  
	  for(var q=0;q<=field.length;q++){
	  graph = new AmCharts.AmGraph();
	  graph.valueField = field[q];
	  graph.lineColor = color[q];
	  graph.showBalloon = false;
	  graph.type = "column";
	  graph.fillAlphas = 0.8;
	  chart1.addGraph(graph);
	  };
  
	  chart1.write(chart_DBP_1);	
  }
    
//页面加载后生成风险评估图
function Risk()
  {
	  var PatientId=localStorage.getItem('PatientId');
	 // PatientId = "PID201501070003";
	  var Hyper="";
	  var Harvard="";
	  var Framingham="";
	  var Stroke="";
	  var Heart="";
	  GetHypertension(PatientId);
	  GetHarvardRisk(PatientId);
	  GetFramingham(PatientId);
	  GetStroke(PatientId);
	  GetHeartFailure(PatientId);
	  RiskBar(Hyper,Harvard,Framingham,Stroke,Heart);

      //高血压
      function GetHypertension(PatientId)
	  {
		  
		//alert("1");
		//PatientId = localStorage.getItem('PatientId');
		//alert(PatientId); 	  	
	 	 $.ajax
	 	 ({  	 	
          	type: "POST",
          	dataType: "xml",
		  	timeout: 30000,  
			//url: 'http://'+serverIP+ '/' +serviceName+'/GetHypertension',
		  	url: 'http://'+ serverIP +'/'+serviceName+'/GetHypertension',
		  	async:false,
          	data: {UserId:PatientId},//输入变量
		  	beforeSend: function(){},
          	success: function(result) 
		 	{ 
				//alert("1");
				
			   Hyper=$(result).text();
			   Hyper=Hyper.split("||");
			   var RiskInfactor=parseFloat(Hyper[0]); 
			   evaluate.RiskInfactor1=RiskInfactor;
			   var Age = Hyper[1];
			   evaluate.Age=Age;
			   var SBP=$('#TextInput1').val();
			   var DBP=$('#TextInput2').val();
			   RiskInfactor=RiskInfactor- 0.05933 * SBP - 0.12847 * DBP+ 0.00162 * Age*DBP;
			   //alert(RiskInfactor);
			   Hyper = 1-Math.exp(-Math.exp(((Math.log(Math.E,4))- (22.94954+ RiskInfactor))/0.87692));
			   //alert(Hyper);
			   //alert(RiskInfactor+1.5);
			   //alert(Age);
          	}, 
            error: function(msg) {alert("请输入相关参数");}
     	 });
		 //alert(Hyper);
	  	 return Hyper;
		 
		 //alert("1");
	  }
	  
    //五年危险率
    function GetHarvardRisk(PatientId)
	{  
	  $.ajax
	  ({  
          type: "POST",
          dataType: "xml",
		  timeout: 30000,  
		  //url: 'http://'+ 'localhost:48401/' +servicename+'/GetHarvardRisk',
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetHarvardRisk',
		  async:false,
          data: {UserId:PatientId},//输入变量
		  beforeSend: function(){},
          success: function(result) 
		  { 
			 Harvard=$(result).text();	
			 Harvard=Harvard.split("||");
			 var RiskInfactor=parseInt(Harvard[0]); 
			 evaluate.RiskInfactor2=RiskInfactor;
			 var Gender = Hyper[1];//0,2女，其他男，可以调
			 evaluate.Gender=Gender;
			 var SBP=$('#TextInput1').val();
			 //不同性别SBP的影响因素
			 if (Gender==1)
			 {
				     if (SBP <= 119)
                     {
                         RiskInfactor = RiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         RiskInfactor = RiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         RiskInfactor = RiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         RiskInfactor = RiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         RiskInfactor = RiskInfactor + 5;
                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         RiskInfactor = RiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         RiskInfactor = RiskInfactor + 8;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         RiskInfactor = RiskInfactor + 9;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         RiskInfactor = RiskInfactor + 10;
                     }
                     else
                     {
                         RiskInfactor = RiskInfactor + 11;
                     }	 
			 }
			 else
			 {
				                     if (SBP <= 119)
                     {
                         RiskInfactor = RiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         RiskInfactor = RiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         RiskInfactor = RiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         RiskInfactor = RiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         RiskInfactor = RiskInfactor + 5;
                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         RiskInfactor = RiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         RiskInfactor = RiskInfactor + 7;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         RiskInfactor = RiskInfactor + 8;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         RiskInfactor = RiskInfactor + 9;
                     }
                     else
                     {
                         RiskInfactor = RiskInfactor + 10;
                     }	 
			 }    
			Harvard = 6.304 * Math.pow(10, -8) * Math.pow(RiskInfactor, 5) - 5.027 * Math.pow(10, -6) * Math.pow(RiskInfactor, 4) + 0.0001768 * Math.pow(RiskInfactor, 3) - 0.001998 * Math.pow(RiskInfactor, 2) + 0.01294 * RiskInfactor + 0.0409;
			Harvard=Harvard/100;
          }, 
          error: function(msg) {alert("请输入相关参数");}
      });
	  return Harvard;
	}
	
    //心血管疾病
    function GetFramingham(PatientId)
	{  
	  $.ajax({  
          type: "POST",
          dataType: "xml",
		  timeout: 30000,  
		  //url: 'http://'+ 'localhost:48401/' +serviceName+'/GetFramingham',
		  //url: 'http://'+ 'localhost:48401/' +servicename+'/GetFramingham',
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetFramingham',
		  async:false,
          data: {UserId:PatientId},//输入变量
		  beforeSend: function(){},
          success: function(result) 
		  { 
			 Framingham=$(result).text();
			 evaluate.Framingham=Framingham;	    
          }, 
          error: function(msg) {alert("请输入相关参数");}
      });
	  return Framingham;
	}	
	
    //中风
    function GetStroke(PatientId)
	{  
	  $.ajax
	  ({  
          type: "POST",
          dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetStroke',
		  //url: 'http://'+ 'localhost:48401/' +servicename+'/GetStroke',
		  async:false,
          data: {UserId:PatientId},//输入变量
		  beforeSend: function(){},
          success: function(result) 
		  { 
			 Stroke=$(result).text();	  
			 Stroke=Stroke.split("||");
			 var RiskInfactor=parseFloat(Stroke[0]); 
			 evaluate.RiskInfactor3=RiskInfactor;
			 var Gender = Stroke[1];
			 var Value3 = Stroke[2];
			 evaluate.Value3=Value3;
			 var SBP=$('#TextInput1').val(); 
			 //男性SBP加成
			 if (Gender==1)
			 {
				if (Value3 != 1) //没有治疗过高血压的情况
                {
                         if (SBP <= 105)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 106 && SBP <= 115)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 116 && SBP <= 125)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 126 && SBP <= 135)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 136 && SBP <= 145)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 146 && SBP <= 155)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 156 && SBP <= 165)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 166 && SBP <= 175)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 176 && SBP <= 185)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 186 && SBP <= 195)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                 }
                else//治疗过高血压的情况
                     {
                         if (SBP <= 105)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 106 && SBP <= 112)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 113 && SBP <= 117)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 118 && SBP <= 123)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 124 && SBP <= 129)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 130 && SBP <= 135)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 136 && SBP <= 142)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 143 && SBP <= 150)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 151 && SBP <= 161)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 162 && SBP <= 176)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                     }	 
				var Risk = new Array(3, 3, 4, 4, 5, 5, 6, 7, 8, 10, 11, 13, 15, 17, 20, 22, 26, 29, 33, 37, 42, 47, 52, 57, 63, 68, 74, 79, 84, 88);
				//alert(Risk[1]-1)
				 Stroke = Risk[RiskInfactor-1] / 100;
			 }
			 //女性SBP加成
			 else
			 {
			 	 if (Value3 != 1) //没有治疗过高血压的情况
                     {
                         if (SBP <= 94)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 118)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 119 && SBP <= 130)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 131 && SBP <= 143)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 144 && SBP <= 155)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 156 && SBP <= 167)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 168 && SBP <= 180)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 181 && SBP <= 192)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 193 && SBP <= 204)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                     }
                 else//治疗过高血压的情况
                     {
                         if (SBP <= 94)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 113)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 114 && SBP <= 119)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 120 && SBP <= 125)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 126 && SBP <= 131)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 132 && SBP <= 139)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 140 && SBP <= 148)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 149 && SBP <= 160)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 161 && SBP <= 204)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                     }
			     var Risk = new Array(1, 1, 2, 2, 2, 3, 4, 4, 5, 6, 8, 9, 11, 13, 16, 19, 23, 27, 32, 37, 43, 50, 57, 64, 71, 78, 84);
				 //alert(Risk[1]-1);
				Stroke = Risk[RiskInfactor-1] / 100;         
			 }
			 
          }, 
          error: function(msg) {alert("请输入相关参数");}
      });
	  return Stroke;
	}	
	
    //心衰
    function GetHeartFailure(PatientId)
	{  
	  $.ajax
	  ({  
          type: "POST",
          dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetHeartFailure',
		  //url: 'http://'+ 'localhost:48401/' +servicename+'/GetHeartFailure',
		  async:false,
          data: {UserId:PatientId},//输入变量
		  beforeSend: function(){},
          success: function(result) 
		  { 
			 Heart=$(result).text();
			 Heart=Heart.split("||");
			 var RiskInfactor=parseFloat(Heart[0]); 
			 evaluate.RiskInfactor4=RiskInfactor;
			 var Gender = Heart[1];	 
			 var SBP=$('#TextInput1').val(); 
			 if (Gender==1)
			 {
				  if (SBP <= 119)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 120 && SBP <= 139)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 140 && SBP <= 169)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 170 && SBP <= 189)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 190 && SBP <= 219)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
				  if (RiskInfactor <= 5)
                     {
                         HeartFailureRisk = 1;
                     }
                     else if (RiskInfactor > 5 && RiskInfactor < 14)
                     {
                         HeartFailureRisk = 3;
                     }
                     else if (RiskInfactor >= 14 && RiskInfactor < 16)
                     {
                         HeartFailureRisk = 5;
                     }
                     else if (RiskInfactor >= 16 && RiskInfactor < 18)
                     {
                         HeartFailureRisk = 8;
                     }
                     else if (RiskInfactor >= 18 && RiskInfactor < 20)
                     {
                         HeartFailureRisk = 11;
                     }
                     else if (RiskInfactor >= 20 && RiskInfactor < 22)
                     {
                         HeartFailureRisk = 11;
                     }
                     else if (RiskInfactor >= 22 && RiskInfactor < 24)
                     {
                         HeartFailureRisk = 22;
                     }
                     else if (RiskInfactor >= 24 && RiskInfactor < 25)
                     {
                         HeartFailureRisk = 30;
                     }
                     else if (RiskInfactor >= 25 && RiskInfactor < 26)
                     {
                         HeartFailureRisk = 34;
                     }
                     else if (RiskInfactor >= 26 && RiskInfactor < 27)
                     {
                         HeartFailureRisk = 39;
                     }
                     else if (RiskInfactor >= 27 && RiskInfactor < 28)
                     {
                         HeartFailureRisk = 44;
                     }
                     else if (RiskInfactor >= 28 && RiskInfactor < 29)
                     {
                         HeartFailureRisk = 49;
                     }
                     else if (RiskInfactor >= 29 && RiskInfactor < 30)
                     {
                         HeartFailureRisk = 54;
                     }
                     else 
                     {
                         HeartFailureRisk = 59;
                     }
				  Heart=HeartFailureRisk/100;
			 }
			 else
			 {
				if (SBP < 140)
                     {
                         RiskInfactor = RiskInfactor + 0;
                     }
                     else if (SBP >= 140 && SBP <= 209)
                     {
                         RiskInfactor = RiskInfactor + 1;
                     }
                     else
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }	 
				if (RiskInfactor < 10)
                     {
                         HeartFailureRisk = 1;
                     }
                     else if (RiskInfactor <= 28)
                     {
                         var Risk = new Array(2,2,3, 3, 4, 5, 7, 9, 11, 14, 17, 21, 25, 30, 36, 42, 48, 54, 60 );
                         HeartFailureRisk = Risk[RiskInfactor - 10];
                     }
                     else 
                     {
                         HeartFailureRisk = 60;
                     }
				Heart=HeartFailureRisk/100;
			 }  
          }, 
          error: function(msg) {alert("请输入相关参数");}
      });
	  return Heart;
	}	
	  
    //画柱状图
    function RiskBar(Hyper,Harvard,Framingham,Stroke,Heart)
    {
	  //alert(Hyper);
	  Hyper=Hyper*100;
	  Harvard=Harvard*100;
	  Framingham=Framingham*100;
	  Stroke=Stroke*100;
	  Heart=Heart*100;
	  var chartData = [
                {
                    "year": "高血压",
                    "正常": 1,
                    "您的风险": Hyper.toFixed(2)
                },
                {
                    "year": "五年危险率",
                    "正常": 1,
                    "您的风险": Harvard.toFixed(2)
                },
                {
                    "year": "心血管疾病",
                    "正常": 1,
                    "您的风险": Framingham.toFixed(2)
                },
                {
                    "year": "中风",
                    "正常": 1,
                    "您的风险": Stroke.toFixed(2)
                },
                {
                    "year": "心衰",
                    "正常": 1,
                    "您的风险": Heart.toFixed(2)
                }
            ];
                // SERIAL CHART
                chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "year";
				
                chart.startDuration = 0;
                chart.plotAreaBorderColor = "#DADADA";
                chart.plotAreaBorderAlpha = 1;
                // this single line makes the chart a bar chart
                chart.rotate = false;

                // AXES
                // Category
                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridPosition = "start";
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
				categoryAxis.labelRotation = 60;
                // Value
                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.axisAlpha = 0;
                valueAxis.gridAlpha = 0;
                valueAxis.position = "bottom";
                chart.addValueAxis(valueAxis);

                // GRAPHS
                // first graph
                var graph1 = new AmCharts.AmGraph();
                graph1.type = "column";
                graph1.title = "正常";
                graph1.valueField = "正常";
                graph1.balloonText = "正常:[[value]]";
                graph1.lineAlpha = 0;
                graph1.fillColors = "#ADD981";
                graph1.fillAlphas = 1;
                chart.addGraph(graph1);

                // second graph
                var graph2 = new AmCharts.AmGraph();
                graph2.type = "column";
                graph2.title = "您的风险";
                graph2.valueField = "您的风险";
                graph2.balloonText = "您的风险:[[value]]";
                graph2.lineAlpha = 0;
                graph2.fillColors = "#81acd9";
                graph2.fillAlphas = 1;
                chart.addGraph(graph2);

                // LEGEND
                var legend = new AmCharts.AmLegend();
                chart.addLegend(legend);

                chart.creditsPosition = "top-right";

                // WRITE
                chart.write("chartdiv3");
				//alert(Hyper);	
      }
  }	
  
  
  //修改当前收缩压和舒张压时实时显示风险评估结果
  function RiskModify()
  {
	  var PatientId=localStorage.getItem('PatientId');
	  var Hyper="";
	  var Harvard="";
	  var Framingham="";
	  var Stroke="";
	  var Heart="";
	  GetHypertension(PatientId);
	  GetHarvardRisk(PatientId);
	  GetFramingham(PatientId);
	  GetStroke(PatientId);
	  GetHeartFailure(PatientId);
	  RiskBar(Hyper,Harvard,Framingham,Stroke,Heart);
	  //高血压
	 function GetHypertension(PatientId)
	 {
		var RiskInfactor=evaluate.RiskInfactor1; 
		var Age = evaluate.Age;
		var SBP=$('#TextInput1').val();
		var DBP=$('#TextInput2').val();
		RiskInfactor=RiskInfactor- 0.05933 * SBP - 0.12847 * DBP+ 0.00162 * Age*DBP;
		Hyper = 1-Math.exp(-Math.exp(((Math.log(Math.E,4))- (22.94954+ RiskInfactor))/0.87692));
		return Hyper;
	 };
	 //五年危险率
	 function GetHarvardRisk(PatientId)
	 {  
			 var RiskInfactor=evaluate.RiskInfactor2; 
			 var Gender = evaluate.Gender;//0,2女，其他男，可以调
			 var SBP=$('#TextInput1').val();
			 //不同性别SBP的影响因素
			 if (Gender==1)
			 {
				     if (SBP <= 119)
                     {
                         RiskInfactor = RiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         RiskInfactor = RiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         RiskInfactor = RiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         RiskInfactor = RiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         RiskInfactor = RiskInfactor + 5;
                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         RiskInfactor = RiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         RiskInfactor = RiskInfactor + 8;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         RiskInfactor = RiskInfactor + 9;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         RiskInfactor = RiskInfactor + 10;
                     }
                     else
                     {
                         RiskInfactor = RiskInfactor + 11;
                     }	 
			 }
			 else
			 {
				     if (SBP <= 119)
                     {
                         RiskInfactor = RiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         RiskInfactor = RiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         RiskInfactor = RiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         RiskInfactor = RiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         RiskInfactor = RiskInfactor + 5;
                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         RiskInfactor = RiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         RiskInfactor = RiskInfactor + 7;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         RiskInfactor = RiskInfactor + 8;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         RiskInfactor = RiskInfactor + 9;
                     }
                     else
                     {
                         RiskInfactor = RiskInfactor + 10;
                     }	 
			 }    
			Harvard = 6.304 * Math.pow(10, -8) * Math.pow(RiskInfactor, 5) - 5.027 * Math.pow(10, -6) * Math.pow(RiskInfactor, 4) + 0.0001768 * Math.pow(RiskInfactor, 3) - 0.001998 * Math.pow(RiskInfactor, 2) + 0.01294 * RiskInfactor + 0.0409;
			Harvard=Harvard/100;
			return Harvard;
	}
	 
	//心血管疾病
	function GetFramingham(PatientId)
	{  
	 	Framingham=evaluate.Framingham;	    
		return Framingham;
	}	
	
	//中风
	function GetStroke(PatientId)
	{  
	  	var RiskInfactor=evaluate.RiskInfactor3;
		var Gender = evaluate.Gender;
		var Value3 = evaluate.Value3;
	    var SBP=$('#TextInput1').val(); 
		//男性SBP加成
		if (Gender==1)
		{
				if (Value3 != 1) //没有治疗过高血压的情况
                {
                         if (SBP <= 105)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 106 && SBP <= 115)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 116 && SBP <= 125)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 126 && SBP <= 135)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 136 && SBP <= 145)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 146 && SBP <= 155)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 156 && SBP <= 165)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 166 && SBP <= 175)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 176 && SBP <= 185)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 186 && SBP <= 195)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                 }
                else//治疗过高血压的情况
                     {
                         if (SBP <= 105)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 106 && SBP <= 112)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 113 && SBP <= 117)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 118 && SBP <= 123)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 124 && SBP <= 129)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 130 && SBP <= 135)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 136 && SBP <= 142)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 143 && SBP <= 150)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 151 && SBP <= 161)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 162 && SBP <= 176)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                     }	 
				var Risk = new Array(3, 3, 4, 4, 5, 5, 6, 7, 8, 10, 11, 13, 15, 17, 20, 22, 26, 29, 33, 37, 42, 47, 52, 57, 63, 68, 74, 79, 84, 88);
				//alert(Risk[1]-1)
				 Stroke = Risk[RiskInfactor-1] / 100;
			 }
			 //女性SBP加成
			 else
			 {
			 	 if (Value3 != 1) //没有治疗过高血压的情况
                     {
                         if (SBP <= 94)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 118)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 119 && SBP <= 130)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 131 && SBP <= 143)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 144 && SBP <= 155)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 156 && SBP <= 167)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 168 && SBP <= 180)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 181 && SBP <= 192)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 193 && SBP <= 204)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                     }
                 else//治疗过高血压的情况
                     {
                         if (SBP <= 94)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 113)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 114 && SBP <= 119)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 120 && SBP <= 125)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else if (SBP >= 126 && SBP <= 131)
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
                         else if (SBP >= 132 && SBP <= 139)
                         {
                             RiskInfactor = RiskInfactor + 6;
                         }
                         else if (SBP >= 140 && SBP <= 148)
                         {
                             RiskInfactor = RiskInfactor + 7;
                         }
                         else if (SBP >= 149 && SBP <= 160)
                         {
                             RiskInfactor = RiskInfactor + 8;
                         }
                         else if (SBP >= 161 && SBP <= 204)
                         {
                             RiskInfactor = RiskInfactor + 9;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 10;
                         }
                     }
			     var Risk = new Array(1, 1, 2, 2, 2, 3, 4, 4, 5, 6, 8, 9, 11, 13, 16, 19, 23, 27, 32, 37, 43, 50, 57, 64, 71, 78, 84);
				 //alert(Risk[1]-1);
				Stroke = Risk[RiskInfactor-1] / 100;         
			 }
		return Stroke;
	}	
	
	//心衰
	function GetHeartFailure(PatientId)
	{  

			 var RiskInfactor=evaluate.RiskInfactor4;
			 var Gender = evaluate.Gender;	 
			 var SBP=$('#TextInput1').val(); 
			 //性别对SBP的影响
			 if (Gender==1)
			 {
				  if (SBP <= 119)
                         {
                             RiskInfactor = RiskInfactor + 0;
                         }
                         else if (SBP >= 120 && SBP <= 139)
                         {
                             RiskInfactor = RiskInfactor + 1;
                         }
                         else if (SBP >= 140 && SBP <= 169)
                         {
                             RiskInfactor = RiskInfactor + 2;
                         }
                         else if (SBP >= 170 && SBP <= 189)
                         {
                             RiskInfactor = RiskInfactor + 3;
                         }
                         else if (SBP >= 190 && SBP <= 219)
                         {
                             RiskInfactor = RiskInfactor + 4;
                         }
                         else
                         {
                             RiskInfactor = RiskInfactor + 5;
                         }
				  if (RiskInfactor <= 5)
                     {
                         HeartFailureRisk = 1;
                     }
                     else if (RiskInfactor > 5 && RiskInfactor < 14)
                     {
                         HeartFailureRisk = 3;
                     }
                     else if (RiskInfactor >= 14 && RiskInfactor < 16)
                     {
                         HeartFailureRisk = 5;
                     }
                     else if (RiskInfactor >= 16 && RiskInfactor < 18)
                     {
                         HeartFailureRisk = 8;
                     }
                     else if (RiskInfactor >= 18 && RiskInfactor < 20)
                     {
                         HeartFailureRisk = 11;
                     }
                     else if (RiskInfactor >= 20 && RiskInfactor < 22)
                     {
                         HeartFailureRisk = 11;
                     }
                     else if (RiskInfactor >= 22 && RiskInfactor < 24)
                     {
                         HeartFailureRisk = 22;
                     }
                     else if (RiskInfactor >= 24 && RiskInfactor < 25)
                     {
                         HeartFailureRisk = 30;
                     }
                     else if (RiskInfactor >= 25 && RiskInfactor < 26)
                     {
                         HeartFailureRisk = 34;
                     }
                     else if (RiskInfactor >= 26 && RiskInfactor < 27)
                     {
                         HeartFailureRisk = 39;
                     }
                     else if (RiskInfactor >= 27 && RiskInfactor < 28)
                     {
                         HeartFailureRisk = 44;
                     }
                     else if (RiskInfactor >= 28 && RiskInfactor < 29)
                     {
                         HeartFailureRisk = 49;
                     }
                     else if (RiskInfactor >= 29 && RiskInfactor < 30)
                     {
                         HeartFailureRisk = 54;
                     }
                     else 
                     {
                         HeartFailureRisk = 59;
                     }
				  Heart=HeartFailureRisk/100;
			 }
			 else
			 {
				if (SBP < 140)
                     {
                         RiskInfactor = RiskInfactor + 0;
                     }
                     else if (SBP >= 140 && SBP <= 209)
                     {
                         RiskInfactor = RiskInfactor + 1;
                     }
                     else
                     {
                         RiskInfactor = RiskInfactor + 2;
                     }	 
				if (RiskInfactor < 10)
                     {
                         HeartFailureRisk = 1;
                     }
                     else if (RiskInfactor <= 28)
                     {
                         var Risk = new Array(2,2,3, 3, 4, 5, 7, 9, 11, 14, 17, 21, 25, 30, 36, 42, 48, 54, 60 );
                         HeartFailureRisk = Risk[RiskInfactor - 10];
                     }
                     else 
                     {
                         HeartFailureRisk = 60;
                     }
				Heart=HeartFailureRisk/100;
			 }  
			 return Heart;
	}	 
	 
    //画柱状图
    function RiskBar(Hyper,Harvard,Framingham,Stroke,Heart)
    {
	  //alert(Hyper);
	  Hyper=Hyper*100;
	  Harvard=Harvard*100;
	  Framingham=Framingham*100;
	  Stroke=Stroke*100;
	  Heart=Heart*100;
	  var chartData = [
                {
                    "year": "高血压",
                    "正常": 1,
                    "您的风险": Hyper.toFixed(2)
                },
                {
                    "year": "五年危险率",
                    "正常": 1,
                    "您的风险": Harvard.toFixed(2)
                },
                {
                    "year": "心血管疾病",
                    "正常": 1,
                    "您的风险": Framingham.toFixed(2)
                },
                {
                    "year": "中风",
                    "正常": 1,
                    "您的风险": Stroke.toFixed(2)
                },
                {
                    "year": "心衰",
                    "正常": 1,
                    "您的风险": Heart.toFixed(2)
                }
            ];
                // SERIAL CHART
                chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "year";
				
                chart.startDuration = 0;
                chart.plotAreaBorderColor = "#DADADA";
                chart.plotAreaBorderAlpha = 1;
                // this single line makes the chart a bar chart
                chart.rotate = false;

                // AXES
                // Category
                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridPosition = "start";
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
				categoryAxis.labelRotation = 60;
                // Value
                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.axisAlpha = 0;
                valueAxis.gridAlpha = 0;
                valueAxis.position = "bottom";
                chart.addValueAxis(valueAxis);

                // GRAPHS
                // first graph
                var graph1 = new AmCharts.AmGraph();
                graph1.type = "column";
                graph1.title = "正常";
                graph1.valueField = "正常";
                graph1.balloonText = "正常:[[value]]";
                graph1.lineAlpha = 0;
                graph1.fillColors = "#ADD981";
                graph1.fillAlphas = 1;
                chart.addGraph(graph1);

                // second graph
                var graph2 = new AmCharts.AmGraph();
                graph2.type = "column";
                graph2.title = "您的风险";
                graph2.valueField = "您的风险";
                graph2.balloonText = "您的风险:[[value]]";
                graph2.lineAlpha = 0;
                graph2.fillColors = "#81acd9";
                graph2.fillAlphas = 1;
                chart.addGraph(graph2);

                // LEGEND
                var legend = new AmCharts.AmLegend();
                chart.addLegend(legend);

                chart.creditsPosition = "top-right";

                // WRITE
                chart.write("chartdiv3");
				//alert(Hyper);	
      }
    }	
  
    //插入当前收缩压压
    function InsertCurSbp()//PatientId P444
    {
		var ret = false;
	  var CurSbp=$('#TextInput1').val();
	  if(!TestValue(CurSbp,100,200))
{
			  alert("当前收缩压数据错误。");


	  return ret;
}
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
		  error: function(msg) {alert("Error!");}
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
				 ItemCode:"Bloodpressure_1",
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
			  //alert(RecordDate);
			  var SBP = CurSbp;
			  GetDescription(SBP); 
     
		 },
		 error: function(msg) {alert("InsertcurSBPError!");
		 
		 ret =false;} 
	  });
	  return ret;
    }
  
    //插入当前舒张压
    function InsertCurDbp()
    {
		var ret = false;
	  var CurDbp=$('#TextInput2').val();
	  if(!TestValue(CurDbp,40,140))
{
			  alert("当前舒张压数据错误。");
	  return ret;
}
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
		  error: function(msg) {alert("Error!");}
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
				 ItemCode:"Bloodpressure_2",
				 Value:CurDbp,
				 Unit:"mmHg",
				 revUserId:localStorage.getItem('UserId'),
				 TerminalName:localStorage.getItem('TerminalName'),
				 TerminalIp:localStorage.getItem('TerminalIp'),
				 DeviceType:localStorage.getItem('DeviceType')
				 },//输入变量
		  beforeSend: function(){},
		  success: function(result) { 
ret = true;    
		 }, 
		 error: function(msg) {alert("InsertCurDbpError!");
		 ret = false;}
	  });
	  return ret; 
  }  
  
  //插入新Plan、当前血压、目标血压
  function InsertTarget()
  {
	  var ret = false;
	  var PlanNo = "";
	  var PLType = localStorage.getItem("PLType");
	  if(PLType == 3 || PLType == 4)
	  {
		  PlanNo = localStorage.getItem("NewPlanNo");
		  if(PlanNo == ""){
			  GetNewPlanNo();
			  PlanNo = localStorage.getItem("NewPlanNo");
			  InsertPlan(PlanNo); //将新生成的PlanNo插入Plan表
		  }
	  }
	  else if(PLType == 1)
	  {
	      PlanNo = localStorage.getItem("PlanNo");
	  }
	 ret = InsertCurSbp() && InsertCurDbp() && InsertTargetSbp(PlanNo) && InsertTargetDbp(PlanNo);
	 //alert(ret);
	 return ret;		
  }
  
  //生成PlanNo
  //修改函数名，改为GetNewPlanNo ZC 2015-05-07
  function GetNewPlanNo(){
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
		  	PlanNo=$(result).text();
		  	localStorage.setItem('NewPlanNo', PlanNo);//将新生成的PlanNo插入localstorage
		  },
		  error: function(msg) {alert("GetNewPlanNoError!");}
	  });
  }
  
  //将PlanNo插入Plan表
  function InsertPlan(PlanNo)
  {
	  var PlanNo2=PlanNo;
	  //ZAM 2015-4-28
	  var StartDate =0;
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
		  async:false,
		  data: {},
		  beforeSend: function(){},
		  success: function(result) {
			  StartDate =  $(result).text().slice(0,10).replace(/-/g,"");		    
		  }, 
		  error: function(msg) {alert("Error!");}
	  });
	  
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetPlan',
		  async:false,
		  data: {PlanNo:PlanNo2,
				 PatientId:localStorage.getItem('PatientId'),
				 StartDate:StartDate,
				 EndDate:99999999,
				 Module:localStorage.getItem('ModuleType'),
				 Status:1,	//ZAM 2015-5-4
				 DoctorId:localStorage.getItem('UserId'),
				 piUserId:localStorage.getItem('UserId'),
				 piTerminalName:localStorage.getItem('TerminalName'),
				 piTerminalIp:localStorage.getItem('TerminalIp'),
				 piDeviceType:localStorage.getItem('DeviceType')
				 },//输入变量
		  beforeSend: function(){},
		  success: function(result) {},
		  error: function(msg) {alert("SetPlanError!");}
	  });
  }  
  
  //插入目标收缩压
  function InsertTargetSbp(PlanNo)
  {
	  var ret = false;
	  var PlanNo3=PlanNo;//取生成的PlanNo
	  var TarSbp=$('#TextInput3').val();
	  var CurSbp=$('#TextInput1').val();
if(!TestValue(TarSbp,100,200))
{
		  alert("目标收缩压数据错误。");	  

		  return ret;
}

if(!TestValue(CurSbp,100,200))
{
			  alert("当前收缩压数据错误。");

	  return ret;
}
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetTarget',
		  async:false,
		  data: {Plan:PlanNo3,
				 Id:"1",
				 Type:"Bloodpressure",
				 Code:"Bloodpressure_1",
				 Value:TarSbp,
				 Origin:CurSbp,
				 Instruction:"",
				 Unit:"mmhg",
				 piUserId:localStorage.getItem('UserId'),
				 piTerminalName:localStorage.getItem('TerminalName'),
				 piTerminalIp:localStorage.getItem('TerminalIp'),
				 piDeviceType:localStorage.getItem('DeviceType')
				 },//输入变量
		  beforeSend: function(){},
		  success: function(result) {  
ret= true;
		  },
		  error: function(msg) {alert("SetTargetSBPError!"); 
		  ret=false; }
	  }); 
	  return ret;
  }
  //插入目标舒张压
  function InsertTargetDbp(PlanNo)
  {
	  var ret =false;
	  var PlanNo1=PlanNo;//取生成的PlanNo
	 // alert(PlanNo1);
	  var TarSbp=$('#TextInput4').val();
	  var CurSbp=$('#TextInput2').val();
if(!TestValue(TarSbp,40,140))
{		  alert("目标舒张压数据错误。");

		  return ret;
}

if(!TestValue(CurSbp,40,140))
{		  alert("当前舒张压数据错误。");

		  return ret;
}

	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetTarget',
		  async:false,
		  data: {Plan:PlanNo1,
				 Id:"2",
				 Type:"Bloodpressure",
				 Code:"Bloodpressure_2",
				 Value:TarSbp,
				 Origin:CurSbp,
				 Instruction:"",
				 Unit:"mmhg",
				 piUserId:localStorage.getItem('UserId'),
				 piTerminalName:localStorage.getItem('TerminalName'),
				 piTerminalIp:localStorage.getItem('TerminalIp'),
				 piDeviceType:localStorage.getItem('DeviceType')
				 },//输入变量
		  beforeSend: function(){},
		  success: function(result) { 
ret = true;
		  },
		  error: function(msg) {alert("SetTargetDBPError!");
		  ret = false;}
      });
return ret;
  }  
  
  //获取当前血压与目标血压之间的差值
  function getGoalValue(){
	  $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetGoalValue',
		async:false,
		data: {PlanNo:localStorage.getItem('NewPlanNo')},
		success: function(result) {  
			target = parseInt($(result).text());
			toTarget = target;
			target = target - lifeChanges - drugChanges;
			if(target < 0){
			    target = 0;	
			}
			$("#goal").text(target + 'mmHg');
		}, 
		error: function(msg) {alert("Error! loadLifeStyle");}
	  });
  }
  
  //加载生活方式列表
  function loadLifeStyle(){
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
		data: {Module:localStorage.getItem('ModuleType')},
		success: function(result) {  
			$(result).find('Table1').each(function(){		
			  sid = $(this).find("StyleId").text();
			  changes = $(this).find("CurativeEffect").text();
			  strs += '<tr><td><div class="checkboxRound"><input type="checkbox" name="LifeStyle" id="' 
				+ sid + '" value="' + sid + '" data-role="none" onclick="setLifeChanges(this, ' 
				+ changes +')"><label for="' + sid + '"></label></div></td><td>' 
				+ $(this).find("Name").text() + '</td><td>' 
				+ $(this).find("Instruction").text() + '</td><td>' 
				+ changes + $(this).find("Unit").text() + '</td><td>' 
				+ $(this).find("SideEffect").text() + '</td></tr>';
			  	
		    });
			$("#LifeStyleBody").empty();
			$("#LifeStyleBody").append(strs);  		
		}, 
		error: function(msg) {alert("Error! loadLifeStyle");}
	  });
  }
  
  //加载“上一次”或“暂存”计划的生活方式
  function loadLastLifeStyle(){
	  if(localStorage.getItem('PLType') ==1 || localStorage.getItem('PLType') == 4){
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetPsTaskByType',
			  async:false,
			  data: {PlanNo:localStorage.getItem('PlanNo'), Type:"LifeStyle"},
			  success: function(result) {  
				  $(result).find('Table1').each(function(){		
					sid = $(this).find("Code").text();
					$("input:checkbox[id='" + sid +"']").attr('checked', 'true');
				});		
			  }, 
			  error: function(msg) {alert("Error! loadLifeStyle");}
		  });
		  
		  $("input[name='LifeStyle']:checked").each(function () {
			  effect = parseInt($(this).parent().parent().next().next().next().text());
		      lifeChanges += effect;
		      (target - effect) > 0? target -= effect: target = 0;
		  });
		  
		  $("#lifestyleChanges").text(lifeChanges + 'mmHg');
	      $("#goal").text(target + 'mmHg');
		  
	  }
  }
  
  //加载以往的“药物治疗”记录
  function loadDrugList(){
	  var plType = localStorage.getItem('PLType');
	  var strdl = "";
	  if(plType == 1 || plType == 4)
	  {
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetPsTaskByType',
			  async:false,
			  data: {PlanNo:localStorage.getItem('PlanNo'), Type:"Drug"},
			  success: function(result) {  
			      if($(result).find('Table1').length > 0){
					  if(plType == 4){
						  strdl += '<h4>△上次计划中使用的药品：';
					  }
					  else if(plType == 1){
						  strdl += '<h4>△本次计划中原计划使用的药品：';
					  }
			          $(result).find('Table1').each(function(){		
					      strdl += $(this).find("CodeName").text() + '（' + $(this).find("Instruction").text() + '）；';
				      });
					  strdl = strdl.substr(0, strdl.length - 1);
					  strdl += '</h4>';
					  $("#LastDrugListDiv").empty();
	                  $("#LastDrugListDiv").append(strdl);
				  }
			  }, 
			  error: function(msg) {alert("Error! loadDrugList");}
		  });
		  
	  }
  }
  
  //获得患者的药嘱记录
  function getPatientDrugRecord(){
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
		data: {PatientId:localStorage.getItem('PatientId'),Module:localStorage.getItem('ModuleType')},
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
				$("#popupDrugDiv").empty();
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
	  
	  drugChanges = 0;
	  if(lifeChanges < toTarget){
		  target = toTarget - lifeChanges;
	  }
	  
	  if(target - drugeffect > 0){
		  drugChanges = drugeffect;
		  target -= drugeffect;
	  }
	  else{
		  drugChanges = drugeffect;
		  target = 0;
	  }
	  $("#drugChanges").text(drugChanges + 'mmHg');
	  $("#goal").text(target + 'mmHg');
  }  
  
  //生活方式对血压的影响
  function setLifeChanges(cb, effect){
	  var status = cb.checked;
	  if(status){
		  lifeChanges += effect;
		  (target - effect) > 0? target -= effect: target = 0;
	  }
	  else{
		  if(lifeChanges > toTarget && lifeChanges + drugChanges - effect < toTarget){
		      target += toTarget - (lifeChanges + drugChanges - effect);		
		  }
		  else if(lifeChanges <= toTarget && target === 0){
		      target = (drugChanges >= toTarget)? 0: (toTarget - drugChanges - lifeChanges + effect);
			  target = target >=0? target: 0;
		  }
		  else if(lifeChanges <= toTarget && target !== 0){
		      target = target + effect; 
		  }
		  
		  lifeChanges -= effect; 
	  }
	  $("#lifestyleChanges").text(lifeChanges + 'mmHg');
	  $("#goal").text(target + 'mmHg');
  };
  
  //药物治疗对血压的影响
  function setDrugChanges(cb, effect){
	  var status = cb.checked;
	  if(status){
		  if(target == 0){
			  cb.checked =! cb.checked;
			  alert("已超过目标，请调整计划！");
		  }
		  else if(target - effect > 0){
		      drugChanges += effect;
			  target -= effect;
		  }
		  else{
			  drugChanges += target;
			  target = 0;
			  //alert("已超过目标，请调整计划！");
		  }
	  }
	  else{
		  if(drugChanges - effect > 0){
		      drugChanges -= effect;
		  	  target += effect;
		  }
		  else{
			  target += drugChanges;
			  drugChanges = 0;
		  }
	  }
	  $("#drugChanges").text(drugChanges + 'mmHg');
	  $("#goal").text(target + 'mmHg');

  };
  
  //创建计划，插入Ps.Task
  function setPsTask(){
	var task_str = "";
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
			task_str = task_str + 'Drug#' + trim($("#DrugListBody tr:eq(" + i + ") td:eq(0)").text()) + '#' 
				+ trim($("#DrugListBody tr:eq(" + i + ") td:eq(2)").text()) + '，' + trim($("#DrugListBody tr:eq(" + i + ") td:eq(3)").text()) + '@';		
		}
	}
	
	if(task_str != ""){
		task_str = task_str.substring(0,task_str.length-1);	
	}
	
	if(task_str != ""){
		$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/CreateTask',
			async:false,
			data: {PlanNo: localStorage.getItem('NewPlanNo'),
				   Task: task_str,
				   UserId: localStorage.getItem('UserId'),
				   TerminalName: localStorage.getItem('TerminalName'),
				   TerminalIP: localStorage.getItem('TerminalIP'),
				   DeviceType: localStorage.getItem('DeviceType')
				   },
			success: function(result) { 
				 if($(result).text()){
					 $.mobile.changePage("#StartPlanPage");
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
  
  //令计划被激活或暂存
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
				  if(Status == 3)
				  {
					  //alert("Plan " + PlanNo + " starts");
		console.log("新建计划： " + PlanNo + " 成功！");
		//popup dialog
		
//				$("#GoToInvitePage").removeAttr("disabled").parent().removeClass("ui-state-disabled");
								$("#GoToInvitePage").removeAttr("disabled");


				  }
				  else
				  {
					  alert("Back to edit plan "+ PlanNo);
				  }
			  }
			  else
			  {		
				  alert("新建计划失败");
			  }				    
		 }, 
		 error: function(msg) {alert("Error! SetPlan");}
     });	
  }
  
  //得到任务清单
  function GetPsTask(){
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
				task_str = task_str + 'Drug#' + trim($("#DrugListBody tr:eq(" + i + ") td:eq(0)").text()) + '#' + trim($("#DrugListBody tr:eq(" + i + ") td:eq(2)").text()) + '，' + trim($("#DrugListBody tr:eq(" + i + ") td:eq(3)").text()) + '@';		
			}
		}
	
		if(task_str != ""){
			task_str = task_str.substring(0,task_str.length-1);	
		}
	
		if(task_str != ""){
			$.ajax({
				type: "POST",
				dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/CreateTask',
				async:false,
				data: {PlanNo: localStorage.getItem('NewPlanNo'),
				   Task: task_str,
				   UserId: localStorage.getItem('UserId'),
				   TerminalName: localStorage.getItem('TerminalName'),
				   TerminalIP: localStorage.getItem('TerminalIP'),
				   DeviceType: localStorage.getItem('DeviceType')
				   },
				success: function(result) { 
					if($(result).text()){
				 	}  
				 	else{
						alert("任务创建失败");
				 	}
				},
				error: function(msg) {alert("Error! setPsTask");}
			});
		}
		else{alert("请选择任务")};
		$.ajax({  
        type: "POST",
        dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetPsTask',
		//url: 'http://localhost:58895/Services.asmx/GetPsTask',
		async:false,
        data: {PlanNo:localStorage.getItem('NewPlanNo')},
		beforeSend: function(){},
        success: function(result) {
			var ret =  $.trim($(result).text()).replace(/ /g,"").split("\n\n\n");
			if(ret != "")
			{   
				for(j = 0; j < ret.length; j++){
				    if(ret[j].split("\n")[0] == ""){
						ret[j] = ret[j].replace("\n","");
					}
					var res = ret[j].split("\n");
					//if(res[1]=="LifeStyle"){
					//	res[1] = "生活方式";
					//}
					//if(res[1]=="VitalSign"){
					//    res[1] = "体征测量";
					//}
					//if(res[1]=="Drug"){
					//    res[1] = "药物治疗";
					//}
					//if(res[4] == null){
					//	res[4] = "";
					//}
					Tasklist[j] = res[0];
					//if(j == 0){
//						$("#L" + j).next().remove();
//						$("#L" + j).after('<tbody><tr id="L' + (j+1) + '"><td><div align="center" style="width:80px;word-wrap:break-word;">' + res[0] + '</div></td><td><div align="center" style="width:80px;word-wrap:break-word;">' + res[1] + '</div></td><td><div align="center" style="width:80px;word-wrap:break-word;">' + res[3] + '</div></td><td><div style="width:185px;word-wrap:break-word;">' + res[4] + '</div></td></tr>');
//					}
//					else{
//						$("#L" + j).after('<tr id="L' + (j+1) + '"><td><div align="center" style="width:80px;word-wrap:break-word;">' + res[0] + '</div></td><td><div align="center" style="width:80px;word-wrap:break-word;">' + res[1] + '</div></td><td><div align="center" style="width:80px;word-wrap:break-word;">' + res[3] + '</div></td><td><div style="width:185px;word-wrap:break-word;">' + res[4] + '</div></td></tr>');
//					}
				}
				//$("#L" + (j-1)).after('</tbody>');
			}
			else
			{		
			  	alert("该计划还没有布置任务");
			}				    
       }, 
       error: function(msg) {alert("Error!");}
     });	
  }
  
  //得到计划的目标
  function GetPsTarget(PlanNo){
	  $.ajax({  
	      type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetPsTarget',
		  async:false,
		  data: {PlanNo:PlanNo},
		  beforeSend: function(){},
		  success: function(result) {
			  var ret =  $.trim($(result).text()).replace(/ /g,"").split("\n\n\n");
			  if(ret != "")
			  {  
				  for(j = 0; j < ret.length; j++){
				  	  if(ret[j].split("\n")[0] == ""){
						ret[j] = ret[j].replace("\n","");
					  }
				  	  var res = ret[j].split("\n");
					  if(res[1] == "Bloodpressure" && res[3] == "Bloodpressure_1"){
						  $("#OSBP").val(res[6]);
						  $("#TSBP").val(res[5]);
					  }
					  if(res[1] == "Bloodpressure" && res[3] == "Bloodpressure_2"){
						  $("#ODBP").val(res[6]);
						  $("#TDBP").val(res[5]);
					  }
				  }
			  }
			  else
			  {		
				  alert("该计划还没有目标");
		 	  }				    
		  }, 
	      error: function(msg) {alert("Error! GetPsTarget");}
      });	
  }
	
  //得到计划信息
  function GetPlanInfo(PlanNo){
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
				  PatientId = ret[1];
				  StartDate = ret[2];
				  Module = ret[4];
				  DoctorId = ret[6];
			  }
			  else
			  {		
				  alert("计划读取失败");
			  }				    
		  }, 
		  error: function(msg) {alert("Error! GetPlanInfo");}
	  });	
  }
  
  //LY 20150604
  function SetCompliance(PatientId, DDate, PlanNo, Compliance, revUserId, TerminalName, TerminalIP, DeviceType){
      $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetCompliance',
		  async:false,
		  data: {PatientId:PatientId,
				 DDate:DDate,
				 PlanNo:PlanNo,
				 Compliance:Compliance,
				 revUserId:revUserId,
				 TerminalName:TerminalName,
				 TerminalIP:TerminalIP,
				 DeviceType:DeviceType},
		  beforeSend: function(){},
		  success: function(result) {
			  var ret =  $(result).text();			    
		 }, 
		 error: function(msg) {alert("Error! SetCompliance");}
     });
  }
  
  //LY 20150604
  function SetComplianceDetail(PatientId, DDate, PlanNo, Id, Status, CoUserId, CoTerminalName, CoTerminalIP, CoDeviceType){
      var Parent = PatientId + "||" + DDate + "||" + PlanNo;
      $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/SetComplianceDetail',
		  async:false,
		  data: {Parent:Parent,
				 Id:Id,
				 Status:Status,
				 CoUserId:CoUserId,
				 CoTerminalName:CoTerminalName,
				 CoTerminalIP:CoTerminalIP,
				 CoDeviceType:CoDeviceType},
		  beforeSend: function(){},
		  success: function(result) {
			  var ret =  $(result).text();			    
		 }, 
		 error: function(msg) {alert("SetComplianceDetail Error!");}
     });
  }
  
  //按下"确认开始"后发生LY
  function PlanStart()
  {
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
		  async:false,
		  data: {},
		  beforeSend: function(){},
		  success: function(result) {
			  StartDate =  $(result).text().slice(0,10).replace(/-/g,"");		    
		  }, 
		  error: function(msg) {alert("Error!");}
	  });
	  var EndDate = $("#EndDateSet").val().replace(/-/g,"");
	  //GetPlanInfo(localStorage.getItem('NewPlanNo'));
	  if(EndDate == ""){
	  	  $(".dateinvalid").html("请输入结束时间");
		  $(".dateinvalid").show();
		  return;
	  }
	  if(EndDate < StartDate){
		  return;
	  }
	  SetCompliance(localStorage.getItem('PatientId'), StartDate, localStorage.getItem('NewPlanNo'), 0, localStorage.getItem('UserId'), localStorage.getItem('TerminalName'), localStorage.getItem('TerminalIP'), localStorage.getItem('DeviceType'));
	  for(q = 0; q < Tasklist.length; q++){
	      SetComplianceDetail(localStorage.getItem('PatientId'), StartDate, localStorage.getItem('NewPlanNo'), Tasklist[q], 0, localStorage.getItem('UserId'), localStorage.getItem('TerminalName'), localStorage.getItem('TerminalIP'), localStorage.getItem('DeviceType'));
	  }
	  SetPlan(localStorage.getItem('NewPlanNo'), localStorage.getItem('PatientId'), StartDate, EndDate, localStorage.getItem('ModuleType'), 3, localStorage.getItem('UserId'), localStorage.getItem('UserId'), localStorage.getItem('TerminalName'), localStorage.getItem('TerminalIP'), localStorage.getItem('DeviceType'));
  }
  function TestValue(value, minValue, maxValue)
  {
	  var ret = false;
	if(value != "" && (value>=minValue &&value<=maxValue))
	   ret = true;
	   return ret; 
  }
  
  //判断结束日期是否合法
  function DateIsLegal() {
	var StartDate = "";
    $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
		async:false,
		data: {},
		beforeSend: function(){},
		success: function(result) {
			StartDate =  $(result).text().slice(0,10);		    
		}, 
		error: function(msg) {alert("Error!");}
	});
    var EndDate = $("#EndDateSet").val();
	if (EndDate < StartDate){
        $(".dateinvalid").html("结束日期不能早于开始日期");
		$(".dateinvalid").show();
	}
    else {
    	$(".dateinvalid").hide();
    }
  }