/**********************全局变量************************/
 var UserId 	= window.localStorage.getItem("ID");
 var Key 		= window.localStorage.getItem("Key");
 var Device 	= window.localStorage.getItem("Device");
 var AutoLogOn 	= window.localStorage.getItem("AutoLogOn");
 var PASSWORD 	= window.localStorage.getItem("Password");
 var ID			= window.localStorage.getItem("UserName");
 var TerminalIP = window.localStorage.getItem("TerminalIP");
 var TerminalName = window.localStorage.getItem("TerminaName");
 var DeviceType = window.localStorage.getItem("DeviceType");
 var revUserId  = window.localStorage.getItem("UserId");


 
/**********************登录***********************/
function SubmitForm(){
			var userId = $("#UserId").val();
			var password = $("#Password").val();
			var myRegEmail = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
			var myRegPhone = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
			window.localStorage.setItem("Password",password);
			window.localStorage.setItem("UserName",userId);
window.localStorage.setItem("Device","Pad");
			if (userId != "" && password!= "")
			{
				//$('#logOnBtn').removeAttr('disabled');
				if (myRegPhone.test(userId))
				{
					var Type = "PhoneNo";
				}
				else if (myRegEmail.test(userId))
				{
					var Type = "2";	
				}
				else
				{
					var Type = "3";	
				}
				$.ajax({
				  type: "POST",
				  timeout: 30000,
				  //contentType: "application/json;charset=utf-8",
				  url: 'http://'+ serverIP +'/'+serviceName+'/CheckPasswordByInput',
				  data: { Type: Type, Name: userId, Password: password},
				  dataType: 'xml',
				  async: false,
				  beforeSend: function() {},
				  success: function(result) {
					  var test = $(result).find("int").text();
					  if (test == 1)
					  {
						  $.ajax({
							  type: "POST",
							  timeout: 30000,
							  //contentType: "application/json;charset=utf-8",
							  url: 'http://'+ serverIP +'/'+serviceName+'/GetIDByInput',
							  data: { Type: Type, Name: userId},
							  dataType: 'xml',
							  async: false,
							  beforeSend: function() {},
							  success: function(result) {
								  if (result != "")
								  {
									  var UserId = $(result).find("string").text();
									  window.localStorage.setItem("ID",UserId);
									  window.localStorage.setItem("UserId",UserId);
									  window.localStorage.setItem("Key","LogOn");
									  //alert(UserId);
									  $.ajax({
										  type: "POST",
										  timeout: 30000,
										  //contentType: "application/json;charset=utf-8",
										  url: 'http://'+ serverIP +'/'+serviceName+'/GetActivatedState',	
										  data: { UserId: UserId, RoleClass: "HealthCoach"},
										  dataType: 'xml',
										  async: false,
										  beforeSend: function() {},
										  success: function(result) {
											  var Class = $(result).find("string").text();
											  if (Class == "0")
											  {
												  $.ajax({
													  type: "POST",
													  timeout: 30000,
													  //contentType: "application/json;charset=utf-8",
													  url: 'http://'+ serverIP +'/'+serviceName+'/GetAllRoleMatch',
													  data: { UserId: UserId},
													  dataType: 'xml',
													  async: false,
													  beforeSend: function() {},
													  success: function(result) {
														  if (result != "")
														  {
															  $(result).find('Table1').each(function() {
																  var Role = $(this).find("RoleClass").text();
																  if (Role == "HealthCoach")
																  {
																	  window.localStorage.setItem("AutoLogOn","Yes");
																	  //alert("登陆成功");	
																	  location.href = "HomePage.html";
																  }
															  });
														  }
													  },
													  error: function(msg) {
														  alert("Error: GetAllRoleMatch");	
													  }
												  });
											  }
											  else if (Class = "1")
											  {
												  setTimeout(function(){
													  location.href = "Activition-Pad.html";
												  },2000)
											  }
											  else
											  {
												  document.getElementById("alert").innerHTML = "抱歉，由于权限问题，您无法使用本系统";
					  							   $("#popdiv").popup("open");	
											  }
										  },
										  error: function(msg) {
											  alert("Error: GetActivatedState");	
										  }
									  });
								  
								  }
							  },
							  error: function(msg) {
								  alert("Error: GetIDByInput");	
							  }
					  	  });
					  }
					  else
					  {
						  document.getElementById("alert").innerHTML = "密码错误或用户名不存在";
					  	  $("#popdiv").popup("open");	
					  }
				  },
				  error: function(msg) {
					  alert("Error: CheckPasswordByInput");	
				  }
				 });
			}
			else if (userId == "") 
			{
				document.getElementById("alert").innerHTML = "用户名不能为空！";
				$("#popdiv").popup("open");
                $("#username").focus();
            }
            else if (password == "") 
			{
				document.getElementById("alert").innerHTML = "密码不能为空！";
				$("#popdiv").popup("open");
                $("#userpassword").focus(); 
            }
		};



