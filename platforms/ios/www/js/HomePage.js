/* global ChangeFlagToT */
/* global ChangeFlagToF */
/* global GetSMSDialogue */
/* global myscroll */
/* global GetLatestSMS */
/* global AmCharts */
/* global myScroll */
/* global GetSMSCountForAll */
/* global serviceName */
/* global serverIP */
/* global $ */
function InitialSMSBox()
{
	var doctorId = localStorage.getItem("DoctorId");
	var SMSCount = GetSMSCountForAll(doctorId);	
	//console.log('SMSCount: ' +SMSCount);
	$('#SMSCount').text(SMSCount);
	InitialRateLoader();
}
var OverDueArr = new Array();
var loadersArr = new Array();		

//PlanOverDueCheck
 function PlanOverDueCheck()
 {
	 var doctorId = localStorage.getItem("DoctorId");
	 var moduleSelected=$('#moduleSelect').children('option:selected').val();
	 OverDueArr.length = 0;
	 $.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/GetOverDuePlanList',		
		data:{DoctorId: doctorId,		
		ModuleType :moduleSelected		
		},
		async: true,
		beforeSend: function() {
	},
		success: function(result) {
		  if ($(result).text())
			$(result).find('Table1').each(function() {
				var patientId = $(this).find("PatientId").text();
				var patientName = $(this).find("PatientName").text();
				var photoAddress = $(this).find("photoAddress").text();
				var planNo = $(this).find("PlanNo").text();
				var startDate = $(this).find("StartDate").text();
				var process = $(this).find("Process").text();
				var remainingDays = $(this).find("RemainingDays").text();
				var vals = $(this).find('VitalSign').find("string");
				
				var obj = new Object();
				obj.patientId = patientId;
				obj.patientName = patientName;
				obj.photoAddress = photoAddress;
				obj.planNo = planNo;
				obj.startDate = startDate;
				obj.process =process;
				obj.remainingDays = remainingDays;
				OverDueArr.push(obj);

				//console.log('object name: ' + obj.patientName);
				});
			console.log('Plan Overdue count is '+OverDueArr.length);
		if(OverDueArr.length != 0)
		{
			console.log('Plan Overdue count is '+OverDueArr.length);
			for (var i in OverDueArr)
			{
				console.log(OverDueArr[i].patientName + " "+ OverDueArr[i].patientId+" " + OverDueArr[i].planNo);
				}
	   //DataTableLoad(rowArr); 
		$('#plancount').text(OverDueArr.length);
		}
		else
		{
				var obj = new Object();
				obj.patientId = "PID0001";
				obj.patientName = "测试患者1";
				obj.planNo = 'planNo0001';
				OverDueArr.push(obj);
				
				var obj1 = new Object();
				obj1.patientId = "PID0002";
				obj1.patientName = "测试患者2";
				obj1.planNo = 'planNo0001';
				OverDueArr.push(obj1);	
			console.log('Plan Overdue count is '+OverDueArr.length);					
		$('#plancount').text(OverDueArr.length);		
		}
		//PlanOverDuePanel
		$('#PlanOverDueList ul').empty();

		for(var i in OverDueArr)
		{
			 // var trcontent = '<p id="'+OverDueArr[i].planNo+'" class="planlist" value="'+OverDueArr[i].patientId+'">'+OverDueArr[i].patientId+" "+OverDueArr[i].patientName+" "+OverDueArr[i].planNo+'</p>';
			 var trcontent = '<li><a href="#"id="'+OverDueArr[i].planNo+'" class="planlist" value="'+OverDueArr[i].patientId+'">'+OverDueArr[i].patientId+" "+OverDueArr[i].patientName+" "+OverDueArr[i].planNo+'</a></li>';
			$('#PlanOverDueList ul').append(trcontent);
		}
			 $('#PlanOverDueList ul').listview('refresh')
    		$( "#PlanOverDuePanel" ).trigger( "updatelayout" );
				//PlanOverDue
			$(".planlist").click(function ()
			 {
				 localStorage.setItem("PatientId",$(this).attr("value"));
				 localStorage.setItem("PlanNo",$(this).attr("id"));
				 localStorage.setItem("PLType",4); //修改这个计划
				 
				 console.log($(this).attr("value")); 		 
				 console.log($(this).attr("id"));
				 location.href='CreatePlan.html?';
				 });

		},
		error: function(msg) {
		  console.log(msg);
		}
	  });
	 }


