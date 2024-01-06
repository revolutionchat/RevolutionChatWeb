from flask import Flask, render_template, send_file, send_from_directory, request, redirect, session, jsonify, Response, abort
#from replit import db as repldb
from datetime import datetime
import pyrebase as pyrebase
import os, json, time, random, requests, classes
import api, aiModel
import auth as Auth
auth = Auth.auth
from requests.exceptions import HTTPError
import api  #just api
from werkzeug.exceptions import NotImplemented
import hashlib, base64
from flask_cors import cross_origin
import collections.abc

collections.Hashable = collections.abc.Hashable

app = Flask(__name__, template_folder="./pages")
account = "public"
# THIS FUNCTION HERE (
app.config['secret_key'] = "reovokfiergubtruybgybiyufbreyvft4evbrygbrtyuinbgyt5btfvertyvfytgt" #os.environ['regen_secret_key']
app.secret_key = "reovokfiergubtruybgybiyufbreyvft4evbrygbrtyuinbgyt5btfvertyvfytgt" #os.environ['regen_secret_key']
# ) REGENERATES THE SECRET KEY EVERY RUN TO PREVENT LEAKS

aiModel = aiModel.RevolvedAI(app)

firebaseConfiguration = {
  "apiKey": "AIzaSyDkGHNQ-Kl3G6bujqay-qjMo6CGY2GMxZw",
  "authDomain": "my-goodbarber-project-263704.firebaseapp.com",
  "databaseURL": "https://my-goodbarber-project-263704.firebaseio.com",
  "storageBucket": "my-goodbarber-project-263704.appspot.com"
}
firebase = pyrebase.initialize_app(firebaseConfiguration)
fbauth = firebase.auth()
db = firebase.database()

verrcode = random.randint(1000, 9999)

userObject = {
  "name": "Cynamical",
  "discriminator": "#0001",
  "presence": "Night sky shining like a light :)",
  "status": classes.UserStatus.idle
}

privateServers = json.load(open('./privateServers.json'))["auto"]
servers = json.load(open('./servers.json'))["auto"]
groups = os.listdir('./messages/groups')

reports = json.load(open('./reports.json'))["auto"]

gooblerAutomatedSystemMessages = json.load(
  open('./automatedSystem.json'))["auto"]
gooblerAutoIssueSuggestionList = json.load(
  open('./autoIssueSuggestions.json'))["auto"]

conversationIds = ["1", "2", "3"]

#mongoclientssh = os.environ['mongo_url']
#client = pymongo.MongoClient(mongoclientssh)
#db = client.test


@app.route('/')
def home():
  #spotipyUtils.get_current_track(access_token=os.environ.get('access_token'))
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('home.html', panel_message=json.load(open('./site-data.json'))['global']['panel-message'])

@app.route('/tests/a0')
def a0dtest():
  return render_template('lemail.html')

@app.route('/tests/a1')
def a1dtest():
  messageamount = 0
  dmsamount = 0
  for i in os.listdir('./messages/dms/'):
    if i.endswith('.json'):
      dmsamount+=1
  for i in os.listdir('./messages/servers'):
    if i.endswith('.json'):
      server = json.load(open(f'./messages/servers/{i}'))['messages']
      messageamount += len(server)
  serversamount = len(json.load(open('servers.json'))['auto'])
  return render_template('ld.html', usersamount=len(json.load(open('./accounts.json'))["auto"]), messageamount=messageamount, serversamount=serversamount, dmsamount=dmsamount)

@app.route('/serviceWorker.js')
def serviceworker():

  return send_file("./serviceWorker.js")

  js = open('./serviceWorker.js', 'r').read()
  return Response(js, mimetype='text/javascript')


#@app.route('/new_ui/<file>')
#def getfile(file):
#if file in os.listdir('./pages/new_ui'):
# return render_template(f'new_ui/{file}')
#else: return "file does not exist"


@app.route('/jobs')
def jobspage():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('jobs.html')


@app.route('/store/basket')
def storebasket():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('basket.html')


@app.route('/download')
def downloadpage():
  #return "Dude, we are working on something way cooler. Check back later."
  return redirect('/app')


@app.route('/store')
def storepage():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('store.html')


@app.route('/store/goobux')
def goobuxstorepage():
  url = request.url
  if "/store/goobux" in url:
    print("Somebody has entered the store")
    return render_template('goobux.html',
                           channel="Goobux",
                           currentaccount="none")
    #return "Dude, we are working on something way cooler. Check back later."


