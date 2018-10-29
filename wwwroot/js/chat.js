"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.on("ReceiveMessage", function (user, message) {
    var currentUser = document.getElementById("userInput").value;
    if(currentUser === undefined || currentUser === null || currentUser.length === 0){
        return;
    }
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var css = user == document.getElementById("userInput").value ? "green-message" : "blue-message";
    var encodedMsg = "<b>" + user + "</b> : " + msg;
    var li = document.createElement("li");
    li.innerHTML = encodedMsg;
    li.className = css;
    document.getElementById("messagesList").appendChild(li);
});

var typingTimer;
connection.on("typing", function (user) {   
    var currentUser = document.getElementById("userInput").value;
    if(currentUser === undefined || currentUser === null || currentUser.length === 0){        
        return;
    } 
    document.getElementById("isTyping").textContent = user + " is typing...";
    if(typingTimer){
        clearTimeout(typingTimer);
    }
    typingTimer = setTimeout(function(){        
        document.getElementById("isTyping").textContent = "";
    }, 3000);
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var currentUser = document.getElementById("userInput").value;
    if(currentUser === undefined || currentUser === null || currentUser.length === 0){
        alert("User name is missing");
        return;
    }
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", currentUser, message).then(function(){
        document.getElementById("messageInput").value = "";
    }).catch(function (err) {        
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("messageInput").addEventListener("keypress", function (event) {
    var currentUser = document.getElementById("userInput").value;
    if(currentUser === undefined || currentUser === null || currentUser.length === 0){        
        return;
    }
    connection.invoke("SendTyping", currentUser);
});