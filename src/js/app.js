/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');
var ajax = require('ajax');
var Clay = require('clay');
var clayConfig = require('config');
var clay = new Clay(clayConfig);

// override defaults - no need for InboxReceivedHandler vs. just keeping it in JS

var main = new UI.Card({
   title: 'WATCH ALERT',
   subtitle: '\n' + 'Worried?',
   body: 'Press select to start timer.' + '\n' + 'Press up for help.',
   subtitleColor: 'indigo', // Named colors
   bodyColor: '#9a0036 ' // Hex colors
});

main.show();

//Click up is where the how to guide and other information will go.
main.on('click', 'up', function(e) {
	var wind2 = new UI.Window({
		backgroundColor: 'white'
	});
	
	var textfieldAbout = new UI.Text({
		size: new Vector2(140, 60),
		font: 'GOTHIC_24',
		text: 'Long press the select button in an emergency. It acts' +
		' as a panic button, immediately sending a message to your ' +
		'emergency contact(s) with an explanation and location data. ' +
		'Press the bottom button to set the length of the timer. This ' +
		'function behaves as an emergency backup system for times you' + 
		' anticipate your safety may be put in jeopardy. Press the select ' +
		'button to start the timer for the emergency backup system. If you ' + 
		'arrive safely at your destination, simply press the select button ' +
		'again before the timer runs out. If you fail to do so, your emergency ' +
		'contact(s) will receive a message as described above.'
	})
});

main.on('click', 'select', function(e) {
    var wind = new UI.Window({
        backgroundColor: 'black'
    });

    var radial = new UI.Radial({
        size: new Vector2(140, 140),
        angle: 0,
        angle2: 360,
        radius: 20,
        borderColor: 'celeste',
        borderWidth: 1,
    });

    var textfield = new UI.Text({
        size: new Vector2(140, 60),
        font: 'ROBOTO_BOLD_SUBSET_49',
        text: '',
        textAlign: 'center'
    });

	var textfieldNumUnits = new UI.Text({
		size: new Vector2(140, 60),
		font: 'ROBOTO_CONDENSED_21',
		text: 'MIN',
		textAlign: 'center'
	});


    var windSize = wind.size();
    // Center the radial in the window
    var radialPos = radial.position()
        .addSelf(windSize)
        .subSelf(radial.size())
        .multiplyScalar(0.5);
    radial.position(radialPos);
    // Center the textfield in the window
    var textfieldPos = textfield.position()
        .addSelf(windSize)
        .subSelf(textfield.size())
        .multiplyScalar(0.3);
    textfield.position(textfieldPos);
	var textfieldNumUnitsPos = textfieldNumUnits.position()
		.addSelf(windSize)
		.subSelf(textfield.size())
		.multiplyScalar(0.7);
	textfieldNumUnits.position(textfieldNumUnitsPos);
    wind.add(radial);
    wind.add(textfield);
	wind.add(textfieldNumUnits);
    wind.show();
    var timerRunning = true;
    wind.on('click', 'select', function(e) {
        timerRunning = !timerRunning;
    });

    //Have a timer and a variable that check to see if the timer should still be counting down
    setInterval(timerLoopCheck, 1000);

    function timerLoopCheck() {
        //Create a timer with an interval equal to about the refresh rate of the pebble's screen
        if (timerRunning) {
            timerCountDown();
        }
    }

    //Define these variables before the timer count down since we need them inside of it
    //The number of seconds we want the timer to be.
    var timerStartMinutes = 2;
    textfield.text(timerStartMinutes);
    //Divide 360-angle of a full circle-by the number of seconds of our timer
    //This gives us the angle we must decrease each second in order to reach an empty circle at 0 seconds
	
	// want angle to decrease by 6 degrees per second, 360 degrees per minute
	var angleDecreaseAmt = 6;
    //We want to start the angle at a full value.
    var angleOfRadial = 360;
	// keeping track of how many minutes have passed
	var minutesPassed = 0;
	
    function timerCountDown() {
	
        if (angleOfRadial <= 0) {
			// count the rotation as 1 minute passed
			minutesPassed += 1;
			if (timerStartMinutes === minutesPassed) {
            //If the timer reaches 0, then we need to peform the correct actions.
            timerRunning = false;
            timerEnd();
			}
			else {
				angleOfRadial = 360;
			}
        } else {
            angleOfRadial -= angleDecreaseAmt;
        }

        //We want to decrease angle 2 since we want the timer to appear to be going down.
        radial.angle2(angleOfRadial);
        //If the angle can be divided by the timer to angle value, that means its a second with no variables
        //This is when we want to update the timer to dispaly the new seconds remaining.
        if (angleOfRadial % angleDecreaseAmt === 0) {
			// if we're below the one minute mark
			if (timerStartMinutes - minutesPassed <= 1) {
				textfieldNumUnits.text('SEC');
				textfield.text(angleOfRadial / angleDecreaseAmt);
				
				// cue vibrations
            	if (angleOfRadial / angleDecreaseAmt <= 10 && angleOfRadial / angleDecreaseAmt > 5) {
                	Vibe.vibrate('long');
            	} else if (angleOfRadial / angleDecreaseAmt <= 5) {
                	Vibe.vibrate('double');
            	}
			}
			else {
				// display number of minutes remaining
            	textfield.text(timerStartMinutes - minutesPassed);
			}

        }
    }
    //Function that handles what we do if the timer reaches 0.
    function timerEnd() {
        //We initialize the message we are going to eventually want to send out to the users contacts. 
        var messageToSendOut;
        //If we are able to successfully obtain the gps postion from the user
        function success(pos) {
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;
            console.log('lat= ' + lat + ' lon= ' + lon);
            var googleMapsURL = 'https://www.google.com/maps/preview/@' + lat + ',' + lon + ',20z';
            console.log(googleMapsURL);
            messageToSendOut = "We recieved an alarm from the a user who has you listed you as an emergency contact." +
                "This was their last know location: " + googleMapsURL;
            ajaxCall(messageToSendOut);

        }
        //If we get an error then they must have location services turned off.
        function error(err) {
            console.log('location error (' + err.code + '): ' + err.message);
        }

        // Choose options about the data returned
        var options = {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
        };

        function ajaxCall(bodyMessage) {
            var data = {};
            console.log(messageToSendOut);
            data.To = "4148520131";
            data.From = "4142550845";
            data.Body = bodyMessage;

            ajax({
                    url: 'https://ACd99960d3dfc18229010441bc962cedd3:bf3e76e626b5938e791491cde2972945@api.twilio.com/2010-04-01/Accounts/ACd99960d3dfc18229010441bc962cedd3/Messages.json',
                    method: 'POST',
                    type: 'JSON',
                    data: data
                },
                function(data) {
                    console.log("did we get any dater?");
                    console.log(data);
                },
                function(error) {
                    console.log(error);
                    //If we errored here then for some reason the number wasn't able to go through
                    //This could eventually be reduced to make it so that when the user first 
                }

            );
        }

        // Request current position
        navigator.geolocation.getCurrentPosition(success, error, options);

    }

});




main.on('click', 'down', function(e) {
    var card = new UI.Card();
    card.title('A Card');
    card.subtitle('Is a Window');
    card.body('The simplest window type in Pebble.js.');
    card.show();
});