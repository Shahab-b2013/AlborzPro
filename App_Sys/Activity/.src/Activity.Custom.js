// JScript File(Amnpardaz Software Co. Copyright 2020 - All Right Reserved)
// Release Ferdos.WebAppDesk 2.0.0.0

//Saba Compatibility
function sabaCalPricePriceRequest() {

    var data = new FormData();

    var __objKeys = [];

    var activiyParams = new Array();

    activiyParams = $activityParams(['Product', 'LicenceQuntity', 'LicenceType', 'LicenceDuration', 'ServiceResponder', 'TravelExpense',
        'ServiceOption1', 'ServiceOption2', 'ServiceOption3', 'ServiceOption4', 'ServiceOption5', 'ServiceOption6', 'ServiceOption7', 'ServiceOption8', 'ServiceOption9']);

    data.append('activiyParams', JSON.stringify(activiyParams));

    data.append('objectIDs', JSON.stringify(__objKeys));

    data.append('id', 1025157);
   
    var $aExecutor = new iaExecutor(data);

    $aExecutor.submit();
   
    $sfi('CostOfService', parseInt($aExecutor.getResult()));

    $sfi('CalculatedPrice', parseInt(parseInt($gfi('CostOfService').replace(/,/g, '')) + parseInt($gfi('ProductPrice').replace(/,/g, ''))));

    if ($fi('CustomerHasOwner').is(":checked")) {

        $sfi('FinalizedPrice', parseInt(parseFloat($gfi('CalculatedPrice').replace(/,/g, '')) * parseFloat($gfi('PriceAddedFactor'))))
    }
    else {
        $sfi('FinalizedPrice', $gfi('CalculatedPrice'))
    }
}
