({
    setupRIData: function(component){
        var action = component.get("c.getAllRI");
        var oppid = component.get("v.recordId");
        //Defining the callback function
        action.setParams({opp_Id : oppid});
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('RI state'+ state);
            if(state === "SUCCESS"){
                component.set("v.RIRecord", response.getReturnValue());
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
    addRIRecord : function(cmp, event) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Required_Capability__c",
            "navigationLocation" : "LOOKUP",
            "panelOnDestroyCallback": function(event) {
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": "/lightning/r/Opportunity/"+cmp.get("v.recordId")+"/view"
                });
                urlEvent.fire();
            },            
            "defaultFieldValues": {
                'Opportunity__c' : cmp.get("v.recordId")
            }        
        });
        createRecordEvent.fire();
    },
    updateRIData: function(component){
        alert(component.get("v.RIRecord"));
        alert(component.get("v.selectRecordId1"));
        
        var action = component.get("c.UpdateRCdata");
        //Defining the callback function
        this.showSpinner(component);
        action.setParams({ listRCs : component.get("v.RIRecord") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.RIRecord", response.getReturnValue());
                this.hideSpinner(component);
                this.showToast(component,'Record Updated','View updated')
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
        // $A.enqueueAction(action);    
    },
    deleteData: function(component,event){
        var rcRecordposition = event.target.name;
        var oppId = component.get("v.recordId");
        var existingRecords = component.get("v.RIRecord");
        var singleVarrecord = existingRecords[rcRecordposition] ;
        var action = component.get("c.deleteRCdata");
        //Defining the callback function
        action.setParams({ rcRec : singleVarrecord,opp_Id:oppId });
        this.showSpinner(component);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.RIRecord", response.getReturnValue());
                this.hideSpinner(component);
                this.showToast(component,'Record Deleted','Required Capability '+singleVarrecord.Name+ ' deleted.')
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
        // $A.enqueueAction(action);  
    },
    showToast : function(component,title,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type" : 'info',
            "message": message
        });
        toastEvent.fire();
    },
    showSpinner:function(cmp){    
        cmp.set("v.IsSpinner",true);   
    },  
    hideSpinner:function(cmp){   
        cmp.set("v.IsSpinner",false); 
    }   
})