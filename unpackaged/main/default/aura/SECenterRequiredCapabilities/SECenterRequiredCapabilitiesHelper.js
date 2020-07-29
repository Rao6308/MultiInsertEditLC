({
    setupRCData: function(component){
        var action = component.get("c.getAllRC");
        var oppid = component.get("v.recordId");
        //Defining the callback function
        action.setParams({opp_Id : oppid});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.RCRecord", response.getReturnValue());
                component.set("v.UnfilteredData",response.getReturnValue());           
            }
            else if(state === "INCOMPLETE"){                
            }
                else if(state === "ERROR"){
                    var errors = response.getError();
                    if(errors){
                        if(errors[0] && errors[0].message){
                            console.log("Error message: " + errors[0].message);
                        }
                    }else{
                        console.log("Unknown error");
                    }
                }
        });
        //Adding the request to queue
        $A.enqueueAction(action);    
    },
    Searchfunction:function(cmp) {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                console.log(txtValue);
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }       
        }
        
    },
    updateRCData: function(component){
        var action = component.get("c.UpdateRCdata");
        //Defining the callback function
        this.showSpinner(component);
        action.setParams({ listRCs : component.get("v.RCRecord") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.RCRecord", response.getReturnValue());
                this.hideSpinner(component);
                this.showToast(component,'success','Record Updated','View updated');               
            }
            else if(state === "INCOMPLETE"){
                
            }
                else if(state === "ERROR"){
                    var errors = response.getError();
                    if(errors){
                        if(errors[0] && errors[0].message){
                            console.log("Error message: " + errors[0].message);
                        }
                    }else{
                        console.log("Unknown error");
                    }
                }
        });
        //Adding the request to queue
        $A.enqueueAction(action);    
    },
    addRCRecord: function(component, event) {
        component.set("v.showInsertTable", true);
        var RCList = component.get("v.RCInsertRecord");
        RCList.push({
            'sobjectType': 'Required_Capability__c',
            'Additional_Context__c': '',
            'Summary__c': '',
            'Product_Capability__c': '--None--'
        });
        component.set("v.RCInsertRecord", RCList);
        this.showinsertTable(component);
    },
    removeRCRecord: function(component, event) {
        var rcRecordposition = event.target.name;
        var RCList = component.get("v.RCInsertRecord");
        RCList.pop();
        component.set("v.RCInsertRecord", RCList);
        this.showinsertTable(component);
    },
    insertRCRecord: function(component){
        var action = component.get("c.InsertRCdata");
        //Defining the callback function
        this.showSpinner(component);     
        action.setParams({ RCRecord : component.get("v.RCInsertRecord") ,opp_Id : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(state === "SUCCESS"){
                this.hideinsertTable(component);
                this.hideSpinner(component);
                this.showToast(component,'success','Record Inserted','Inserted record');
                this.setupRCData(component);
                component.set("v.RCInsertRecord",[]);
            }
            else if(state === "INCOMPLETE"){
                
            }
                else if(state === "ERROR"){
                    var errors = response.getError();
                    if(errors){
                        if(errors[0] && errors[0].message){
                            console.log("Error message: " + errors[0].message);
                        }
                    }else{
                        console.log("Unknown error");
                    }
                }
        });
        //Adding the request to queue
        $A.enqueueAction(action);    
    },
    deleteData: function(component,event){
        var rcRecordposition = event.target.name;
        var oppId = component.get("v.recordId");
        var existingRecords = component.get("v.RCRecord");
        var singleVarrecord = existingRecords[rcRecordposition] ;
        var action = component.get("c.deleteRCdata");
        //Defining the callback function
        action.setParams({ rcRec : singleVarrecord,opp_Id:oppId });
        this.showSpinner(component);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.RCRecord", response.getReturnValue());
                this.hideSpinner(component);
                this.showToast(component,'success','Record Deleted','Required Capability '+singleVarrecord.Name+ ' deleted.')
            }
            else if(state === "INCOMPLETE"){
                
            }
                else if(state === "ERROR"){
                    var errors = response.getError();
                    if(errors){
                        if(errors[0] && errors[0].message){
                            console.log("Error message: " + errors[0].message);
                        }
                    }else{
                        console.log("Unknown error");
                    }
                }
        });
        //Adding the request to queue
        $A.enqueueAction(action);  
    },
    setupPicklistval: function(component){
        this.getPCoptions(component);  
    },
    getPCoptions: function(component){
        var action = component.get("c.getProductCapability");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var PCVal = [];
                for(var key in result){
                    PCVal.push({key: key, value: result[key]});
                }
                component.set("v.PCMap", PCVal);
            }
        });
        $A.enqueueAction(action);
    },
    filter:function(component, event) {
        var tabledata = component.get("v.RCRecord");
        var unfilteredData = component.get("v.UnfilteredData");
        var filtervalue = component.get("v.filter");
        if(tabledata!=undefined || tabledata.length>0){  
            // filter method create a new array tha pass the test (provided as function)  
            var filtereddata = unfilteredData.filter(word => (!filtervalue) || word.Name.toLowerCase().indexOf(filtervalue.toLowerCase()) > -1);  
        }  
        component.set("v.RCRecord", filtereddata);  
        if(filtervalue ==''){  
            component.set("v.RCRecord",unfilteredData);  
        }  
    },
    validateRCList: function(component, event,RCList) {
        //Validate all account records
		var errormsg = [];
        var errorstring = '';
        var isValid = true;
        for (var i = 0; i < RCList.length; i++) {
            if (RCList[i].Product_Capability__c == '' || RCList[i].Product_Capability__c == '--None--') {
                isValid = false;
                errormsg .push('Product capability cannot be blank on row number ' + (i + 1));
            }
            if (RCList[i].Summary__c == '') {
                isValid = false;
                errormsg.push('Summary cannot be blank on row number ' + (i + 1));
            }
        }
        for (var i = 0; i < errormsg.length; i++) {
            errorstring = errorstring + errormsg[i]+"\n";
        }
        this.showToast(component,'Error','Error', errorstring);

        return isValid;
    },
    showToast : function(component,type,title,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type" : type,
            "message": message
        });
        toastEvent.fire();
    },
    showSpinner:function(cmp){    
        cmp.set("v.IsSpinner",true);   
    },  
    hideSpinner:function(cmp){   
        cmp.set("v.IsSpinner",false); 
    } ,
    showinsertTable:function(cmp){ 
        cmp.set("v.showInsertTable", true);
    } ,
    hideinsertTable:function(cmp){   
        cmp.set("v.showInsertTable", false);
    } ,
})