$(document).on("pageinit", "#SetTargetPage", function(){
    if (localStorage.getItem('EditEnable') == 0) {
      $('#Targetbutton').css('display','none');
      //console.log('targetPage');
    }
	  $("#TextInput1").css("width","80px").parent().css("width","80px");
	  $("#TextInput2").css("width","80px").parent().css("width","80px");
	  $("#TextInput3").css("width","80px").parent().css("width","80px");
	  $("#TextInput4").css("width","80px").parent().css("width","80px");
	  var ContentTxt1 = document.getElementById('TextInput1');
	  var ContentTxt2 = document.getElementById('TextInput2');
	  var ContentTxt3 = document.getElementById('TextInput3');
	  var ContentTxt4 = document.getElementById('TextInput4');
	  ContentTxt1.addEventListener("focus", InTxt, false);
	  ContentTxt1.addEventListener("blur", OutOfTxt, false);
	  ContentTxt2.addEventListener("focus", InTxt, false);
	  ContentTxt2.addEventListener("blur", OutOfTxt, false);
	  ContentTxt3.addEventListener("focus", InTxt, false);
	  ContentTxt3.addEventListener("blur", OutOfTxt, false);
	  ContentTxt4.addEventListener("focus", InTxt, false);
	  ContentTxt4.addEventListener("blur", OutOfTxt, false);
	  //先对NewPlanNo置为空，以对“下一步”按钮点击状态进行判断 ZC 2015-05-07
	  localStorage.setItem('NewPlanNo', "");
	  GetBPGrades();
	  //读取血压值，包括当前和前一个计划的目标
	  GetCurrentSBP(localStorage.getItem('PatientId'));
	  GetCurrentDBP(localStorage.getItem('PatientId'));
	  
	  GetTargetSBP(localStorage.getItem('PLType'), localStorage.getItem('PlanNo'), "1");
	  GetTargetDBP(localStorage.getItem('PLType'), localStorage.getItem('PlanNo'), "2");

/*	  SBPBar($('#TextInput1').val(), $('#TextInput3').val(), SBPlist, chart_SBP_1);
	  DBPBar($('#TextInput2').val(), $('#TextInput4').val(), DBPlist, chart_DBP_1);
	  Risk();*/

   	   setTimeout(function(){
		  SBPBar($("#TextInput1").val(), $("#TextInput3").val(), SBPlist, chart_SBP_1);
		  },200);
	   setTimeout(function(){
		  DBPBar($("#TextInput2").val(), $("#TextInput4").val(), DBPlist, chart_DBP_1);
		  },200);
	   setTimeout(function(){
		  Risk();
		  },200); 
  });

  function InTxt() //开始输入，避免输入框被键盘遮挡
{
	$('#MainField').attr("class", "ShortField");
	document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight*0.6;
}

function OutOfTxt() //输入完成
{	
	$('#MainField').attr("class", "NormalField");	
	
}
  
  
  //CreatePlanPage自运行
  $(document).on("pageinit", "#CreatePlanPage", function(){ 
      //当PlanNo状态为暂存时，把NewPlanNo=PlanNo，只要PLType不变，则不影响页面逻辑
      if(localStorage.getItem('PLType') == 1){
		localStorage.setItem('NewPlanNo', localStorage.getItem('PlanNo'));  
	  }
      getGoalValue(); 
	  loadLifeStyle();	
	  loadLastLifeStyle();
	  getPatientDrugRecord(); //获取患者的药嘱列表
      loadDrugList();  //加载以往的“药物治疗”记录
  });
   
  //StartPlanPage自运行
  $(document).on("pageinit", "#StartPlanPage", function(){ 
  	  $("#PlanShow").chromatable({		//任务显示滚动(表头不滚动)
		  width: "495px",
		  height: "450px",
		  scrolling: "yes",	
	  });
  });
 

  
  
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
		data: {PatientId:PatientId},//输入变量
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
		  data: {PatientId:PatientId},//输入变量
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
	 // alert(a);alert(b);alert(SBPlist);都取到数值了
