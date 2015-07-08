// JavaScript Document

//前一页面传递参数的接收函数GetQueryString
/*	function GetQueryString(name){
     	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     	var r = window.location.search.substr(1).match(reg);
     	if(r!=null)return  unescape(r[2]); return null;
	}*/


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
			
			//基本信息、头像
			$("#PatientName").text(data.PatientInfo.PatientName);
			if(data.PatientInfo.ImageUrl !="")
			{
				//var ImageUrl=serverIP+"/PersonalPhoto/"+data.PatientInfo.ImageUrl;
				var ImageUrl='http://'+serverIP+"/"+imgStoreFile+"/"+data.PatientInfo.ImageUrl;
				$("#portrait").attr("src", ImageUrl);
			}
			else
			{
			    //var ImageUrl='http://'+"10.13.22.66:8088"+"/"+imgStoreFile+"/"+"non.jpg";
				var ImageUrl='http://'+serverIP+"/"+imgStoreFile+"/"+"non.jpg";
				$("#portrait").attr("src",ImageUrl); 
			}
			
			//计划列表  条数必>=1，下拉框形式加前后计划切换钮
			var str_li='';
			for(var i=0;i<data.PlanList.length;i++)
			{
				var id = "planList_" + (i+1).toString();
				var planno=data.PlanList[i].PlanNo;
				str_li+='<option value="'+planno+'" id="'+id+'">'+ data.PlanList[i].PlanName+'</option>';
			}
   
            str_li+='';
			$('#planList').append(str_li); 
			//$('#planListDiv').trigger('create'); 
			$("#planList").selectmenu('refresh', true);

			if(data.PlanList[0].PlanNo=="")  //当前没有正在执行的计划
			{
				//修改计划可以创建计划吗？
				//$("#showEditPlan").css("visibility","hidden");  //隐藏修改计划按钮

				$("#alertText").text("当前没有正在执行的计划");
				$("#graph_loading").css("display","none");
				$("#load_after").css("visibility","hidden");
				$("#load_first").css("display","block");
				$("#alertTextDiv").css("display","block");
				
				NowPlanNo="";
	            StartDate=0;
	            EndDate=0;
			}
			
			else  //当前有正在执行的计划
			{
				
			    //进度、剩余天数、依从率
			    animate(data.ProgressRate,data.RemainingDays);
			    var CompliacneValue = data.CompliacneValue;
			    $("#CompliacneValue").text(CompliacneValue);
                
				//计划编号、起止日期
                NowPlanNo=data.PlanList[0].PlanNo;
	            StartDate=data.StartDate;
	            EndDate=data.EndDate;

                //体征切换下拉框
				var str_option='';
				for(var i=0;i<data.SignList.length;i++)
				{
					var signid="signList_"+(i+1);
					str_option+='<option value="'+data.SignList[i].SignCode+'" id="'+signid+'">'+data.SignList[i].SignName+'</option>';
				}
	   
				str_option+='';
				$('#sign_switch').append(str_option); 
				$("#sign_switch").selectmenu('refresh', true);
				

                //收缩压的起始值，目标值必须有！
				if(((data.ChartData.GraphGuide.original==null)||(data.ChartData.GraphGuide.original=="")) && ((data.ChartData.GraphGuide.target==null)||(data.ChartData.GraphGuide.target=="")))
				{
					$("#ori_tarDiv").css("display","none");
				}
				else
				{
					//$("#originalDiv").css("visibility","visible");
				    //$("#targetDiv").css("visibility","visible");
			        $("#BPoriginal").text(data.ChartData.GraphGuide.original);
	                $("#BPtarget").text(data.ChartData.GraphGuide.target);
					$("#ori_tarDiv").css("display","block");
				}
				
			    //画图
			    if((data.ChartData.GraphList.length>0) && (data.ChartData.GraphList!=null))          //图表有数据
			   {
				   //✔ ✘ ' 处理 
				   for(var m=0;m<data.ChartData.GraphList.length;m++)
				   {	
				       var regS = new RegExp("noncomplete","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS, "✘");
		               var regS1 = new RegExp("complete","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS1, "✔");
				       var regS2 = new RegExp("###","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS2, "'");
				   }
				

			      //输入画图数据和分级规则
				  if(data.ChartData.OtherTasks=="1")  //除体征测量外，有其他任务
				  {
			          createStockChart(data.ChartData);
					  //监听下部图的bullet点 的点击事件
					  chart.panels[1].addListener("clickGraphItem",showDetailInfo); 
					  //监听下部图的横坐标lable 的点击事件
					 //chart.panels[1].categoryAxis.addListener("clickItem",showDetailInfo);
					  
				  }
				  else  //没有其他任务
				  {
					  createStockChartNoOther(data.ChartData);
				  }

				  
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
       error: function(msg) {alert("Error: GetImplementationForPadFirst!");},
	   complete: function() {      
             // $("div[data-role=content] ul").listview();    
			  //$("div[data-role=content] ul li").listview("refresh");    
			  //$('#ul_target').listview('refresh');     
        } 
     });
 }

	
function showDetailInfo(event)
{
	//清空弹框内内容
	//$("#ul_targetDetial li").remove();
	$('#ul_targetDetial').find("li").remove();
	
	//获取被点击的bullet的时间值，事件格式，许处理成string"20150618"格式传到webservice
	var dateSelected=event.item.category;
	var theyear=dateSelected.getFullYear();
	var themonth=dateSelected.getMonth()+1;  
	if(themonth<10)
	{
		var themonth="0"+themonth.toString();
	}
	var theday=dateSelected.getDate();
	if(theday<10)
	{
		var theday="0"+theday.toString();
	}
	var theDate=theyear.toString()+themonth.toString()+theday.toString();

	/*
	  //alert(event.item.category);
	  //alert(event.index);  获取点的序号 0~
     var dateSelected= chart.panels[1].categoryAxis.coordinateToDate(2); 
	 //获取X值，再调method获取date 只能在没有缩放的时候使用
	*/
	
	 $.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
	url: 'http://'+ serverIP +'/'+serviceName+'/GetImplementationByDate',
		//async:false,
        data: {PatientId:PatientId, 
		        PlanNo:NowPlanNo,
				DateSelected:theDate
			  },
		beforeSend: function(){//alert(dateSelected);
			},
        success: function(data) {
			
		var str="";
		str+='<li data-role="list-divider" style="text-align:center;"> <span>'+data.Date+'</span><span style="margin-left:20px;">'+data.WeekDay+'</span></li>';
		
		//体征
		if(data.VitalTaskComList.length>0)
		{
			str+=' <li ><h3 style="margin-top:-5px;margin-left:-5px;">体征测量</h3>';
		for(var j=0;j<data.VitalTaskComList.length;j++)
		{
			if(data.VitalTaskComList[j].Status=="1"){
			str+='<p style="margin-left:10px;font-size:14px;">✔ '+data.VitalTaskComList[j].SignName+'<span style="margin-left:10px;"> '+data.VitalTaskComList[j].Value+''+data.VitalTaskComList[j].Unit+'</span> <span style="margin-left:10px;">'+data.VitalTaskComList[j].Time+'</span></p>';
			}
			else
			{
				str+='<p style="margin-left:10px;font-size:14px;color:red;"><b>✘ '+data.VitalTaskComList[j].SignName+'</b></p>';
			}
		}
		str+='</li>'; 
		}
		
		
		//其他任务:生活方式和用药情况
		if(data.TaskComByTypeList.length>0)
		{			
			for(var i=0;i<data.TaskComByTypeList.length;i++)
		    {
				if(data.TaskComByTypeList[i].TaskType =="生活方式aa")
				{
				  str+=' <li ><h3 style="margin-top:-5px;margin-left:-5px;">'+data.TaskComByTypeList[i].TaskType+'</h3><p style="font-size:14px;">';
			  
			 
				 for(var j=0;j<data.TaskComByTypeList[i].TaskComList.length;j++)
				 {
					 
					 if(data.TaskComByTypeList[i].TaskComList[j].Status=="1")
					{
				  str+='<span style="margin-left:10px;">✔ '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'</span>';
				  
					}
					else
				   {
				  str+='<span style="margin-left:10px;"> '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'✘</span>';
				   }
				}
				str+='</p></li>'; 
			  }
			
			else //用药 药名过长在不同行 与生活方式在同一行样式不一样
			{
				str+=' <li ><h3 style="margin-top:-5px;margin-left:-5px;">'+data.TaskComByTypeList[i].TaskType+'</h3>';
			
				for(var j=0;j<data.TaskComByTypeList[i].TaskComList.length;j++)
				{
					if(data.TaskComByTypeList[i].TaskComList[j].Status=="1")
					{
						str+='<p style="font-size:14px;"><span style="margin-left:10px;">✔ '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'</span></p>';
						
					}
					else
					{
						str+='<p style="font-size:14px;"><b><span style="margin-left:10px;color:red;">✘ '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'</span></b></p>';
					}
				}
				str+='</li>'; 
		    }
		}
	 }
	 
     $("#ul_targetDetial").append(str);
     $('#ul_targetDetial').listview('refresh');  
	 $("#popupDetail").popup("open");	
		
			}, 
       error: function(msg) {alert("Error: showDetailInfo!");},
	   complete: function() {      
  
        } 
     });

}
  

 function createStockChart(ChartData) {
	 $("#chartdiv").height(450);
	   //var minimum=50;
       //图上说明
       //$("#BPoriginal").text(ChartData.GraphGuide.original);
	  // $("#BPtarget").text(ChartData.GraphGuide.target);
       //图
	   chart=AmCharts.makeChart("chartdiv", {
		       // addClassNames:true,
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
                    format: 'MM/DD'
                }, {
                    period: 'MM',
                    format: 'YYYY/MM'
                }, {
                    period: 'YYYY',
                    format: 'YYYY'
                }]
					},
					
				dataSets: [{
					fieldMappings: [{
					fromField: "SignValue",
					toField: "SignValue"
				},{
					fromField: "DrugValue",
					toField: "DrugValue"
				}],
					//color: "#fac314",
					dataProvider: ChartData.GraphList, //数据集   
					//title: "体征和任务依从情况",
					categoryField: "Date"
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
						percentHeight: 65,
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
							minimum: ChartData.GraphGuide.minimum,  
							maximum: ChartData.GraphGuide.maximum,   
                            //显示上下限不对  解决办法parseFloat(guides[0].minimum
							guides: ChartData.GraphGuide.GuideList  //区域划分
							
						}
						//,{id:"v2",minimum:10}
						],
                       
						categoryAxis: {
							//dashLength: 5	
						},
						stockGraphs: [{
							//type: "line",
							id: "graph1",
                            valueField: "SignValue",
							lineColor: "#7f8da9",
							lineColorField:"SignColor",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletField:"SignShape",
							bulletSize:12,
							//bulletSizeField:"bulletSize",
                            //customBulletField : "customBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 1,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[category]]<br>[[SignDescription]]",
							//要不要显示时间？[[category]]<br>
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
						title: "任务依从情况",
						showCategoryAxis: true,
						//backgroundColor:"#CC0000",
						percentHeight: 35,
						valueAxes: [{
							id:"v2",
							gridAlpha : 0,
                            axisAlpha : 0,
							labelsEnabled : false
							//minimum: 10,
						}],
                        //dateFormats: "YYYYMMDD",
						categoryAxis: {		
							//dashLength: 5
						},
						stockGraphs: [{
							//type: "line",
							id: "graph2",
                            valueField: "DrugValue",
							lineColor: "#FFFFFF",
							lineColorField:"DrugColor",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletSize:20,
							//bulletSizeField:"bulletSize",
                            customBulletField : "DrugBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 2,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[DrugDescription]]",
				            //labelText:"[[drugDescription]]"
                            //balloonFunction:zz,
						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none",				
							}
					}
				],
                balloon:{
					fadeOutDuration:7,   //3秒之后自动消失
					animationDuration:0.1,
					maxWidth:500,  //必须有，不然自排版是乱的
				    textAlign:"left",
					horizontalPadding:12,
					verticalPadding:4,
					fillAlpha:0.8
					,disableMouseEvents:true
					 //offsetX:20
                     //fixedPosition:true,
				},
				chartCursorSettings:{
					zoomable:false,
					pan:true,
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
                   }
			});
		
		//alert(chart.panels[0].valueAxes[0].reversed);
		//chart.addListener("clickStockEvent",objet);				
        // chart.panels[0].valueAxes[0].inside=false;
	    //chart.validateNow();
		//
}
  

  
  //体征切换
  function selectDataset(ItemCode) {
	  
	  //方案 重新画图 清空chart再赋值
  	  //$("#chartdiv").empty();  //清空子元素
	  
	  //获取当前计划编号
	  $.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetSignInfoByCode',
		//async:false,
        data: {PatientId:PatientId, 
		        PlanNo:NowPlanNo,
				ItemCode:ItemCode, 
		        StartDate:StartDate,
				EndDate:EndDate,
			  },
		beforeSend: function(){

			$("#load_first").css("display","block");
			//$("#load_after").css("visibility","hidden");
			document.getElementById("chartdiv").innerHTML="";
			$("#alertTextDiv").css("display","none");
			$("#graph_loading").css("display","block");
			},
        success: function(data) {
	            chart="";
			    //画图
			    if((data.GraphList.length>0) && (data.GraphList!=null))          //图表有数据
			    {
				   //✔ ✘ ' 处理 
				   for(var m=0;m<data.GraphList.length;m++)
				   {	
				       var regS = new RegExp("noncomplete","g");
			           data.GraphList[m].DrugDescription=data.GraphList[m].DrugDescription.toString().replace(regS, "✘");
		               var regS1 = new RegExp("complete","g");
			           data.GraphList[m].DrugDescription=data.GraphList[m].DrugDescription.toString().replace(regS1, "✔");
				       var regS2 = new RegExp("###","g");
			           data.GraphList[m].DrugDescription=data.GraphList[m].DrugDescription.toString().replace(regS2, "'");
				   }
				   
				//输入画图数据和分级规则
				  if(data.OtherTasks=="1")  //除体征测量外，有其他任务
				  {
			          createStockChart(data);
					  chart.panels[1].addListener("clickGraphItem",showDetailInfo); 
				  }
				  else  //没有其他任务
				  {
					  createStockChartNoOther(data);
				  }
				  
				  if((ItemCode=="Bloodpressure|Bloodpressure_1")||(ItemCode=="Bloodpressure|Bloodpressure_2"))
				  {
					  chart.panels[0].title="血压 （单位：mmHg）";
				  }
				  else if(ItemCode=="Pulserate|Pulserate_1")
				  {
					  chart.panels[0].title="脉率 （单位：次/分）";
				  }
				  chart.validateNow();
				  
				  //类似脉率没有初始值和目标值，则隐藏
			   if(((data.GraphGuide.original==null)||(data.GraphGuide.original=="")) && ((data.GraphGuide.target==null)||(data.GraphGuide.target=="")))
				{
					$("#ori_tarDiv").css("display","none");
				}
				else
				{
					//$("#originalDiv").css("visibility","visible");
				    //$("#targetDiv").css("visibility","visible");
			        $("#BPoriginal").text(data.GraphGuide.original);
	                $("#BPtarget").text(data.GraphGuide.target);
					$("#ori_tarDiv").css("display","block");
				}
				
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
       error: function(msg) {
		   alert("Error: selectDataset !");
		   },
	   complete: function() {      
    
        } 
     });
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
  
  
  
  //按钮切换计划（新）
function hookBtn(button_id)
{
	//获取计划下拉框当前选择
	
	//var length=document.getElementById("planList").options.length
	var length=$("#planList option").length;
	//var planSelected=$('#planList option:selected').val();
	var planSelected=$('#planList option:selected').attr("id");
	var array = planSelected.split("_");
	var index=parseInt(array[1]);
	
	if(button_id == 'play_prev')  //上一计划 之前
	{
		index++;
		if(index == length+1) 
		{
		    index = length;  //维持不变alert(index);
		    $("#popupBasic").popup("open");	
			setTimeout(function(){$("#popupBasic").popup("close");},1000);
		}
		else
		{
			rechange(index); //更新下拉框计划,刷新图
		}
	}
	else  //下一计划 时间晚些的
	{
		index--;
		if(index == 0) 
		{
			index = 1; //维持不变，提示已是最新
            $("#popupBasic").popup("open");	
			setTimeout(function(){$("#popupBasic").popup("close");},1000);
		}
		else
		{
			rechange(index); 
		}
	}

}
  
   //按钮切换计划
function rechange(loop){
    var temp = "planList_" + loop;

	//相应改变下拉框选中值
	//$("#"+temp).attr("selected","selected");

	var opList = document.getElementById("planList").childNodes;
    for (var i = 0, len = opList.length; i < len; i++) 
	{
        if (opList[i].id == temp) 
		{
            opList[i].selected = true;
            //break;
        }
		else
		{
			opList[i].selected = false;
		}
    }

    $("#planList").selectmenu('refresh', true);


    var planid=$("#"+temp).val();
	
    if((loop==1) &&(planid!=""))
    {
	  // $("#showEditPlan").css("visibility","visible");
    }
    else
    {
	   //$("#showEditPlan").css("visibility","hidden");
    }
    //刷图
	if(planid=="")
	{
		 //当前无正在执行的计划
		 $("#alertText").text("当前没有正在执行的计划");
		 $("#graph_loading").css("display","none");
		 document.getElementById("chartdiv").innerHTML="";
		 $("#load_after").css("visibility","hidden");
		 $("#load_first").css("display","block");
		 $("#alertText").css("display","block");
	}
	else
	{
		
	  //$("#load_after").css("visibility","hidden");
	 // $("#graph_loading").css("display","block");
	  GetImplementationForPadSecond(PatientId, planid);
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
			
			//document.getElementById("load_after").style.visibility = "hidden";
			document.getElementById("chartdiv").innerHTML="";
			//$("#load_after").css("visibility","hidden");
			$("#alertTextDiv").css("display","none");
			$("#graph_loading").css("display","block");
			},
        success: function(data) {
			//画图
			       
			animate(data.ProgressRate,data.RemainingDays);
			$("#CompliacneValue").text(data.CompliacneValue);
			
			//计划编号、起止日期
                NowPlanNo=PlanNo;
	            StartDate=data.StartDate;
	            EndDate=data.EndDate;
			 
			 //画图
			    if((data.ChartData.GraphList.length>0) && (data.ChartData.GraphList!=null))          //图表有数据
			   {
				   //✔ ✘ ' 处理 
				   for(var m=0;m<data.ChartData.GraphList.length;m++)
				   {	
				       var regS = new RegExp("noncomplete","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS, "✘");
		               var regS1 = new RegExp("complete","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS1, "✔");
				       var regS2 = new RegExp("###","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS2, "'");
					   
					   //var regS3 = new RegExp("shuang","g");		           
					   //data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS3, "'");
				   }
				

			      //输入画图数据和分级规则
				  if(data.ChartData.OtherTasks=="1")  //除体征测量外，有其他任务
				  {
			         createStockChart(data.ChartData);
					  
					   //监听下部图的bullet点 的点击事件
					  chart.panels[1].addListener("clickGraphItem",showDetailInfo); 
					  //监听下部图的横坐标lable 的点击事件
					 //chart.panels[1].categoryAxis.addListener("clickItem",showDetailInfo);
				  }
				  else  //没有其他任务
				  {
					  createStockChartNoOther(data.ChartData);
				  }
				  
			   $("#graph_loading").css("display","none");
			   $("#alertTextDiv").css("display","none");
			   //$("#load_after").css("visibility","visible");
			   
			  //类似脉率没有初始值和目标值，则隐藏  类似收缩压有的则显示
			   if(((data.ChartData.GraphGuide.original==null)||(data.ChartData.GraphGuide.original=="")) && ((data.ChartData.GraphGuide.target==null)||(data.ChartData.GraphGuide.target=="")))
				{
					$("#ori_tarDiv").css("display","none");
				}
				else
				{
					//$("#originalDiv").css("visibility","visible");
				    //$("#targetDiv").css("visibility","visible");
			        $("#BPoriginal").text(data.ChartData.GraphGuide.original);
	                $("#BPtarget").text(data.ChartData.GraphGuide.target);
					$("#ori_tarDiv").css("display","block");
				}
               

			   //$("#load_first").css("display","block");  
			   
			    //重新加载下拉框 
				
				$('#sign_switch').find("option").remove();
				var str_option='';
				for(var i=0;i<data.SignList.length;i++)
				{
					var signid="signList_"+(i+1);
					str_option+='<option value="'+data.SignList[i].SignCode+'" id="'+signid+'">'+data.SignList

[i].SignName+'</option>';
				}
	   
				str_option+='';
				$('#sign_switch').append(str_option); 
				$("#sign_switch").selectmenu('refresh', true);
				
				$("#load_after").css("visibility","visible");
				/*
			   //$("#Bloodpressure_1").attr("selected","selected");
			   var signList = document.getElementById("sign_switch").childNodes;
				for (var i = 0, len = signList.length; i < len; i++) 
				{
					if (signList[i].id == "signList_1") 
					{
						signList[i].selected = true;
						//break;
					}
					else
					{
						signList[i].selected = false;
					}
				}
	           $("#sign_switch").selectmenu('refresh', true);
			*/

			  //$("#load_after").css("visibility","visible");
			
		    }
			else //无图表数据
			{   $("#alertText").text("暂时无数据");
				$("#graph_loading").css("display","none");
				$("#load_first").css("display","block");
			    $("#load_after").css("visibility","hidden");
				$("#alertTextDiv").css("display","block");
			}
		    
			

		                  }, 
       error: function(msg) {alert("Error: GetImplementationForPadSecond!");},
	   complete: function() {      
    
        } 
     });
  }
  
  //没有其他任务
  function createStockChartNoOther(ChartData) {
	 
	    $("#chartdiv").height(300);
	   //var minimum=50;
       //图上说明
       //$("#BPoriginal").text(ChartData.GraphGuide.original);
	   //$("#BPtarget").text(ChartData.GraphGuide.target);
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
					fromField: "SignValue",
					toField: "SignValue"
				},{
					fromField: "DrugValue",
					toField: "DrugValue"
				}],
					//color: "#fac314",
					dataProvider: ChartData.GraphList, //数据集   
					//title: "体征和任务依从情况",
					categoryField: "Date"
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
						showCategoryAxis: true,
						percentHeight: 70,
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
							minimum: ChartData.GraphGuide.minimum,  
							maximum: ChartData.GraphGuide.maximum,   
                            //显示上下限不对  解决办法parseFloat(guides[0].minimum
							guides: ChartData.GraphGuide.GuideList  //区域划分
							
						}
						//,{id:"v2",minimum:10}
						],
                       
						categoryAxis: {
							//dashLength: 5	
						},
						stockGraphs: [{
							//type: "line",
							id: "graph1",
                            valueField: "SignValue",
							lineColor: "#7f8da9",
							lineColorField:"SignColor",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletField:"SignShape",
							bulletSize:12,
							//bulletSizeField:"bulletSize",
                            //customBulletField : "customBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 1,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[SignDescription]]",
							//要不要显示时间？[[category]]<br>
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
					}	
				],
                balloon:{
					fadeOutDuration:7,
					animationDuration:0.1,
					maxWidth:400,
				    textAlign:"left",
					horizontalPadding:12,
					verticalPadding:4,
					fillAlpha:0.8
				},
				chartCursorSettings:{
					usePeriod: "7DD",
				    zoomable:false,
					pan:true,
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

}
  