@app.route('/support')
def supportpage():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('support.html')


@app.route('/beta')
def betaclient():
  user = {}
  for i in json.load(open('./users.json'))['auto']:
    if i['id'] == session.get('uid'):
      user = i
      break
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('betaClient.html',
                         currentAccount="public",
                         guilds=servers,
                         user=session['usern'].split('@')[0],
                         email=session['email'],
                         usertag=user.get('discriminator'))


@app.route('/safety')
def safetypage():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('safety.html')


@app.route('/app')
def webAppOrClientLoading():
  return render_template("betaClient.html")
  return render_template(
    'new_app_loader.html',
    rand_load_txt=random.choice([
      "Did you know that you are an early user to log on to Revolution? Crazy!",
      "We added a new loading screen.. Looks?",
      "Revolution has been made to be accessible for everyone."
    ]))


#return "Dude, we are working on something way cooler. Check back later."


@app.route('/app/login')
def clientloginapp():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('login_app.html', session=session)

@app.route('/app/login/authorize-with-app')
def clientloginappdesktop():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('login_app_authorize_desktop.html', session={})

@app.route('/app/login/authorize-with-app/finish', methods=["POST"])
def lauthappw():
  #return "Dude, we are working on something way cooler. Check back later."
  email = request.form.get("email")
  password = request.form.get("password")
  user = None
  try:
    user = fbauth.sign_in_with_email_and_password(email, password)
    print(user)
  except HTTPError as ex:
    print(str(ex))
    #If there is any error, redirect back to login
    if "EMAIL_NOT_FOUND" in str(ex):
      return redirect(
        f"/login/method/account?alert=You don't have an account with this email."
      )
    if "INVALID_PASSWORD" in str(ex):
      return redirect(
        f"/login/method/account?alert=The password you put in is incorrect.")
    if "USER_DISABLED" in str(ex):
      return redirect(
        f"/login/method/account?alert=This account has been disabled. To re-enable your account, please contact support."
      )
    return redirect(
      f"/login/method/account?alert=This is a problem on our end. You cannot login at this time."
    )
  session["email"] = user["email"]
  session["aid"] = user["localId"]
  accountsLoad = json.load(open('./accounts.json'))
  accountInfo = {}
  for i in accountsLoad["auto"]:
    if i['id'] == user["localId"]:
      accountInfo = i
  unhashed = random.randint(0, 199293472364)
  h = hashlib.new('sha256')
  h.update(str(unhashed).encode())
  token = h.hexdigest()
  with open('./accounts.json', 'w') as jsonFile:
    for i in accountsLoad["auto"]:
      if i['id'] == user["localId"]:
        i["token"] = token
    json.dump(accountsLoad, jsonFile)
  session["uid"] = accountInfo["user"]
  usersLoad = json.load(open('./users.json'))["auto"]
  userInfo = {}
  for i in usersLoad:
    if i['id'] == accountInfo["user"]:
      userInfo = i
  session["usern"] = userInfo["name"]
  #return f"<script>localStorage.setItem('token', {unhashed}); window.location = '/app';</script>"#redirect("/app")
  return f"""<form hidden action="http://localhost:9273/auththw"> <input type="text" name="token" value="{unhashed}"> </form> <script>document.querySelector('form').submit();</script>
"""


@app.route('/app/login/authorize-with-app/new', methods=["POST"])
def lauthappwv2():
  #return "Dude, we are working on something way cooler. Check back later."
  email = request.headers.get("email")
  password = request.headers.get("password")
  user = None
  try:
    user = fbauth.sign_in_with_email_and_password(email, password)
    print(user)
  except HTTPError as ex:
    print(str(ex))
    #If there is any error, redirect back to login
    if "EMAIL_NOT_FOUND" in str(ex):
      return jsonify({
        "error": "You don't have an account with this email."
      })
    if "INVALID_PASSWORD" in str(ex):
      return jsonify({
        "error": "The password you put in is incorrect."
      })
    if "USER_DISABLED" in str(ex):
      return jsonify({
        "error": "This account has been disabled. To re-enable your account, please contact support."
      })
    return jsonify({
      "error": "This is a problem on our end. You cannot login at this time."
    })
  #session["email"] = user["email"]
  #session["aid"] = user["localId"]
  accountsLoad = json.load(open('./accounts.json'))
  accountInfo = {}
  for i in accountsLoad["auto"]:
    if i['id'] == user["localId"]:
      accountInfo = i
  unhashed = random.randint(0, 199293472364)
  h = hashlib.new('sha256')
  h.update(str(unhashed).encode())
  token = h.hexdigest()
  with open('./accounts.json', 'w') as jsonFile:
    for i in accountsLoad["auto"]:
      if i['id'] == user["localId"]:
        i["token"] = token
    json.dump(accountsLoad, jsonFile)
  #session["uid"] = accountInfo["user"]
  usersLoad = json.load(open('./users.json'))["auto"]
  userInfo = {}
  for i in usersLoad:
    if i['id'] == accountInfo["user"]:
      userInfo = i
  #session["usern"] = userInfo["name"]
  #return f"<script>localStorage.setItem('token', {unhashed}); window.location = '/app';</script>"#redirect("/app")
  return jsonify({
    "token": unhashed,
    "aid": user["localId"],
    "email": user["email"],
    "account": userInfo,
    "uid": accountInfo["user"]
  })

