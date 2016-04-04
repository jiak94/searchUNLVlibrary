$(document).ready(function() {
	document.getElementById('form').addEventListener("submit", search, false);
	document.getElementById('submit').addEventListener("click", search, false);
	document.getElementById('back').addEventListener("click", back, false);
	document.getElementById('searchAnother').addEventListener("click", back, false);
	document.getElementById('sendItToMe').addEventListener("click", getEmail, false);
	document.getElementById('send').addEventListener("click", send, false);
	$('.result').hide();
	$('.thumnail').hide();
	$('.notfound').hide();
	$('.loading').hide();
});

function search() {
	var checkAuthor = true;
	var bookName = $('#bookName').val();
	bookName = bookName.trim();
	if (bookName.length == 0) {
		notfound();
		return;
	}
	var urlBookName = bookName.split(' ').join('+');
	$('.left').hide();
	$('.loading').show();
	var requestURL = generateURL(urlBookName);
	var data = '';
	$.ajax({
		type: "GET",
		url: requestURL,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-TW;q=0.2,ko;q=0.2',
			'Cache-Control': 'max-age=0',
			'Upgrade-Insecure-Requests': '1'
		},
		success: function(msg) {
			var data = msg;
			var result = getResult(data, bookName);
			if (result == "NOT FOUND") {
				notfound();
			}
			else {
				parseHTML(result);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			notfound();
		}
	})
}

function generateURL(bookName) {
	baseURL = 'https://unlv.summon.serialssolutions.com/api/search?';
	return baseURL + 'pn=1&ho=t&fvf%5B%5D=ContentType%2CBook+%2F+eBook%2Cf&l=en&q=' + bookName;
}

function getResult(data, bookName) {
	if (Object.keys(data['documents']).length == 0) {
		return "NOT FOUND"
	}

	for (var i = 0; i < Object.keys(data['documents']).length; i++) {
		var item = data['documents'][i];
		var title = item['title'];
		title = title.split('<b>').join('');
		title = title.split('</b>').join('');
		title = title.toLowerCase();

		var substring = bookName.toLowerCase();

		if (title.indexOf(substring) > -1) {
			return item;
		}
	}

	return "NOT FOUND";
}

function parseHTML(data) {
	$('#sendDetail').hide();
	$('.loading').hide();
	var bookName = data['title'];
	try {
		var call_number = data['lc_call_numbers'][0];
	}
	catch(err){
		var call_number = 'Internet Access';
	}
	try {
		var author = data['authors'][0]['fullname'];
	}
	catch(err) {
		var author = 'Undefine';
	}
	try {
		var genra = data['genres'][0];
	}
	catch(err) {
		var genra = 'Undefine';
	}
	try {
		var library = data['libraries'][0];
	}
	catch(err) {
		var library = 'Undefine';
	}
	try {
		var thumnail = data['thumbnail_medium'];
	}
	catch(err) {
		var thumnail = "./img/notfound.jpg";
	}
	try {
		var link = data['link'];
	}
	catch (err) {
		var link = '#';
	}

	$('#book').html(bookName);
	$('#call_number').text(call_number);
	$('#author').text(author);
	$('#genra').text(genra);
	$('#library').text(library);

	$('#thumnail').attr("src", thumnail);

	$('#link').attr("href", link);

	$('.left').hide();
	$('.right').hide();
	$('.information').hide();

	$('.result').show();
	$('.thumnail').show();

	$('#sendItToMe').show();
}

function getEmail() {
	$('#sendDetail').show();
	$('#sendItToMe').hide();
}

function back() {
	$('.loading').hide();
	$('.result').hide();
	$('.thumnail').hide();
	$('.left').show();
	$('.right').show();
	$('.notfound').hide();
	$('.information').show();
}

function notfound() {
	$('.left').hide();
	$('.right').hide();
	$('.information').hide();
	$('.notfound').show();
	$('.loading').hide();
}