let connectAlert = document.getElementById('network-change-alert');
window.addEventListener('offline', (e) => {
  connectAlert.hidden = false;
});
window.addEventListener('online', (e) => {
  connectAlert.innerText = "Connecting...";
  setTimeout(function () {
    connectAlert.hidden = true;
    connectAlert.innerText = "Your network connectivity is unstable and we can't connect you.";
  }, 2000)
});