@app.route('/login/method/account')
def loginaccount():
  #return "Dude, we are working on something way cooler. Check back later."
  return render_template('login_account.html', session=session, args=request.args)


@app.route('/login/action/account', methods=["POST"])
def loginaccountaction():
  #return "Dude, we are working on something way cooler. Check back later."
  email = request.form.get("email")
  password = request.form.get("password")
  user = None
  try:
    user = fbauth.sign_in_with_email_and_password(email, password)
    print(user)
  except HTTPError as ex:
    print(str(ex))
    #If there is any error, redirect back to login
    if "EMAIL_NOT_FOUND" in str(ex):
      return redirect(
        f"/login/method/account?alert=You don't have an account with this email."
      )
    if "INVALID_PASSWORD" in str(ex):
      return redirect(
        f"/login/method/account?alert=The password you put in is incorrect.")
    if "USER_DISABLED" in str(ex):
      return redirect(
        f"/login/method/account?alert=This account has been disabled. To re-enable your account, please contact support."
      )
    return redirect(
      f"/login/method/account?alert=This is a problem on our end. You cannot login at this time."
    )
  session["email"] = user["email"]
  session["aid"] = user["localId"]
  accountsLoad = json.load(open('./accounts.json'))
  accountInfo = {}
  for i in accountsLoad["auto"]:
    if i['id'] == user["localId"]:
      accountInfo = i
  unhashed = random.randint(0, 199293472364)
  h = hashlib.new('sha256')
  h.update(str(unhashed).encode())
  token = h.hexdigest()
  with open('./accounts.json', 'w') as jsonFile:
    for i in accountsLoad["auto"]:
      if i['id'] == user["localId"]:
        i["token"] = token
    json.dump(accountsLoad, jsonFile)
  session["uid"] = accountInfo["user"]
  usersLoad = json.load(open('./users.json'))["auto"]
  userInfo = {}
  for i in usersLoad:
    if i['id'] == accountInfo["user"]:
      userInfo = i
  session["usern"] = userInfo["name"]
  return f"<script>localStorage.setItem('token', {unhashed}); window.location = '/app';</script>"#redirect("/app")


@app.route('/register/action', methods=["POST"])
def registerAction():
  #return "Dude, we are working on something way cooler. Check back later."
  username = request.form.get("username")
  email = request.form.get("email")
  password = request.form.get("password")
  user = None
  try:
    user = fbauth.create_user_with_email_and_password(email, password)
  except HTTPError as ex:
    print(str(ex))
    #If there is any error, redirect back to login
    if "EMAIL_EXISTS" in str(ex):
      return redirect(
        f"/register?alert=A account with that email already exists!")
    else:
      return redirect(
        f"/register?alert=This is a problem on our end. You cannot register at this time."
      )
  session["email"] = user["email"]
  session["aid"] = user["localId"]
  userid = random.randint(0, 199293472364)
  session["uid"] = userid
  unhashed = random.randint(0, 199293472364)
  h = hashlib.new('sha256')
  h.update(str(unhashed).encode())
  token = h.hexdigest()
  accountsLoad = json.load(open('./accounts.json'))
  with open('./accounts.json', 'w') as jsonFile:
    accountsLoad['auto'].append({"id": user["localId"], "user": userid, "token": token})
    json.dump(accountsLoad, jsonFile)
  discrim = random.randint(1, 9999)
  usersLoad = json.load(open('./users.json'))
  with open('./users.json', 'w') as jsonFile:
    usersLoad['auto'].append({
      "id": userid,
      "name": username,
      "discriminator": f'{discrim:04}',
      "description": ""
    })
    json.dump(usersLoad, jsonFile)
  session["usern"] = username
  return f"<script>localStorage.setItem('token', {unhashed}); window.location = '/app';</script>"