/**********************激活***********************/
function Activition() {
			var UserId = window.localStorage.getItem("ID");
			//alert(UserId);
			var InviteCode = $('#InviteCode').val();
			
			if (InviteCode != "")
			{
				//$('#ActivitionBtn').removeAttr('disabled');
				$.ajax({
					type: "POST",
					timeout: 30000,
					//contentType: "application/json;charset=utf-8",
					url: 'http://'+ serverIP +'/'+serviceName+'/SetActivition',
					data: { UserId: UserId, RoleClass: "HealthCoach", ActivationCode: InviteCode},
					dataType: 'xml',
					async: false,
    				beforeSend: function() {},
					success: function(result) {
						var Flag = $(result).find("int").text();
						if (Flag == 1)
						{
							document.getElementById("showlabel").innerHTML = "激活成功，首次使用请重置密码";
							document.getElementById("showlabel").style.display = "block";
							setTimeout(function () {
								//alert("激活成功");
								location.href = "ResetPassword-Pad.html"
							},1000)
						}
						else
						{
							document.getElementById("alert").innerHTML = "邀请码错误，请确认后重新输入邀请码！";
							$("#popdiv").popup("open");
						}
					},
					error: function(msg) {
						alert("Error: SetActivition");	
					}
				});
			}
			else if (InviteCode == "")
			{
				document.getElementById("alert").innerHTML = "邀请码不能为空！";
				$("#popdiv").popup("open");
                $("#InviteCode").focus();
			}
		};
		
		
