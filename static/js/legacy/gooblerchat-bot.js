let betaEnabled = false;

function onSentMessageG(message) {
  if (message.includes('!g')) {
    if (message.includes('info')) {
      module = message.split('info')[1].replace(' ', '')
      return sendMsgToChannel(`<b>Information about this bot:</b><br><p>Welcome! I am Revolution, or you can just call me Revolved Bot. I am the official Revolution Chat bot here to greet you. I autojoin servers, so you can see me anytime for help, updates, tips and more. I hope you like your journey here!</p><br><br><span>- Official Revolution Chat Bot <img src='/assets/images/Goobler-meowsicles.png' width='40' /></span><br><small>Verified <span class="badge" style="background: mediumpurple;">BOT <i class="fa fa-check" aria-hidden="true"></i></span> response.</small>`,"Revolution")
    } else if (message.includes('beta')) {
      sendMsgToChannel(`<b>Entered beta-mode.</b> This will activate a lot of beta features.`,"Revolution")
      return betaEnabled = true;
    } else if (message.includes('activity')) {
      if (betaEnabled == true) {
        return sendMsgToChannel(`<i>You cannot use activities yet.</i> Please try again <b>later.</b>`, "Revolution")
      } else {
        return sendMsgToChannel(`<i>Activities are a beta feature.</i> <b>Enable beta-mode</b> to test/view activities. <br><button class='danger' onclick="document.querySelector('#textInput').insertAdjacentText('beforeend', '!g beta');">Enable beta-mode.</button>`, "Revolution")
      }
    } else {
        return sendMsgToChannel(`<b>My commands:</b><code>!g help</code>, <code>!g whoami</code>, <code>!g info [module|optional]</code> <br><b>My prefix:</b> <code>!g</code><br><small>Verified <span class="badge" style="background: mediumpurple;">BOT <i class="fa fa-check" aria-hidden="true"></i></span> response.</small>`,"Revolution")
    }
  }
}