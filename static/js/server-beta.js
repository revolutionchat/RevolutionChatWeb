import { user, firstLoadedMessages, servers, websck } from "./betaClient.js";

let currChannel = "chat";
let currServer = "revolution";

window.currServer = currServer;
window.currChannel = currChannel;

const getNewMessages = async () => {
  let loaded = false
  document.getElementById("loadingMessages").hidden = false
  document.querySelector('.channel-messages ul').innerHTML = null;

  await fetch(`/get_messages/s/${window.currServer}` + "~" + window.currChannel, {
    headers: {
      amount: 20,
      skip: 0
    }
  }).then(async (response) => {
    //const body = await response.text();
    //const jsonText = body.replaceAll('\u0027', '\u0022').replaceAll(`]|sngl-qt|[`,'\'').replaceAll(']|dbl-qt|[',`'`);
    const item = await response.json() //JSON.parse(jsonText)/*.replaceAll(`'`, `"`);*/
    console.log("Got new messages")

    console.log(item)

    for (const obj of Object.entries(item)) {
      await renderMessage(obj[1])
      console.log("Rendered new messages")
    }
    const msgsDiv = document.querySelector('.channel-messages');
    document.getElementById("loadingMessages").hidden = true;
    setTimeout(() => {
      msgsDiv.scrollTop = msgsDiv.scrollHeight
      loaded = true
    }, 500);
    
    /*document.querySelector('.channel-messages ul').insertAdjacentHTML('beforeend', `<li style="padding-left: 10px; color: white; width: 100%;" onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Goobler-meowsicles.png" width=40/> <onclickFunc onclick="">${json.message}</onclickFunc> <span class="badge" style="background: mediumpurple;">TESTER <i class="fa fa-check"></i></span> </b> <br>${json["messages"]['message']}</li>`);*/
  })
  //location.reload()
} // we now need to be able to send messages

const userCache = {}
const usersTyping = [];
const usersTypingString = "$(user) is typing...";

const showTyping = async (data, defaultUser) => {
  const typing = document.querySelector('.message-input .user-typing');
  let dataalreadythere = false;
  for (const i of usersTyping) {
    if (i.uid === data.uid) dataalreadythere = true;
  }
  if (defaultUser.id !== data.author && !dataalreadythere) {
    usersTyping.push(data);
  }
  console.log(usersTyping);
  if (usersTyping.length === 3 || usersTyping.length > 3) {
    typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;Several users are typing...`;
    typing.hidden = false
  } else {
    if (usersTyping.length === 1) {
      typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;${usersTypingString.replaceAll('$(user)',usersTyping[0].name)}`;
      typing.hidden = false;
    }
    if (usersTyping.length === 0) {
      typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;No one is currently typing.`;
      typing.hidden = true;
    }
    if (usersTyping.length === 2) {
      typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;${usersTyping[0].name} and ${usersTyping[1].name} are typing...`;
      typing.hidden = false;
    }
  }
  return 0;
}

