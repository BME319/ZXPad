  var SBPlist = new Array();
  var DBPlist = new Array();
  var Tasklist = new Array();
  var bpi = 0;
  
  //panel初始化
  function RiskPanelInit(){
	  var CurrentSBP = GetCurrentSBP();
	  var CurrentDBP = GetCurrentDBP();
	  var TargetSBP = GetTargetSBP(localStorage.getItem('PlanNo'), "1");
	  var TargetDBP = GetTargetDBP(localStorage.getItem('PlanNo'), "2");
	  
	  $("#PanelCurrentSBP").text(CurrentSBP);
	  $("#PanelCurrentDBP").text(CurrentDBP);
	  $("#PanelTargetSBP").text(TargetSBP);
	  $("#PanelTargetDBP").text(TargetDBP);
	  
	  GetBPGrades();
	  setTimeout(function(){SBPBar(CurrentSBP, TargetSBP, SBPlist, chart_SBP_1);},2000); 
	  setTimeout(function(){DBPBar(CurrentDBP, TargetDBP, DBPlist, chart_DBP_1);},2000); 
	  	    
	  GetDescription(CurrentSBP);
	  GetData();
  }
  
  
  //从数据库中读取用户当前收缩压值
  function GetCurrentSBP(){
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
	    }, 
	    error: function(msg) {alert("Get Current Sbp Error!");}
	  });
      return option;	
  }	 
  
  //从数据库中读取用户当前舒张压值
  function GetCurrentDBP(){
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
		  }, 
		  error: function(msg) {alert("Get Current Dbp Error!");}
	  });
	  return option;	
  } 
   
  //从数据库中读取用户前一个计划的目标收缩压值
  function GetTargetSBP(PlanNo, Id){
	  var option;
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
			  }, 
			  error: function(msg) {alert("Get Target Sbp Error!");}
		  });
		  return option;	
  } 
  
  //从数据库中读取用户前一个计划的目标舒张压值
  function GetTargetDBP(PlanNo, Id){
	  var option;
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
			  }, 
			  error: function(msg) {alert("Get Target Dbp Error!");}
		  });
		  return option;	
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
  
  //获取血压等级说明
  function GetDescription(SBP){
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
			  $('#hyperclass').val(option);
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
    
//风险评估数据获取
function GetData()
{
	  var Hyper="";
	  var Harvard="";
	  var Framingham="";
	  var Strokee="";
	  var Heart="";	 
	  var Age = ""; 
	  
	  var Gender  = ""; 
	  var Height  = ""; 
	  var Weight  = ""; 
	  var AbdominalGirth = "";
	  var BMI = "";
	  var Heartrate  = ""; 
	  var Parent  = ""; 
	  var Smoke  = ""; 
	  var Stroke  = ""; 
	  var Lvh  = ""; 
	  var Diabetes  = ""; 
	  var Treat  = ""; 
	  var Heartattack  = ""; 
	  var Af  = ""; 
	  var Chd  = ""; 
	  var Valve  = "";
	  var Tcho  = "";
	  var Creatinine  = "";
	  var Hdlc  = ""; 
	  
	  var SBP = "";
	  var DBP = "";
	  	  	  
	  var Hyperother = "";
	  var HarvardRiskInfactor = "";
	  var FraminghamRiskInfactor = ""; 
	  var StrokeRiskInfactor = ""; 
	  var HeartFailureRiskInfactor = ""; 	
	  	
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
					AbdominalGirth = parseInt($(this).find("AbdominalGirth").text());
					BMI = parseFloat($(this).find("BMI").text());
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
					
					SBP = parseInt($(this).find("SBP").text());
					DBP = parseInt($(this).find("DBP").text());
										
			});		 
		 
			//高血压风险评估发病率
			Hyper = GetHyperRate(Hyperother, SBP, DBP, Age);
  
			//Harvard五年死亡率
			Harvard = GetHarvardRate(Gender, SBP, HarvardRiskInfactor);
		   
		    //十年心血管疾病发生率
			Framingham = GetFraminghamRate(Gender, Treat, FraminghamRiskInfactor, SBP);		   
		    //中风发生率
		    Strokee = GetStrokeRate(Gender, Treat, StrokeRiskInfactor, SBP);
		    //心衰发生率
			Heart = GetHeartFailureRate(Gender, HeartFailureRiskInfactor, SBP);	   
		 
		 	PresentRiskResult(Hyper, "Hyper");
			PresentRiskResult(Harvard, "Harvard");
			PresentRiskResult(Framingham, "Framingham");
			PresentRiskResult(Strokee, "Strokee");
			PresentRiskResult(Heart, "Heart");
        }, 
		error: function(msg) {alert("获取评估输入");}
   });  
   
} 

