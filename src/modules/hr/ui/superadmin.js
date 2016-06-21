var DoleticUIModule = new function() {
	/**
	 *	Parent abstract module
	 */
	this.super = new AbstractDoleticUIModule('HR_UIModule', 'Nicolas Sorin', '1.0dev');
	/**
	 *	Override render function
	 */
	this.render = function(htmlNode) {

		// Define global variables
		window.sortUser = {attribute:"id", asc:Boolean(true)};
		window.sortTeam = {attribute:"id", asc:Boolean(true)};
		this.super.render(htmlNode, this);
		// activate items in tabs
		$('.menu .item').tab();
		// Load HTML templates
		DoleticUIModule.getStatsTab();
		DoleticUIModule.getMembersTab();
		DoleticUIModule.getTeamsTab();
		DoleticUIModule.getDetailsTab();


		$('#content_div').load("../modules/hr/ui/superadmin.html");
		// hide user details tab
		$('#det').hide();
		// fill user and team list. User first to fill user_list global array
		$.when($.ajax(DoleticUIModule.fillUsersList())).then(DoleticUIModule.fillTeamsList());
		// fill country field
		DoleticUIModule.fillCountrySelector();
		// fill gender field
		DoleticUIModule.fillGenderSelector();
		// fill INSA dept field
		DoleticUIModule.fillINSADeptSelector();
		// fill position field
		DoleticUIModule.fillPositionSelector();
		// fill school year field
		DoleticUIModule.fillSchoolYearSelector();
		//fill division field
		DoleticUIModule.fillDivisionSelector();
		//fill ag field
		DoleticUIModule.fillAGSelector();
		// init filters
		//$('.dropdown').dropdown();
		$('#user_filters .dropdown').dropdown('setting', 'onChange', function() {DoleticUIModule.fillUsersList()});
		$('#team_filters .dropdown').dropdown('setting', 'onChange', function() {DoleticUIModule.fillTeamsList()});
	}
	/**
	 *	Override build function
	 */
	this.build = function() {
		return "<div class=\"ui two column grid container\"> \
				  <div class=\"row\"> \
				  </div> \
				  <div class=\"row\"> \
				  	<div class=\"sixteen wide column\"> \
				  		<div class=\"ui top attached tabular menu\"> \
  							<a class=\"item active\" data-tab=\"stats\">Statistiques</a> \
  							<a class=\"item\" data-tab=\"memberlist\">Liste des membres</a> \
  							<a class=\"item\" data-tab=\"teamlist\">Liste des équipes</a> \
  							<!--<a class=\"item\" data-tab=\"form\">Formations</a>--> \
  							<a class=\"item\" id=\"det\" data-tab=\"userdetails\">Détails de l'utilisateur</a> \
						</div> \
						<div class=\"ui bottom attached tab segment active\" data-tab=\"stats\"> \
							<div id=\"statsTab\">\
							</div>\
					    </div> \
						<div class=\"ui bottom attached tab segment\" data-tab=\"memberlist\"> \
							<div id=\"membersTab\">\
							</div>\
						</div> \
						<div class=\"ui bottom attached tab segment\" data-tab=\"teamlist\"> \
							<div id=\"teamsTab\">\
							</div>\
						</div> \
						<div class=\"ui bottom attached tab segment\" data-tab=\"userdetails\"> \
							<div id=\"detailsTab\">\
							</div>\
						</div> \
					</div> \
				  </div> \
				  <div class=\"row\"> \
				  </div> \
				  <div class=\"row\"> \
				  </div> \
				</div>";
	}
	/**
	 *	Override uploadSuccessHandler
	 */
	this.uploadSuccessHandler = function(id, data) {
		this.super.uploadSuccessHandler(id, data);
	}

	this.nightMode = function(on) {
	    /*if(on) {
	      $('.ui.horizontal.divider').attr('class', 'ui horizontal divider inverted');
	      $('#ticket_list').attr('class', 'ui very relaxed celled selection list inverted');
	      $('#support_form').attr('class', 'ui form segment inverted');
	      $('#abort_btn').attr('class', 'ui button inverted');
		  $('#adduser_btn').attr('class', 'ui green button inverted');
	    } else {
	      $('.ui.horizontal.divider.inverted').attr('class', 'ui horizontal divider');
	      $('#ticket_list').attr('class', 'ui very relaxed celled selection list');
	      $('#support_form').attr('class', 'ui form segment');
	      $('#abort_btn').attr('class', 'ui button');
	      $('#adduser_btn').attr('class', 'ui green button');
	    }*/
  	}

// ---- OTHER FUNCTION REQUIRED BY THE MODULE ITSELF

	/**
	 *	Load the HTML code of the Stats Tab
	 */
	this.getStatsTab = function() {
		$('#statsTab').load("../modules/hr/ui/templates/statsTab.html");
	}

	/**
	 *	Load the HTML code of the Members Tab
	 */
	this.getMembersTab = function() {
		$('#membersTab').load("../modules/hr/ui/templates/membersTab.html");
	}

	/**
	 *	Load the HTML code of the Teams Tab
	 */
	 this.getTeamsTab = function() {
		 $('#teamsTab').load("../modules/hr/ui/templates/teamsTab.html");
	 }
	 /**
	 *	Load the HTML code of the Details Tab
	 */
	 this.getDetailsTab = function() {
		 $('#detailsTab').load("../modules/hr/ui/templates/detailsTab.html");
	 }

	this.hasInputError = false;

	this.fillCountrySelector = function() {
		UserDataServicesInterface.getAllCountries(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "<option value=\"\">Pays</option>";
				//DoleticUIModule.country_list = data.object;
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i]+"\">"+data.object[i]+"</option>\n";
				};
				// insert html content
				$('#country').html(content).dropdown();
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillGenderSelector = function() {
		UserDataServicesInterface.getAllGenders(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "<option value=\"\">Civilité...</option>";
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i]+"\">"+data.object[i]+"</option>\n";
				};
				// insert html content
				$('#gender').html(content).dropdown();
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillINSADeptSelector = function() {
		UserDataServicesInterface.getAllINSADepts(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "<option value=\"\">Département...</option>";
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i].label+"\">"+data.object[i].label+"</option>\n";
				};
				// insert html content
				$('#dept').html(content).dropdown();
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillSchoolYearSelector = function() {
		UserDataServicesInterface.getAllSchoolYears(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "<option value=\"\">Année...</option>";
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i]+"\">"+data.object[i]+"</option>\n";
				};
				// insert html content
				$('#schoolyear').html(content).dropdown();
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillPositionSelector = function() {
		UserDataServicesInterface.getAllPositions(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "<option value=\"\">Poste...</option>";
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i]+"\">"+data.object[i]+"</option>\n";
				};
				// insert html content
				$('#position').html(content).dropdown();
				//$('#position_f').append(content);
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillDivisionSelector = function() {
		TeamServicesInterface.getAllDivisions(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "<option value=\"\">Pôle...</option>";
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i]+"\">"+data.object[i]+"</option>\n";
				};
				// insert html content
				$('#division').html(content).dropdown();
				//$('#user_filters #division_f').append(content);
				//$('#team_filters #division_ft').append(content);
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}
	this.fillAGSelector = function() {
		UserDataServicesInterface.getAllAgs(function(data) {
			// if no service error
			if(data.code == 0) {
				// create content var to build html
				var content = "";
				var table_content = "";
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					content += "<option value=\""+data.object[i]+"\">"+data.object[i]+"</option>\n";
					table_content += "<tr><td>"+data.object[i]+"</td><td><button class=\"ui icon button\"onClick=\"DoleticUIModule.deleteAGR('"+data.object[i]+"'); return false;\"> \
			  									<i class=\"remove icon\"></i>Retirer \
											</button></td></tr>";
				};
				// insert html content
				$('#ag').html(content).dropdown();
				$('#agr_body').html(table_content);
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillUsersList = function() {
		UserDataServicesInterface.getAll(function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				// Store data in global array
				window.user_list = new Array();
				// iterate over values to build options
				var content = "";
				var filters = [
								DoleticMasterInterface.no_filter,
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.reset_filter
								];
				var selector_content = "<option value>Membre...</option>";
				for (var i = 0; i < data.object.length; i++) {
						
						window.user_list[data.object[i].id] = data.object[i];

						selector_content += "<option value=\""+data.object[i].user_id+"\">"

	    							+ data.object[i].firstname + " " + data.object[i].lastname + "</option>\n";
						content += "<tr><td> \
	      						<button class=\"ui icon button\" onClick=\"DoleticUIModule.fillUserDetails("+data.object[i].user_id+"); return false;\"> \
		  							<i class=\"user icon\"></i> \
								</button> \
								</td><td> \
	        				<h4 class=\"ui header\"> \
	          				<div class=\"content\">"  + data.object[i].firstname + " " + data.object[i].lastname +
	            			"<div class=\"sub header\"><a href=\"mailto:" + data.object[i].email + "\" target=\"_blank\">"+data.object[i].email+"</a></div> \
	        				</div> \
	      					</h4></td> \
	      					<td>" + data.object[i].last_pos.label + "</td> \
	      					<td>" + data.object[i].tel + "</td> \
	      					<td>" + data.object[i].school_year + data.object[i].insa_dept + "</td> \
	    				<td> \
	    					<div class=\"ui icon buttons\"> \
		    					<button class=\"ui icon button\" onClick=\"DoleticUIModule.editUser("+data.object[i].id+", "+data.object[i].user_id +"); return false;\"> \
		  							<i class=\"write icon\"></i> \
								</button> \
								<button class=\"ui icon button\" onClick=\"DoleticUIModule.deleteUser("+data.object[i].id+", "+data.object[i].user_id+"); return false;\"> \
		  							<i class=\"remove user icon\"></i> \
								</button> \
							</div> \
	    				</td> \
	    				</tr>";

	    				
				}
				$('#user_body').html(content);
				DoleticMasterInterface.makeDataTables('user_table', filters);
				$('#leader').html(selector_content).dropdown();
				
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.fillTeamsList = function() {
		TeamServicesInterface.getAll(function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				
				window.team_list = new Array();
				// create content var to build html
				var content = "";
				var filters = [
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.reset_filter
								];
				// iterate over values to build options
				for (var i = 0; i < data.object.length; i++) {
					window.team_list[data.object[i].id] = data.object[i];
					DoleticUIModule.makeTeamModal(data.object[i]);
					content += "<tr><td>"+data.object[i].name+"</td> \
								<td>"+window.user_list[data.object[i].leader_id].firstname + " " 
								+ window.user_list[data.object[i].leader_id].lastname +"</td> \
								<td>" + data.object[i].division + "</td> \
								<td> \
									<button class=\"ui icon button\" onClick=\"$('#tmodal_"+data.object[i].id+"').modal('show');\"> \
	  									<i class=\"write icon\"></i>Gérer \
								</td> \
								<td> \
									<div class=\"ui icon buttons\"> \
										<button class=\"ui icon button\" onClick=\"DoleticUIModule.editTeam("+data.object[i].id+"); return false;\"> \
		  									<i class=\"write icon\"></i> \
										</button> \
										<button class=\"ui icon button\"onClick=\"DoleticUIModule.deleteTeam("+data.object[i].id+"); return false;\"> \
		  									<i class=\"remove icon\"></i> \
										</button>\
									</div> \
								</td> \
								</tr>";
					//}
				};
				// insert html content
				$('#team_body').html(content);
				DoleticMasterInterface.makeDataTables('team_table', filters);
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.makeTeamModal = function(team) {
		var modal = "<div class=\"ui modal\" id=\"tmodal_"+team.id+"\" > \
	  		<div class=\"header\">\
	    		Gérer les membres\
	  		</div> <br>\
	  		<div class=\"ui stackable grid container\"> \
	  			<div class=\"row\"> \
	  				<div class=\"ten wide column\"> \
	  					<table class=\"ui very basic single line striped table\"><tbody id=\"members_"+team.id+"\">";
	  	for(var i=0; i<team.member_id.length; i++) {
	  		modal += "		<tr><td> \
						  <i class=\"large user middle aligned icon\"></i></td><td>\
						  <div class=\"content\">\
						    <div class=\"header\"><strong>"+ window.user_list[team.member_id[i]].firstname + " " 
						    					   + window.user_list[team.member_id[i]].lastname;
			modal +=	    "</strong></div><div class=\"description\">"+window.user_list[team.member_id[i]].last_pos.label+"</div>\
						  </div>";
			if(team.member_id[i] != team.leader_id) {
				modal += "<td><button class=\"ui small icon button\"onClick=\"DoleticUIModule.deleteTeamMember("+team.id+", "+team.member_id[i]+"); return false;\"> \
	  									<i class=\"remove icon\"></i>Retirer \
							</button></td>";
			} else {
				modal += "<td> (Chef d'équipe) </td>";
			}
			modal += "</td></tr>";
	  	}
	  	modal += "		</tbody></table> \
	  				</div> \
	  				<div class=\"six wide column\"> \
	  					<form class=\"ui form\">\
 						 <h4 class=\"ui dividing header\">Ajouter des membres</h4>\
 						 <div class=\"required field\"> \
							<label>Membre à ajouter</label> \
			      				<select id=\"add_tmember_select"+team.id+"\" class=\"ui fluid search dropdown\" multiple >";
		for(var i = 0; i<window.user_list.length; i++) {
 			if(typeof window.user_list[i] !== 'undefined') {
 				modal += "<option value=\""+window.user_list[i].id+"\">"+window.user_list[i].firstname + " " + window.user_list[i].lastname+"</option>";
 			}
 		}
		modal +=				"</select> \
		  				 </div> \
		  				 <div id=\"add_tmember_btn"+team.id+"\" class=\"ui green button\" onClick=\"DoleticUIModule.insertTeamMember("+team.id+");\">Ajouter</div> \
 						</form>\
	  				</div> \
	  			</div> \
	  			<div class=\"row\"></div>\
	  		</div> \
		</div>";
		
		var $mod = $("#something").find("#tmodal_"+team.id);
		if (!$mod.length) {
		    $("body").append(modal);
		} else {
		    $mod.replaceWith(modal);
		}
		//$("body").append(modal);
		$("#add_tmember_select"+team.id).dropdown();
	}

	this.fillUserDetails = function(userId) {
		this.userId = userId;
		UserDataServicesInterface.getById(userId, function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				$('#det_name').html(data.object.gender + " " + data.object.firstname + " " + data.object.lastname);
				$('#det_pos').html(data.object.last_pos.label);
				$('#det_birth').html(data.object.birthdate);
				$('#det_country').html(data.object.country);
				$('#det_city').html(data.object.city);
				$('#det_add').html(data.object.address);
				$('#det_postal').html(data.object.postal_code);
				$('#det_tel').html(data.object.tel);
				$('#det_mail').html(data.object.email);
				$('#det_year').html(data.object.school_year + data.object.insa_dept);
				$('#det_ag').html(data.object.ag);
				$('#det').show();
				$('#det').html("Détails de "+ data.object.firstname + " " + data.object.lastname);
				$('#det').click();
				$('#admm_btn').attr("onClick", "DoleticUIModule.insertNewAdmMembership("+data.object.user_id+"); return false;");
				$('#abort_admm').attr("onClick", "DoleticUIModule.clearNewAdmMembershipForm("+data.object.user_id+"); return false;");
				$('#intm_btn').attr("onClick", "DoleticUIModule.insertNewIntMembership("+data.object.user_id+"); return false;");
				$('#abort_intm').attr("onClick", "DoleticUIModule.clearNewIntMembershipForm("+data.object.user_id+"); return false;");
				$('#admm_tab').click();

				// Fill memberships tables
				AdmMembershipServicesInterface.getUserAdmMemberships(data.object.user_id, function(data) {
					var filters = [
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.reset_filter
								];
					var html = "";
					for(var i=0; i<data.object.length; i++) {
						if(!(data.object[i].fee && data.object[i].form && data.object[i].certif)) {
							html += "<tr class=\"warning\">";
						} else {
							html += "<tr>";
						}
						html += "<td>"+data.object[i].start_date+"</td>";
						html += "<td>"+data.object[i].end_date+"</td>";
						html += "<td>"+data.object[i].fee+"</td>";
						html += "<td>"+data.object[i].form+"</td>";
						html += "<td>"+data.object[i].certif+"</td>";
						html = html.replace(/false/g, "Non");
						html = html.replace(/true/g, "Oui");
						html += "<td>\
							<div class=\"ui icon buttons\"> \
								<button class=\"ui icon button\" onClick=\"DoleticUIModule.editAdmMembership("+data.object[i].id+", "+data.object[i].user_id+"); return false;\"> \
		  							<i class=\"write icon\"></i> \
								</button> \
								<button class=\"ui icon button\"onClick=\"DoleticUIModule.deleteAdmMembership("+data.object[i].id+", "+data.object[i].user_id+"); return false;\"> \
		  							<i class=\"remove icon\"></i> \
								</button>\
							</div> \
						</td></tr>";
						
					}
					$("#admm_body").html(html);
					DoleticMasterInterface.makeDataTables('admm_table', filters);
				});
				IntMembershipServicesInterface.getUserIntMemberships(data.object.user_id, function(data) {
					var filters = [
								DoleticMasterInterface.input_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.select_filter,
								DoleticMasterInterface.reset_filter
								];
					var html = "";
					for(var i=0; i<data.object.length; i++) {
						if(!(data.object[i].fee && data.object[i].form && data.object[i].certif && data.object[i].rib && data.object[i].identity)) {
							html += "<tr class=\"warning\">";
						} else {
							html += "<tr>";
						}
						html += "<td>"+data.object[i].start_date+"</td>";
						html += "<td>"+data.object[i].fee+"</td>";
						html += "<td>"+data.object[i].form+"</td>";
						html += "<td>"+data.object[i].certif+"</td>";
						html += "<td>"+data.object[i].rib+"</td>";
						html += "<td>"+data.object[i].identity+"</td>";
						html = html.replace(/false/g, "Non");
						html = html.replace(/true/g, "Oui");
						html += "<td>\
							<div class=\"ui icon buttons\"> \
								<button class=\"ui icon button\" onClick=\"DoleticUIModule.editIntMembership("+data.object[i].id+", "+data.object[i].user_id+"); return false;\"> \
		  							<i class=\"write icon\"></i> \
								</button> \
								<button class=\"ui icon button\"onClick=\"DoleticUIModule.deleteIntMembership("+data.object[i].id+", "+data.object[i].user_id+"); return false;\"> \
		  							<i class=\"remove icon\"></i> \
								</button>\
							</div> \
						</td></tr>";
						
					}
					$("#intm_body").html(html);
					DoleticMasterInterface.makeDataTables('intm_table', filters);
				});
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});

	}

	this.clearNewUserForm = function() {
		$('#user_form')[0].reset();
		$('#user_form h4').html("Ajout d'un membre");
		$('#firstname').prop('readonly', false);
		$('#lastname').prop('readonly', false);
		$('#user_form .dropdown').dropdown('restore defaults');

		$('#adduser_btn').html("Ajouter");
		$('#adduser_btn').attr("onClick", "DoleticUIModule.insertNewUser(); return false;");
		$('#user_form').transition('flash');
	}

	this.clearNewTeamForm = function() {
		$('#team_form')[0].reset();
		$('#team_form h4').html("Ajout d'une équipe");
		$('#team_form .dropdown').dropdown('restore defaults');
		$('#addteam_btn').html("Ajouter");
		$('#addteam_btn').attr("onClick", "DoleticUIModule.insertNewTeam(); return false;");
		$('#team_form').transition('flash');
	}

	this.clearNewAdmMembershipForm = function(userId) {
		$('#admm_form')[0].reset();
		$('#admm_form h4').html("Ajout d'une adhésion");
		$('#admm_form .dropdown').dropdown('restore defaults');
		$('#admm_btn').html("Ajouter");
		$('#admm_btn').attr("onClick","DoleticUIModule.insertNewAdmMembership("+userId+"); return false;");
		$('#admm_form').transition('flash');
	}

	this.clearNewIntMembershipForm = function(userId) {
		$('#intm_form')[0].reset();
		$('#intm_form h4').html("Ajout d'une adhésion");
		$('#intm_form .dropdown').dropdown('restore defaults');
		$('#intm_btn').html("Ajouter");
		$('#intm_btn').attr("onClick", "DoleticUIModule.insertNewIntMembership("+userId+"); return false;");
		$('#intm_form').transition('flash');
	}

	this.clearNewAGRForm = function() {
		$('#agr').val("");
	}

	this.addUserHandler = function(data) {
		// if no service error
		if(data.code == 0) {
			// clear ticket form
			DoleticUIModule.clearNewUserForm();
			// alert user that creation is a success
			DoleticMasterInterface.showSuccess("Création réussie !", "L'utilisateur a été créé avec succès !");
			// fill ticket list
			DoleticUIModule.fillUsersList();
		} else {
			// use default service service error handler
			DoleticServicesInterface.handleServiceError(data);
		}
	}

	this.editUserHandler = function(data) {
		// if no service error
		if(data.code == 0) {
			// clear ticket form
			DoleticUIModule.clearNewUserForm();
			// alert user that creation is a success
			DoleticMasterInterface.showSuccess("Edition réussie !", "L'utilisateur a été modifié avec succès !");
			// fill ticket list
			DoleticUIModule.fillUsersList();
		} else {
			// use default service service error handler
			DoleticServicesInterface.handleServiceError(data);
		}
	}

	this.addTeamHandler = function(data) {
		// if no service error
		if(data.code == 0) {
			// clear ticket form
			DoleticUIModule.clearNewTeamForm();
			// alert user that creation is a success
			DoleticMasterInterface.showSuccess("Création réussie !", "L'équipe a été créée avec succès !");
			// fill ticket list
			DoleticUIModule.fillTeamsList();
		} else {
			// use default service service error handler
			DoleticServicesInterface.handleServiceError(data);
		}
	}

	this.editTeamHandler = function(data) {
		// if no service error
		if(data.code == 0) {
			// clear ticket form
			DoleticUIModule.clearNewTeamForm();
			// alert user that creation is a success
			DoleticMasterInterface.showSuccess("Edition réussie !", "L'équipe a été modifiée avec succès !");
			// fill ticket list
			DoleticUIModule.fillTeamsList();
		} else {
			// use default service service error handler
			DoleticServicesInterface.handleServiceError(data);
		}
	}

	this.insertNewUser = function() {
		// ADD OTHER TESTS
		if(DoleticUIModule.checkNewUserForm()) {
		   	// generate credentials according to db
			UserServicesInterface.generateCredentials($('#firstname').val().trim(), $('#lastname').val().trim(), function(data) {
				// Insert new user in db
				UserServicesInterface.insert(data.object.username, data.object.pass, function(data) {
					// Insert user data in db SELECT ?
					UserDataServicesInterface.insert(data.object, 
													$('#gender option:selected').text(),
													$('#firstname').val(), 
													$('#lastname').val(),
													$('#birthdate').val(),
													$('#tel').val(),
													$('#mail').val(),
													$('#address').val(),
													$('#city').val(),
													$('#postalcode').val(),
													$('#country option:selected').text(),
													$('#schoolyear option:selected').text(),
													$('#dept option:selected').text(),
													$('#position option:selected').text(),
													$('#ag option:selected').text(),
													DoleticUIModule.addUserHandler);
				});
			});
		}
	}

	this.insertNewTeam = function() {
		if(DoleticUIModule.checkNewTeamForm()) {
		   	// retreive missing information
			TeamServicesInterface.insert(
				$('#tname').val(),
				$('#leader').val(),
				$('#division option:selected').text(),
				DoleticUIModule.addTeamHandler
			);
		}
	}

	this.insertNewAdmMembership = function(userId) {
		if(DoleticUIModule.checkNewAdmMembershipForm()) {
		   	// retreive missing information
			var handler = function() {
				DoleticUIModule.fillUserDetails(userId);
				DoleticUIModule.clearNewAdmMembershipForm(userId);
			};
			var options = document.getElementById("docs_adm").options;
			AdmMembershipServicesInterface.insert(
				userId, // Retenir l'utilisateur concerné
				$('#sdatea').val(),
				$('#edate').val(),
				Boolean(options[0].selected),
				Boolean(options[1].selected),
				Boolean(options[2].selected),
				handler);
		}
	}

	this.insertNewIntMembership = function(userId) {
		if(DoleticUIModule.checkNewIntMembershipForm()) {
		   	var handler = function() {
				DoleticUIModule.fillUserDetails(userId);
				DoleticUIModule.clearNewIntMembershipForm(userId);
			};
		   	// retreive missing information
			var options = document.getElementById("docs_int").options;
			IntMembershipServicesInterface.insert(
				userId,
				$('#sdatei').val(),
				Boolean(options[0].selected),
				Boolean(options[1].selected),
				Boolean(options[2].selected),
				Boolean(options[3].selected),
				Boolean(options[4].selected),
				handler);
		}
	}

	this.insertNewAGR = function() {
		var handler = function() {
			DoleticUIModule.fillAGSelector();
			DoleticUIModule.clearNewAGRForm();
		};

		if(DoleticUIModule.checkNewAGRForm()) {
			var ag = $("#agr").val();
			UserDataServicesInterface.insertAg(ag, handler);
		}
	}

	this.insertTeamMember = function(id) {
		var handler = function() {
			DoleticUIModule.updateTeamModal(id);
		};

		var select = document.getElementById("add_tmember_select"+id);
		var options = new Array();
		for(var i=0; i<select.options.length; i++) {
			if(select.options[i].selected) {
				options.push(select.options[i].value);
			}
		}
		TeamServicesInterface.insertMember(id, options, handler);
	}

	this.editUser = function(id, user_id) {
		$('#user_form h4').html("Edition d'un membre");
		UserDataServicesInterface.getById(id, function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				$('#firstname').val(data.object.firstname);
				$('#firstname').prop('readonly', true);
				$('#lastname').val(data.object.lastname);
				$('#lastname').prop('readonly', true);
				$('#birthdate').val(data.object.birthdate);
				$('#city').val(data.object.city);
				$('#address').val(data.object.address);
				$('#postalcode').val(data.object.postal_code);
				$('#tel').val(data.object.tel);
				$('#mail').val(data.object.email);
				$('#schoolyear').dropdown("set selected", data.object.school_year);
				$('#dept').dropdown("set selected", data.object.insa_dept);
				$('#gender').dropdown("set selected", data.object.gender);
				$('#position').dropdown("set selected", data.object.last_pos.label);
				$('#country').dropdown("set selected", data.object.country);
				$('#ag').dropdown("set selected", data.object.ag);

				$('#adduser_btn').html("Confirmer");
				$('#adduser_btn').attr("onClick", "DoleticUIModule.updateUser("+id+", "+user_id+"); return false;");
				$('#user_form').transition('pulse');
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.editTeam = function(id) {
		$('#team_form h4').html("Edition d'une équipe");
		TeamServicesInterface.getById(id, function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				$('#tname').val(data.object.name);
				$('#division').dropdown("set selected", data.object.division);
				$('#leader').dropdown("set selected", data.object.leader_id);
				$('#addteam_btn').html("Confirmer");
				$('#addteam_btn').attr("onClick", "DoleticUIModule.updateTeam("+id+"); return false;");
				$('#team_form').transition('pulse');
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.editAdmMembership = function(id, userId) {
		$('#admm_tab').click();
		$('#admm_form h4').html("Edition d'une adhésion");
		AdmMembershipServicesInterface.getById(id, function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				$('#sdatea').val(data.object.start_date);
				$('#edate').val(data.object.end_date);
				$('#ag').dropdown("set selected", Number(data.object.ag)-1);
				var options = new Array();
				if(data.object.fee == 1) {
					options.push("0");
				}
				if(data.object.form == 1) {
					options.push("1");
				}
				if(data.object.certif == 1) {
					options.push("2");
				}
				$('#docs_adm').dropdown("set exactly", options);
				$('#admm_btn').html("Confirmer");
				$('#admm_btn').attr("onClick", "DoleticUIModule.updateAdmMembership("+id+", "+userId+"); return false;");
				$('#admm_form').transition('pulse');
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.editIntMembership = function(id, userId) {
		$('#intm_tab').click();
		$('#intm_form h4').html("Edition d'une adhésion");
		IntMembershipServicesInterface.getById(id, function(data) {
			// if no service error
			if(data.code == 0 && data.object != "[]") {
				$('#sdatei').val(data.object.start_date);
				var options = new Array();
				if(data.object.fee == 1) {
					options.push("0");
				}
				if(data.object.form == 1) {
					options.push("1");
				}
				if(data.object.certif == 1) {
					options.push("2");
				}
				if(data.object.rib == 1) {
					options.push("3");
				}
				if(data.object.identity == 1) {
					options.push("4");
				}
				$('#docs_int').dropdown("set exactly", options);
				$('#intm_btn').html("Confirmer");
				$('#intm_btn').attr("onClick", "DoleticUIModule.updateIntMembership("+id+", "+userId+"); return false;");
				$('#intm_form').transition('pulse');
			} else {
				// use default service service error handler
				DoleticServicesInterface.handleServiceError(data);
			}
		});
	}

	this.updateUser = function(id, user_id) {
		// ADD OTHER TESTS
		if(DoleticUIModule.checkNewUserForm()) {
			// Insert user data in db SELECT ?
			UserDataServicesInterface.update(id, user_id,
				$('#gender option:selected').text(),
				$('#firstname').val(), 
				$('#lastname').val(),
				$('#birthdate').val(),
				$('#tel').val(),
				$('#mail').val(),
				$('#address').val(),
				$('#city').val(),
				$('#postalcode').val(),
				$('#country option:selected').text(),
				$('#schoolyear option:selected').text(),
				$('#dept option:selected').text(),
				$('#position option:selected').text(),
				$('#ag option:selected').text(),
				DoleticUIModule.editUserHandler);
		}
	}

	this.updateTeam = function(id) {
		// ADD OTHER TESTS
		if(DoleticUIModule.checkNewTeamForm()) {
			// Update team data in DB
			TeamServicesInterface.update(id,
				$('#tname').val(),
				$('#leader').val(),
				$('#division option:selected').text(),
				DoleticUIModule.editTeamHandler
			);
		}
	}

	this.updateAdmMembership = function(id, userId) {
		// ADD OTHER TESTS
		if(DoleticUIModule.checkNewAdmMembershipForm()) {
		   	// retreive missing information
			var handler = function() {
				DoleticUIModule.fillUserDetails(userId);
				DoleticUIModule.clearNewAdmMembershipForm(userId);
			};
			var options = document.getElementById("docs_adm").options;
			AdmMembershipServicesInterface.update(id,
				userId, // Retenir l'utilisateur concerné
				$('#sdatea').val(),
				$('#edate').val(),
				Boolean(options[0].selected),
				Boolean(options[1].selected),
				Boolean(options[2].selected),
				handler);
		}
	}

	this.updateIntMembership = function(id, userId) {
		// ADD OTHER TESTS
		if(DoleticUIModule.checkNewIntMembershipForm()) {
		   	// retreive missing information
			var handler = function() {
				DoleticUIModule.fillUserDetails(userId);
				DoleticUIModule.clearNewIntMembershipForm(userId);
			};
			var options = document.getElementById("docs_int").options;
			IntMembershipServicesInterface.update(id,
				userId, // Retenir l'utilisateur concerné
				$('#sdatei').val(),
				Boolean(options[0].selected),
				Boolean(options[1].selected),
				Boolean(options[2].selected),
				Boolean(options[3].selected),
				Boolean(options[4].selected),
				handler);
		}
	}

	this.deleteUser = function(id, user_id) {
		// Création fonction de suppression (nécessaire pour passer une référence et nom un retour)
		var del = function() {
			UserDataServicesInterface.delete(id, user_id, function() {
				UserServicesInterface.delete(id, function(id) {
					DoleticMasterInterface.hideConfirmModal();
					DoleticMasterInterface.showSuccess("Suppression réussie !", "L'utilisateur a été supprimé avec succès !");
					DoleticUIModule.fillUsersList();
					
				});
			});
		};
		// Confirmation
		DoleticMasterInterface.showConfirmModal("Confirmer la suppression", "\<i class=\"remove user icon\"\>\<\/i\>", 
			"Etes-vous sûr de vouloir supprimer l'utilisateur ? Cette opération est irréversible.", del, DoleticMasterInterface.hideConfirmModal);
	}

	this.deleteTeam = function(id) {
		// Création fonction de suppression (nécessaire pour passer une référence et nom un retour)
		var del = function() {
			TeamServicesInterface.delete(id, function() {
				DoleticMasterInterface.hideConfirmModal();
				DoleticMasterInterface.showSuccess("Suppression réussie !", "L'équipe a été supprimée avec succès !");
				DoleticUIModule.fillTeamsList();
			});
		};
		// Confirmation
		DoleticMasterInterface.showConfirmModal("Confirmer la suppression", "\<i class=\"remove icon\"\>\<\/i\>", 
			"Etes-vous sûr de vouloir supprimer l'équipe ? Cette opération est irréversible.", del, DoleticMasterInterface.hideConfirmModal);	
	}

	this.deleteAdmMembership = function(id, userId) {
		var del = function() {
			AdmMembershipServicesInterface.delete(id, function() {
				DoleticMasterInterface.hideConfirmModal();
				DoleticMasterInterface.showSuccess("Suppression réussie !", "L'adhésion a été supprimée avec succès !");
				DoleticUIModule.fillUserDetails(userId);
			});
		};
		// Confirmation
		DoleticMasterInterface.showConfirmModal("Confirmer la suppression", "\<i class=\"remove icon\"\>\<\/i\>", 
			"Etes-vous sûr de vouloir supprimer l'adhésion ? Cette opération est irréversible.", del, DoleticMasterInterface.hideConfirmModal);
	}

	this.deleteIntMembership = function(id, userId) {
		var del = function() {
			IntMembershipServicesInterface.delete(id, function() {
				DoleticMasterInterface.hideConfirmModal();
				DoleticMasterInterface.showSuccess("Suppression réussie !", "L'adhésion a été supprimée avec succès !");
				DoleticUIModule.fillUserDetails(userId);
			});
		};
		// Confirmation
		DoleticMasterInterface.showConfirmModal("Confirmer la suppression", "\<i class=\"remove icon\"\>\<\/i\>", 
			"Etes-vous sûr de vouloir supprimer l'adhésion ? Cette opération est irréversible.", del, DoleticMasterInterface.hideConfirmModal);
	}

	this.deleteAGR = function(ag) {
		console.log(String(ag));
		var del = function() {
			UserDataServicesInterface.deleteAg(String(ag), function() {
				DoleticMasterInterface.hideConfirmModal();
				DoleticMasterInterface.showSuccess("Suppression réussie !", "L'AGR a été supprimée avec succès !");
				DoleticUIModule.fillAGSelector();
			});
		};
		// Confirmation
		DoleticMasterInterface.showConfirmModal("Confirmer la suppression", "\<i class=\"remove icon\"\>\<\/i\>", 
			"Etes-vous sûr de vouloir supprimer l'AGR ? Cette opération est irréversible.", del, DoleticMasterInterface.hideConfirmModal);
	}

	this.deleteTeamMember = function(id, memberId) {
		var handler = function() {
			DoleticUIModule.updateTeamModal(id);
		};

		TeamServicesInterface.deleteMember(id, memberId, handler);
	}

	this.updateTeamModal = function(id) {
		$("#add_tmember_select"+id).dropdown('restore defaults');
		TeamServicesInterface.getTeamMembers(id, function(data) {
			window.team_list[id].members = data.object;
			html = "";
			for(var i=0; i<data.object.length; i++) {
		  		html += "		<tr><td> \
							  <i class=\"large user middle aligned icon\"></i></td><td>\
							  <div class=\"content\">\
							    <div class=\"header\"><strong>"+ window.user_list[data.object[i]].firstname + " " 
							    					   + window.user_list[data.object[i]].lastname;
				html +=	    "</strong></div><div class=\"description\">"+window.user_list[data.object[i]].last_pos.label+"</div>\
							  </div>";
				if(data.object[i] != window.team_list[id].leader_id) {
					html += "<td><button class=\"ui small icon button\"onClick=\"DoleticUIModule.deleteTeamMember("+id+", "+data.object[i]+"); return false;\"> \
		  									<i class=\"remove icon\"></i>Retirer \
								</button></td>";
				} else {
					html += "<td> (Chef d'équipe) </td>";
				}
				html += "</td></tr>";
				$("#members_" + id).html(html);
		  	}
		});
	}

	this.checkNewUserForm = function() {
		$('#user_form .field').removeClass("error");
		var valid = true;
		var errorString = "";
		if( !DoleticMasterInterface.checkName($('#firstname').val()) ) {
			$('#firstname_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkName($('#lastname').val()) ) {
			$('#lastname_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkDate($('#birthdate').val()) ) {
			$('#birthdate_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkTel($('#tel').val()) ) {
			$('#tel_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkMail($('#mail').val()) ) {
			$('#mail_field').addClass("error");
			valid = false;
		}
		if($('#address').val() == "") {
			$('#address_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkName($('#city').val()) ) {
			$('#city_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkPostalCode($('#postalcode').val()) ) {
			$('#postalcode_field').addClass("error");
			valid = false;
		}
		if( $('#gender option:selected').text() == "" ) {
			$('#gender_field').addClass("error");
			valid = false;
		}
		if( $('#country option:selected').text() == "" ) {
			$('#country_field').addClass("error");
			valid = false;
		}
		if( $('#schoolyear option:selected').text() == "" ) {
			$('#schoolyear_field').addClass("error");
			valid = false;
		}
		if( $('#dept option:selected').text() == "" ) {
			$('#dept_field').addClass("error");
			valid = false;
		}
		if( $('#position option:selected').text() == "" ) {
			$('#position_field').addClass("error");
			valid = false;
		}
		if(!valid) {
			$('#user_form').transition('shake');
			DoleticMasterInterface.showError("Erreur !", "Merci de corriger les champs affichés en rouge.");
		}
		return valid;
	}

	this.checkNewTeamForm = function() {
		$('#team_form .field').removeClass("error");
		var valid = true;
		if( $('#tname').val() == "" ) {
			$('#tname_field').addClass("error");
			valid = false;
		}
		if( $('#leader option:selected').text() == "" ) {
			$('#leader_field').addClass("error");
			valid = false;
		}
		if( $('#division option:selected').text() == "" ) {
			$('#division_field').addClass("error");
			valid = false;
		}
		if(!valid) {
			$('#team_form').transition('shake');
			DoleticMasterInterface.showError("Erreur !", "Merci de corriger les champs affichés en rouge.");
		}
		return valid;
	}

	this.checkNewAdmMembershipForm = function() {
		$('#admm_form .field').removeClass("error");
		var valid = true;
		if( !DoleticMasterInterface.checkDate($('#sdatea').val()) ) {
			$('#sdatea_field').addClass("error");
			valid = false;
		}
		if( !DoleticMasterInterface.checkDate($('#edate').val()) ) {
			$('#edate_field').addClass("error");
			valid = false;
		}
		if(!valid) {
			$('#admm_form').transition('shake');
			DoleticMasterInterface.showError("Erreur !", "Merci de corriger les champs affichés en rouge.");
		}
		return valid;
	}

	this.checkNewIntMembershipForm = function() {
		$('#intm_form .field').removeClass("error");
		var valid = true;
		if( !DoleticMasterInterface.checkDate($('#sdatei').val()) ) {
			$('#sdatei_field').addClass("error");
			valid = false;
		}
		if(!valid) {
			$('#intm_form').transition('shake');
			DoleticMasterInterface.showError("Erreur !", "Merci de corriger les champs affichés en rouge.");
		}
		return valid;
	}

	this.checkNewAGRForm = function() {
		if( !DoleticMasterInterface.checkDate($('#agr').val()) ) {
			$('#agr').addClass("error");
			return false;
		}
		return true;
	}

	this.resetUserFilters = function() {
		$('#user_filters .dropdown').dropdown("restore defaults");
		$('#keyword_filter').val('');
		DoleticUIModule.fillUsersList();
	}

	this.resetTeamFilters = function() {
		$('#team_filters .dropdown').dropdown("restore defaults");
		$('#keyword_filter_t').val('');
		DoleticUIModule.fillTeamsList();
	}

	this.sortUserList = function(attribute, asc) {
		// Set global variable properties
		window.sortUser.attribute = attribute;
		window.sortUser.asc = Boolean(asc);
		// Reverse button
		if(asc) {
			$("#usort_"+attribute).html("<i class=\"caret down icon\"></i>");
			$("#usort_"+attribute).attr("onClick", "DoleticUIModule.sortUserList('"+attribute+"', false); return false;");
		} else {
			$("#usort_"+attribute).html("<i class=\"caret up icon\"></i>");
			$("#usort_"+attribute).attr("onClick", "DoleticUIModule.sortUserList('"+attribute+"', true); return false;");
		}
		DoleticUIModule.fillUsersList();
	}

	this.sortTeamList = function(attribute, asc) {
		// Set global variable properties
		window.sortTeam.attribute = attribute;
		window.sortTeam.asc = Boolean(asc);
		// Reverse button
		if(asc) {
			$("#tsort_"+attribute).html("<i class=\"caret down icon\"></i>");
			$("#tsort_"+attribute).attr("onClick", "DoleticUIModule.sortTeamList('"+attribute+"', false); return false;");
		} else {
			$("#tsort_"+attribute).html("<i class=\"caret up icon\"></i>");
			$("#tsort_"+attribute).attr("onClick", "DoleticUIModule.sortTeamList('"+attribute+"', true); return false;");
		}
		DoleticUIModule.fillTeamsList();
	}

}