/**********************注册***********************/
function Register() {
			var userId = $('#UserId').val();
			var UserName = $('#UserName').val();
			var Password = $('#Password').val();
			var myRegEmail = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
			var myRegPhone = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
			var isHealthCoach = 0;
			
			if (UserId != "" && UserName != "" && Password != "" )
			{
				if (myRegPhone.test(userId))
				{
					var Type = "PhoneNo";
				}
				else if (myRegEmail.test(userId))
				{
					var Type = "2";	
				}
				else
				{
					var Type = "3";	
				}
				//$('#RegisterBtn').removeAttr('disabled');
				$.ajax({
					type: "POST",
					timeout: 30000,
					//contentType: "application/json;charset=utf-8",
					url: 'http://'+ serverIP +'/'+serviceName+'/CheckRepeat',
					data: { Input: userId, Type: Type},
					dataType: 'xml',
					async: false,
    				beforeSend: function() {},
					success: function(result) {
						var Flag = $(result).find("int").text();
						if (Flag == 1)
						{
							$.ajax({
								type: "POST",
								timeout: 30000,
								//contentType: "application/json;charset=utf-8",
								url: 'http://'+ serverIP +'/'+serviceName+'/Register',
								data: { Type: Type, Name: userId, Value: "", Password: Password, UserName: UserName,revUserId: revUserId, TerminalName: TerminalName, TerminalIP: TerminalIP, DeviceType: DeviceType},
								dataType: 'xml',
								async: false, 
								beforeSend: function() {},
								success: function(result) {
									var Flag1 = $(result).find("int").text();
									if (Flag1 == 1)
									{
										$.ajax({
											type: "POST",
											timeout: 30000,
											//contentType: "application/json;charset=utf-8",
											url: 'http://'+ serverIP +'/'+serviceName+'/GetIDByInput',
											data: { Type: Type, Name: userId},
											dataType: 'xml',
											async: false,
											beforeSend: function() {},
											success: function (result) {
												var userID = $(result).find("string").text();
												//alert(userId);
												if (userID != "")
												{
													$.ajax({
													  type: "POST",
													  dataType: "xml",
													  timeout: 30000,
													  url: 'http://' + serverIP + '/' + serviceName + '/GetNoByNumberingType',
													  async: false,
													  data: { NumberingType: "12" },
													  beforeSend: function () { },
													  success: function (result) {
														  var InviteNo = $(result).find("string").text();
														  if (InviteNo != "")
														  {
															$.ajax({
																type: "POST",
																timeout: 30000,
																//contentType: "application/json;charset=utf-8",
																url: 'http://'+ serverIP +'/'+serviceName+'/SetPsRoleMatch',
																data: { PatientId: userID, RoleClass: "HealthCoach", ActivationCode: InviteNo, ActivatedState: "1", Description: ""},
																dataType: 'xml',
																async: false,
																beforeSend: function() {},
																success: function (result) {
																	var test = $(result).find("int").text();
																	if (test == 1)
																	{
																		document.getElementById("showlabel").innerHTML = "注册成功，即将返回登录页面";
																		document.getElementById("showlabel").style.display = "block";
																		setTimeout(function () {
																			//alert("注册成功");
																			location.href = "LogOn-Pad.html"
																		},1000)
																	}
																	else
																	{
																		document.getElementById("alert").innerHTML = "注册失败！";
																		$("#popdiv").popup("open");
																	}
																},
																error: function(msg) {
																	alert("Error: SetPsRoleMatch");	
																}
															});
														  }
													  },
													  error: function (msg) {
														  alert("Error: GetNoByNumberingType");
													  }
												  	});
												}
											},
											error: function(msg) {
												alert("Error: GetIDByInput");	
											}
										});
									}
								},
								error: function(msg) {
									alert("Error: Register");	
								}
							});
						}
						else
						{
							$.ajax({
							  type: "POST",
							  timeout: 30000,
							  //contentType: "application/json;charset=utf-8",
							  url: 'http://'+ serverIP +'/'+serviceName+'/GetIDByInput',
							  data: { Type: Type, Name: userId},
							  dataType: 'xml',
							  async: false,
							  beforeSend: function() {},
							  success: function(result) {
								  var UserId = $(result).find("string").text();
								  if (UserId != "")
								  {
									  $.ajax({
										type: "POST",
										timeout: 30000,
										//contentType: "application/json;charset=utf-8",
										url: 'http://'+ serverIP +'/'+serviceName+'/GetAllRoleMatch',
										data: { UserId: UserId},
										dataType: 'xml',
										async: false,
										beforeSend: function() {},
										success: function(result) {
											if (result != "")
											{
												$(result).find('Table1').each(function() {
													var Role = $(this).find("RoleClass").text();
													if (Role == "HealthCoach")
													{
														document.getElementById("alert").innerHTML = "用户名重复！";
														$("#popdiv").popup("open");
														isHealthCoach = 1;
													}
												});
											}
										},
										error: function(msg) {
											alert("Error: GetAllRoleMatch");	
										}
									});
									
									if (isHealthCoach == 0)
									{
										$.ajax({
										  type: "POST",
										  dataType: "xml",
										  timeout: 30000,
										  url: 'http://' + serverIP + '/' + serviceName + '/GetNoByNumberingType',
										  async: false,
										  data: { NumberingType: "12" },
										  beforeSend: function () { },
										  success: function (result) {
											  var InviteNo = $(result).find("string").text();
											  if (InviteNo != "")
											  {
												$.ajax({
													type: "POST",
													timeout: 30000,
													//contentType: "application/json;charset=utf-8",
													url: 'http://'+ serverIP +'/'+serviceName+'/SetPsRoleMatch',
													data: { PatientId: UserId, RoleClass: "HealthCoach", ActivationCode: InviteNo, ActivatedState: "1", Description: ""},
													dataType: 'xml',
													async: false,
													beforeSend: function() {},
													success: function (result) {
														var test = $(result).find("int").text();
														if (test == 1)
														{
															document.getElementById("showlabel").innerHTML = "注册成功，密码与您的医生账号一致，即将返回登录页面";
															document.getElementById("showlabel").style.display = "block";
															setTimeout(function () {
																//alert("注册成功");
																location.href = "LogOn-Pad.html"
															},1000)
														}
														else
														{
															document.getElementById("alert").innerHTML = "注册失败！";
															$("#popdiv").popup("open");	
														}
													},
													error: function(msg) {
														alert("Error: SetPsRoleMatch");	
													}
												});
											  }
										  },
										  error: function (msg) {
											  alert("Error: GetNoByNumberingType");
										  }
										});	
									}
								  }
								  else
								  {
									  $.ajax({
										  type: "POST",
										  timeout: 30000,
										  //contentType: "application/json;charset=utf-8",
										  url: 'http://'+ serverIP +'/'+serviceName+'/Register',
										  data: { Type: Type, Name: userId, Value: "", Password: Password, UserName: UserName,revUserId: revUserId, TerminalName: TerminalName, TerminalIP: TerminalIP, DeviceType: DeviceType},
										  dataType: 'xml',
										  async: false,
										  beforeSend: function() {},
										  success: function(result) {
											  var Flag1 = $(result).find("int").text();
											  if (Flag1 == 1)
											  {
												  $.ajax({
													  type: "POST",
													  timeout: 30000,
													  //contentType: "application/json;charset=utf-8",
													  url: 'http://'+ serverIP +'/'+serviceName+'/GetIDByInput',
													  data: { Type: Type, Name: userId},
													  dataType: 'xml',
													  async: false,
													  beforeSend: function() {},
													  success: function (result) {
														  var userID = $(result).find("string").text();
														  //alert(userId);
														  if (userID != "")
														  {
															  $.ajax({
																type: "POST",
																dataType: "xml",
																timeout: 30000,
																url: 'http://' + serverIP + '/' + serviceName + '/GetNoByNumberingType',
																async: false,
																data: { NumberingType: "12" },
																beforeSend: function () { },
																success: function (result) {
																	var InviteNo = $(result).find("string").text();
																	if (InviteNo != "")
																	{
																	  $.ajax({
																		  type: "POST",
																		  timeout: 30000,
																		  //contentType: "application/json;charset=utf-8",
																		  url: 'http://'+ serverIP +'/'+serviceName+'/SetPsRoleMatch',
																		  data: { PatientId: userID, RoleClass: "HealthCoach", ActivationCode: InviteNo, ActivatedState: "1", Description: ""},
																		  dataType: 'xml',
																		  async: false,
																		  beforeSend: function() {},
																		  success: function (result) {
																			  var test = $(result).find("int").text();
																			  if (test == 1)
																			  {
																				  document.getElementById("showlabel").innerHTML = "注册成功，即将返回登录页面";
																				  document.getElementById("showlabel").style.display = "block";
																				  setTimeout(function () {
																					  //alert("注册成功");
																					  location.href = "LogOn-Pad.html"
																				  },1000)
																			  }
																			  else
																			  {
																				  document.getElementById("alert").innerHTML = "注册失败！";
																				  $("#popdiv").popup("open");
																				  
																			  }
																		  },
																		  error: function(msg) {
																			  alert("Error: SetPsRoleMatch");	
																		  }
																	  });
																	}
																},
																error: function (msg) {
																	alert("Error: GetNoByNumberingType");
																}
															  });
														  }
													  },
													  error: function(msg) {
														  alert("Error: GetIDByInput");	
													  }
												  });
											  }
										  },
										  error: function(msg) {
											  alert("Error: Register");	
										  }
									  }); 
								  }
							  },
							  error: function(msg) {
								  alert("Error: GetIDByInput");	
							  }
							});	
						}
					},
					error: function(msg) {
						alert("Error: CheckRepeat");	
					}
				});
			}
			else if (userId == "")
			{
				document.getElementById("alert").innerHTML = "用户名不能为空！";
				$("#popdiv").popup("open");
                $("#username").focus();
			}
			else if (Password == "")
			{
				document.getElementById("alert").innerHTML = "密码不能为空！";
				$("#popdiv").popup("open");
                $("#Password").focus();
			}
			else if (UserName == "")
			{
				document.getElementById("alert").innerHTML = "真实姓名不能为空！";
				$("#popdiv").popup("open");
                $("#UserName").focus();

			}
			
		}		
		
		