const stopTyping = async (obj, payload, user) => {
  const typing = document.querySelector('.message-input .user-typing');
  console.log(`${JSON.stringify(obj)}; \n${payload}; \n${JSON.stringify(user)}`);
  for (const i of usersTyping) {
    if (i.uid !== user.id) {
      if (i.uid === obj.author) usersTyping.splice(count, 1);
      if (usersTyping.length === 3 || usersTyping.length > 3) {
        typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;Several users are typing...`;
        typing.hidden = false
      } else {
        if (usersTyping.length === 1) {
          typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;${usersTypingString.replaceAll('$(user)',usersTyping[0].username)}`;
          typing.hidden = false
        }
        if (usersTyping.length === 2) {
          typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;${usersTyping[0].username} and ${usersTyping[1].username} are typing...`;
          typng.hidden = false
        }
        if (usersTyping.length === 0) {
          typing.innerHTML = `<span class="material-symbols-outlined">blur_on</span>&nbsp;&nbsp;No one is currently typing.`;
          typing.hidden = true;
        }
      }
    }
  }
  return 0;
}

const renderMessage = async (data, start) => {
      let skipped = 0
      const message = data.message
      const sent_by = data.sent_by
      const author_id = data.author_id
      const raw_timestamp = data.timestamp;
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

      let userData = null
      if (author_id in userCache) {
        userData = userCache[author_id]
      } else {
        const userRes = await fetch("/api/v1/get_user", {
          headers: { "id": author_id }
        })
        userData = await userRes.json()
        userCache[author_id] = userData
      }
  
      let badge = "TESTER"
      let badgeBG = "mediumpurple"
      if (userData.bot) {
        badge = "BOT"
        badgeBG = "#007FFF"
      }
      if (userData.staff) {
        badge = "STAFF"
        badgeBG = "#86602d"
      }
      
      let localTimestamp = new Date(raw_timestamp);
      let localeTime = localTimestamp.toLocaleTimeString();
      let localDate = new Date(raw_timestamp);
      let localeDate = localDate.toLocaleString();

      if (skipped == 0) {
        await document.querySelector('.channel-messages ul').insertAdjacentHTML('before' + (start ? "start" : "end"), `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';" ><b><img src="/assets/images/Revolution.png" width=40 style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="newUserPopUpCard(${author_id})">${sent_by}</onclickFunc> <span class="badge" style="background: ${badgeBG};">${badge} <i class="fa fa-check"></i></span> <small class="timestamp-local" style="color:grey;">${localeDate}</small> </b> <br>${marked.parse(message)}</li>`);
      } else {
        await document.querySelector('.channel-messages ul').insertAdjacentHTML('before' + (start ? "start" : "end"), `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';" ><b><img src="/assets/images/Revolution.png" width=40 style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="newUserPopUpCard(${author_id})">${sent_by}</onclickFunc> <span class="badge" style="background: red;">${badge}</span> <small class="timestamp-local" style="color:grey;">${localeDate}</small> </b> <br>[!] This message contains a bad script or a piece of code and has been blocked.</li>`);
      }
      document.querySelector('.channel-messages ul').scrollTop = document.querySelector('.channel-messages ul').scrollHeight
      var e = document.querySelector('.channel-messages ul').children[document.querySelector('.channel-messages ul').children.length-1];
      e.scrollIntoView({ block: "end", behavior: "smooth" });
      if (firstLoadedMessages) {
        rackedUpMessages += 1;
        rackedUpMessages--;
      }
}

    // CHANNEL AUTOMATION

    //let channels = [{% for ch in sChannels %}"{{ch}}",{% endfor %}]
    //let currChannel = location.hash === "" ? channels[0] : location.hash.split("#")[1]
    //document.getElementsByTagName("title")[0].textContent = "#" + currChannel + " | Revolution"

  const fetchInfo = (readonly) => {
    if (readonly.includes(currChannel) && !user.staff) {
        //document.getElementById("textInput").contentEditable = false
        //document.getElementById("sendMessage").disabled = true
        document.getElementById("read-only").hidden = false;
        document.getElementById("input-area").hidden = true;
      } else {
        //document.getElementById("textInput").contentEditable = true
        //document.getElementById("sendMessage").disabled = false
        document.getElementById("read-only").hidden = true;
        document.getElementById("input-area").hidden = false;
      }
  };

    function switchChannel(element) {
      // Find the element in the list and if it exists, switch to it.
      const channelList = document.querySelector('.channel-list')
      //if ("{{sId}}" === "deltarune") {
        //window.location = "https://deltarune.com"
      window.currChannel = element.name
      //location.hash = "#" + element.name
      document.getElementsByTagName("title")[0].textContent = "#" + element.name + " | Revolution"
      history.pushState({}, "#" + currChannel + " | Revolution", "https://revolution-web.repl.co/channels/" + window.currServer + "/" + window.currChannel)
      //}
      getNewMessages()
      console.log(websck);
      websck.send(JSON.stringify({ "type": "resetfollowlist", "token": localStorage.getItem("token") }));
      websck.send(JSON.stringify({ "type": "follow", "channels": [window.currServer + "~" + window.currChannel], "token": localStorage.getItem("token") /* "guest" */ }));
      fetchInfo(servers[window.currServer].readonly)
    }

window.switchChannel = switchChannel;

function sendMessageToChannel(channel) {
  if (servers[window.currServer].readonly.includes(window.currChannel) && !user.staff) return
  let input = document.querySelector('#textInput');
  //let innerTXT = input.innerText.replaceAll("'",`]|sngl-qt|[`).replaceAll('"',`]|dbl-qt|[`);
  //let editedNAME = onlyUsername.replaceAll('\'', ']|sngl-qt|[',).replaceAll('"',']|dbl-qt|[');
  let channelMessages = document.querySelector('.channel-messages ul');
  /*var messageTemplate = `
    <li style="padding-left: 10px; color: white; width: 100%;" onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Goobler-meowsicles.png" width=40 style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="">${onlyUsername}</onclickFunc> <span class="badge" style="background: mediumpurple;">TESTER <i class="fa fa-check"></i></span> </b> <br>${innerTXT}</li>
  `;*/

  if (!/[a-zA-Z]/.test(input.innerText)) {
    alert("Please add some content into your message.")
  } else {
      //channelMessages.insertAdjacentHTML('beforeend', messageTemplate);
    
    fetch(`/send_message/s/${window.currServer}` + "~" + window.currChannel, {
      headers: {
        "message": input.innerText.replaceAll('\n','<br/>'),
        "token": localStorage.getItem("token")
      }
    }).then(function(response) {
      console.log(response)
    });
  
    //onSentMessage(input.innerText)
  
    input.innerText = null
  }
}

// user cards

document.addEventListener('click', (e) => {
  /*if (e.srcElement.parentElement.classList.contains("profile-click") != true && e.srcElement.parentElement.classList.contains("user-profile-main-popup") != true && e.srcElement.parentElement.classList.contains("profile") != true && (e.srcElement.classList.contains('profile-click') != true || e.srcElement.children.length > 2)) {
    if (document.querySelector('.user-profile-main-popup').hidden) {
      document.querySelector('.user-profile-main-popup').hidden = false;
    } else {
      document.querySelector('.user-profile-main-popup').hidden = true;
    }
    console.log(e.srcElement.parentElement.classList);
    console.log(e.srcElement.classList);
  } else {
    console.log(e.srcElement.parentElement.classList);
    console.log(e.srcElement.classList);
  }*/
  try {
    if (e.srcElement.parentElement.classList.contains("user-card") || e.srcElement.classList.contains("user-card") || e.srcElement.classList.contains("user-card-c") || e.srcElement.parentElement.classList.contains("user-card-c")) {
      return;
    } else {
      document.querySelector('.user-card').remove();
    }
    console.log(e)
  } catch {
    console.log("No existing user cards found.");
  }
});

async function newUserPopUpCard(id) {
  let mouseEvent = window.event;
  let openedMenu = false;
  const mouseY = mouseEvent.clientY;
  const mouseX = mouseEvent.clientX;

  var rect = mouseEvent.target.getBoundingClientRect();

  const openMenuY = rect.top + 6;
  const openMenuX = rect.left - 7;

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

  let minusToMouseY = 0;
  let minusToMouseX = 0;

  if (mouseY > 400) {
    minusToMouseY = 400;
  } else {
    minusToMouseY = 0;
  }

  if (mouseX > 1200) {
    minusToMouseX = 300;
  }else {
    minusToMouseX = 0;
  }

  var usercard = `<div class="user-card" style="left: ${openMenuX - minusToMouseX + 10}px; top: ${openMenuY - minusToMouseY + 10}px; position: fixed;">
  <div class='banner-image'></div>
  <button class="view-full-profile primary" uid-user="${id}">View Full Profile</button>
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
  <br>
</div>`

  /*document.querySelectorAll('.content')[1]*/document.body.insertAdjacentHTML('beforeend', usercard)
  const card = document.querySelector('.user-card');
  //card.style.position = "fixed";

  card.style.top = mouseY - minusToMouseY + 10;
  card.style.left = mouseX - minusToMouseX + 10;

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

window.newUserPopUpCard = newUserPopUpCard;

document.querySelector('.channel-messages ul').addEventListener('scroll', (e) => {
  try{
    if (document.querySelector('.user-card')) {
      document.querySelector('.user-card').remove();
    }
  } catch (e) {
    console.log("No user cards.")
  }
});

document.getElementById("createInvite").addEventListener("click", async () => {
  await fetch("/api/v1/servers/invite", {
    "method": "POST",
    "body": JSON.stringify({"server": currServer.id}),
    "headers": {
      "token": localStorage.getItem("token")
    }
  })
})

export { newUserPopUpCard, sendMessageToChannel, switchChannel, fetchInfo, renderMessage, stopTyping, showTyping, getNewMessages }

window.currServer = currServer;
window.currChannel = currChannel;