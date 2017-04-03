// While it may not seem imperative for smaller programs, 
// you should get in the habit of wrapping your js code in either a 

// $(document).ready(function(){
//  // code goes here
// })

// or an IIFE (immediately invoked function expression)

// ;(function(){
//  // code goes here
// })()

// One of the most important reasons for that is security - because right now your global variables (ie `database`)
// can be tampered with through the console by a malicious visitor to your train schedule app 😮

 // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCL9iuhhkFh1vBtaxn4OXC4uJ1rDXE_0AY",
      authDomain: "train-7ecd0.firebaseapp.com",
      databaseURL: "https://train-7ecd0.firebaseio.com",
      storageBucket: "train-7ecd0.appspot.com",
      messagingSenderId: "814840275605"
    };

    firebase.initializeApp(config);

   var database = firebase.database();

    $("#submit-button").on("click", function(event) {
      event.preventDefault();
      var name = $("#add-train").val().trim();
      var destination = $("#add-destination").val().trim();
      var startDate = moment($("#add-date").val().trim(), "HH:mm").format("");
      var frequency = $("#add-frequency").val().trim();
      
      database.ref().push({
        name: name,
        destination: destination,
        startDate: startDate,
        frequency: frequency
        
      });

      $("#add-train").val("");
      $("#add-destination").val("");
      $("#add-date").val("");
      $("#add-frequency").val("");

    });

    function update(){

   
      setInterval(function(){

        var updateMinsAways = $(".minutes-away");

        updateMinsAways.each(function(){
          // capitalization can make all the difference
          var timeNow = parseInt($(this).text());
          var newTime = timeNow - 1;
          $(this).text(newTime)

        })



      }, 60000);


    };

    // You generally want to remove console.log statements from your production code.
    // Also, by invoking the update function inside of this console.log and at the end
    // of this file you end up setting two intervals that are doing the same thing.
    // It doesn't cause any issues in this case since there's only one element returned
    // by $(".minutes-away"), but if that targeted all the table row meant to display
    // the minutes away, then they'd be getting decremented twice as fast as intended
    // console.log(update());

    database.ref().on("child_added", function(childSnapshot) {

    // console.log(childSnapshot.val().name);
    // console.log(childSnapshot.val().desination);
    // console.log(childSnapshot.val().startDate);
    // console.log(childSnapshot.val().frequency);

  

    var startDate = childSnapshot.val().startDate;
    var frequency = childSnapshot.val().frequency;
    var train = childSnapshot.val().name;
    var destinationData = childSnapshot.val().destination;
    

    var firstTimeConverted = moment(startDate, "HH:mm").subtract(1, "years");

    // console.log(firstTimeConverted);
     

    var currentTime = moment();

 
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");


    var timeRemainder = diffTime % frequency;

    // console.log(timeRemainder);

  
    var timeMinutesTillTrain = frequency - timeRemainder;
    // console.log(timeMinutesTillTrain);

    // great job working through this logic 👌
    var nextTrain = moment().add(timeMinutesTillTrain, "minutes");
    var nextTrainConverted = moment(nextTrain).format("hh:mm a");
    // console.log(nextTrainConverted);

    // writing markup like this is inherently error prone and as your elements become more
    // and more complex, this becomes much more difficult to maintain. Another way you could
    // do this would be to add all the row elements to an array and dynamically build the row
    // using a loop like so:

    // var tableRow = $('<tr>')
    // var rowElements = [train, destinationData, frequency, nextTrainConverted, timeMinutesTillTrain]
    
    // rowElements.forEach(function(element) {
    //   var td = $('<td>')
    //   td.text(element)
    //   tableRow.append(td)
    // })
    
    // $("#train-table tbody").append(tableRow);

    var markup = "<tr><td>" + train + "</td><td>" + destinationData + "</td><td>" +
        frequency + "</td><td>" + nextTrainConverted + "</td><td>" + timeMinutesTillTrain + "</td><td>"

    $("#train-table tbody").append(markup);

   });

  update();


