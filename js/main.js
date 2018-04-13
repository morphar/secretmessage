/* setup variables for elements */

var encryptform = document.getElementById("encryptform");
var decryptform = document.getElementById("decryptform");
var copyBtn = document.getElementById("copybtn");
var mailBtn = document.getElementById("mailbtn");
var generateBtn = document.getElementById("generatebtn");
var copyBtn = document.getElementById("copybtn");
var mailBtn = document.getElementById("mailbtn");
var showMessageBtn = document.getElementById("showmessage");
var secretLink = document.getElementById("secretlink");
var message = document.getElementById("message");
var encryptpass = document.getElementById("encryptpass");
var decryptpass = document.getElementById("decryptpass");
var iv = document.getElementById("iv");

/* Copy to clipboard */

function copyToClipBoard() {
	secretLink.focus();
	secretLink.selectionStart = 0;
	secretLink.selectionEnd = 9999;
	document.execCommand("copy");
	toggleCopyButton();
}

/* Create an e-mail link */

function sendAsEmail() {
	var link = "mailto:?subject=Secret%20Message&body=";
	var body = "Go see your message here:\r\n" + secretLink.value;
	link += encodeURIComponent(body);
	window.location = link;
}

/* Button togglers */

function toggleGenerateLink() {
	if (message.value != "" && encryptpass.value != "") {
		generateBtn.disabled = false;
	} else {
		generateBtn.disabled = true;
	}
}

function toggleShowMessage() {
	if (decryptpass.value != "") {
		showMessageBtn.disabled = false;
	} else {
		showMessageBtn.disabled = true;
	}
}

function toggleCopyButton() {
	secretLink.focus();
	copyBtn.classList.add("btn-success");
	setTimeout(function() {
		copyBtn.classList.remove("btn-success");
		secretLink.blur();
		var selection = getSelection();
		if (selection != null) {
			selection.removeAllRanges();
		}
	}, 500);
}

/* Setup events */

if (encryptform != null) {
	encryptform.addEventListener("submit", encryptMessage, true);
}

if (decryptform != null) {
	decryptform.addEventListener("submit", decryptMessage, true);
}

if (copyBtn != null) {
	copyBtn.addEventListener("click", copyToClipBoard, true);
}

if (mailBtn != null) {
	mailBtn.addEventListener("click", sendAsEmail, true);
}

if (message != null) {
	message.addEventListener("keyup", toggleGenerateLink, true);
	message.addEventListener("change", toggleGenerateLink, true);
}

if (encryptpass != null) {
	encryptpass.addEventListener("keyup", toggleGenerateLink, true);
	encryptpass.addEventListener("change", toggleGenerateLink, true);
}

if (decryptpass != null) {
	decryptpass.addEventListener("keyup", toggleShowMessage, true);
	decryptpass.addEventListener("change", toggleShowMessage, true);
}