@app.route('/action/add', methods=["POST", "GET"])
def addUserAction():
  #return "Dude, we are working on something way cooler. Check back later."
  uname = request.form.get("username")
  username = uname.split("#")[0]
  discriminator = uname.split("#")[1]
  user = None
  load = json.load(open('./users.json'))["auto"]
  data = auth(request.form.get("token"))
  if not data["valid"]:
    return abort(403)
  user = data["user"]
  for i in os.listdir('./messages/dms/'):
    io = json.load(open(f"./messages/dms/{i}"))
    if user["id"] in io["users"] and session["uid"] in io["users"]:
      return redirect("/channels/@me/" + str(io["id"]))
  # create a text file for writing
  dmId = random.randint(0, 199293472364)
  with open('./messages/dms/' + str(dmId) + ".json", 'w') as fp:
    json.dump(
      {
        "id": dmId,
        "users": [session["uid"], user["id"]],
        "messages": []
      }, fp)
  return redirect("/channels/@me/" + str(dmId))

@app.route('/channels/<server>/<channel>')
def serverChannel(server, channel):
  return render_template('betaClient.html')

@app.route('/channels/@me/<id>')
def webAppOrClientMessage(id):
  return render_template("betaClient.html")
  if 'usern' not in session:
    return redirect("/login")
  for i in os.listdir('./messages/dms/'):
    io = json.load(open(f"./messages/dms/{i}"))
    if str(io["id"]) == id:
      #session['conversation'] = id
      #return "Dude, we are working on something way cooler. Check back later."
      user = {}
      for i in json.load(open('./users.json'))['auto']:
        if i['id'] == session.get('uid'):
          user = i
          break
      if user["id"] not in io["users"]:
        return abort(403)
      return render_template('betaClient.html')
      return render_template('message_a_user.html',
                             currentAccount="public",
                             convId=io["id"],
                             guilds=servers,
                             user=session['usern'].split('@')[0],
                             email=session['email'],
                             usertag=user.get('discriminator'))
  return abort(404)


@app.route('/channels/<id>')
def webAppOrClient(id):
  return render_template("betaClient.html")
  if 'usern' not in session:
    return redirect("/login")
  if id == "@me":
    if 'usern' and 'email' in session:
      user = {}
      for i in json.load(open('./users.json'))['auto']:
        if i['id'] == session.get('uid'):
          user = i
          break
      return render_template("betaClient.html")
      return render_template('client.html',
                             currentAccount="public",
                             guilds=servers,
                             user=session['usern'].split('@')[0],
                             email=session['email'],
                             usertag=user.get('discriminator'))
    else:
      return redirect('/login')
  if id == "@servers":
    if 'usern' and 'passw' in session:
      return str(servers)
    else:
      return render_template('app.html',
                             channel="Home",
                             currentaccount="public")
  if id == "@logoutAction":
    if 'usern' and 'passw' in session:
      session.clear()
      return clientorwebapplogin()
    else:
      return clientorwebapplogin()
  if id == "@betaTest":
    return render_template("betaClient.html")
    return render_template('client.html',
                           channel="BETA",
                           currentaccount="public",
                           guilds=servers)
  if id == "@system":
    user = {}
    for i in json.load(open('./users.json'))['auto']:
      if i['id'] == session.get('uid'):
        user = i
        break
    return render_template("betaClient.html")
    return render_template('system_msg_client.html',
                           channel=session.get('usern'),
                           currentaccount="public",
                           guilds=servers,
                           sys_messages=gooblerAutomatedSystemMessages,
                           user=session['usern'].split('@')[0],
                           usertag=user.get('discriminator'))
  if id == "@support":
    return render_template(
      'message_a_user.html',
      account="public",
      user={
        "name": "Revolution Support",
        "discriminator": "#0001",
        "presence": "Night sky shining like a light :)",
        "status": classes.UserStatus.idle,
        "badges": ["VERIFIED ✓"]
      },
      previousMessages=[
        #Get from firebase
      ])
  if id == "@ai":
    user = {}
    for i in json.load(open('./users.json'))['auto']:
      if i['id'] == session.get('uid'):
        user = i
        break
    return render_template("betaClient.html")
    return render_template('revolvedai.html',
                           user=session['usern'].split('@')[0],
                           usertag=user.get('discriminator'))
  if id == "@settings":
    user = {}
    for i in json.load(open('./users.json'))['auto']:
      if i['id'] == session.get('uid'):
        user = i
        break
    return render_template('user_settings.html',
                           user=session.get('usern'),
                           usertag=user.get('discriminator'),
                          useri=user)

  if id == "@report":
    if session.get('usern') == None:
      return redirect('/login')
    return render_template('reportissue.html', user=session['usern'])

  if id == "chat":
    return render_template('message_a_user.html', account="public")

  if id == "@add":
    user = {}
    for i in json.load(open('./users.json'))['auto']:
      if i['id'] == session.get('uid'):
        user = i
        break
    return render_template("betaClient.html")
    return render_template('add_a_user.html',
                           currentAccount="public",
                           guilds=servers,
                           user=session['usern'].split('@')[0],
                           email=session['email'],
                           usertag=user.get('discriminator'))
  abort(404)


