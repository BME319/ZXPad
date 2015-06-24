// JavaScript Document

//前一页面传递参数的接收函数GetQueryString
	function GetQueryString(name){
     	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     	var r = window.location.search.substr(1).match(reg);
     	if(r!=null)return  unescape(r[2]); return null;
	}


 function GetImplementationForPadFirst(PatientId, Module){
	$.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetImplementationForPadFirst',
		//async:false,
        data: {PatientId:PatientId, 
		        Module:Module,
			  },
		beforeSend: function(){
			$("#load_first").css("display","none");
			$("#load_after").css("visibility","hidden");
			$("#alertTextDiv").css("display","none");
			$("#graph_loading").css("display","block");
			
			},
        success: function(data) {
			//头像、基本信息
			$("#PatientName").text(data.PatientInfo.PatientName);
			
			
			//计划列表 条数必》1
			var str_li='';
			str_li+='<li style="width:30px"><img id="play_prev" src="images/btn_prev.gif" width="20" height="13" title="上一计划" alt="上一计划" onclick="hookBtn(this.id);" /></li>';
			str_li+='';
			
			for(var i=0;i<data.PlanList.length;i++)
			{
				var id = "thumb_" + i.toString();
				var planno=data.PlanList[i].PlanNo;
				if(i==0)
				{	
				    str_li+=' <li id="'+id+'" name="'+planno+'" style="display:block;width:500px">'+ data.PlanList[i].PlanName+'</li>';
				}
				else
				{
					//var a="2010/01/0123:00:00";
					//str_li+=' <li id='+id+' name='+planno+' style="display:none;width:50%">'+ data.PlanList[i].PlanName+'</li>';
					str_li+=' <li id="'+id+'" name="'+planno+'" style="display:none;width:500px">'+ data.PlanList[i].PlanName+'</li>';
				}
			}
			str_li+='<li style="width:30px"><img id="play_next" src="images/btn_next.gif" width="20" height="13" title="下一计划" alt="下一计划"  onclick="hookBtn(this.id);"/></li>';
			
			$('#ul_target').append(str_li);   
			
			if(data.PlanList[0].PlanNo=="") //当前没有正在执行的计划
			{
				$("#showEditPlan").css("visibility","hidden");

				$("#alertText").text("当前没有正在执行的计划");
				$("#graph_loading").css("display","none");
				$("#load_after").css("visibility","hidden");
				$("#load_first").css("display","block");
				$("#alertTextDiv").css("display","block");
			}
			
			else  //当前计划有正在执行
			{
				$("#showEditPlan").css("visibility","visible");
				
			//进度、依从率
			animate(data.ProgressRate,data.RemainingDays);
			//var RemainingDays="距离计划结束还有"+data.RemainingDays+"天";
			//$("#RemainingDays").text(RemainingDays);
			var CompliacneValue = data.CompliacneValue;
			$("#CompliacneValue").text(CompliacneValue);
			
			
			
			
			//画图
			if((data.chartData.graphList.length>0) && (data.chartData.graphList!=null))//有图表数据
			{
			   guides=data.chartData.BPGuide; //guide需要传出
			   createStockChart(data.chartData.graphList, 0);
			   
			   $("#graph_loading").css("display","none");
			   $("#alertTextDiv").css("display","none");
			   $("#load_first").css("display","block");
			   $("#load_after").css("visibility","visible");
			   
		    }
			else //无图表数据
			{
				$("#alertText").text("暂时无数据");
				$("#graph_loading").css("display","none");
				$("#load_first").css("display","block");
				$("#alertTextDiv").css("display","block");
			    $("#load_after").css("visibility","hidden");
			}
		    
			}
		                  }, 
       error: function(msg) {alert("Error!");},
	   complete: function() {      
             // $("div[data-role=content] ul").listview();    
			  //$("div[data-role=content] ul li").listview("refresh");    
			  //$('#ul_target').listview('refresh');     
        } 
     });
  }
  

 function createStockChart(chartData,d) {
	 //alert(guides[0].minimum);
	 //var minimum=50;
       //图上说明
       $("#BPoriginal").text(guides[0].original);
	   $("#BPtarget").text(guides[0].target);
      
       //图
	   chart=AmCharts.makeChart("chartdiv", {
				type: "stock",
				pathToImages: "amcharts-images/",
				dataDateFormat:"YYYYMMDD",
                categoryAxesSettings: {
						//minPeriod: "mm"
						parseDates: true,
						minPeriod:"DD",
						dateFormats:[{
                    period: 'DD',
                    format: 'MM/DD'
                }, {
                    period: 'WW',
                    format: 'MM DD'
                }, {
                    period: 'MM',
                    format: 'MM/DD'
                }, {
                    period: 'YYYY',
                    format: 'YYYY'
                }]
					},
					
				dataSets: [{
					fieldMappings: [{
					fromField: "SBPvalue",
					toField: "SBPvalue"
				}, {
					fromField: "DBPvalue",
					toField: "DBPvalue"
				},{
					fromField: "drugValue",
					toField: "drugValue"
				}],
					//color: "#fac314",
					dataProvider: chartData,   //输入的变量
					//title: "血压和用药",
					categoryField: "date"
				}],
              valueAxesSettings:{
					inside:true,
					reversed:false
					//labelsEnabled:true				
				},
				
               PanelsSettings:{   
				   //marginTop:90,
				   //marginRight:90,
				   //panelSpacing:400,
				  // plotAreaBorderAlpha:1,
				  // plotAreaBorderColor:"#000000"
				   //usePrefixes: true,
				   autoMargins:false
			   },
				//autoMargins:false,
				panels: [{
						title: "血压 （单位：mmHg）",
						showCategoryAxis: false,
						percentHeight: 60,
						autoMargins:false,
						//marginTop:300,
						//marginLeft:90,
						//marginRight:90,
						valueAxes: [{
							id:"v1",
							//strictMinMax:true,
							//logarithmic : true,
							//baseValue:115,     //起始值，Y线
							//dashLength: 5,   //虚线
							//title:"血压",
							//axisThickness:4,
							showFirstLabel:true,
							showLastLabel:true,
							//inside:false,
							gridAlpha : 0,
							//labelOffset:0,
							labelsEnabled : false,
							minimum: guides[0].minimum,  //parseFloat(guides[0].minimum)
							maximum: guides[0].maximum,   //parseFloat(guides[0].maximum)
                                //显示下限  不对 guides[0].minimum会不对
							guides: guides[0].Guides  //区域划分
							
						}],
                       
						categoryAxis: {
							//dashLength: 5	
						},
						stockGraphs: [{
							//type: "line",
							id: "graph1",
                            valueField: "SBPvalue",
							lineColor: "#7f8da9",
							lineColorField:"SBPlineColor",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletField:"SBPbulletShape",
							bulletSize:12,
							//bulletSizeField:"bulletSize",
                            //customBulletField : "customBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 1,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "<b><span style='font-size:14px;'>[[SBPvalue]] </span></b>/[[DBPvalue]]<br>[[category]]",
				            //labelText:"[[nowDay]][[SBPvalue]]",
							
							ValueAxis:{
								id:"v1",
								strictMinMax:true,
							//maximum: 190,   //guide的第三和最后
                            //minimum: 65,
							}

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none"
								//autoMargins:false
							}
					},
					{
						title: "用药情况",
						showCategoryAxis: true,
						//backgroundColor:"#CC0000",
						percentHeight: 20,
						valueAxes: [{
							id:"v2",
							gridAlpha : 0,
                            axisAlpha : 0,
							labelsEnabled : false
						}],
                        //dateFormats: "YYYYMMDD",
						categoryAxis: {		
							//dashLength: 5
						},
						stockGraphs: [{
							//type: "line",
							id: "graph2",
                            valueField: "drugValue",
							lineColor: "#FFFFFF",
							lineColorField:"drugColor",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletSize:20,
							//bulletSizeField:"bulletSize",
                            customBulletField : "drugBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 2,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[category]]<br>[[drugDescription]]",
				            //labelText:"[[drugDescription]]"

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none",				
							}
					}
				],
                balloon:{
					fadeOutDuration:3,
					animationDuration:0.1,
					//fixedPosition:true, //？
				},
				chartCursorSettings:{
					usePeriod: "7DD",
					//pan:false,
				    //zoomable:true,
					//leaveCursor:"false",
					//cursorPosition:"middle",
					categoryBalloonEnabled:false,
					categoryBalloonAlpha:1,
					categoryBalloonColor:"#ffff",
					categoryBalloonDateFormats:[{period:"YYYY", format:"YYYY"}, {period:"MM", format:"YYYY/MM"}, {period:"WW", format:"YYYY/MM/DD"}, {period:"DD", format:"YYYY/MM/DD"}],
					valueLineEnabled:false,  //水平线
					valueLineBalloonEnabled:false,
					valueBalloonsEnabled: true,  //上下值同时显现
					//graphBulletSize: 1,
					},
			chartScrollbarSettings: {  //时间缩放面板				    
						enabled:true,
						position: "top",
					    autoGridCount: true, //默认
						graph: "graph1",
						graphType:"line",
						graphLineAlpha:1,
						graphFillAlpha:0,
						height:30,
						dragIconHeight:28,
						dragIconWidth:20,
						//usePeriod: "10mm",
						
			  },
				responsive: {   //手机屏幕自适应
                    enabled: true
                   },

			});
		
		//alert(chart.panels[0].valueAxes[0].reversed);
		
			
		//chart.addListener("clickStockEvent",objet);				
          // chart.panels[0].valueAxes[0].inside=false;
	      //chart.validateNow();
}
  
  //切换血压
  function selectDataset(d) {
	  
	  $("#BPoriginal").text(guides[d].original);
	 $("#BPtarget").text(guides[d].target);
	 
	 if(d==1)
	 { 

	chart.panels[0].valueAxes[0].guides=guides[d].Guides;
	chart.panels[0].valueAxes[0].maximum=guides[d].maximum;
	chart.panels[0].valueAxes[0].minimum=guides[d].minimum;
	chart.panels[0].stockGraphs[0].valueField="DBPvalue";
	chart.panels[0].stockGraphs[0].lineColorField="DBPlineColor";
	chart.panels[0].stockGraphs[0].bulletField="DBPbulletShape";
	chart.panels[0].stockGraphs[0].balloonText= "<b><span style='font-size:14px;'>[[DBPvalue]] </span></b>/[[SBPvalue]]<br>[[category]]";
	//chart.panels[0].stockGraphs[0].labelText="[[nowDay]][[DBPvalue]]";
	}
	else
	{

	chart.panels[0].valueAxes[0].guides=guides[d].Guides;
	chart.panels[0].valueAxes[0].maximum=guides[d].maximum;
	chart.panels[0].valueAxes[0].minimum=guides[d].minimum;
	chart.panels[0].stockGraphs[0].valueField="SBPvalue";
	chart.panels[0].stockGraphs[0].lineColorField="SBPlineColor";
	chart.panels[0].stockGraphs[0].bulletField="SBPbulletShape";
	chart.panels[0].stockGraphs[0].balloonText= "<b><span style='font-size:14px;'>[[DBPvalue]] </span></b>/[[DBPvalue]]<br>[[category]]";
	//chart.panels[0].stockGraphs[0].labelText="[[nowDay]][[DBPvalue]]";
		}
   // chart.dataProvider = chartData[d];
	//alert(chart.panels[0].valueAxes[0].id);
	//chart.panels[0].valueAxes[0].guides=guides[d];
	//alert(chart.dataProvider[0]);
   // chart.validateData();
    //chart.animateAgain();  //只适用于serial
	chart.validateNow();
	//chart.write("chartdiv");
	//alert("1");
}
  
  
  
    //进度条动态
function animate(a,b){

    var barcolor="barblue";
	$(".proChart").each(function(i,item){
		var addStyle=barcolor;
		$(item).addClass(addStyle);
		//var a=$(item).attr("w");
		$(item).animate({
			width: a+"%"
		},1000);
		
	});
		var proText="进度：";
		proText+=a+"%";
		proText+=",距离计划结束还有"+b+"天";
		$(".last").find("span").text(proText);
}
  
  
  
//bind next/prev img
 //$(document).ready(function(){});
function hookBtn(id){
	var length=$("#thumbs li").length-2;
	var temp_index=index;
	if(id == 'play_prev')
	{
			index--;
			if(index < 0) 
			{
				index = 0; //维持不变，提示已是最新
				//alert("1");
                 $("#popupBasic").popup("open");	
				 setTimeout(function(){$("#popupBasic").popup("close");},1000);
			}
			else
			{
				rechange(temp_index, index); 
			}
	}
	else
	{
			index++;
			if(index ==length) 
			{
				index = length-1;  //维持不变alert(index);
				$("#popupBasic").popup("open");	
				 setTimeout(function(){$("#popupBasic").popup("close");},1000);
			}
			else
			{
				rechange(temp_index, index); 
			}
	}	

}

 //列表显示项刷新，图也相应刷新
function rechange(pre,loop){
	
	//列表显示什么，隐藏什么
	var pre_id = 'thumb_'+ pre;
	$("#"+pre_id).css("display","none");
	
    var id = 'thumb_'+ loop;
	
	$("#"+id).css("display","block");
	var name=$("#"+id).attr("name");

 if((loop==0) &&(name!=""))
   {
	   $("#showEditPlan").css("visibility","visible");
   }
   else
   {
	   $("#showEditPlan").css("visibility","hidden");
   }
   
//alert(name);
	//刷图
	if(name=="")
	{
		 //当前无正在执行的计划
		 $("#alertText").text("当前没有正在执行的计划");
		 $("#graph_loading").css("display","none");
		 $("#load_after").css("visibility","hidden");
		 $("#load_first").css("display","block");
		 $("#alertText").css("display","block");
	}
	else
	{
		
	 $("#load_after").css("visibility","hidden");
	  $("#graph_loading").css("display","block");
	  GetImplementationForPadSecond(PatientId, name);
	}
}

 function GetImplementationForPadSecond(PatientId, PlanNo){
	 //需要重新画图，改变chart、guide	 
	$.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		//url: 'http://localhost:58895/Services.asmx/GetImplementationForPadSecond',
		url: 'http://'+ serverIP +'/'+serviceName+'/GetImplementationForPadSecond',
		//async:false,
        data: {PatientId:PatientId, 
		        PlanNo:PlanNo,
			  },
		beforeSend: function(){
			$("#load_first").css("display","block");
			$("#load_after").css("visibility","hidden");
			$("#alertTextDiv").css("display","none");
			$("#graph_loading").css("display","block");
			},
        success: function(data) {
			//画图
			       
			animate(data.ProgressRate,data.RemainingDays);
			//var CompliacneValue=data.CompliacneValue;
			$("#CompliacneValue").text(data.CompliacneValue);
			 
			 
			 if(data.chartData.graphList.length>0)   //有图表数据
			{
			   guides=data.chartData.BPGuide; //guide需要传出
			   createStockChart(data.chartData.graphList, 0);
			   
			   $("#graph_loading").css("display","none");
			   $("#alertTextDiv").css("display","none");
			   $("#load_first").css("display","block");
			   $("#load_after").css("visibility","visible");
			   
		    }
			else //无图表数据
			{   $("#alertText").text("暂时无数据");
				$("#graph_loading").css("display","none");
				$("#load_first").css("display","block");
			    $("#load_after").css("visibility","hidden");
				$("#alertTextDiv").css("display","block");
			}
		 
		                  }, 
       error: function(msg) {alert("Error!");},
	   complete: function() {      
    
        } 
     });
  }
  
  