//const database = firebase.getDatabase(app);

let user;
let onlyUsername;
let onlyDiscrim;

let dId = location.href.split("@")[1].split("/")[1]

var channelMessages = document.querySelector('.channel-messages ul');
/*
if (sessionStorage.getItem('.here.before') == null) {
  window.location.href = "/app"
}*/

function registerD(id) {
  dId = id
}

function registerUser(name, discrim) {
  user = name+"#"+discrim;
  onlyUsername = name;
  onlyDiscrim = discrim;
  console.log(`${user}; ${onlyUsername}; ${onlyDiscrim}`)
}

//messaging
    
function sendMessageToChannel() {
  let input = document.querySelector('#textInput');
  let channelMessages = document.querySelector('.channel-messages ul');
  if (!/[a-zA-Z]/.test(input.innerText)) {
    alert("Please add some content into your message.")
  } else {
    fetch(`/send_message/d/${dId}`, {
      headers: { "message": input.innerText.replaceAll('\n','<br/>'), "token": localStorage.token }
    }).then(function(response) {
      console.log(response)
    });
  
    //onSentMessage(input.innerText)
  
    input.innerText = null
  }
}

const getNewMessages = async () => {
  let loaded = false
  document.getElementById("loadingMessages").hidden = false
  document.querySelector('.channel-messages ul').innerHTML = null;

  await fetch(`/get_messages/d/${dId}`, {
    headers: {
      amount: 10,
      skip: 0
    }
  }).then(async (response) => {
    const item = await response.json()
    console.log("Got new messages")

    console.log(item)

    for (const obj of Object.entries(item)) {
      renderMessage(obj[1])
      console.log("Rendered new messages")
    }
    const msgsDiv = document.querySelector('.channel-messages');
    document.getElementById("loadingMessages").hidden = true;
    setTimeout(() => {
      msgsDiv.scrollTop = msgsDiv.scrollHeight
      loaded = true
    }, 500);
  })
}

getNewMessages()

loaded = false;

setInterval(async () => {
  const msgsDiv = document.querySelector('.channel-messages');
  if (loaded && msgsDiv.scrollTop < 100) {
    loaded = false
    const res = await fetch(`/get_messages/d/${sId}` + "~" + currChannel, {
      headers: {
        amount: 10, // up the limit for a few past messages to be rendered
        skip: 10 // but too many messages will slow down revolution: the server and the client
      }
    });
    const item = await res.json();
    for (const obj of Object.entries(item).reverse()) {
      renderMessage(obj[1], true);
      console.log("Rendered new messages")
    }
  }
}, 100)

const renderMessage = (data, start) => {
      let skipped = 0
      const message = data.message
      const sent_by = data.sent_by
      const author_id = data.author_id
      if (message.includes('<script') || message.includes('<style') && message.includes('</style>')) {
        skipped = 1;
      }
      if (message.includes('<link ')) {
        // block it completely.
        skipped = 1;
      }
      if (message.includes('<iframe')) {
        skipped = 1;
      }
      if (message.includes('<embed')) {
        skipped = 1;
      }
      if (message.includes('position:')) {
        skipped = 1;
      }

      if (skipped == 0) {
        document.querySelector('.channel-messages ul').insertAdjacentHTML('before' + (start ? "start" : "end"), `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Revolution.png" width=40 style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="newUserPopUpCard(${author_id})">${sent_by}</onclickFunc> <span class="badge" style="background: mediumpurple;">${data.bot ? "BOT" : "TESTER"} <i class="fa fa-check"></i></span> </b> <br>${message}</li>`);
      } else {
        document.querySelector('.channel-messages ul').insertAdjacentHTML('before' + (start ? "start" : "end"), `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Revolution.png" width=40 style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="newUserPopUpCard(${author_id})">${sent_by}</onclickFunc> <span class="badge" style="background: red;">${data ? "BOT" : "TESTER"} <i class="fa fa-check"></i></span> </b> <br>[!] This message contains a bad script or a piece of code and has been blocked.</li>`);
      }
}

websocket = function() {
  const websck = new WebSocket("wss://revolution-web.repl.co");
  
  websck.addEventListener("open", (e) => {
    websck.send(JSON.stringify({ "type": "follow", "channels": [dId], "token": localStorage.token }));
  });
  
  websck.addEventListener("open", (e) => {
  })
  
  websck.addEventListener('message', ev => {
    console.log(ev.data);
    renderMessage(JSON.parse(ev.data))
  });
  
  websck.addEventListener('close', ev => {
    if (window.navigator.onLine) {
      console.log('Reconnecting...');
      setTimeout(() => websocket(), 100)
    } else {
      window.location = "/app"
    }
  });
}

websocket();

// user cards