/**********************验证用户名***********************/	
var wait = 60;
    	function Time() {
        	document.getElementById("GetValidateCode").disabled = false;
        	if (wait == 0) {
            	document.getElementById("GetValidateCode").disabled = false;
            	document.getElementById("GetValidateCode").value = "获取验证码";
            	wait = 60;

        	}
       	 	else {
           	 	document.getElementById("GetValidateCode").disabled = true;
            	document.getElementById("GetValidateCode").value = "重新获取验证码(" + wait + ")";
            	wait--;
            	setTimeout(function () { Time() }, 1000);
       	 	}

    	}
		
		function Verification() {
			var userId = $("#UserId").val();
			var ValidateCode = $("#ValidateCode").val();
			var valiCode = "test";
			var myRegEmail = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
			var myRegPhone = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
			
			if (userId != "" && ValidateCode != "")
			{
				if (myRegPhone.test(userId))
				{
					var Type = "PhoneNo";
				}
				else if (myRegEmail.test(userId))
				{
					var Type = "2";	
				}
				else
				{
					var Type = "3";	
				}
				//alert(Type);
				//$('#NextBtn').removeAttr('disabled');
				$.ajax({
					type: "POST",
					timeout: 30000,
						//contentType: "application/json;charset=utf-8",
					url: 'http://'+ serverIP +'/'+serviceName+'/GetIDByInput',
					data: { Type: Type, Name: userId},
					dataType: 'xml',
					async: false,
					beforeSend: function() {},
					success: function(result) {
						var userID = $(result).find("string").text();
						if (userID != "")
						{
							
							if (ValidateCode == valiCode)
							{
								//alert("验证码正确");
								window.localStorage.setItem("ID",userID);	
								window.localStorage.setItem("Key","Verification");
								//var t = localStorage.getItem("ID");
								//alert(t);
								location.href = "ResetPassword-Pad.html";
							}
							else
							{
								document.getElementById("alert").innerHTML = "验证码错误！";
								$("#popdiv").popup("open");	
							}
						}
						else
						{
							document.getElementById("alert").innerHTML = "用户名不存在！";
							$("#popdiv").popup("open");	
						}
					},
					error: function(msg) {
						alert("Error: GetIDByInput");	
					}
				});
			}
			else if (userId == "")
			{
				document.getElementById("alert").innerHTML = "用户名不能为空！";
				$("#popdiv").popup("open");
				$("#UserId").focus();
			}
			else if (ValidateCode == "")
			{
				document.getElementById("alert").innerHTML = "验证码不能为空！";
				$("#popdiv").popup("open");
				$("#ValidateCode").focus();
			}
		}
		
		