//计算高血压发病率
function GetHyperRate(Hyperother, SBP, DBP, Age)
{
	var ret;
	Hyperother=Hyperother- 0.05933 * SBP - 0.12847 * DBP+ 0.00162 * Age*DBP;
    ret = 1-Math.exp(-Math.exp(((Math.log(4))- (22.94954+ Hyperother))/0.87692));
	return ret;
}

//计算Harvard五年死亡率
function GetHarvardRate(Gender, SBP, HarvardRiskInfactor)
{
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
	var ret = 6.304 * Math.pow(10, -8) * Math.pow(HarvardRiskInfactor, 5) - 5.027 * Math.pow(10, -6) * Math.pow(HarvardRiskInfactor, 4) + 0.0001768 * Math.pow(HarvardRiskInfactor, 3) - 0.001998 * Math.pow(HarvardRiskInfactor, 2) + 0.01294 * HarvardRiskInfactor + 0.0409;
	ret = ret / 100;	
	return ret;
}

//计算十年心血管疾病发生率
function GetFraminghamRate(Gender, Treat, FraminghamRiskInfactor, SBP)
{
	var ret;
	if(Gender == 1)
   	{
		if(Treat==1)
		{
			FraminghamRiskInfactor = FraminghamRiskInfactor+1.99881*Math.log(SBP);	
		}
		else
		{
			FraminghamRiskInfactor = FraminghamRiskInfactor+1.93303*Math.log(SBP);	
		}   
		ret =  1-Math.pow(0.88936,Math.exp(FraminghamRiskInfactor - 23.9802));
   	}
    else
    {
		if(Treat==1)
		{
			FraminghamRiskInfactor = FraminghamRiskInfactor+2.82263*Math.log(SBP);	
		}
		else
		{
			FraminghamRiskInfactor = FraminghamRiskInfactor+2.76157*Math.log(SBP);	
		}  
		ret= 1-Math.pow(0.95012,Math.exp(FraminghamRiskInfactor - 26.1931));	   
   }
	return ret;
}

//计算中风发生率
function GetStrokeRate(Gender, Treat, StrokeRiskInfactor, SBP)
{
	var ret;
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
		ret = Risk[StrokeRiskInfactor-1] / 100;
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
		ret = Risk[StrokeRiskInfactor-1] / 100;         
	}	
	return ret;
}

//计算心衰发病率
function GetHeartFailureRate(Gender, HeartFailureRiskInfactor, SBP)
{
	var ret
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
		 
		ret=HeartFailureRisk/100;
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
	ret = HeartFailureRisk/100;
	} 
	return ret;	
} 

//将风险评估计算结果显示在界面上
function PresentRiskResult(No, id)
{
	if (isNaN(No))
	{
		$('#' + id).parent().css("background-color", "white");
	}
	if (!(isNaN(No)))
	{
		var NewNo = (No*100).toFixed(2);
		var color;
		if (NewNo <= 5)
		{
			color = "#2ACA58";
		}
		else if (NewNo <= 15)
		{
			color = "#D4CC11";
			
		}
		else if (NewNo <= 25)
		{
			color = "#ECA319";
		}
		else if (NewNo <= 35)
		{
			color = "#FF7F50";
		}
		else
		{
			color = "#EC4319";
		}
		$('#' + id).parent().css("background-color", color);
		var Str = NewNo.toString() + "%";
		$('#' + id).html(Str);
	}
}
   