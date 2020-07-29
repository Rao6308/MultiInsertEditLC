({
    doInit : function(component, event, helper) {
        helper.setupRCData(component);
        helper.setupPicklistval(component);
    },
    Searchfunction: function(component, event, helper) {
        helper.Searchfunction(component);
    },
    
    handleSave: function(component, event, helper) {
        if(helper.validateRCList(component, event,component.get("v.RCRecord"))){       
            helper.updateRCData(component);
        }
    },
    handleInsert: function(component, event, helper) {
        if(helper.validateRCList(component, event,component.get("v.RCInsertRecord"))){       
            helper.insertRCRecord(component);
        }
    },
    addRow: function(component, event, helper) {
        helper.addRCRecord(component, event);        
    },
    removeRow: function(component, event, helper) {
        helper.removeRCRecord(component, event);        
    },
    handleCancel:function(component, event, helper) {
        helper.setupRCData(component);
    },
    handleDelete:function(component, event, helper) {
        helper.deleteData(component,event);
    },
    filter:function(component, event, helper) {
        helper.filter(component,event);
    },
})