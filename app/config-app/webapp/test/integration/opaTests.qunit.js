sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gallant/configapp/test/integration/FirstJourney',
		'gallant/configapp/test/integration/pages/configurationList',
		'gallant/configapp/test/integration/pages/configurationObjectPage'
    ],
    function(JourneyRunner, opaJourney, configurationList, configurationObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gallant/configapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheconfigurationList: configurationList,
					onTheconfigurationObjectPage: configurationObjectPage
                }
            },
            opaJourney.run
        );
    }
);