var rowArr = new Array();
	function GetPatientsList()
	{
		var doctorId = localStorage.getItem("DoctorId");
		$.mobile.loading( "show", {
            text: 'loading',
            textVisible: true,
            //theme: theme,
            textonly: false,
            //html: html
    });
		var moduleSelected=$('#moduleSelect').children('option:selected').val();
		var planSelected=$('#planSelect').children('option:selected').val();
		var complianceSelected=$('#complianceSelect').children('option:selected').val();
		var goalSelected=$('#goalSelect').children('option:selected').val();
		//console.log('module ' + moduleSelected +' plan '+planSelected+' compliance '+complianceSelected+' goal '+goalSelected);		
		rowArr.length = 0;
	  $.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/GetPatientsList',		
		data:{DoctorId: doctorId,		
		ModuleType :moduleSelected,		
		Plan :planSelected,		
		Compliance :complianceSelected,
		Goal:goalSelected
		},
		async: true,
		beforeSend: function() {
	},
		success: function(result) {
		  if ($(result).text())
		  {
			 $(result).find('RateTable').each(function() {
				var planRate = $(this).find("PlanRate").text();
				var complianceRateTotal = $(this).find("ComplianceRate").text();
				var goalRate = $(this).find("GoalRate").text();
				console.log('planRate: '+ planRate+'  complianceRateTotal: '+ complianceRateTotal+'  goalRate: '+ goalRate);
				DrawRates(planRate, complianceRateTotal, goalRate);
			});
			$(result).find('PatientListTable').each(function() {
				var patientId = $(this).find("PatientId").text();
				var patientName = $(this).find("PatientName").text();
				var photoAddress = $(this).find("photoAddress").text();
				var planNo = $(this).find("PlanNo").text();
				var startDate = $(this).find("StartDate").text();
				var process = $(this).find("Process").text();
				var remainingDays = $(this).find("RemainingDays").text();
				var complianceRate = $(this).find('ComplianceRate').text();
				var val0 =  $(this).find('VitalSign').children("string").eq(0).text(); //Now Value
				var val1=  $(this).find('VitalSign').children("string").eq(1).text();	//Origin Value
				var val2=  $(this).find('VitalSign').children("string").eq(2).text();	//Target Value
				var totalDays = $(this).find('TotalDays').text();	
				var planstatus = $(this).find('Status').text();			

				var vals = new Array();
				vals.push(val0);
				vals.push(val1);
				vals.push(val2);
				console.log(val0+"  O: "+val1 +" T: "+val2);
			
			
				var obj = new Object();
				obj.patientId = patientId;
				obj.patientName = patientName;
				obj.photoAddress = photoAddress;
				obj.planNo = planNo;
				obj.startDate = startDate;
				obj.process =process;
				obj.remainingDays = remainingDays;
				obj.complianceRate = complianceRate;
				obj.vals = vals;
				obj.totalDays  =totalDays;
				obj.planstatus = planstatus;				
				rowArr.push(obj);
				});

		  }
		if(rowArr != null)
	   		DataTableLoad(rowArr);
			   	$.mobile.loading( "hide" ); 
				   	$("#DataTable").trigger('create');  
		},
		error: function(msg) {
		  console.log(msg);
		  $.mobile.loading( "hide" );

		}
	  });

	}


