
app.service('doneRequestDetailService', function() {
    var request;
    return {
        setRequest: function(value) {
            request = value;
        },
        getRequest: function() {
            return request;
        }
    }
});
app.service('progressRequestDetailService', function() {
    var request;
    return {
        setRequest: function(value) {
            request = value;
        },
        getRequest: function() {
            return request;
        }
    }
});