/*	  if(a=="")
	  {
		a=0;
	  }
	  if(b=="")
	  {
		b=0;
	  }*/
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
	  var Hyper="";
	  var Harvard="";
	  var Framingham="";
	  var Stroke="";
	  var Heart="";	 
	  var Age = ""; 	
	  $.ajax
	 	 ({  	 	
          	type: "POST",
          	dataType: "xml",
		  	timeout: 30000,  
		  	url: 'http://'+ serverIP +'/'+serviceName+'/GetRiskInput',
		  	async:false,
          	data: {UserId:PatientId},//输入变量
		  	beforeSend: function(){},
          	success: function(result) 
		 	{ 			
			   $(result).find('Table1').each(function(){		
					Age = parseInt($(this).find("Age").text());
					Gender = parseInt($(this).find("Gender").text());
					Height = parseInt($(this).find("Height").text());
					Weight = parseInt($(this).find("Weight").text());
					Heartrate = parseInt($(this).find("Heartrate").text());
					Parent = parseInt($(this).find("Parent").text());
					Smoke = parseInt($(this).find("Smoke").text());
					Stroke = parseInt($(this).find("Stroke").text());
					Lvh = parseInt($(this).find("Lvh").text());
					Diabetes = parseInt($(this).find("Diabetes").text());
					Treat = parseInt($(this).find("Treat").text());
					Heartattack = parseInt($(this).find("Heartattack").text());
					Af = parseInt($(this).find("Af").text());
					Chd = parseInt($(this).find("Chd").text());
					Valve = parseInt($(this).find("Valve").text());
					Tcho = parseInt($(this).find("Tcho").text());
					Creatinine = parseFloat($(this).find("Creatinine").text());
					Hdlc = parseFloat($(this).find("Hdlc").text());
					Hyperother = parseFloat($(this).find("Hyperother").text());
					HarvardRiskInfactor = parseInt($(this).find("HarvardRiskInfactor").text());
					FraminghamRiskInfactor = parseFloat($(this).find("FraminghamRiskInfactor").text());
					StrokeRiskInfactor = parseInt($(this).find("StrokeRiskInfactor").text());
					HeartFailureRiskInfactor = parseInt($(this).find("HeartFailureRiskInfactor").text());
			});	
				//从数据库中获取除血压外所有输入，并进行初步计算，一次性取出
				
			   var SBP=parseInt($('#TextInput1').val());
			   var DBP=parseInt($('#TextInput2').val());
			   //从页面获取当前收缩压和舒张压
			   
			   Hyperother=Hyperother- 0.05933 * SBP - 0.12847 * DBP+ 0.00162 * Age*DBP;
			   Hyper = 1-Math.exp(-Math.exp(((Math.log(4))- (22.94954+ Hyperother))/0.87692));
			   //计算高血压风险评估发病率

			   if (Gender==1)
			 {
				     if (SBP <= 119)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 5;
                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 8;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 9;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 10;
                     }
                     else
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 11;
                     }	
			 }
			 
			 else
			 {

				     if (SBP <= 119)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 5;

                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 7;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 8;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 9;
                     }
                     else
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 10;
                     }	 
 
			 } 
			Harvard = 6.304 * Math.pow(10, -8) * Math.pow(HarvardRiskInfactor, 5) - 5.027 * Math.pow(10, -6) * Math.pow(HarvardRiskInfactor, 4) + 0.0001768 * Math.pow(HarvardRiskInfactor, 3) - 0.001998 * Math.pow(HarvardRiskInfactor, 2) + 0.01294 * HarvardRiskInfactor + 0.0409;
			Harvard=Harvard/100;
			//alert(Harvard);
			   //计算Harvard五年死亡率

			   if(Gender == 1)
			   {
					if(Treat==1)
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+1.99881*Math.log10(SBP);	
					}
					else
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+1.93303*Math.log10(SBP);	
					}   
					Framingham =  1-Math.pow(0.88936,Math.exp(FraminghamRiskInfactor - 23.9802));
			   }
			   else
			   {
					if(Treat==1)
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+2.82263*Math.log10(SBP);	
					}
					else
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+2.76157*Math.log10(SBP);	
					}  
					Framingham = 1-Math.pow(0.95012,Math.exp(FraminghamRiskInfactor - 26.1931));	   
			   }
			   //计算十年心血管疾病发生率
			   
			    if (Gender==1)//male
			    {
					if (Treat != 1) //没有治疗过高血压的情况
					{
							 if (SBP <= 105)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 0;
							 }
							 else if (SBP >= 106 && SBP <= 115)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 1;
							 }
							 else if (SBP >= 116 && SBP <= 125)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 2;
							 }
							 else if (SBP >= 126 && SBP <= 135)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 3;
							 }
							 else if (SBP >= 136 && SBP <= 145)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 4;
							 }
							 else if (SBP >= 146 && SBP <= 155)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 5;
							 }
							 else if (SBP >= 156 && SBP <= 165)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 6;
							 }
							 else if (SBP >= 166 && SBP <= 175)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 7;
							 }
							 else if (SBP >= 176 && SBP <= 185)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 8;
							 }
							 else if (SBP >= 186 && SBP <= 195)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 9;
							 }
							 else
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 10;
							 }
                 	}
                	else//治疗过高血压的情况
                    {
                         if (SBP <= 105)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 0;
                         }
                         else if (SBP >= 106 && SBP <= 112)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 1;
                         }
                         else if (SBP >= 113 && SBP <= 117)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 2;
                         }
                         else if (SBP >= 118 && SBP <= 123)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 3;
                         }
                         else if (SBP >= 124 && SBP <= 129)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 4;
                         }
                         else if (SBP >= 130 && SBP <= 135)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 5;
                         }
                         else if (SBP >= 136 && SBP <= 142)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 6;
                         }
                         else if (SBP >= 143 && SBP <= 150)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 7;
                         }
                         else if (SBP >= 151 && SBP <= 161)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 8;
                         }
                         else if (SBP >= 162 && SBP <= 176)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 9;
                         }
                         else
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 10;
                         }
                     }	 
				var Risk = new Array(3, 3, 4, 4, 5, 5, 6, 7, 8, 10, 11, 13, 15, 17, 20, 22, 26, 29, 33, 37, 42, 47, 52, 57, 63, 68, 74, 79, 84, 88);
				//alert(Risk[1]-1)
				 Stroke = Risk[StrokeRiskInfactor-1] / 100;
			 }
			 //女性SBP加成
			 else
			 {
			 	 if (Treat != 1) //没有治疗过高血压的情况
                 {
                         if (SBP <= 94)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 118)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 2;
                         }
                         else if (SBP >= 119 && SBP <= 130)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 3;
                         }
                         else if (SBP >= 131 && SBP <= 143)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 4;
                         }
                         else if (SBP >= 144 && SBP <= 155)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 5;
                         }
                         else if (SBP >= 156 && SBP <= 167)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 6;
                         }
                         else if (SBP >= 168 && SBP <= 180)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 7;
                         }
                         else if (SBP >= 181 && SBP <= 192)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 8;
                         }
                         else if (SBP >= 193 && SBP <= 204)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 9;
                         }
                         else
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 10;
                         }
                 }
                 else//治疗过高血压的情况
                 {
                         if (SBP <= 94)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 113)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 2;
                         }
                         else if (SBP >= 114 && SBP <= 119)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 3;
                         }
                         else if (SBP >= 120 && SBP <= 125)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 4;
                         }
                         else if (SBP >= 126 && SBP <= 131)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 5;
                         }
                         else if (SBP >= 132 && SBP <= 139)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 6;
                         }
                         else if (SBP >= 140 && SBP <= 148)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 7;
                         }
                         else if (SBP >= 149 && SBP <= 160)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 8;
                         }
                         else if (SBP >= 161 && SBP <= 204)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 9;
                         }
                         else
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 10;
                         }
                 }
			     var Risk = new Array(1, 1, 2, 2, 2, 3, 4, 4, 5, 6, 8, 9, 11, 13, 16, 19, 23, 27, 32, 37, 43, 50, 57, 64, 71, 78, 84);
				 Stroke = Risk[StrokeRiskInfactor-1] / 100;         
			 }
			   //中风发生率
			   
			   if (Gender==1)//男性
			   {
				        if (SBP <= 119)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 0;
                         }
                         else if (SBP >= 120 && SBP <= 139)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 1;
                         }
                         else if (SBP >= 140 && SBP <= 169)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 2;
                         }
                         else if (SBP >= 170 && SBP <= 189)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 3;
                         }
                         else if (SBP >= 190 && SBP <= 219)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 4;
                         }
                         else
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 5;
                         }
						 
				         if (HeartFailureRiskInfactor <= 5)
						 {
							 HeartFailureRisk = 1;
						 }
						 else if (HeartFailureRiskInfactor > 5 && HeartFailureRiskInfactor < 14)
						 {
							 HeartFailureRisk = 3;
						 }
						 else if (HeartFailureRiskInfactor >= 14 && HeartFailureRiskInfactor < 16)
						 {
							 HeartFailureRisk = 5;
						 }
						 else if (HeartFailureRiskInfactor >= 16 && HeartFailureRiskInfactor < 18)
						 {
							 HeartFailureRisk = 8;
						 }
						 else if (HeartFailureRiskInfactor >= 18 && HeartFailureRiskInfactor < 20)
						 {
							 HeartFailureRisk = 11;
						 }
						 else if (HeartFailureRiskInfactor >= 20 && HeartFailureRiskInfactor < 22)
						 {
							 HeartFailureRisk = 11;
						 }
						 else if (HeartFailureRiskInfactor >= 22 && HeartFailureRiskInfactor < 24)
						 {
							 HeartFailureRisk = 22;
						 }
						 else if (HeartFailureRiskInfactor >= 24 && HeartFailureRiskInfactor < 25)
						 {
							 HeartFailureRisk = 30;
						 }
						 else if (HeartFailureRiskInfactor >= 25 && HeartFailureRiskInfactor < 26)
						 {
							 HeartFailureRisk = 34;
						 }
						 else if (HeartFailureRiskInfactor >= 26 && HeartFailureRiskInfactor < 27)
						 {
							 HeartFailureRisk = 39;
						 }
						 else if (HeartFailureRiskInfactor >= 27 && HeartFailureRiskInfactor < 28)
						 {
							 HeartFailureRisk = 44;
						 }
						 else if (HeartFailureRiskInfactor >= 28 && HeartFailureRiskInfactor < 29)
						 {
							 HeartFailureRisk = 49;
						 }
						 else if (HeartFailureRiskInfactor >= 29 && HeartFailureRiskInfactor < 30)
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
                         HeartFailureRiskInfactor = HeartFailureRiskInfactor + 0;
                     }
                     else if (SBP >= 140 && SBP <= 209)
                     {
                         HeartFailureRiskInfactor = HeartFailureRiskInfactor + 1;
                     }
                     else
                     {
                         HeartFailureRiskInfactor = HeartFailureRiskInfactor + 2;
                     }	
					  
				     if (HeartFailureRiskInfactor < 10)
                     {
                         HeartFailureRisk = 1;
                     }
                     else if (HeartFailureRiskInfactor <= 28)
                     {
                         var Risk = new Array(2,2,3, 3, 4, 5, 7, 9, 11, 14, 17, 21, 25, 30, 36, 42, 48, 54, 60 );
                         HeartFailureRisk = Risk[HeartFailureRiskInfactor - 10];
                     }
                     else 
                     {
                         HeartFailureRisk = 60;
                     }
				     Heart=HeartFailureRisk/100;
			 } 
			   //心衰发病率
               SetRiskResult(Hyper,Harvard,Framingham,Stroke,Heart);
			   RiskBar(Hyper,Harvard,Framingham,Stroke,Heart);
          	}, 
            error: function(msg) {alert("RiskInput");}
   });
   
	  function SetRiskResult(Hyper,Harvard,Framingham,Stroke,Heart)
	  {
		  Hyper = Hyper.toFixed(4);
		  Harvard = Harvard.toFixed(4);
		  Framingham = Framingham.toFixed(4);
		  Stroke = Stroke.toFixed(4);
		  Heart = Heart.toFixed(4);
		  var Result = Hyper+"||"+Harvard+"||"+Framingham+"||"+Stroke+"||"+Heart;
		  //alert(Result);
		  var ret = false;
		  var AssessmentTime ="";	
		  var SortNo = "";  
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
			  async:false,
			  data: {},
			  beforeSend: function(){},
			  success: function(result) {
				  AssessmentTime =  $(result).text()
				  //alert(AssessmentTime);
				  //RecordDate =  $(result).text().slice(0,10).replace(/-/g,"");	
			  	  //RecordTime = $(result).text().slice(11,16).replace(/:/g,"");		 
			  }, 
			  error: function(msg) {alert("GetServerTimeError!");}
		  });
		  //获取系统时间
		  
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/SetRiskResult',
			  async:false,
			  data: {UserId:localStorage.getItem('PatientId'),
					 SortNo:0,//webservice写好了自增
					 AssessmentType:"HypertensionComplications",
					 AssessmentName:"Hyper",
					 AssessmentTime:AssessmentTime,
					 Result:Result,
					 revUserId:localStorage.getItem('UserId'),
					 TerminalName:localStorage.getItem('TerminalName'),
					 TerminalIP:localStorage.getItem('TerminalIp'),
					 DeviceType:localStorage.getItem('DeviceType'),
					 },//输入变量
			  beforeSend: function(){},
			  success: function(result) {
				  ret =  $(result).text();
			  },
			  error: function(msg) {alert("SetRiskResultError!");
			 
			  ret =false;} 
		  });
		  return ret;  
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
                    "year": "高血压发病率",
                    "正常": 1,
                    "您的风险": Hyper.toFixed(2)
                },
                {
                    "year": "五年死亡率",
                    "正常": 1,
                    "您的风险": Harvard.toFixed(2)
                },
                {
                    "year": "心血管疾病",
                    "正常": 1,
                    "您的风险": Framingham.toFixed(2)
                },
                {
                    "year": "中风发病率",
                    "正常": 1,
                    "您的风险": Stroke.toFixed(2)
                },
                {
                    "year": "心衰发病率",
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
				valueAxis.title="概率/%";
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