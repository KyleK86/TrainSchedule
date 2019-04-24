// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCgfMV84RbooUW7gL9l7UeHBRJhM-FkURE",
    authDomain: "train-schedule-a2df8.firebaseapp.com",
    databaseURL: "https://train-schedule-a2df8.firebaseio.com",
    projectId: "train-schedule-a2df8",
    storageBucket: "train-schedule-a2df8.appspot.com",
    messagingSenderId: "893871978165"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#trainInput").val().trim();
    var trainDest = $("#destinationInput").val().trim();
    var timeInput = $("#trainTimeInput").val().trim();
    var frequencyInput = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        destination: trainDest,
        frequency: frequencyInput,
        name: trainName,
        time: timeInput
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);


    // Clears all of the text-boxes
    $("#trainInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var nameOfTrain = childSnapshot.val().name;
    var destinationOfTrain = childSnapshot.val().destination;
    var inputOfTime = childSnapshot.val().time;
    var inputOfFrequency = childSnapshot.val().frequency;

    // train Info
    console.log(nameOfTrain);
    console.log(destinationOfTrain);
    console.log(inputOfTime);
    console.log(inputOfFrequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(inputOfTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in Time: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % inputOfFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = inputOfFrequency - tRemainder;
    console.log("Minutes til Train: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));



    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(nameOfTrain),
        $("<td>").text(destinationOfTrain),
        $("<td>").text(inputOfFrequency),
        $("<td>").text(moment(nextTrain).format("hh:mm")),
        $("<td>").text(tMinutesTillTrain)

    );

    // Append the new row to the table
    $("#table-data > tbody").append(newRow);

    // Handle the errors
}, function (errorObject) {
    //     console.log("Errors handled: " + errorObject.code);
});