@app.route('/api/sendreport', methods=['POST'])
def sendreporttoguilded():
  form = request.form
  webhookurl = os.environ['webhookurl']

  payload = {
    "embeds": [{
      "title": "Report from GooblerChat",
      "url": "https://chat.goobler.ga/channels/@report",
      "description": f"{form.get('issue')}",
      "footer": {
        "icon_url":
        "https://chat.goobler.ga/assets/images/Goobler-meowsicles.png",
        "text":
        f"User: {form.get('user')} | Official report from Goobler Chat | {str(datetime.now()).split('.')[0]}"
      }
    }]
  }

  requests.post(webhookurl, json=payload).raise_for_status()
  return "<h1>Your request has been submitted!</h1> <a href='/'><button>Go Back</button></a>"


@app.route('/channels/@sendTest')
def sendTest():
  if request.args.get('email'):
    server = classes.EMail.connect()
    classes.EMail.send(
      f"Your code is<br><br> <h1>{db['verifycode']}</h1> <br><br>Use it within 24 hours.",
      "Your verification code is here.", request.args.get('email'), server)
    return (
      "<form method='get'><input type='number' name='code'> <button>Submit</button> </form> <script> document.querySelector('form').onsubmit = function () { if (document.querySelector('form').children[0].value == %s) {alert('Code correct!')} else {alert('Code incorrect!')} };</script>"
      % db['verifycode'])
  else:
    return "<form method='get'><input type='email' name='email'></form>"


@app.route('/support/submit', methods=['POST'])
def supportFormSubmit():
  form = request.form
  suggestionsUponSearch = []
  if request.form:
    user = form.get('username')
    mail = form.get('email')
    issue = form.get('issue')
    for issues in gooblerAutoIssueSuggestionList:
      if issue in issues:
        suggestionsUponSearch.append(issues)
      elif issue in issues.lower():
        suggestionsUponSearch.append(issues)

    # Send the email with suggestions

    server = classes.EMail.connect()
    classes.EMail.send(
      f"## <b>Your request has been recieved</b> <br> Please wait for an attendant to hop on or you can use some suggestions that were recommended: <br> {[f'<li>{str(i)}</li>' for i in gooblerAutoIssueSuggestionList]} <br><br>Thank you <b>{user}</b>,<br><b>Goobler Support</b> team.",
      "Support request recieved.", mail, server)
    return redirect('/?from-email-support-request')


@app.route('/setLoginDetails', methods=['POST', 'GET'])
def setlogindetailsthroughgoobleroauth():
  session['email'] = request.headers.get('email')
  session['passw'] = "gooblersecuresetpassword"

  return "set", 200


@app.route('/channels/@join')
def joinAServer():
  serverId = request.args.get('id')
  return render_template('join_server.html', Id=serverId)


@app.route('/channels/@join/endpoint', methods=['POST'])
def joinAServerEndpoint():
  endpointURI = request.form.get('url')
  for server in servers:
    if server in servers:
      try:
        return redirect(f'/channels/@s/{endpointURI}')
      except:
        return redirect(f'/channels/@s/{endpointURI}')
  for server in privateServers:
    if server in privateServers:
      try:
        return redirect(f'/channels/@sLocal/{endpointURI}')
      except TypeError as Ex:
        return Ex


@app.route('/login/action', methods=['POST'])
def loginusingsession():
  rwquser = request.form['usrname']
  rwqpass = request.form['passw']
  if rwquser and rwqpass:
    session['passw'] = rwqpass
    session['usern'] = rwquser
    return redirect('/app')


