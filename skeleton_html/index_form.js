/*******************************************************************************
File:   index.js
Author: Kelley Neubauer, Alexis Chasney
Date:   4/24/2020

Description: 


*******************************************************************************/

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){

	document.getElementById('contactSubmitButton').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		
		var payload = {userName:null, userEmail:null, userMessageSubject:null, userMessage:null};
		payload.userName = document.getElementById('senderName').value;
		payload.userEmail = document.getElementById('senderEmail').value;
		payload.userMessageSubject = document.getElementById('messageSubject').value;
		payload.userMessage = document.getElementById('messageContent').value;
		
		// var payload = document.getElementById('senderName').value;

		req.open('POST', 'http://httpbin.org/post', true);
		req.setRequestHeader('Content-Type', 'application/json');

		req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			// console.log(response);

			document.getElementById('contactFormDiv').textContent = "";

			let newSpan = document.createElement("p");
			let newSpan1 = document.createElement("p");
			let newSpan2 = document.createElement("p");
			let newSpan3 = document.createElement("p");
			let newSpan4 = document.createElement("p");

			// document.body.appendChild(newSpan);
			document.getElementById('contactFormDiv').appendChild(newSpan);
			document.getElementById('contactFormDiv').appendChild(newSpan1);
			document.getElementById('contactFormDiv').appendChild(newSpan2);
			document.getElementById('contactFormDiv').appendChild(newSpan3);
			document.getElementById('contactFormDiv').appendChild(newSpan4);

			newSpan.textContent = "Thank you, " + response.json.userName + "!";
			newSpan1.textContent = "The message from "+ response.json.userEmail;
			newSpan2.textContent = "Subject: " + response.json.userMessageSubject;
			newSpan3.textContent = "Message: " + response.json.userMessage;
			newSpan4.textContent = "Will be sent to Kelley";


			// THIS WORKS
			//
			// document.getElementById('senderNameResponse').textContent = response.json.userName;
			// document.getElementById('senderEmailResponse').textContent = response.json.userEmail;
			// document.getElementById('messageSubjectResponse').textContent = response.json.userMessageSubject;
			// document.getElementById('messageContentResponse').textContent = response.json.userMessage;
		} 
		else 
		{
			console.log("Error in network request: " + req.statusText);
		}});

		req.send(JSON.stringify(payload));
		// req.send(payload);
		
		event.preventDefault();
	});
}