async function newUserPopUpCard(id) {
  let mouseEvent = window.event;
  let openedMenu = false;
  mouseY = mouseEvent.clientY;
  mouseX = mouseEvent.clientX;

  const res = await fetch("/api/v1/get_user", {
    headers: { "id": id }
  })
  const data = await res.json()
  console.log(data)

  // get rid of existing user cards
  try {
    document.querySelector('.user-card').remove();
  } catch {
    console.info("No existing user cards found.")
  }
  console.log(mouseY)
  console.log(mouseX)
  var usercard = `<div class="user-card">
  <div class='banner-image'></div>
  <div class='dismiss' onclick='this.parentElement.remove();'>❌</div>
  <div class='user-card-c'>
    <h3>${data.name}<strong style="color: grey;">#${data.discriminator}</strong></h3>
    <small>Status</small><br>
    <p>Unknown</p>
${data.description !== "" ? `
    <small>Description</small>
    <p>${data.description}</p>
` : ""}
  </div>
</div>`

  document.querySelector('.content').insertAdjacentHTML('beforeend', usercard)
  document.querySelector('.user-card').style.position = "absolute";

  if (mouseY > 400) {
    minusToMouseY = 350
  } else {
    minusToMouseY = 0
  }

  if (mouseX > 1200) {
    minusToMouseX = 300
  }else {
    minusToMouseX = 0
  }
  
  document.querySelector('.user-card').style.top = mouseY - minusToMouseY + 10;
  document.querySelector('.user-card').style.left = mouseX - minusToMouseX + 10;

  openedMenu = true

  /*document.body.addEventListener('click', function() {
    if (openedMenu == true) {
      try {
        document.querySelector('.user-card').remove();
        openedMenu = false;
      } catch {
        console.info("No existing user cards found.")
        openedMenu = true
      }
    } else { return false; }
  });*/
}

//external page warnings

let testForLinks = setInterval(function() {
  var anchors = document.querySelectorAll('.channel-messages ul li a');

  for (var i = 0; i < anchors.length; i++) {
    if (!anchors[i].checked) {
      anchors[i].value = anchors[i].href
      anchors[i].checked = true
      anchors[i].href = "javascript:void(0)"
      anchors[i].addEventListener('click', externalPageWarning)
    }
  }
}, 10);

//let testForButtons = setInterval(function() {
  //var anchors = document.querySelectorAll('.channel-messages ul li button');

  //for (var i = 0; i < anchors.length; i++) {
    //if (!anchors[i].checked) {
      //anchors[i].value = anchors[i].href
      //anchors[i].checked = true
      //anchors[i].href = "javascript:void(0)"
      //anchors[i].addEventListener('click', buttonsRollingSoon)
    //}
  //}
//}, 10);

var buttonsRollingSoon = function() {
  alert("Buttons are rolling out soon!")
}
var confirmIt = function (e) {
  console.log(e)
  if (!confirm(`Are you sure you want to head to "${e.currentTarget.value}"? This could be a bad idea. \n Please note: We are not responsible for the accounts that have been stolen by clicking this link.`)) e.preventDefault();
}; var allA_elements = document.getElementsByTagName('a');

function externalPageWarning(e) {
  conf = confirm(`Are you sure you want to go to the external page '${e.currentTarget.value}'? This could be a bad idea.`)
  if(conf){
    window.open(e.currentTarget.value)
  }
  if(!conf){
    return false;
  }
}

//messaging

function sendMsgToChannel(msg,sentby) {
  var channelMessages = document.querySelector('.channel-messages ul');
  var messageTemplate = `
    <li style="padding-left: 10px; color: white; width: 100%;" onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Goobler-meowsicles.png" width=40 style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="">${sentby}</onclickFunc> <span class="badge" style="background: mediumpurple;">TESTER <i class="fa fa-check"></i></span> </b> <br>${msg}</li>
  `;
  console.log(sentby)
  channelMessages.insertAdjacentHTML('beforeend', messageTemplate);
  
  fetch(`/send_message/s/${sId}` + "~" + currChannel, {headers: {"message": msg, "sent_by": sentby}}).then(function(response) {
    console.log(response)
  });
}

// modals

function createModal(defaultContent=`<h2>Welcome to Goobler Chat!</h2><p class='grayed'>We need you to read this for your own safety.</p><button class='success' onclick='closeModal();'>OK</button>`, loadingSeconds=2000) {
  let Modal = document.createElement('div');
  let ModalInnerContent = document.createElement('div');
  //apply classes to class lists
  Modal.classList.add('modal');
  ModalInnerContent.classList.add('modal-content');
  
  ModalInnerContent.innerHTML = "<img width='50px' src='/assets/images/imggooblerloader.gif'>";
  ModalInnerContent.classList.add('center');
  document.querySelector('header').appendChild(Modal);
  Modal.appendChild(ModalInnerContent);
  setTimeout(function() {
    ModalInnerContent.classList.remove('center');
    ModalInnerContent.innerHTML = defaultContent;
    localStorage.setItem('viewedSettingsPage', true);
  },loadingSeconds);
}

// activities
async function startActivity(type) {
  console.log("Started activity on server: "+sId)
  if (type == "youtube-t") {
    // it is youtube together they wanted to start
    console.log("Communicating through YouTube Together...")
    var requestActivity = await fetch(`/start_activity/s/${sId}`, { headers: {"activity": "youtube-together"} });
    var response = await requestActivity.text();
    if (response.toLowerCase() == "ok") {
      // start the activity window
      // send the activity to the server
      sendMsgToChannel(`<p class='grayed'>You have started the activity on server: ${sId}</p>`, "You");
    } else {
      // error communicating or something happened
      createModal(`<h2>Error</h2><p class='grayed'>There was an error communicating with the server. Please try again later.</p><button class='success' onclick='closeModal();'>OK</button>`);
      console.error("Error communicating, server is down or there is no internet connection.");
    }
  }
}