@app.route('/login/action/google', methods=['POST'])
def loginusinggoogle():
  json = request.get_json()
  name = str(json.get('name'))
  id = str(json.get('id'))
  email = str(json.get('email'))
  imageurl = str(json.get('imgurl'))
  print(json)
  return "OK", 200


@app.route('/login/action/google/info')
def loginusinggoogleinfo():
  name = request.args.get('name')
  session['usern'] = name
  print(name)
  session['passw'] = "PASSWORDHERE_IDK"
  print("Gotten info from Google OAuth2.0")
  time.sleep(2)
  return redirect('/app')


@app.route('/login')
def clientorwebapplogin():
  url = request.url
  if "/login" in url:
    print("Login on normal detected")
    return redirect('/app/login')
  if "/channels/" in url:
    print("Login on app detected")
    return redirect('/app/login')


@app.route('/register')
def clientorWebAppRegister():
  return render_template('register_app.html')


@app.route('/docs/api')
def testPage():
  return render_template('API_docs.html')


@app.route('/channels/@sLocal/<serverID>')
def serverLocal(serverID):
  for s in privateServers:
    if s["serverid"] == serverID:
      serverName = s["name"]
      serverABBR = s["abbr"]
      serverDefaultChannel = s["channelid"]
      serverChannels = s["channels"]
      serverRoles = s["roles"]
      serverEmotes = s["emotes"]
      serverEmojis = s["emojis"]
      serverId = s["serverid"]
      serverColor = s["color"]

      return render_template('servers.html',
                             sName=serverName,
                             sABBR=serverABBR,
                             sDefaultChannel=serverDefaultChannel,
                             sChannels=serverChannels,
                             sRoles=serverRoles,
                             sEmotes=serverEmotes,
                             sId=serverId,
                             sEmojis=serverEmojis,
                             sColor=serverColor,
                             guilds=servers,
                             channel="#play")


@app.route('/channels/@s/<serverID>')
def server(serverID):
  if 'usern' not in session:
    return redirect("/login")
  for s in servers:
    if s["serverid"] == serverID:
      serverName = s["name"]
      serverABBR = s["abbr"]
      serverDefaultChannel = s["channelid"]
      serverLogo = s["imgurl"]
      serverChannels = s["channels"]
      serverReadonly = s["readonly"]
      serverRoles = s["roles"]
      serverEmotes = s["emotes"]
      serverEmojis = s["emojis"]
      serverId = s["serverid"]
      serverColor = s["color"]
      serverUsersChatted = json.load(open('./servers.json'))
      for i in serverUsersChatted["auto"]:
        if i["serverid"] == serverId:
          resultforuserschatted = i["users_chatted"]

      user = {}
      for i in json.load(open('./users.json'))['auto']:
        if i['id'] == session.get('uid'):
          user = i
          break
      

      return render_template(
        'servers.html',
        sName=serverName,
        sABBR=serverABBR,
        sDefaultChannel=serverDefaultChannel,
        sChannels=serverChannels,
        sReadonly=serverReadonly,
        sRoles=serverRoles,
        sEmotes=serverEmotes,
        sId=serverId,
        sEmojis=serverEmojis,
        sColor=serverColor,
        sLogo=serverLogo,
        guilds=servers,
        channel="#" + serverChannels[0],
        message_list=json.load(
          open(
            f'./messages/servers/{serverId + "~" + serverChannels[0]}.json')),
        user=session['usern'].split('@')[0],
        usertag=user.get('discriminator'),
        uid=session['uid'],
        users_chatted_in_server=resultforuserschatted)

  return "I have no idea what you were looking for.", 404


@app.route('/channels/@g/<id>')
def group(id):
  for group in groups:
    if id + ".json" in group:
      return


# DEVELOPERS AND API INTERACTIVES:
@app.route('/developers')
def developer_portal():
  return render_template('developer.html', session=session)


@app.route('/developers/create_app', methods=['POST'])
def developer_portal_create_app_endpoint():
  app_client = f"{random.randint(5,39048)}-app"
  app_secret = f"{random.randint(8000, 9493274)}-app_sec=1"
  file_template = f'{json.load(open("./appsAvailable/default.json", "r"))}'
  print(file_template)
  with open(f'./appsAvailable/{app_client}.json', 'w') as f:
    f.write(file_template %
            (request.form.get('name'), None, app_client, app_secret,
             f"token={app_secret}=app", None, None))
    f.close()
    return redirect(f'/developers/{app_client}')


