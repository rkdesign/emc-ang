'use strict';

var mailService = {
		
		weeklyWorkoutMailService : function(external_Site_url, url, adminID, userEmail, userName){			

			var form = document.createElement('FORM');		
			
				this.setFormParamaters(form, external_Site_url);
				
				this.createInputHiddenFields(url,"SITE_URL",form);
				this.createInputHiddenFields(adminID,"adminID",form);
				this.createInputHiddenFields(userEmail,"userEmail",form);
				this.createInputHiddenFields(userName,"userName",form);
				
				this.submitForm(form);
		
		},
		
		recentWorkoutMailService : function(external_Site_url, url, adminID, userEmail, userName){
			var form = document.createElement('FORM');		
			
				this.setFormParamaters(form, external_Site_url);
					
				this.createInputHiddenFields(url,"SITE_URL",form);
				this.createInputHiddenFields(adminID,"adminID",form);
				this.createInputHiddenFields(userEmail,"userEmail",form);
				this.createInputHiddenFields(userName,"userName",form);
					
				this.submitForm(form);
		},
		
		RegistrationSucessMailService : function(external_Site_url, username, userEmail, password){
			var form = document.createElement('FORM');		
			
			this.setFormParamaters(form, external_Site_url);
			
			this.createInputHiddenFields(userEmail, "userEmail",form);
			this.createInputHiddenFields(userName,"userName",form);
			this.createInputHiddenFields(password,"password",form);
			
			this.createInputHiddenFields(url,"SITE_URL",form);
			
			this.submitForm(form);
		},
		
		NFCTagCreationMailService :  function(external_Site_url, userEmail, userName, NFCTag, status){
			var form = document.createElement('FORM');		
			
			this.setFormParamaters(form, external_Site_url);
			
			this.createInputHiddenFields(userEmail, "userEmail",form);
			this.createInputHiddenFields(userName,"userName",form);
			this.createInputHiddenFields(NFCTag,"NFCTag",form);
			this.createInputHiddenFields(status,"status",form);			
			
			this.submitForm(form);
		},
		
		setFormParamaters : function(form, url){
			form.method='POST';
			form.action = url;
			form.target = 'newWindow';
		},
		
		createInputHiddenFields : function(field, fieldName,form){
			var inputHidden = document.createElement("INPUT");
				inputHidden.id=fieldName;
				inputHidden.type="hidden";
				inputHidden.name=fieldName;
				inputHidden.value=field;					
				form.appendChild(inputHidden);
		},
		
		submitForm : function(form){			
			document.body.appendChild(form);			
			window.open("","newWindow","location=yes,width=400,height=400");
			form.submit();
		}
}