function onSentMessageMix(message) {
  if (message.includes('!mx')) {
    if (message.endsWith('play')) {
      sendMsgToChannel(`<b>My commands:</b> <code>!mx play</code>, <code>!mx whoami</code>, <code>!mx yt [videoId]</code><br><b>My prefix:</b> <code>!mx</code><br><i>Notice: commands are not supported yet.</i><br><small>Verified <span class="badge" style="background: mediumpurple;">BOT <i class="fa fa-check" aria-hidden="true"></i></span> response.</small>`,"FixMix")
    } else if (message.includes('yt')) {
      url = message.split('yt').pop().replace(' ', 'www.youtube.com/embed/')
      sendMsgToChannel(`<b>Video:</b><br><iframe src=https://${url} allowfullscreen></iframe><br><small>Verified <span class="badge" style="background: mediumpurple;">BOT <i class="fa fa-check" aria-hidden=true ></i></span> response.</small>`,"FixMix")
    } else {
        sendMsgToChannel(`<b>My commands:</b> <code>!mx play</code>, <code>!mx whoami</code>, <code>!mx yt [videoId]</code><br><b>My prefix:</b> <code>!mx</code><br><small>Verified <span class='badge' style='background: mediumpurple;'>BOT <i class='fa fa-check' aria-hidden='true'></i></span> response.</small>`,"FixMix")
    }
  }
}
