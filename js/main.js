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

/* Extract query param value */

function getQueryParam(key) {
	var re = new RegExp("[?&]" + key + "=([^&#]*)", "i");
	var string = re.exec(window.location.search);
	return string ? string[1] : null;
}

/* Functions to handle encryption and decryption of messages */

function encryptMessage(event) {
	event.preventDefault();

	encryptText(message.value, encryptpass.value)
		.then(function(enc) {
			var iv = base64Encode(enc.iv);
			var secretMessage = base64Encode(enc.encBuffer);

			var link = window.location.protocol + "//" + window.location.host;
			link += "/decrypt.html?iv=" + encodeURIComponent(iv);
			link += "&message=" + encodeURIComponent(secretMessage);
			secretLink.value = link;
			copyBtn.disabled = false;
			mailBtn.disabled = false;
		})
		.catch(function() {
			console.log(arguments);
		});

	return false;
}

function decryptMessage(event) {
	event.preventDefault();

	var iv = base64Decode(decodeURIComponent(getQueryParam("iv")));
	var secretMessage = base64Decode(
		decodeURIComponent(getQueryParam("message"))
	);

	decryptText(secretMessage, iv, decryptpass.value)
		.then(function(plainText) {
			var messageElm = document.getElementById("message");
			messageElm.innerText = plainText;
		})
		.catch(function() {
			console.log(arguments);
		});

	return false;
}

/* Encrypt and decrypt text */

function encryptText(plainText, password) {
	var ptUtf8 = new TextEncoder().encode(plainText);
	var pwUtf8 = new TextEncoder().encode(password);

	return crypto.subtle.digest("SHA-256", pwUtf8).then(function(pwHash) {
		var iv = crypto.getRandomValues(new Uint8Array(12));
		var alg = {
			name: "AES-GCM",
			iv: iv
		};

		return crypto.subtle
			.importKey("raw", pwHash, alg, false, ["encrypt"])
			.then(function(key) {
				return crypto.subtle
					.encrypt(alg, key, ptUtf8)
					.then(function(enc) {
						return {
							iv,
							encBuffer: enc
						};
					});
			});
	});
}

function decryptText(ctBuffer, iv, password) {
	var pwUtf8 = new TextEncoder().encode(password);
	return crypto.subtle.digest("SHA-256", pwUtf8).then(function(pwHash) {
		var alg = {
			name: "AES-GCM",
			iv: iv
		};

		return crypto.subtle
			.importKey("raw", pwHash, alg, false, ["decrypt"])
			.then(function(key) {
				return crypto.subtle
					.decrypt(alg, key, ctBuffer)
					.then(function(ptBuffer) {
						var plaintext = new TextDecoder().decode(ptBuffer);
						return plaintext;
					});
			});
	});
}

/* Base64 functions that can deal with array buffers */

var base64chars =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64lookup = new Uint8Array(256);
for (var i = 0; i < base64chars.length; i++) {
	base64lookup[base64chars.charCodeAt(i)] = i;
}

function base64Encode(arrayBuffer) {
	var bytes = new Uint8Array(arrayBuffer), i, len = bytes.length, base64 = "";

	for (i = 0; i < len; i += 3) {
		base64 += base64chars[bytes[i] >> 2];
		base64 += base64chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += base64chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += base64chars[bytes[i + 2] & 63];
	}

	if (len % 3 === 2) {
		base64 = base64.substring(0, base64.length - 1) + "=";
	} else if (len % 3 === 1) {
		base64 = base64.substring(0, base64.length - 2) + "==";
	}

	return base64;
}

function base64Decode(base64) {
	var bufferLength = base64.length * 0.75,
		len = base64.length,
		i,
		p = 0,
		encoded1,
		encoded2,
		encoded3,
		encoded4;

	if (base64[base64.length - 1] === "=") {
		bufferLength--;
		if (base64[base64.length - 2] === "=") {
			bufferLength--;
		}
	}

	var arraybuffer = new ArrayBuffer(bufferLength);
	var bytes = new Uint8Array(arraybuffer);

	for (i = 0; i < len; i += 4) {
		encoded1 = base64lookup[base64.charCodeAt(i)];
		encoded2 = base64lookup[base64.charCodeAt(i + 1)];
		encoded3 = base64lookup[base64.charCodeAt(i + 2)];
		encoded4 = base64lookup[base64.charCodeAt(i + 3)];

		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
		bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
		bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	}

	return arraybuffer;
}

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
