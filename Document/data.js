let userName;
let groupName;
const input = $("input[name='txt-msg']");
const message_body = $(".chat-meassage");
const newUser = $(".user");
const socket = io();
socket.on('connect', addUser);
socket.on('updateusers', updateUserList);
function addUser() {
    userName = prompt("Please enter your Name!");
    groupName = prompt(" Please enter your Group name!");
    socket.emit('adduser', userName, groupName);
}
input.on('keyup', function (e) {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});
function sendMessage(message) {
    let msg = {
        user: userName,
        message: message.trim()
    };
    appendMessage(msg, 'outgoing');
    input.val('');
    goDown();
    socket.emit('message', msg);
}
function appendMessage(msg, type) {
    let msgDiv = document.createElement('div');
    msgDiv.classList.add(type, 'message');
    let Msgmark = `<h4>${msg.user}</h4><p>${msg.message}</p>`;
    msgDiv.innerHTML = Msgmark;
    message_body.append(msgDiv);
}
function goDown() {
    message_body.scrollTop(message_body[0].scrollHeight);
}
function sendClick() {
    let message = input.val();
    sendMessage(message);
}
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    goDown();
});
socket.on('greeting', (data) => {
    let msg = {
        user: "Server",
        message: `Welcome ${data}! <br> Our Chatting group!`
    };
    appendMessage(msg, 'incoming');
    goDown();
});
function updateUserList(data) {
    $('.user').empty();
    $('.group').html(groupName);
    $.each(data, function (key, value) {
        if (key.endsWith(groupName)) {
            let newSpan = document.createElement('span');
            let Msgmark = `<img src="user.png" alt="${value}"> <sub class="on_off">${value}</sub>`;
            newSpan.innerHTML = Msgmark;
            newUser.append(newSpan);
        }
    });
}
$('#uploadimg').on('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
        if (file.type.startsWith('image/')) {
            socket.emit('uploadImage', evt.target.result, userName);
            appendImage(evt.target.result, userName, 'outgoing');
        } else {
            socket.emit('uploadFile', evt.target.result, userName, file.name);
            appendFile(file.name, evt.target.result, userName, 'outgoing');
        }
    };
    reader.readAsDataURL(file);
    $('#uploadimg').val('');
});
function appendImage(data, user, type) {
    let msgDiv = document.createElement('div');
    msgDiv.classList.add(type, 'message');
    let Msgmark = `<h4>${user}</h4><img src="${data}" class="uploadedImage" />`;
    msgDiv.innerHTML = Msgmark;
    message_body.append(msgDiv);
    goDown();
}
function appendFile(fileName, data, user, type) {
    let msgDiv = document.createElement('div');
    msgDiv.classList.add(type, 'message');
    let Msgmark = `<h4>${user}</h4><a href="${data}" download="${fileName}">Download ${fileName}</a>`;
    msgDiv.innerHTML = Msgmark;
    message_body.append(msgDiv);
    goDown();
}
socket.on('publishImage', (data, user) => appendImage(data, user, 'incoming'));
socket.on('publishFile', (data, user, fileName) => appendFile(fileName, data, user, 'incoming'));