/**********************重置密码***********************/	
function ResetPassword() {
			var NewPassword = $("#NewPassword").val();
			var ConfirmPassword = $("#ConfirmPassword").val();
			var UserId = window.localStorage.getItem("ID");
			//alert(UserId);
			var Key = window.localStorage.getItem("Key");
			var Device = window.localStorage.getItem("Device");
			//alert(Key);
			//alert(Device);
			var OldPassword = "#*bme319*#";
			
			if (NewPassword != "" && ConfirmPassword != "" && NewPassword == ConfirmPassword)
			{
				$.ajax({
					type: "POST",
					timeout: 30000,
						//contentType: "application/json;charset=utf-8",
					url: 'http://'+ serverIP +'/'+serviceName+'/ChangePassword',
					data: { UserId: UserId, OldPassword: OldPassword, NewPassword: NewPassword, revUserId: revUserId, TerminalName: TerminalName, TerminalIP: TerminalIP, DeviceType: DeviceType},
					dataType: 'xml',
					async: false,
					beforeSend: function() {},
					success: function(result) {
						var test = $(result).find("int").text();
						if (test == 1)
						{
							if (Key == "LogOn")
							{
								document.getElementById("showlabel").style.display = "block";
								document.getElementById("showlabel").innerHTML = "首次重置密码成功，即将进入系统";
								setTimeout(function () {
									if (Device == "Pad")
									{
										//alert("带我进Pad主页啊");
										location.href = "HomePage.html";
									}
									else if (Device == "Phone")
									{
										//alert("带我进Phone主页啊");
										location.href = "TaskMenu.html";
									}
									
								},3000)		
							}
							else if (Key == "Verification")
							{
								document.getElementById("showlabel").style.display = "block";
								setTimeout(function () {
									if (Device == "Pad")
									{
										location.href = "LogOn-Pad.html";
									}
									else if (Device == "Phone")
									{
										location.href = "LogOn-Phone.html";
									} 
								},3000)	
							}
						}
					},
					error: function(msg) {
							alert("Error: ChangePassword");	
						}
				});
			}
			else if (NewPassword == "")
			{
				document.getElementById("alert").innerHTML = "新密码不能为空！";
				$("#popdiv").popup("open");
                $("#NewPassword").focus();
			}
			else if (ConfirmPassword == "")
			{
				document.getElementById("alert").innerHTML = "请再次输入新密码！";
				$("#popdiv").popup("open");
                $("#ConfirmPassword").focus();
			}
			else if (NewPassword != ConfirmPassword)
			{
				document.getElementById("alert").innerHTML = "两次输入的密码不同，请再次确认新密码！";
				$("#popdiv").popup("open");
				$("#ConfirmPassword").focus();
			}
		}
		
		/**********************修改密码***********************/	
