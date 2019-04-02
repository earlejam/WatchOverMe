/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var main = new UI.Card({
  title: 'Watch Alert',
  icon: 'images/menu_icon.png',
  subtitle: 'Need Help?',
  body: 'Press select to start timer.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }, {
        title: 'Third Item',
      }, {
        title: 'Fourth Item',
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Dynamic\nWindow',
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
      .multiplyScalar(0.5);
  textfield.position(textfieldPos);
  wind.add(radial);
  wind.add(textfield);
  wind.show();
});

var time = 0;

main.on('click', 'down', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-18-bold',
    text: 'Time of Countdown:',
    textAlign: 'center'
  });
   var textfieldOne = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-18-bold',
    text: ':' + time,
    textAlign: 'center'
  });
  var windSize = wind.size();
  var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.2);
  textfield.position(textfieldPos);
   var textfieldPosOne = textfieldOne.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.8);
  textfieldOne.position(textfieldPosOne);
  wind.add(textfield);
  wind.add(textfieldOne);
  wind.show();
  if (time < 10){
       textfieldOne.text(':' + '0' + (time));
    }
  
  wind.on('click', 'up', function(e) { 
     ++time;
    
      if (time < 0) {
        time = 59;
      }
      if (time > 59) {
        time = 0;
      }
      if (time < 10){
         textfieldOne.text(':' + '0' + (time));
      }
      else {
        textfieldOne.text(':' + (time));
      } 
    
    
  });
  
  wind.on('click', 'down', function(e) { 
    --time;
  
      if (time < 0) {
        time = 59;
      }
      if (time > 59) {
        time = 0;
      }
      if (time < 10 ){
         textfieldOne.text(':' + '0' + (time));
      }
      else {
        textfieldOne.text(':' + (time));
      }
    
    
  });
  
});
