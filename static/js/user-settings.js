const otp = Math.random();

function closeModal() {
  document.querySelector('.modal').remove();
}

function selectItemSidebar(selection) {
  document.querySelector('.active-tab').classList.remove('active-tab');
  
  selection.classList.add('active-tab')
  window.location.href = `${selection.getAttribute('itemref')}`;
}
    
function createModal(defaultContent=`<h2>Welcome to Settings!</h2><p class='grayed'>This is where you can edit certain account settings, billing settings, profiles and more!</p><button class='success' onclick='closeModal();'>OK</button>`, loadingSeconds=2000) {
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

function changeInnerHTMLtoValueFromLocalStorage(item, key) {
  return item.innerHTML = localStorage.getItem(key);
}

function changeEmail(t) {
  email = document.querySelector('.emailfield').value;
  localStorage.setItem('email', email);
  closeModal();
  createModal(`
  <h2>Verify your email</h2>
  <hr class='sidebar-split'>
  <p>Please verify your email ${localStorage.getItem('email')} by going to your email and getting the OTP code.</p>
  <button class='primary' onclick='verifyEmail()'>I'm ready</button>
  `,70)
}

function verifyEmail() {
  closeModal();
  fetch(`/api/email/send/test/Goobler`, {
    headers: {
      "email": localStorage.getItem('email'), 
      "subject": "Goobler Chat email verification", 
      "message": `Hello!<br>Welcome to the Goobler Chat platform.<br>We got a request for someone <b>trying to verify their email.</b><br>If this was <b>you</b>, here is the OTP code: <br><h1>${otp}</h1><br><br>If this was not you, please disregard and delete this email <b>as normal.</b><br><br>Thank you,<br>Goobler Chat <img src='https://chat.goobler.ga/assets/images/Goobler-meowsicles.png' width=35 />`
    }
  })
  createModal(`
  <h2>Verify your account</h2>
  <hr class='sidebar-split'>
  <alertmodal></alertmodal>
  <p>Please verify your account using the OTP code sent to your email.</p>
  <input type='number' placeholder='Enter your OTP Code' class='u otpfield'/><br>
  <button onclick='confirmOTP()'>Verify</button>
  `, 1000);
}

function confirmOTP() {
  if (document.querySelector('.otpfield').value == otp) {
    document.querySelector('.modal-content alertmodal').style.color = "green";
    document.querySelector('.modal-content alertmodal').innerHTML = "Valid OTP code! Close the modal by clicking here: <button class='primary' onclick='closeModal();'>Close</button>";
  } else {
    document.querySelector('.modal-content alertmodal').innerHTML = "Invalid OTP code. Please try again or <button onclick='closeModal(); createModal(`<h2>Connect your Email</h2><hr class='sidebar-split'><br><form><input type='email' required placeholder='Change Email' class='emailfield'><br><br><button type='button' class='primary' onclick='changeEmail(this)'>Connect</button></form>`);' class='primary'>change your email.</button>";
  }
}

function changePhone() {
  phone = document.querySelector('.phonefield').value;
  localStorage.setItem('phone', phone);
  closeModal();
}

window.addEventListener('DOMContentLoaded', (e) => {
  const change = document.querySelector('#deviceName');
  if (change) {
    determineDevice();
  } else {
    console.log("Unknown element")
  }
});

function getBrowser(useragent) {
  // firefox check
  if (useragent.includes('Firefox') && !useragent.includes('Seamonkey')) {
    return "Firefox";
  }
  if (useragent.includes('Seamonkey')) {
    return "Seamonkey";
  }
  if (useragent.includes('Chrome') && !useragent.includes('Chromium') && !useragent.includes('Edg.*')) {
    return "Chrome"
  }
  if (useragent.includes('Chromium')) {
    return "Chromium"
  }
  if (useragent.includes('Safari') && !useragent.includes('Chrome') && !useragent.includes('Chromium')) {
    return "Safari";
  }
  if (useragent.includes('OPR')) {
    return "Opera 15+";
  }
  if (useragent.includes('Opera')) {
    return "Opera 12-";
  }
}

function determineDevice() {
  const change = document.querySelector("#deviceName");
  let agent = window.navigator.userAgentData; // {brands: [...], platform: "...", mobile: false/true}
  /*if (agent) {*/
  change.innerHTML = `Platform: ${navigator.platform} | Browser: ${getBrowser(navigator.userAgent)}`; /*? */
  /*}?*/
  // This isn't Python
  // You don't need to restart the server
  // oh yes, its only for the html pages/templates if we update them
  // what is brands? https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData mdn reference ^
  // It's expermimental so it will break half of the time
  // in firefox and safari, it isn't supported
  // But those browsers are popuar yes, i am removing brands
  // brands are just for the browser, we can determine the browser via useragent
  // no you can't meowy u there?!?!?!?!?!?!!?!?!?!?!?!?!?!??!? lol
  // eric? uhm, i am confused at what u just wrote
  // "people with @ symbol in their name be like:" ?yes?
  //I was just spamming random text/giggigigiiiigiiiiig
}