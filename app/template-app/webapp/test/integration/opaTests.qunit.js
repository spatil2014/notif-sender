sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gallant/templateapp/test/integration/FirstJourney',
		'gallant/templateapp/test/integration/pages/templatesList',
		'gallant/templateapp/test/integration/pages/templatesObjectPage'
    ],
    function(JourneyRunner, opaJourney, templatesList, templatesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gallant/templateapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThetemplatesList: templatesList,
					onThetemplatesObjectPage: templatesObjectPage
                }
            },
            opaJourney.run
        );
    }
);