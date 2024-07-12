sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gallant/logreport/test/integration/FirstJourney',
		'gallant/logreport/test/integration/pages/logList',
		'gallant/logreport/test/integration/pages/logObjectPage'
    ],
    function(JourneyRunner, opaJourney, logList, logObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gallant/logreport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThelogList: logList,
					onThelogObjectPage: logObjectPage
                }
            },
            opaJourney.run
        );
    }
);