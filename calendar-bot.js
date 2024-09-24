function checkUpcomingMeetings() {

  var now = new Date();
  var numMinutes = 2;
  var later = new Date(now.getTime() + (numMinutes * 60 * 1000));

  // Note this will get all events, including ones that are currently occurring, not just ones that start in the future
  var events = CalendarApp.getDefaultCalendar().getEvents(now, later);
  Logger.log('Number of events: ' + events.length);

  for (var eventIdx = 0; eventIdx < events.length; eventIdx++)
  {
    var myEvent = events[eventIdx];
    // Only send the message if the event is upcoming and not if we're in the event
    if(myEvent.getStartTime() >= now.getTime())
    {
      Logger.log("Sending messasge for " + myEvent.getTitle());
      var myMessage = buildMessageText(myEvent);
      webhook(myMessage);
    }    
  }
}



function buildMessageText(event)
{

  // Formatting How To https://developers.google.com/workspace/chat/format-messages
  var messageText = "Hello, you have a meeting soon: \n";
  messageText += "***** *" + event.getTitle() + "* *****\n";

  // TODO - The time zone is hard coded
  // https://developers.google.com/apps-script/reference/calendar/calendar-event#getStartTime()
  messageText += "From " + Utilities.formatDate(event.getStartTime(), "GMT-6", "HH:mm") + " to " + Utilities.formatDate(event.getEndTime(), "GMT-6", "HH:mm") + "\n";
  messageText += "Your status is: " + event.getMyStatus() + "\n";
  
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // https://stackoverflow.com/questions/62544681/find-zoom-url-to-join-call-from-text

  var eventDescription = event.getDescription();
  // var zoomRegEx = "https://*.zoom.us/j/.+?";
  messageText += eventDescription;
  
  
  
  return(messageText);
}

// https://developers.google.com/workspace/chat/quickstart/webhooks#apps-script 
function webhook(messageText) {
  const url = "https://chat.googleapis.com/v1/spaces/<YOUR-SPACE-ID-HERE>/messages?key=<YOUR-KEY-HERE>";
  const options = {
    "method": "post",
    "headers": {"Content-Type": "application/json; charset=UTF-8"},
    "payload": JSON.stringify({"text": messageText})
  };
  const response = UrlFetchApp.fetch(url, options);
}
