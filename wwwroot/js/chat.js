"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
OnConnected();

connection.on("ReceiveMessage", function (user, message) {
    var currentUser = document.getElementById("userInput").value;
    if (currentUser === undefined || currentUser === null || currentUser.length === 0) {
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

connection.on("OnConnected", function (user) {    
    refreshActiveUserList();
});

connection.on("OnDisconnected", function (user) {    
    refreshActiveUserList();
});

var typingTimer;
connection.on("typing", function (user) {
    var currentUser = document.getElementById("userInput").value;
    if (currentUser === undefined || currentUser === null || currentUser.length === 0) {
        return;
    }
    document.getElementById("isTyping").textContent = user + " is typing...";
    if (typingTimer) {
        clearTimeout(typingTimer);
    }
    typingTimer = setTimeout(function () {
        document.getElementById("isTyping").textContent = "";
    }, 3000);
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    sendMessage();
    event.preventDefault();
});

function sendMessage(){
    var currentUser = document.getElementById("userInput").value;
    if (currentUser === undefined || currentUser === null || currentUser.length === 0) {
        alert("User name is missing");
        return;
    }
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", currentUser, message).then(function () {
        document.getElementById("messageInput").value = "";
    }).catch(function (err) {
        return console.error(err.toString());
    });
}

document.getElementById("messageInput").addEventListener("keypress", function (event) {
    var currentUser = document.getElementById("userInput").value;
    if (currentUser === undefined || currentUser === null || currentUser.length === 0) {
        return;
    }
    connection.invoke("SendTyping", currentUser);
});

document.getElementById("messageInput").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        sendMessage();
        event.preventDefault();
    }
});

function OnConnected() {
    connection.start().then(function () {
        var currentUser = document.getElementById("userInput").value;
        if (currentUser === undefined || currentUser === null || currentUser.length === 0) {
            alert("User name is missing");
            return;
        }
        connection.invoke("OnConnected", currentUser).then(function () {
            refreshActiveUserList();
        }).catch(function (err) {
            return console.error(err.toString());
        });
    }).catch(err => console.error(err.toString()));
}

function OnDisconnected() {
    var currentUser = document.getElementById("userInput").value;
    if (currentUser === undefined || currentUser === null || currentUser.length === 0) {
        alert("User name is missing");
        return;
    }
    connection.invoke("OnDisconnected", currentUser).then(function () {
        refreshActiveUserList();
    }).catch(function (err) {
        return console.error(err.toString());
    });
}

function refreshActiveUserList() {
    connection.invoke("GetActiveUserList").then(function (activeUserList) {
        var ul = document.createElement("ul");
        for (var i = 0; i < activeUserList.length; i++) {
            var li = document.createElement("li");
            li.innerText = activeUserList[i];
            ul.appendChild(li);
        }
        document.getElementById("activeUserList").innerHTML = "";
        document.getElementById("activeUserList").appendChild(ul);
    }).catch(function (err) {
        return console.error(err.toString());
    });
    
}