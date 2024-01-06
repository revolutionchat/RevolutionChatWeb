const mainPagePath = "/"
const authorized = "{'jsonAuthorized': true, 'user': true}"

const main = (async () => {
  //main code or private code
  var url = window.location;
  var urlHost = url.host;
  var urlPath = url.pathname;
  var urlProtocol = url.protocol;
  window.addEventListener('DOMContentLoaded', async(e) => {
    if (urlPath.endsWith('/developer') || urlPath.endsWith('/developer/')) {
      await betaHomePage();
    } else if (urlPath.includes('/developer/apps/')) {
      await appConfigurePage(parseInt(urlPath.split('/')[3]));
    } else {
      await pageNotFound();
    }
  });
})();

const betaTest = (async() => {
  const loadingScreen = document.body.querySelector('.loadingScreen');
  const page = document.body.querySelector('.app .app.screen_betahome');

  loadingScreen.hidden = true;
  loadingScreen.style.display = "none";
  for (const f of loadingScreen.children) {
    f.hidden = true;
  }
  page.hidden = false;
  page.parentElement.hidden = false;
  document.body.classList.remove('loadingInProgress');
});

const betaHomePage = (async() => {
  const loadingScreen = document.body.querySelector('.loadingScreen');
  const page = document.body.querySelector('.app .app.screen_home');

  loadingScreen.hidden = true;
  loadingScreen.style.display = "none";
  for (const f of loadingScreen.children) {
    f.hidden = true;
  }
  page.hidden = false;
  page.parentElement.hidden = false;
  document.body.classList.remove('loadingInProgress');

  async function getApps() {
    const userapps = await (await fetch(`/developer/api/v1/get_apps`, {
      headers: {
        token: localStorage.getItem('token')
      }
    })).json();

    if (userapps['apps'].length != 0) {
      document.querySelector('.app .app.screen_home .portal__applications').innerHTML = null;
      for (const i of userapps['apps']) {
        /* <button class="back" hidden><span class="material-symbols-outlined">arrow_back</span></button> */
        const app = document.createElement('div');
        app.classList.add('app-card');
        app.innerHTML = `<button class="delete-app" name="${i['id']}"><span class="material-symbols-outlined">delete</span></button> &nbsp; &nbsp;${i['name']}#${i['discriminator']}`
        document.querySelector('.app .app.screen_home .portal__applications').appendChild(app);
        app.addEventListener('click', async (e) => {
          await appConfigurePage(i['id']);
        });
        app.querySelector('.delete-app').addEventListener('click', async (e) => {
          if (confirm(`Are you sure you want to delete the app: ${i['name']} ?\nThis app is unrecoverable and will be deleted completely.`)) {
            await (await fetch(`/developer/api/v1/delete_app`, {
              method: 'GET',
              headers: {
                token: localStorage.getItem('token'),
                app: i['id']
              }
            })).json();
            location.reload();
          }
        });
      }
    }
  }

  await getApps();

  document.body.querySelector('.app .app.screen_home .heading__main-2306 button.bg.blurple.rbutton').addEventListener('click', async (e) => {
    var prmt = window.prompt("What will your app be called today?");
    if (!prmt) return
    if (!window.navigator.onLine) return alert("You are offline. We cannot create the app right now.");
    console.log("[SERVER] Creating new application...");
    const create = await fetch(`/developer/api/v1/create_app`, {
      headers: {
        token: localStorage.getItem('token'),
        name: prmt
      }
    });
    const status = create.status;
    if (status == 401) {
      if (confirm("You aren't logged in. Take you to the login page?")) {
        window.location = "/app/login";
        return;
      } else return false;
    }
    if (status == 200) {
      alert("Application created successfully.");
      await getApps();
    
    } else if (status != 401) {
      
    }
  });
});

const appConfigurePage = (async(id) => {
  history.pushState({}, null, `/developer/apps/${id}`);

  const loadingScreen = document.body.querySelector('.loadingScreen');
  const page = document.body.querySelector('.app .app.screen_configure_app');

  loadingScreen.hidden = true;
  loadingScreen.style.display = "none";
  for (const f of loadingScreen.children) {
    f.hidden = true;
  }
  page.hidden = false;
  page.parentElement.hidden = false;
  document.body.classList.remove('loadingInProgress');
  
  const appInfo = await (await fetch(`/developer/api/v1/get_app`, { headers: {
    token: localStorage.getItem('token'),
    app: id
  }})).json();

  const app = document.body.querySelector('.app .app.screen_configure_app');
  const home = document.body.querySelector('.app .app.screen_home');

  home.hidden = true;
  app.hidden = false;

  app.querySelector('.appname-configure').innerText = `Configure ${appInfo['name']}#${appInfo['discriminator']}`;
  app.querySelector('.settings .bot-token-input').value = appInfo.token;
  app.querySelector('.settings .client-id-input').value = appInfo.id;
  app.querySelector('.settings .name-input').value = appInfo.name;

  app.querySelector('.add-bot-to-server').onclick = async(e) => {
    window.location.href = `/app/add_bot?client_id=${appInfo.id}`;
  }
});

const pageNotFound = (async() => {
  const loadingScreen = document.body.querySelector('.loadingScreen');
  const notfoundScreen = document.body.querySelector('.pageNotFound');
  
  notfoundScreen.hidden = false;
  notfoundScreen.parentElement.hidden = false;
  loadingScreen.hidden = true;
  loadingScreen.style.display = "none";
  for (const f of loadingScreen.children) {
    f.hidden = true;
  }
  document.body.classList.remove('loadingInProgress');
});