function figureDraw(i, valNow,valOrigin,valTarget)
{
			var chart;
				console.log(valNow+"  "+valOrigin +" "+valTarget);

			//var val0 = 65;
			//var val1 = 78;
			var width = 60;
			var chartData = [
				{
					"category": "",
					"good": width,
					"average": width,
					"poor": width,
					"bad":width,
					"valTarget": valTarget,
					"full": 220,
					"valOrigin":valOrigin,
					"valNow": valNow
				}
			];
			
				// FIRST BULLET CHART
				// bullet chart is a simple serial chart
				chart = new AmCharts.AmSerialChart();
				chart.dataProvider = chartData;
				chart.categoryField = "category";
				chart.rotate = true; // if you want vertical bullet chart, set rotate to false
				chart.columnWidth = 1;
				chart.startDuration = 1;
			
				// AXES
				// category
				var categoryAxis = chart.categoryAxis;
				categoryAxis.gridAlpha = 0;
				categoryAxis.axisAlpha =0 ;
			
				// value
				var valueAxis = new AmCharts.ValueAxis();
				valueAxis.labelsEnabled = false;
				valueAxis.maximum = 210;
				valueAxis.axisAlpha = 0;
				valueAxis.gridAlpha = 0;
				valueAxis.stackType = "regular"; // we use stacked graphs to make color fills
				chart.addValueAxis(valueAxis);
			
				// this graph displays the short dash, which usually indicates maximum value reached.
				var graph = new AmCharts.AmGraph();
				graph.valueField = "valTarget";
				graph.lineColor = "#0FF0FF";
				// it's a step line with no risers
				graph.type = "step";
				graph.noStepRisers = true;
				graph.lineAlpha = 1;
				graph.lineThickness = 3;
				graph.columnWidth = 0.5; // change this if you want wider dash
				graph.stackable = false; // this graph shouldn't be stacked
				chart.addGraph(graph);
			
				
				// The following graphs produce color bands
				graph = new AmCharts.AmGraph();
				graph.valueField = "bad";
				graph.lineColor = "#b4dd1e";
				graph.showBalloon = false;
				graph.type = "column";
				graph.fillAlphas = 0.8;
				chart.addGraph(graph);

				graph = new AmCharts.AmGraph();
				graph.valueField = "poor";
				graph.lineColor = "#f4fb16";
				graph.showBalloon = false;
				graph.type = "column";
				graph.fillAlphas = 0.8;
				chart.addGraph(graph);
			
				graph = new AmCharts.AmGraph();
				graph.valueField = "average";
				graph.lineColor = "#f6d32b";
				graph.showBalloon = false;
				graph.type = "column";
				graph.fillAlphas = 0.8;
				chart.addGraph(graph);
			
				graph = new AmCharts.AmGraph();
				graph.valueField = "good";
				graph.lineColor = "#fb7116";			
				graph.showBalloon = false;
				graph.type = "column";
				graph.fillAlphas = 0.8;
				chart.addGraph(graph);


				// this is the "bullet" graph - black bar showing current value
				graph = new AmCharts.AmGraph();
				graph.openField = "valOrigin";
				graph.bullet = "round";
				graph.bulletSize = 12;
				graph.bulletOffset = 8;
				graph.valueField = "valOrigin";
				graph.lineColor = "#FFFFFF";
				graph.type = "column";
				graph.lineAlpha = 0;
				graph.fillAlphas = 0;
				graph.columnWidth = 0.3; // this makes it narrower than color graphs
				graph.stackable = false; // bullet graph should not stack
				graph.clustered = false; // this makes the trick - one column above another
				chart.addGraph(graph);

			
				// this is the "bullet" graph - black bar showing current value
				graph = new AmCharts.AmGraph();
				graph.openField = "valOrigin";
				graph.bullet = "triangleLeft";
				graph.bulletSize = 10;		
				graph.bulletOffset = -8;
				graph.valueField = "valNow";
				graph.lineColor = "#FFFFFF";
				graph.type = "column";
				graph.lineAlpha = 1;
				graph.fillAlphas = 1;
				graph.columnWidth = 0.3; // this makes it narrower than color graphs
				graph.stackable = false; // bullet graph should not stack
				graph.clustered = false; // this makes the trick - one column above another
				chart.addGraph(graph);				
				var obj = 'chartdiv'+i;
				// WRITE
				chart.write(obj);
}