function ChangePassword() {
			var OldPassword = $("#OldPassword").val();
			var NewPassword = $("#NewPassword").val();
			var ConfirmPassword = $("#ConfirmPassword").val();
			var UserId = window.localStorage.getItem("ID");
			//alert(UserId);
			//var Key = window.localStorage.getItem("Key");
			var Device = window.localStorage.getItem("Device");
			//alert(Key);
			//alert(Device);
			//var OldPassword = "#*bme319*#";
			
			if (OldPassword != "" && NewPassword != "" && ConfirmPassword != "" && NewPassword == ConfirmPassword)
			{
				$.ajax({
					type: "POST",
					timeout: 30000,
						//contentType: "application/json;charset=utf-8",
					url: 'http://'+ serverIP +'/'+serviceName+'/ChangePassword',
					data: { UserId: UserId, OldPassword: OldPassword, NewPassword: NewPassword, revUserId: revUserId, TerminalName: TerminalName, TerminalIP: TerminalIP, DeviceType: DeviceType},
					dataType: 'xml',
					async: false,
					beforeSend: function() {},
					success: function(result) {
						var test = $(result).find("int").text();
						window.localStorage.setItem("AutoLogOn","No");
						if (test == 1)
						{
							document.getElementById("showlabel").style.display = "block";
							setTimeout(function () {
								if (Device == "Pad")
								{
									location.href = "HomePage.html";
								}
								else if (Device == "Phone")
								{
									location.href = "TaskMenu.html";
								} 
							},3000)	
						}
						else if (test == 2)
						{
							document.getElementById("showlabel").innerHTML = "新密码设置失败，请联系管理员重置密码";
							document.getElementById("showlabel").style.display = "block";
						}
						else if (test == 3)
						{
							document.getElementById("showlabel").innerHTML = "旧密码错误，请输入正确的旧密码";
							document.getElementById("showlabel").style.display = "block";
						}
						else if (test == 4)
						{
							document.getElementById("showlabel").innerHTML = "密码已过期，请联系管理员重置密码";
							document.getElementById("showlabel").style.display = "block";
						}
					},
					error: function(msg) {
							alert("Error: ChangePassword");	
						}
				});
			}
			else if (OldPassword == "")
			{
				document.getElementById("alert").innerHTML = "旧密码不能为空！";
				$("#popdiv").popup("open");
                $("#OldPassword").focus();
			}
			else if (NewPassword == "")
			{
				document.getElementById("alert").innerHTML = "新密码不能为空！";
				$("#popdiv").popup("open");
                $("#NewPassword").focus();
			}
			else if (ConfirmPassword == "")
			{
				document.getElementById("alert").innerHTML = "请再次输入新密码！";
				$("#popdiv").popup("open");
                $("#ConfirmPassword").focus();
			}
			else if (NewPassword != ConfirmPassword)
			{
				document.getElementById("alert").innerHTML = "两次输入的密码不同，请再次确认新密码！";
				$("#popdiv").popup("open");
				$("#ConfirmPassword").focus();
			}
		}
		
