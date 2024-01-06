window.addEventListener('offline', (e) => {
  const alert = document.createElement('div');
  alert.classList.add("alert").add("alert-danger");
  alert.innerHTML = "Network is unable to connect or availability is limited.";
  document.querySelector('.content').appendChild(alert);
})