//load PatientList DataTable
function DataTableLoad(arr)
{
	//alert($('#dtSearch').val());
	if ($('#dtSearch').val() != "") {
		console.log('no refresh!');
		return;	
	}
	var table = $('#DataTable').DataTable();
	table.clear().draw();
	var doctorId = localStorage.getItem("DoctorId");
	//动态加载“患者信息”和“任务列表”等
	for(var i in arr) 
	{
		//患者信息
		//Avatar Name PID Progress
		var patientInfo;
		var pid = arr[i].patientId;
		var patientname = arr[i].patientName;
		var processvalue = arr[i].process*100;
		var remainingDays = arr[i].remainingDays;
		var totalDays = 0;
		var processDays = 0;
		var planstatus = 0;
		if(arr[i].planstatus != "")
			planstatus =arr[i].planstatus;
		//console.log(pid +'  '+ planstatus+'  '+arr[i].startDate);
		//Days counting
		if (arr[i].totalDays > 0) {
			totalDays = arr[i].totalDays;
			processDays = totalDays*arr[i].process;
		}
		if(patientname =="")
			patientname = "未知";			

		var avatarUrl = "img/avatar.jpg";
		var progressbar = "progressbar";

		progressbar ='<div  data-role="fieldcontain" style = "margin:0;"><input type="range" name="points" class="points" value="'+processvalue+'" min="0" max="100" data-highlight="true"><p>'+processDays+'/'+totalDays+'天</p></div>';
		//patientInfo = ' <ul data-role="listview" data-inset="true"><li data-role="list-divider"><a href=""><img src = "'+avatarUrl+'"'+'id="img'+pid+'" value="'+pid+'"/></a>'+patientname+'</li><li> <p><b>'+arr[i].patientId+'</b></p>'+progressbar+'</li></ul>';		
//patientInfo = ' <ul data-role="listview" data-inset="true"><li data-role="list-divider"><a href=""><img src = "'+avatarUrl+'"'+'id="img'+pid+'" value="'+pid+'"/></a>'+patientname+'<span  ><a href="#link" data-role="button" data-icon="info" data-iconpos="notext">信息</a></span></li><li> <p><b>'+arr[i].patientId+'</b></p>'+progressbar+'</li></ul>';		
//patientInfo = ' <ul data-role="listview" data-inset="true"><li data-role="list-divider"><a href=""><img src = "'+avatarUrl+'"'+'id="img'+pid+'" value="'+pid+'"/></a>'+patientname+'</li><li> <p id="clinicInfo'+pid+'" value="'+pid+'"><b>'+arr[i].patientId+'</b></p>'+progressbar+'</li></ul>';
//patientInfo = ' <ul data-role="listview" data-inset="true"><li data-role="list-divider"><a href=""><img class="Avataricon" src = "'+avatarUrl+'"/></a>'+patientname+'</li><li> <p id="clinicInfo'+pid+'" value="'+pid+'"><b>'+arr[i].patientId+'</b></p> <div class="ui-btn-right"> <a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="plus" class="Planicon"></a><a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="info" class="SMSicon"></a></div>'+progressbar+'</li></ul>';		

//patientInfo = ' <div style="width: 30%;float:left;"><a href=""><img class="Avataricon" src = "'+avatarUrl+'"/></a> </div> <div style="width: 70%;float:right;"><ul data-role="listview" data-inset="true"><li data-role="list-divider">'+patientname+'<div class="ui-btn-right"> <a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="plus" class="Planicon"></a><a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="info" class="SMSicon"></a></div></li><li> <p id="clinicInfo'+pid+'" value="'+pid+'"><b>'+arr[i].patientId+'</b></p> '+progressbar+'</li></ul></div>';		

//patientInfo = ' <div><div style="width: 25%;float:left;margin-top:20px;margin-bottom:20px;"><div class="imgtest" ><a href=""><img class="Avataricon" src = "'+avatarUrl+'"/></a></div> </div> <div style="width: 70%;float:right;"><ul data-role="listview" data-inset="true"><li data-role="list-divider">'+patientname+'<div class="ui-btn-right"> <a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="plus" class="Planicon"></a><a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="info" class="SMSicon"></a></div></li><li> <p id="'+pid+'" value="'+pid+'"><b>'+arr[i].patientId+'</b></p>'+progressbar+'</li></ul></div></div>';		
      	
patientInfo = ' <div><div style="width: 25%;float:left;margin-top:20px;margin-bottom:20px;"><div style="display:inline-block;margin:5px auto;width:70px;height:70px;border-radius:100px;border:2px solid #fff;overflow:hidden;-webkit-box-shadow:0 0 3px #ccc;box-shadow:0 0 3px #ccc;" ><a href=""><img style="width:100%;min-height:100%; text-align:center;" class="Avataricon" src = "'+avatarUrl+'"/></a></div> </div> <div style="width: 70%;float:right;"><ul data-role="listview" data-inset="true"><li data-role="list-divider">'+patientname+'<div class="ui-btn-right"> <a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="plus" class="Planicon"></a><a href="" data-inline="true"  data-role="button"  data-iconpos="notext" data-icon="info" class="SMSicon"></a></div></li><li> <p id="'+pid+'" value="'+pid+'"><b>'+arr[i].patientId+'</b></p>'+progressbar+'</li></ul></div></div>';		
		var tasklist = '<canvas id="l'+i+'"class="loader'+i+'" style="width:100px;"></canvas>';
		var figure = '<div id="chartdiv'+i+'" style="width: 240px; height: 100px;"></div>';
		var Content = "";
		var SendDateTime = "";
		var count = "0" ;
		var message = "";
		//if(arr[i].planNo != "")
		{
			var SMSArray = GetLatestSMS(doctorId,pid);
			//console.log(SMSArray);
			Content = SMSArray[1];
			SendDateTime = SMSArray[2];
			count = GetSMSCountForOne(doctorId,pid);
			//console.log('Content: ' + Content);
		}
		if(Content != "" || count != "0")
		{
			message = '<div style="width: 100%; height: 80%;"><ul  data-role="listview" data-inset="true"><li data-role="list-divider">'+SendDateTime+' <span class="ui-li-count" style="background-color:#C00"><font color="white">'+count+'</font></span></li><li><a href="" class="SMS" id="SMS'+i+'" value="'+pid+'"><p>'+Content+'</p></a> </li></ul></div>';
		}

		table.row.add([patientInfo, tasklist, figure, message,arr[i].planNo,arr[i].patientId,arr[i].startDate,planstatus,patientname]).draw();
		if(arr[i].planNo != "")
		{
		var loaders = '.loader'+i;
		var loader = $(loaders).ClassyLoader({
			width:100,
			height:100,
			fontSize: "20px",
			diameter:40,
			lineColor:'rgba(0, 200, 0, 1)',
			remainingLineColor:'rgba(0, 0, 0, 0.1)',
			lineWidth:10,
			speed: 50,
			animate: false,
			percentage: 0
		});
		//if(arr[i].planNo != "")
		//{
			console.log('PID: ' + pid);
			figureDraw(i, arr[i].vals[0],arr[i].vals[1],arr[i].vals[2]);	//vitalsign figure
			if(arr[i].complianceRate > 0)
			{
			loader.draw(arr[i].complianceRate*100); //tasklist percentage figure
			//console.log(arr[i].complianceRate*100);
			}		
		}		
	}
	
	//Avataricon (PatientBasicInfo)
		$('.Avataricon').bind('click',function () {
		//var val = $(this).attr("value");
			var table = $('#DataTable').DataTable();
            var row_clicked = $(this).closest('tr');
			var pid = table.row(row_clicked).data()[5];			
		localStorage.setItem('PatientId', pid);
		location.href='ProfilePage.html?';			
		});
		
	//Planicon
		$('.Planicon').bind('click',function () {
			var table = $('#DataTable').DataTable();
            var row_clicked = $(this).closest('tr');
			var pid = table.row(row_clicked).data()[5];			
			var planNo = table.row(row_clicked).data()[4];
			var status  = table.row(row_clicked).data()[7];
			var moduletype = 	localStorage.getItem("ModuleType");
		 localStorage.setItem('PatientId',pid);
		localStorage.setItem('NewPlanNo', '');
		localStorage.setItem('PlanNo', planNo);
		localStorage.setItem('ModuleType', moduletype);
		if (status == 0) {
			localStorage.setItem('PLType', '3');
		}
		else
			localStorage.setItem('PLType', status);
	    localStorage.setItem('EditEnable', '1');						  
		
		alert('创建计划按钮 '+'planNo: ' + planNo+'  PlanStatus: '+ table.row(row_clicked).data()[7]);
		location.href='CreatePlan.html?';	
		});	
	
	//SMS_icon
		$('.SMSicon').bind('click',function () {
			var table = $('#DataTable').DataTable();
            var row_clicked = $(this).closest('tr');
		 localStorage.setItem('PatientId',table.row(row_clicked).data()[5]);
		 InitialSMS();
		$( "#SMSPanel" ).panel( "open" );	
		$('#SMSContentPhone').val("");	   
		});	

		 //SMS
	 $(".SMS").click(function ()
	 {
			var table = $('#DataTable').DataTable();
            var row_clicked = $(this).closest('tr');
			var pid = table.row(row_clicked).data()[5];			  
		 localStorage.setItem('PatientId',pid);
		 InitialSMS();
		//$('#SMSPanel').trigger('updatelayout');
		$( "#SMSPanel" ).panel( "open" );
		$('#SMSContentPhone').val("");
		//myScroll.disable();		 
		 });

		 
	//DataTable refresh style css
	$("#DataTable").trigger('create');
	$.mobile.loading( "hide" );

	//progressbar ui adjust
		$('.points').parent().find('input').hide().css('margin-left','-9999px'); // Fix for some FF versions
            $('.points').parent().find('.ui-slider-track').css('margin','0 15px 0 15px').css('pointer-events','none');	//disable drag interaction
            $('.points').parent().find('.ui-slider-handle').hide();			
		myScroll.refresh();	// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion) 
}


