function send() {
	var book = $('#book').text();
	var call = $('#call_number').text();
	var author = $('#author').text();
	var library = $('#library').text();
	var emailAddr = $('#email').val();

	$.post(
		"MailGun Domain",
		{
			username : "api",
			password: "api key",
			from: "UNLV Book Information <noreply@example.net>",
			to: [emailAddr],
			subject: "UNLV Book Information",
			html: "Title: <b>" + book + "</b><br>" +
				  "Call Number: <b>" + call + "</b><br>" +
				  "Author: <b>" + author + "</b><br>" + 
				  "Library: " + library + "</b><br>"
		},
		function(data, status) {
			alert(status);
		}
	);
}