@app.route('/developers/articles/<article>')
def articlePageDev(article):
  if article == "premade-bot-applications":
    return f"Revolution is making a feature called <b>Premade Bot Applications</b>, aka making a bot app by our <b>script API</b>."


@app.route('/developers/<app_client>')
def openApplication(app_client):
  if app_client + ".json" in os.listdir('./appsAvailable'):
    with open(f'./appsAvailable/{app_client}.json', 'r') as f:
      return render_template('dev_portal_project.html', f=f)
  else:
    return "This app could not be found. I am sorry if this has happened to you.."


# APIS


@app.route('/api/hosts/hostforever', methods=['POST', 'PUT'])
def hostForeverThroughAPI():
  if request.form.get('auth') == "Goobl2Test":
    for each in os.listdir('./bots'):
      for each2 in os.listdir('./bots/' + each):
        if each2:
          status = open(f'./bots/{each}/settings/status', 'r').read()
          presence = open(f'./bots/{each}/settings/presence', 'r').read()
          return jsonify({
            "tokenExpires": "never",
            "status": status,
            "presence": presence
          })
        else:
          return f"Not able to connect application."
  else:
    return "Error, not a valid token.", 404


@app.route('/api/roles/determine')
def apidetermineuserrole():
  return classes.UserRoles.determine(request.args.get('email'))


@app.route('/api/connect/goobleroauth', methods=['POST'])
def connectGooblerOauthAccount():
  session['usern'] = request.form.get('email').split('@')[0]
  session['email'] = request.form.get('email')
  session['passw'] = request.form.get('pass')
  return f"<script>var message = `logged-in?{session['email']}={session['passw']}+{session['usern']}`; window.parent.postMessage(message, `*`);</script>", 200


@app.route('/api/connect/goobleroauth/manual')
def connectGooblerOauthAccountManually():
  email = request.args.get('email')
  passw = request.args.get('passw')
  usern = request.args.get('usern')

  session['usern'] = usern
  session['email'] = email
  session['passw'] = passw
  return redirect('/app')


# END DEV APPS AND APIS


@app.route('/style.css')
def styling():
  return send_file('./assets/css/style.css')


@app.route('/assets/images/<img>')
def image(img):
  return send_from_directory('./assets/images', img)


from traceback import format_tb


# Errors
@app.errorhandler(Exception)
def internal_server_error(e):
  print(e)

  webhookurl = os.environ['crash_webhook']
  newline = "\n"

  payload = {
    "username":
    "Revolution",
    "avatar_url":
    "https://revolution-web.repl.co/assets/images/Revolution.png",
    "embeds": [{
      "title": "Revolution Error",
      "color": 0xff0000,
      "description":
      f"{ str(e) + newline + newline.join(format_tb(e.__traceback__))}",
      "footer": {
        "icon_url":
        "https://revolution-web.repl.co/assets/images/Revolution.png",
        "text":
        f"Revolution Crash Report | {str(datetime.now()).split('.')[0]}"
      }
    }]
  }

  requests.post(webhookurl, json=payload).raise_for_status()

  if "usern" in str(e):
    return redirect("/app")

  if type(e).__name__ == "TemplateNotFound":
    return app.handle_user_exception(NotImplemented())
  return render_template('error/500/index.html'), 500


@app.errorhandler(500)
def error500(e):
  return render_template('error/500/index.html'), 500


@app.errorhandler(501)
def error501(e):
  return render_template('error/501/index.html'), 501


@app.errorhandler(404)
def error404(e):
  return render_template('error/404/index.html'), 404


@app.errorhandler(403)
def error403(e):
  return render_template('error/403/index.html'), 403


@app.errorhandler(401)
def error401(e):
  return render_template('error/401/index.html'), 401


@app.route('/apps/moderation')
def modapp():
  type = request.args.get('type')
  if type.lower() == "staff":
    return render_template('modApps/staff.html')
  else:
    return "Sorry, this application form wasn't found.", 404


from flask_websockets import WebSockets, ws, has_socket_context

activeConnections = []
# For each new connection, add it to the list above

websocket = WebSockets(app, patch_app_run=True)

api.apiCog(app, websocket, activeConnections)
app.config.update(SESSION_COOKIE_SECURE=True, SESSION_COOKIE_SAMESITE='Strict')