function onDeviceReady() {
	
	//CheckNetwork();
	GetPatientsList();
	//console.log('ondevice is ready or pull to refresh');
	//figureDraw(0);
	PlanOverDueCheck(); 
	BindEvent();
}

function BindEvent() {
	 //SMSBOX & SMS Event binding
	 $("[data-role='panel']").on( "panelclose", function( event, ui ) {
		myScroll.enable();
		//console.log('myScroll enable'); 
		})
	 .on("panelopen", function(event, ui){
		 myScroll.disable();
		//console.log('myScroll disable');		 		 
	 });

}

function DrawRates(p,c,g)
{
	var loaders = new Array();		
	loaders.push('#planloader');
	loaders.push('#complianceloader');
	loaders.push('#goalloader');
	
	//Calculate the percentage of three main indicators
	var percentages = new Array();
	percentages.push(p);
	percentages.push(c);
	percentages.push(g);
	for(var i in loaders)
	{
		var linecolor = 'rgba(0, 0, 0, 1)';
		if(percentages[i]> 60)
			linecolor = 'rgba(0, 200, 0, 0.7)';	//Green
		else if(percentages[i] > 30)
			linecolor = 'rgba(240, 120, 0, 0.7)';	//Orange
		else
			linecolor = 'rgba(255, 0, 0, 0.7)';	//Red
		
		if(percentages[i] != 0)
		{
			loadersArr[i].setLineColor(linecolor).setPercent(percentages[i]*100).draw();
			//console.log('LoaderPercent: '+ loadersArr[i].getPercent());			
		}

	}	
}
//Draw Rates Loader
function InitialRateLoader()
{
	var loaders = new Array();
//	var loadersArr = new Array();		
	loaders.push('#planloader');
	loaders.push('#complianceloader');
	loaders.push('#goalloader');

	for(var i in loaders)
	{
		var linecolor = 'rgba(0, 0, 0, 1)';	
		var loader = $(loaders[i]).ClassyLoader({
				width:100,
				height:100,
				fontSize: "20px",
				diameter:40,
				lineColor:linecolor,
				remainingLineColor:'rgba(0, 0, 0, 0.1)',
				lineWidth:10,
				speed: 20,
				animate: false,
				percentage: 0
			});
			
		loadersArr.push(loader);
		//console.log('loaderArr: ' + loadersArr[0].getPercent());
		loader.show();
	}
	
}

	function InitialSMS()
	{//SMS
	//var ThisUserId = localStorage.getItem("DoctorId");
	//console.log(ThisUserId);
	TheOtherId = localStorage.getItem("PatientId");
	console.log('SMS TheOtherId: '+TheOtherId);
	
	
	  GetSMSDialogue(ThisUserId, TheOtherId,'Phone');
	  //document.getElementById('MainFieldPhone').scrollTop = document.getElementById('MainFieldPhone').scrollHeight;
	  console.log('scrollHeight', $('#MainFieldPhone')[0].scrollHeight);
	  $('#MainFieldPhone').scrollTop( $('#MainFieldPhone')[0].scrollHeight);
	  
	  var SMSBtnSMS = document.getElementById('SMSbtnPhone');	
	  SMSBtnSMS.addEventListener("mouseover", ChangeFlagToF, false);
	  SMSBtnSMS.addEventListener("mouseout", ChangeFlagToT, false);
	 /* $('#SMSbtnPhone').bind({
		  mouseover: ChangeFlagToF(),
		  mouseout: ChangeFlagToT()}
		  );*/
		//SMSBtn.addEventListener("click", submitSMS, false);
		
	 // var ContentTxt = document.getElementById('SMSContentPhone');
	 // ContentTxt.addEventListener("focus", InTxt, false);
	 //ContentTxt.addEventListener("blur", OutOfTxt, false);
	 /*$('#SMSContentPhone').bind({
		 focus: InTxt(),
		 blur: OutOfTxt()
	 });*/
	 
	 $('#SMSContentPhone').bind("focus", function(){
		   InTxt('Phone');
	  });
	  $('#SMSContentPhone').bind("blur", function(){
		   OutOfTxt('Phone');
	  });
	  
  	 window.onload = PhoneMessagePush("Phone");
	 $('#SMSPanel').trigger('updatelayout');

	}
	
	
	
	function InitialSMSList()
	{
		var ThisUserId = localStorage.getItem("DoctorId");
	//console.log(ThisUserId);
		var TheOtherId = localStorage.getItem("PatientId");
	//SMSBOX DeviceReady
		GetSMSList(ThisUserId, moduleType);
		GetSMSDialogue(ThisUserId, TheOtherId,'Pad');
	  $('#MainField').scrollTop( $('#MainField')[0].scrollHeight);
	  $('#SMSbtn').bind({
		  mouseover: ChangeFlagToF(),
		  mouseout: ChangeFlagToT()}
		  );

	 $('#SMSContent').bind({
		 focus: InTxt(),
		 blur: OutOfTxt()
	 });
  	 	window.onload = PhoneMessagePush("Phone");		
		$('#SMSBoxPanel').trigger('updatelayout');	
	//点击后出现相应的消息对话
	$(function() {
		$("#SMSListUl li").click(function(){
		   TheOtherId = $(this).find("tr:first").find("td:eq(1)").attr("id");
		   PatientName = $(this).find("tr:first").find("td:eq(1)").text();
		   $('#MainField').html(""); //清空以前的消息
		GetSMSDialogue(ThisUserId, TheOtherId,'Pad');
		   document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;//滑动至底部
		   $('#SubmitTbl').attr("class", "RevealTbl");
		   $('#PName').html(PatientName);
		   SetSMSRead(ThisUserId, TheOtherId); //变为已读
		   $(this).find("tr:first").find("td:first").html(""); //删除未读标记
		   $(this).find("tr:first").find("td:first").removeClass('circle');
		});
	});		
		
	}