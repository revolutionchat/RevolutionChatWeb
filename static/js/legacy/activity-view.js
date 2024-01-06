let sId;
let pId;
let lastpage = "";
let alreadyLoaded = false;

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

setInterval(async function() {
  activityState = await getActivityState();

  if (document.querySelector('iframe').src == "https://youtube.com/embed/"+lastpage) {

  } else {
    lastpage = activityState["page"];
    document.querySelector('iframe').src = "https://youtube.com/embed/"+lastpage;
  }
}, 1000);

setInterval(async function() {
  ftch = await getActivityState();
  lastpage = ftch["page"]
}, 1000);

async function registerServer(id, personid) {
  sId = id;
  pId = personid;
  
  obj = await getActivityState();
  if (pId == obj["host"]) {
    document.querySelector('iframe').style['pointer-events'] = "auto";
  }
}

async function getActivityState() {
  ftch = await fetch(`/get_current_running/activity`, {headers: {serverId: sId}})
  nwres = await ftch.json()

  return nwres
}

async function leaveActivity() {
  return await getActivityState()
}

async function loadUp(e) {
  if (e.target.src == "0") { return false }
  if (alreadyLoaded) { return false } // prevent other loads
  if (!pId == await getActivityState()["host"]) return false;
  ftch = await fetch(`/activity/post_src`, {headers: {src: e.target.src, sid: sId}})
  console.log("synced.")
  alreadyLoaded = true;
}

document.querySelector('iframe').addEventListener('load', loadUp);

async function requestVideoPlayerControls() {
  let url = window.prompt("Enter the YouTube video watch id to display below.", "https://youtube.com/watch?v=");
  if (url.includes('://youtube')) {
    url = url.split('/watch?v=')[1]
    alreadyLoaded = true;
    await fetch(`/activity/post_src`, {headers: {src: url+"?autoplay=1&cc_load_policy=1&rel=0&origin=https://support.google.com&widgetid=1", sid: sId}});
    document.querySelector('iframe').src = "https://youtube.com/embed/"+url+"?autoplay=1&cc_load_policy=1&rel=0&origin=https://support.google.com&widgetid=1";
  }
}