# what eric?
@websocket.on_open
def open_websocket():
  print("New client.")
  current_client = ws.handler.active_client  # just ws
  current_client.uid = random.randint(0, 199293472364)  # something like that
  activeConnections.append({
    "uid": current_client.uid,
    "state": "connected",
    "client_address": ws.handler.client_address,
    "channels": [],
    "voiceConnectedAt": None
  })


@websocket.on_message
def on_message(message):
  current_client = ws.handler.active_client
  #if 'connectionuId' in message:
  #activeConnections.append({"uid": current_client.uid, "state": "connected", "client_address": ws.handler.client_address})
  print(message)
  data = json.loads(message)
  #if 'message' in message:
  #websocket.broadcast({"message": f"Message from friends: {message['message']}"})
  def check_token():
    valid_token = False
    userid = None
    if data["token"] == "guest":
      valid_token = True
      userid = 173193019279
    h = hashlib.new('sha256')
    h.update(str(data["token"]).encode())
    token = h.hexdigest()
    for i in os.listdir('./assets/application_tokens/'):
      io = json.load(open(f"./assets/application_tokens/{i}"))
      if io['token'] == data['token']:
        valid_token = True
        userid = io['id']
    accountload = json.load(open("./accounts.json"))["auto"]
    for i in accountload:
      if i.get('token') == token:
        valid_token = True
        userid = i['user']
    if valid_token:
      userload = json.load(open("./users.json"))["auto"]
      for i in userload:
        if i['id'] == userid:
          global user
          user = i
    print(userid)
    #print(user)
    return valid_token

  if data.get("type") == "login":
    if check_token():
      current_client.logged_in = True
      load = json.load(open('./servers.json'))["auto"]
      load2 = json.load(open('./users.json'))["auto"]
      for i in load:
        result = i

        def getUser(usera):
          for c in load2:
            if c["id"] == usera["id"]:
              return c

        result["users_chatted"] = list(map(getUser, i["users_chatted"]))

        userInServer = False
        for c in result["users_chatted"]:
          if c["id"] == user["id"]:
            userInServer = True
        if not result.get("public") and not userInServer:
          continue
        ws.send(json.dumps({"type": "serverInfo", "server": i}))
      print(user)
      ws.send(json.dumps({"type": "ready", "user": user}))
    else:
      ws.send(json.dumps({"type": "error", "message": "Invalid token.", "code": "invalid_token"}))
  if data.get("type") == "follow":
    if check_token():
      for i in activeConnections:
        if i['uid'] == current_client.uid:
          for channel in data["channels"]:
            if channel == "deltarune":
              print("Deltarune is a server, not a channel.")
            can_access = True
            for io in os.listdir('./messages/dms/'):
              ion = json.load(open(f"./messages/dms/{io}"))
              if str(ion['id']) == channel and user['id'] not in ion['users']:
                can_access = False
            if can_access:
              i["channels"].append(channel)
          print(i["channels"])
  if data.get('type') == "resetfollowlist":
    if check_token():
      for i in activeConnections:
        if i['uid'] == current_client.uid:
          i['channels'] = []
  if data.get('type') == "voiceTransmit":
    decodedData = data['data']
    id = data['id']
    if check_token():
      for i in activeConnections:
        clientList = list(websocket.active_sockets)[0].handler.server.clients
        if i['uid'] == current_client.uid: pass
        else:
          if i['client_address'] in clientList:
            clientList[i['client_address']].ws.send(
              json.dumps({
                "type": "voiceBroadcast",
                "id": id,
                "data": decodedData
              })
            )
  """
    if 'message' in data:
      ws.send(message)
      for i in activeConnections:
        if i['uid'] == current_client.uid:
          print(ws.handler.server.clients[i['client_address']].ws)
          ws.handler.server.clients[i['client_address']].ws.send(json.dumps({'message': f"Message from friends: {data['message']}"}))
    #return message""" # i fixed it using websocket.broadcast


@websocket.on_close
def close_websocket(e):
  print("Client left.")
  current_client = ws.handler.active_client  # just ws
  for i in activeConnections:
    if i['uid'] == current_client.uid:
      del i
  print("Done.")


from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

http_server = WSGIServer(("0.0.0.0", 8080),
                         app,
                         handler_class=WebSocketHandler,
                         log=None)
http_server.serve_forever()
#app.run(host="0.0.0.0", port=6969, debug=True)
"""
Revolution In Code (RIC)

Meowy [TESTER] This is a chat area.
Eric [ADMIN] Yes.
Meowy [TESTER] Is it crashlooping?
Eric [ADMIN] @Meowy are you there?
"""
"""
#changelog

No messages yet.
"""
