sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'antragsmanagement/antrag/manage/test/integration/FirstJourney',
		'antragsmanagement/antrag/manage/test/integration/pages/RequestsList',
		'antragsmanagement/antrag/manage/test/integration/pages/RequestsObjectPage',
		'antragsmanagement/antrag/manage/test/integration/pages/OffersObjectPage'
    ],
    function(JourneyRunner, opaJourney, RequestsList, RequestsObjectPage, OffersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('antragsmanagement/antrag/manage') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheRequestsList: RequestsList,
					onTheRequestsObjectPage: RequestsObjectPage,
					onTheOffersObjectPage: OffersObjectPage
                }
            },
            opaJourney.run
        );
    }
);