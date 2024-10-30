const express=require("express");
const  {createServer}=require("http");
const {Server}=require("socket.io");
const test =express();
const testServer=new createServer(test);
const io=new Server(testServer);
var usernames={};
test.use(express.static(__dirname + "/Document"));
test.get("/",(req,res)=>{
    res.sendFile(__dirname + "/Document/mypage.html");
});
io.on('connection', function(socket){
    console.log('You are Connected')
    socket.on('message',(msg)=>{
        socket.to(socket.group).emit('message',msg);
    });
socket.on('adduser',function(username,groupname){
    socket.join(groupname);
    socket.group=groupname;
    socket.username=username;
    usernames[username+"_"+groupname]=username;
    io.sockets.in(socket.group).emit('updateusers',usernames);
    socket.emit('greeting',username);

});
socket.on('uploadImage',function(data,username){
    socket.to(socket.group).emit('publishImage',data,username);

});
socket.on('uploadFile', (data, username, fileName) => {
    socket.to(socket.group).emit('publishFile', data, username, fileName);
});
socket.on('disconnect',function(){
    console.log("You are Disconnected");
    delete usernames[socket.username +'_'+ socket.group];
    socket.leave(socket.group);
    socket.to(socket.group).emit('updateusers',usernames);
})
})
testServer.listen(8000,()=>{
    console.log("server is ongoing http://localhost:8000");
})


