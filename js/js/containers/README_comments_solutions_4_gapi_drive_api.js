/*	
https://script.google.com/macros/d/MEi16gzXm6anjdONxaBUyywiIV0nJbIFL/edit?uiv=2&mid=ACjPJvEyacBgGyRmkhdupPLiGMWSlNj-fTvjyftjPievutQHL4WE7Fv8njt_CWzcrZzhuoKQ5ezCRH5ktCxwzZX-k4UCFGorVBD9EuEc7EkFBIonTphb7tvdVl0HBVw7k6rL4i2C78dFm7o
*/


/* google Api Get: */

var params = {
        spreadsheetId: "1Zv67DL5UaPpsIb2qeclHuNeWqmKkNB9vnID2m7Hng8c",
        ranges: ["Sheet1!A1:Z1000"], 
        includeGridData: true
      };
	  
var request = gapi.client.sheets.spreadsheets.get(params);	 
	 request.then(function(response) {
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
	
/* google Api batchGet: */
	
	var params = {
        spreadsheetId: "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
        ranges: ["Projects!A1:Z1000", "Sprints Planning!A1:Z1000", "Metrico!A1:Z1000"], 
        includeGridData: true,
		comments : true
      };
	  
	var request = gapi.client.sheets.spreadsheets.values.batchGet(params)
	
	request.then(function(response) {
          
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });

// get comments list 

var params = {
        'fileId' : "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4", 
		'fields' : "comments"
      };
	  
var request = gapi.client.drive.comments.list(params);

request.then(function(response) {          
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });


	 request.then(function(response) {
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
	
	// get specific comment from file : 

function printComment(fileId, commentId) {
  var request = gapi.client.drive.comments.get({
    'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
    'commentId': "AAAABlIj-dc",
	'fields' : "quotedFileContent",
	
  });
  
  request.execute(function(resp) {
    console.log(resp);
  });

}

/*update a comment content to existing comment by its Id, w\o changing the date of submittal*/	

var body = {'content': 'this is a new content per existing comment  automated'};

    var request = gapi.client.drive.comments.update({
      'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
      'commentId': "AAAABi2rcws",
      'resource': body, 
	  'fields' : "replies"
    });
    request.execute(function(resp) {
		console.log(resp);
	});

var body = {'content': 'this is a new content per existing comment  automated'};

    var request = gapi.client.drive.comments.create({
      'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
      'commentId': "AAAABi2rcws",
      'resource': body, 
	  'fields' : "replies"
    });
    request.execute(function(resp) {
		console.log(resp);
	});

	/*delete reply*/	

var request = gapi.client.drive.replies.delete({
    'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
    'commentId': commentId,
    'replyId': replyId
  });
	
/*inserting a new reply to a comment */

var body = {'content': 'a new automatic reply: test'};
  var request = gapi.client.drive.replies.create({
    'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
      'commentId': "AAAABi2rcws",
      'resource': body, 
	  'fields' : "content"
  });
  request.execute(function(resp) {console.log(resp) });

  /*inserting a new comment whatsoever to a file*/
  
  var body = {"content" : "this is a new comment created automatically"};
  var request = gapi.client.drive.comments.create({
    'fileId': "15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4",
    'resource': body, 
	'fields' : "content"
  });
  request.then(function(response) {
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
  });
	
/*get the name of the current user: */

var request = gapi.client.drive.about.get({
	  'fields' : "user"
  });

 request.then(function(response){console.log(response)}, function(error){console.log(error)})
	  	  
	/*working values solution per range outside of drive api*/
	
	function myFunction() {
		var ss = SpreadsheetApp.getActiveSpreadsheet();
		var sheet = ss.getSheetByName("Projects");
		var range_input = ss.getRange("A1:Z").getValues();
		var resultsString = "";
		//Browser.msgBox(range.getNotes());
  for (var i = 1; i < range_input.length; i++){
    resultsString += range_input[i][8].toString() + " ";
  }
  
  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();  
  Browser.msgBox(emailQuotaRemaining);
  
  MailApp.sendEmail({
     to: "andrewgrinchak@gmail.com",
     subject: "comments",
     body: resultsString
   });
}
	/*working comments get solution through drive api enabled : */
	
//reading comments 	
function getCommentsPerFileById() {
   var comments;
   var commentsArray = [];
    comments = Drive.Comments.list('15D_Nga_6x_oEJ_yUca9jeF4Zje5_EwtXRry-R70Ceq4');
    if (comments.items && comments.items.length > 0) {
      for (var i = 0; i < comments.items.length; i++) {
        var comment = comments.items[i];
		commentsArray.push(comment);
        /*
		comments.items[i] objects goodies:
			comment.content, 
			comment.createdDate, 
			comment.author.displayName
			comment.author.picture.url
			comment.commentId
			comment.status
			comment.fieldId
		*/
      }
    }
	return commentsArray;
}

/*comments insert*/

Drive.Comments.insert({
  "kind": "drive#comment",
  "author": {
    "kind": "drive#user",
    "displayName": USER_EMAIL,
    "isAuthenticatedUser": true,
  },
  "content": CONTENT,
  "status": "open",
  "anchor": "{'r':"
             + REVISION_ID
             + ",'a':[{'txt':{'o':"
             + STARTING_OFFSET
             + ",'l':"
             + OFFSET_LENGTH
             + ",'ml':"
             + TOTAL_CHARS
             + "}}]}", 
  "fileId": FILE_ID
}, FILE_ID);

 /* USER_EMAIL, CONTENT, REVISION_ID, FILE_ID: string,
    STARTING_OFFSET, OFFSET_LENGTH, TOTAL_CHARS: int  */

/*insert data values into a spreadsheet by id */

var ss = SpreadsheetApp.getActiveSpreadsheet();
		var sheet = ss.getSheetByName("comments_database_hidden");
		var cell = sheet.getRange("A1");
		 cell.setValue();

		 
		 
		/*gapi rows and columns operations: https://developers.google.com/sheets/api/samples/rowcolumn*/ 
		 
		 
		 
		 
		 