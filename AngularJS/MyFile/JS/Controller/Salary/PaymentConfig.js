app.service('PaymentRequestDetailService', function() {
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