/**********************手机号码正则验证***********************/	
$(document).ready(function() {
	
    $("#UserId").blur(function () {
		var PHONENUMBER = $("#UserId").val();
		var isPhone = /^1[3|4|5|7|8][0-9]\d{4,8}$/;

		//alert(isPhone.test(PHONENUMBER));
		//alert(PHONENUMBER.length)
		if (PHONENUMBER.length == 11)
		{
			if (isPhone.test(PHONENUMBER))
			{
				document.getElementById("AlertUserId").style.display = "none";
				//alert(PHONENUMBER);
			}	
			else
			{
				//alert(PHONENUMBER.length);
				document.getElementById("AlertUserId").innerHTML = "请输入正确的手机号码";
				document.getElementById("AlertUserId").style.display = "block";
				//alert("不是正确的手机号码");
			}
		}
		else
		{
			//alert(PHONENUMBER.length);
			document.getElementById("AlertUserId").innerHTML = "请输入11位手机号码";
			document.getElementById("AlertUserId").style.display = "block";
			//alert("请输入11位手机号码");	
		}
		/*if (isPhone.test(PHONENUMBER))
		{
			document.getElementById("AlertUserId").style.display = "none";
			alert(PHONENUMBER);
		}
		else 
		{
			//alert("test");
			alert(PHONENUMBER.length);
			if (PHONENUMBER.length == 11)
			{
				//alert(PHONENUMBER.length);
				document.getElementById("AlertUserId").innerHTML = "请输入正确的手机号码";
				document.getElementById("AlertUserId").style.display = "block";
				//alert("不是正确的手机号码");
			}
			else
			{
				//alert(PHONENUMBER.length);
				document.getElementById("AlertUserId").innerHTML = "请输入11位手机号码";
				document.getElementById("AlertUserId").style.display = "block";
				//alert("请输入11位手机号码");	
			}	
		}*/
	}
	)
});

