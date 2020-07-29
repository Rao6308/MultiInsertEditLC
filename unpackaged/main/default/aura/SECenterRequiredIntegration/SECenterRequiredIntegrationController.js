({
	doInit : function(component, event, helper) {
        helper.setupRIData(component);
    },
    Searchfunction: function(component, event, helper) {
        helper.Searchfunction(component);
    },
     addRIRecord : function(cmp, event, helper) {
        helper.addRIRecord(cmp, event);
    },
    handleSave: function(component, event, helper) {
        helper.updateRIData(component);
    },
    handleCancel:function(component, event, helper) {
        helper.setupRIData(component);
    },
    handleDelete:function(component, event, helper) {
        helper.deleteData(component,event);
    },
})