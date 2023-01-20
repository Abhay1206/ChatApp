 const chatForm = document.getElementById('chat-form');
 const chatMessages = document.querySelector('.chat-messages');
 const roomName =document.getElementById('room-name');
 const userList = document.getElementById('users');

 // to get username and room from url

 const {username,room} =Qs.parse(location.search,{
  ignoreQueryPrefix:true
 });

 console.log(username);
 console.log(room);

const socket = io();

// join the chat room
socket.emit('joinRoom',{username,room})

// get room
socket.on('roomusers',({room,users})=>{
 outputRoomName(room);
 outputUsers(users);
});

// message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    // scroll 
  chatMessages.scrollTop= chatMessages.scrollHeight;

  //cleqr input


})

// message submmit
chatForm.addEventListener('submit',(e)=>{
 e.preventDefault();

 // get message text
 const msg = e.target.elements.msg.value;

 // emitting a message to server
 socket.emit('chatMessage',msg);


 // clear input 
e.target.elements.msg.value='';
e.target.elements.msg.focus();
})



// output message to dom
function outputMessage (message){
 const div = document.createElement('div');
 div.classList.add('message');
 div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text};
						</p>`

           document.querySelector('.chat-messages').appendChild(div);             
}

// add room name to dom

function outputRoomName(room){
roomName.innerText=room;
}

//
function outputUsers(users){
  userList.innerHTML=`
   ${users.map(user=>`<li>${user.username}</li>`).join("")}
  `
}