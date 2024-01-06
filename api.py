import flask, os, classes, json, random, math, hashlib
from datetime import datetime
from flask import redirect, render_template, send_from_directory, send_file, request, Response, session, jsonify, url_for, abort
import auth as Auth
auth = Auth.auth
from flask_cors import cross_origin

privateServers = json.load(open('./privateServers.json'))["auto"]
servers = json.load(open('./servers.json'))["auto"]
groups = os.listdir('./messages/groups')

reports = json.load(open('./reports.json'))["auto"]

gooblerAutomatedSystemMessages = json.load(
  open('./automatedSystem.json'))["auto"]
gooblerAutoIssueSuggestionList = json.load(
  open('./autoIssueSuggestions.json'))["auto"]

# API DOCS AND FUNCTIONALITY;


class apiCog(flask.Flask):

  def __init__(self, app, websocket, activeConnections):
    self.app = app

    @app.route('/api')
    def apipage():
      #print(ws)
      #print(activeConnections)
      """
      for i in activeConnections:
        if "revolution" in i['channels']:
          clientList = list(websocket.active_sockets)[0].handler.server.clients
          if i['client_address'] in clientList:
            clientList[i['client_address']].ws.send(json.dumps({'message': f"New message"}))"""
      return redirect('/docs/api')

    @app.route('/docs/api/create')
    def createBotPage():
      return render_template(
        'API_create.html', applicationsAvailable=os.listdir('./assets/application_tokens/'))

    @app.route('/api/docs/py')
    def python__docs():
      return render_template('api/documentation/python/main.html')

    @app.route('/api/docs/js')
    def nodejs__docs():
      return render_template('api/documentation/js/main.html')
    
    @app.route('/portal/admin')
    def admincp():
      return render_template('admin.html', customerreports=reports)

    @app.route('/portal')
    def adminportal():
      return render_template('portal.html')

    @app.route('/developer')
    def developerportal():
      return render_template('developers/portal.html')

    @app.route('/app/add_bot')
    def addbottoserverapiv1():
      clientId = str(request.args.get('client_id'))
      servers = []
      o = json.load(open('./servers.json'))
      for i in o['auto']:
        for g in i['users_chatted']:
          if g['id'] == session.get('uid') and i.get('owner') == int(g['id']):
            servers.append(i)
            
      for index, item in enumerate(os.listdir('./assets/application_tokens/')):
        o = json.load(open(f'./assets/application_tokens/{item}'))
        if clientId == str(o.get('id')):
          return render_template('authorize_app.html', client_id=clientId, appInfo=o, servers=servers)
      return "App doesn't exist!"

    @app.route('/developer/api/v1/add_app_to_server')
    def addapptoserverapiv1endpoint():
      clientId = str(request.headers.get('uid'))
      token = str(request.headers.get('token'))
      server = str(request.headers.get('sid'))

      autht = auth(token)
      
      serverslist = json.load(open('./servers.json'))['auto']
      if autht and clientId and server:
        for i in serverslist:
          for o in i.get('users_chatted'):
            if o.get('id') == int(clientId):
              return jsonify({"error": "APP_ALREADY_ADDED"})
            if o.get('id') == int(autht.get('user').get('id')) and i.get('serverid') == server and i.get('owner') == int(autht.get('user').get('id')):
              botInfo = {}
              for index, item in enumerate(os.listdir('./assets/application_tokens/')):
                o = json.load(open(f'./assets/application_tokens/{item}'))
                if clientId == str(o.get('id')):
                  botInfo = o

              if botInfo == {}:
                return jsonify({"error": "APP_NON-EXISTENT"})
              
              bot = {
                "name": o.get('name'),
                "id": int(clientId),
              }

              serverlist = json.load(open('./servers.json'))
              with open('./servers.json','w') as f:
                for index, i in enumerate(serverlist['auto']):
                  if i['serverid'] == server:
                    serverlist['auto'][index]['users_chatted'].append(bot)
                json.dump(serverlist, f, indent=4)
                
              return jsonify({"success": "APP_ADDED"})

    @app.route('/developer/<path>')
    def developerportalpath(path):
      return render_template('developers/portal.html')

    @app.route('/developer/<path>/<path2>')
    def developerportalpath23(path,path2):
      return render_template('developers/portal.html')

    @app.route('/developer/api/v1/create_app')
    def createnewapp():
      parentToken = str(request.headers.get('token'))
      botName = request.headers.get('name')
      #global user
      #user = {}
      
      #def check_token():
        #valid_token = False
        #userid = None
        #if parentToken == "guest":
          #valid_token = True
          #return False
        #h = hashlib.new('sha256')
        #h.update(parentToken.encode())
        #token = h.hexdigest()
        #for i in os.listdir('./assets/application_tokens/'):
          #io = json.load(open(f"./assets/application_tokens/{i}"))
          #if io['token'] == parentToken:
            #valid_token = True
            #userid = io['id']
        #accountload = json.load(open("./accounts.json"))["auto"]
        #for i in accountload:
          #if i.get('token') == token:
            #valid_token = True
            #userid = i['user']
        #if valid_token:
          #userload = json.load(open("./users.json"))["auto"]
          #for i in userload:
            #if i['id'] == userid:
              #global user
              #user = i
        #print(userid)
        #print(user)
        #return valid_token

      authentication = auth(parentToken)

      if authentication:
        # valid person
        print(authentication)
        discrim = random.randint(1, 9999)
        id = random.randint(0, 199293472364)
        obj = {"id": id, "name": f"{botName}", "discriminator": discrim, "description": f"(made by <{authentication['user']['name']}#{authentication['user']['discriminator']}>)", "bot": True}
        maxNumberOfApps = 10
        nal = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"]
        def generate_token():
          result = ""
          for i in nal:
            result += random.choice(nal)
          return result
          
        def check_number_of_apps(user):
          number = 0
          outOf = 0
          failed = 0
          succeeded = 0
          itemscollected = []
          itemsfailed = []
          for i in os.listdir('./assets/application_tokens'):
            o = json.load(open(f'./assets/application_tokens/{i}'))
            try:
              if o['owner']['id'] == user['id']:
                number+=1
                itemscollected.append(o)
              else: itemsfailed.append(o)
              succeeded+=1
            except: 
              print(f"Unable to check bot app: ./assets/application_tokens/{i}")
              failed+=1
            outOf+=1
          return {
            "itemsCollected": itemscollected,
            "itemsTrashed": itemsfailed,
            "number": number,
            "outof": outOf,
            "failed": failed,
            "succeeded": succeeded
          }
        
        #append to users database file
        usersLoad = json.load(open('./users.json'))
        with open('./users.json', 'w') as jsonFile:
          usersLoad['auto'].append(obj)
          json.dump(usersLoad, jsonFile)
          
        appToken = generate_token()
        appNumber = check_number_of_apps(authentication['user'])
        count = len(os.listdir('./assets/application_tokens/'))
        file = f"./assets/application_tokens/{count+1}.json"
        appobj = {
          "token": appToken,
          "name": botName,
          "discriminator": discrim,
          "id": id,
          "owner": authentication['user']
        }
        with open(file,'w') as f: #make the file then close it
          json.dump(appobj, f)
          f.close()

        return jsonify({
          "app_id": id,
          "owner": authentication['user'],
          "discriminator": discrim,
          "name": botName,
          "url": f"https://revolution-web.repl.co/developer/apps/{id}"
        }), 200
        
      else: return "401, UNAUTHORIZED", 401

    @app.route('/developer/api/v1/get_apps')
    def getalluserappsdevapiv1():
      parentToken = str(request.headers.get('token'))
      apps = {"apps": []}
      authentication = auth(parentToken)
      user = authentication.get('user')
      if authentication:
        for i in os.listdir('./assets/application_tokens'):
          o = json.load(open(f'./assets/application_tokens/{i}'))
          if o.get('owner').get('id') == user.get('id'):
            apps['apps'].append(o)
        return jsonify(apps), 200
      else: return "401 UNAUTHORIZED", 401

    @app.route('/developer/api/v1/get_app')
    def getuserappdevapiv1():
      parentToken = str(request.headers.get('token'))
      appId = str(request.headers.get('app'))
      authentication = auth(parentToken)
      user = authentication.get('user')
      if authentication:
        for i in os.listdir('./assets/application_tokens'):
          o = json.load(open(f'./assets/application_tokens/{i}'))
          if str(appId) == str(o.get('id')):
            return jsonify(o), 200
        return "404 APP NOT FOUND", 401
      else: return "401 UNAUTHORIZED", 401

    
    @app.route('/developer/api/v1/delete_app')  
    def deleteuserappdevapiv1():
      parentToken = str(request.headers.get('token'))
      appId = str(request.headers.get('app'))
      authentication = auth(parentToken)

      if authentication:
        #append to users database file
        usersLoad = json.load(open('./users.json'))
        with open('./users.json', 'w') as jsonFile:
          for index, item in enumerate(usersLoad['auto']):
            if str(item['id']) == str(appId):
              del usersLoad['auto'][index]
          json.dump(usersLoad, jsonFile)

        for i in os.listdir('./assets/application_tokens'):
          o = json.load(open(f'./assets/application_tokens/{i}'))
          if str(appId) == str(o.get('id')):
            os.remove(f'./assets/application_tokens/{i}')

        return jsonify({
          "app_id": id
        }), 200

      else: return "401, UNAUTHORIZED", 401
      
    @app.route('/pay/paypal')
    def paypalpayment():
      return render_template('pay.html')

    @app.route('/ws')
    def ws():
      return render_template('ws.html', url_for=url_for)

    @app.route('/api/@serverSide/@application/paymentCompleted/post',
               methods=['POST'])
    def paymentCompletedforGoobuxOrRockets():
      json = request.get_json(force=True, silent=True)
      print(json)
      if json.get('amount') == "400":
        return redirect('/app')

    @app.route('/login/method/guest')
    def loginasguest():
      session["usern"] = "guest"
      session["uid"] = 173193019279
      session["email"] = "guest+untrusted@goobler.ga"
      return f"<script>localStorage.setItem('token', 'guest'); window.location = '/app';</script>"

    @app.route('/assets/js/server.js')
    def serverJS_Handler():
      return send_from_directory('./assets/js', 'server.js')

    @app.route('/api/vc/game/<game>')
    def apicallgame(game):
      return render_template('game/renderedSpotify.html')

    @app.route('/api/email/send/<email>/<service>', methods=['POST'])
    def apicallemail(email, service):
      if service == "GooblerAdmin":
        randomKey = request.json['randomKey']
        if request.json:
          server = classes.EMail.connect()
          classes.EMail.send(
            f"Your OTP code for logging into Goobler Admin is <br/><h1>{randomKey}</h1><br/> Use it in 24 hours.",
            "Your verification code for logging into cloud.", email, server)
          server.quit()
          return "Good request. Response back.", 200
        else:
          return "Bad request.", 500
      else:
        return "Bad request.", 404

    @app.route('/api/email/send/test/<service>', methods=['GET'])
    def apicallemailtest(service):
      if service == "Goobler":
        server = classes.EMail.connect()
        email = request.headers.get('email')
        message = request.headers.get('message')
        subject = request.headers.get('subject')
        classes.EMail.send(message, subject, email, server)
        server.quit()
        return "Good request. Response back.", 200
      else:
        return "Bad request.", 500

    @app.route('/api/v1/internet', methods=['GET'])
    @cross_origin()
    def find_internet__api_v1():
      return jsonify({"hasInternet": "true"})

    @app.route('/api/v1/python/token_exists')
    @cross_origin()
    def find_token_if_exists__api_v1():
      headers = request.headers
      for i in os.listdir('./assets/application_tokens/'):
        io = json.load(open(f"./assets/application_tokens/{i}"))
        if io['token'] == headers['token']:
          return jsonify({
            "token_exists": "true"
            #, "error": "API is down for 3 days. Please update your API package."
          })
      return jsonify({"token_exists": "false", "error": "Token list generated did not find any matches."})

    @app.route('/api/v1/get_server_messages')
    @cross_origin()
    def get_server_messages__api_v1():
      return jsonify({"error": "This endpoint is now removed."}), 410
      #return jsonify({"error": "Please update your API package. The API is down for 3 days."})
      headers = request.headers
      if f"{headers.get('id')}.json" in os.listdir('./messages/servers/'):
        load = json.load(open(f'./messages/servers/{headers["id"]}.json'))
        return jsonify(load)
      else: return jsonify({"messages": []})

    @app.route('/api/v1/get_server')
    @cross_origin()
    def get_server__api_v1():
      headers = request.headers
      load = json.load(open('./servers.json'))["auto"]
      for i in load:
        if i['serverid'] == headers["id"]:
          return jsonify(i)
      return jsonify({"error": "No server found by the id"})

    @app.route('/api/v1/get_user')
    @cross_origin()
    def get_user__api_v1():
      headers = request.headers
      load = json.load(open('./users.json'))["auto"]
      for i in load:
        if str(i['id']) == headers["id"]:
          return jsonify(i)
      return jsonify({"error": "No user found by the id"})

    @app.route('/api/v1/servers/send_message')
    @cross_origin()
    def send_message_to_server__api_v1():
      message = request.headers.get('message')
      sent_by = None
      channel = request.headers.get('id')
      token = request.headers.get('token')
      valid_token = False
      discriminator = None
      author_id = None
      for i in os.listdir('./assets/application_tokens/'):
        io = json.load(open(f"./assets/application_tokens/{i}"))
        if io['token'] == token:
          valid_token = True
          sent_by = io["name"]
          discriminator = io["discriminator"]
          author_id = io["id"]
      if not valid_token:
        return jsonify({"error": "Please update your API package if you're using one. Otherwise, provide the token parameter"}), 410
      load = json.load(open('./servers.json'))["auto"]
      for i in load:
        if i['serverid'] == channel.split("~")[0]:
          if channel.split("~")[1] in i["readonly"]:
            if int(author_id) == int(1394728468): continue
            else: return
      type = "s"
      if type == "s":
        if channel + ".json" in os.listdir('./messages/servers'):
          messageObject = {"message": f"{message}", "sent_by": f"{sent_by}", "id": random.randint(0,199293472364), "timestamp": math.floor((datetime.now() - datetime(1970, 1, 1)).total_seconds() * 1000), "author_id": author_id}
          load = json.load(open(f'./messages/servers/{channel}.json'))
          load2 = json.load(open(f'./servers.json'))
          with open('./messages/servers/' + channel + '.json',
                    'w') as jsonFile:
            load['messages'].append(messageObject)
            json.dump(load, jsonFile)
          
          for i in activeConnections:
            if channel in i['channels']:
              clientList = list(websocket.active_sockets)[0].handler.server.clients
              if i['client_address'] in clientList:
                clientList[i['client_address']].ws.send(json.dumps({"type": "messageCreate", "message": f"{message}", "sent_by": f"{sent_by}", "channel": f"{channel}", "id": messageObject["id"], "timestamp": messageObject["timestamp"], "author_id": author_id, "bot": True}))

          return jsonify(messageObject)
        else:
          return jsonify({"error": "Unknown error while writing to the server: does not exist"})
      else:
        return jsonify({"error": "Unknown channel type. This is an API based error. Please search for a solution."})

    @app.route('/api/messaging/send_message/<type>/<channel>')
    def send_new_message_for_channel_api_messaging(type, channel):
      return "410", 410
      message = request.headers.get('message')
      sent_by = request.headers.get('sent_by')
      if type == "s":
        if channel + ".json" in os.listdir('./messages/servers'):
          messageObject = {"message": f"{message}", "sent_by": f"{sent_by}", "id": random.randint(0,199293472364), "timestamp": math.floor((datetime.now() - datetime(1970, 1, 1)).total_seconds() * 1000), "author_id": 173193019279}
          load = json.load(open(f'./messages/servers/{channel}.json'))
          load2 = json.load(open(f'./servers.json'))
          for i in load2:
            if i['serverid'] == channel.split("~")[0]:
              if channel.split("~")[1] in i["readonly"]:
                return
          with open('./messages/servers/' + channel + '.json',
                    'w') as jsonFile:
            load['messages'].append(messageObject)
            json.dump(load, jsonFile)
          print(session.get('usern'))

          for i in activeConnections:
            if channel in i['channels']:
              clientList = list(websocket.active_sockets)[0].handler.server.clients
              if i['client_address'] in clientList:
                clientList[i['client_address']].ws.send(json.dumps({"type": "messageCreate", "message": f"{message}", "sent_by": f"{sent_by}", "channel": f"{channel}", "id": messageObject["id"], "timestamp": messageObject["timestamp"], "author_id": 173193019279}))

          return "finished"
        else:
          return "500", 500
      else:
        return "404", 404

    @app.route('/api/get_name_using_auth')
    def api_get_name_using_auth():
      auth = request.args.get('auth')
      return str(userObject["name"])

    @app.route('/get_messages/<type>/<channel>')
    @cross_origin()
    def get_messages_for_channel(type, channel):
      skip = int(request.headers.get("skip"))
      amount = int(request.headers.get("amount"))
      if type == "s":
        if channel + ".json" in os.listdir('./messages/servers'):
          messages = json.load(open(f"./messages/servers/{channel}.json"))["messages"]
          if skip > 0:
            return jsonify(messages[:-skip][-amount:])
          else:
            return jsonify(messages[-amount:])
      if type == "d":
        if channel + ".json" in os.listdir('./messages/dms'):
          messages = json.load(open(f"./messages/dms/{channel}.json"))["messages"]
          if skip > 0:
            return jsonify(messages[:-skip][-amount:])
          else:
            return jsonify(messages[-amount:])

    @app.route('/start_activity/s/<sId>')
    def start_activity_on_server(sId):
      activity = request.headers.get('activity')
      for server in servers:
        if server["serverid"] == sId:
          if activity == "youtube-together":
            loadup = json.load(open(f'./currentActivities/{sId}.json'))
            with open(f'./currentActivities/{sId}.json', 'w') as f:
              loadup["host"] = sId
              loadup["activityId"] = 1
              loadup["page"] = "/"

              json.dump(loadup, f)
            return "ok"
          return "Unknown activity."
        else:
          return "Unknown server. Please use another."

    @app.route('/get_current_running/activity')
    def get_current_running_activity():
      #request.headers["fulfilled"] = True
      sId = session.get('currentActivity.s')
      if sId + ".json" in os.listdir('./currentActivities'):
        load = json.load(open(f'./currentActivities/{sId}.json'))
        if load["activityId"] == 1:
          return jsonify({
            "activity": "YouTube Together",
            "host": load["host"],
            "page": load["page"]
          })
        else:
          return ""
      else:
        return ""

    @app.route('/send_message/<type>/<channel>')
    @cross_origin()
    def send_new_message_for_channel(type, channel):
      message = request.headers.get('message')
      ares = auth(request.headers.get("token"))
      if not ares["valid"]:
        return abort(403)
      user = ares["user"]
      uid = user["id"]
      sent_by = user["name"]
      load = json.load(open('./servers.json'))["auto"]
      
      if type == "s":
        if channel + ".json" in os.listdir('./messages/servers'):
          messageObject = {"message": f"{message}", "sent_by": f"{sent_by}", "id": random.randint(0,199293472364), "timestamp": math.floor((datetime.now() - datetime(1970, 1, 1)).total_seconds() * 1000), "author_id": uid}
          userObject = {"name": f"{sent_by}"}
          load = json.load(open(f'./messages/servers/{channel}.json'))
          load2 = json.load(open(f'./servers.json'))
          for i in load2["auto"]:
            if i['serverid'] == channel.split("~")[0]:
              if channel.split("~")[1] in i["readonly"] and not user["staff"]:
                return
          with open('./messages/servers/' + channel + '.json',
                    'w') as jsonFile:
            load['messages'].append(messageObject)
            json.dump(load, jsonFile)
          print(sent_by)
          for i in activeConnections:
            if channel in i['channels']:
              clientList = list(websocket.active_sockets)[0].handler.server.clients
              if i['client_address'] in clientList:
                clientList[i['client_address']].ws.send(json.dumps({"type": "messageCreate", "message": f"{message}", "sent_by": f"{sent_by}", "channel": f"{channel}", "id": messageObject["id"], "timestamp": messageObject["timestamp"], "author_id": uid}))
          with open('./servers.json', 'w') as jsonFile:
            userAlreadyThere = False
            for l in load2['auto']:
              if l['serverid'] == channel:
                for i in l['users_chatted']:
                  if not session.get('usern') == i['name']:
                    pass
                  else:
                    userAlreadyThere = True

                if userAlreadyThere == False:
                  l['users_chatted'].append(userObject)

            json.dump(load2, jsonFile)
          return "finished"
        else:
          return "500", 500
      elif type == "d":
        if channel + ".json" in os.listdir('./messages/dms'):
          messageObject = {"message": f"{message}", "sent_by": f"{sent_by}", "id": random.randint(0,199293472364), "timestamp": math.floor((datetime.now() - datetime(1970, 1, 1)).total_seconds() * 1000), "author_id": uid}
          load = json.load(open(f'./messages/dms/{channel}.json'))
          with open('./messages/dms/' + channel + '.json',
                    'w') as jsonFile:
            load['messages'].append(messageObject)
            json.dump(load, jsonFile)
          for i in activeConnections:
            if channel in i['channels']:
              clientList = list(websocket.active_sockets)[0].handler.server.clients
              if i['client_address'] in clientList:
                clientList[i['client_address']].ws.send(json.dumps({"type": "messageCreate", "message": f"{message}", "sent_by": f"{sent_by}", "channel": f"{channel}", "id": messageObject["id"], "timestamp": messageObject["timestamp"], "author_id": uid}))
          return "finished"
        else:
          return "404", 404
      else:
        return "404", 404

    @app.route('/api/v1/typing')
    @cross_origin()
    def typingendpoint():
      character = request.headers.get('character')
      sent_by = None
      channel = request.headers.get('id')
      token = request.headers.get('token')
      discriminator = None
      author_id = None
        
      load = json.load(open('./servers.json'))["auto"]
      for i in load:
        if i['serverid'] == channel.split("~")[0]:
          if channel.split("~")[1] in i["readonly"]:
            return
      
      checked = auth(token)

      if checked['valid']:
        author_id = checked['user']['id']
        discriminator = checked['user']['discriminator']
        sent_by = checked['user']['name']
      
      if checked['valid']:
        for i in activeConnections:
          if channel in i['channels']:
            clientList = list(websocket.active_sockets)[0].handler.server.clients
            if i['client_address'] in clientList:
              clientList[i['client_address']].ws.send(json.dumps({"type": "userTyping", "username": f"{sent_by}", "channel": f"{channel}", "uid": author_id, "author": author_id}))
        return "OKAY, 200", 200
      else: return "FORBIDDEN, 401", 401

    #@app.route('/api/v1/request_messages_tab_current_users')
    #def requestmessagestabnew__apiv1():
      #TOKEN = request.headers.get('Authorization')
      #if not TOKEN:
        #return jsonify({
          #"error": "No Authorization was provided."
        #}), 403

      #if TOKEN:
      # 

    @app.route('/test/<id>')
    def test(id):
      return render_template('activities/yt2g-light.html', id=id)

    @app.route('/test')
    def logintest():
      return render_template('login_new.html')

    @app.route('/test/<id>/dark')
    def test2(id):
      session["currentActivity.s"] = id
      return render_template('activities/yt2g-dark.html',
                             id=id,
                             personid=session.get('usern'))

    @app.route('/activity/post_src')
    def post_src():
      src = request.headers.get('src')
      sid = session.get('currentActivity.s')
      load = json.load(open(f'./currentActivities/{sid}.json'))
      with open(f'./currentActivities/{sid}.json', 'w') as f:
        try:
          load["page"] = "/" + src.split('/')[1]
        except:
          load["page"] = "/" + src
        json.dump(load, f)

    @app.route('/open-pwa')
    def openpwaapp():
      return "Unable to open the app."

    @app.route('/OneSignalSDKWorker.js')
    def OneSignalSDKWorker_Handler():
      return Response(open('OneSignalSDKWorker.js').read(),
                      mimetype='text/javascript')

    @app.route('/api/dms/list')
    @cross_origin()
    def getdms__apiv1():
      token = request.headers.get("token")
      account = None
      #h = hashlib.new('sha256')
      #h.update(token.encode())
      #hashed = h.hexdigest()
      #account = None
      #load = json.load(open('./accounts.json'))["auto"]
      #for i in load:
        #if i.get("token") == hashed:
          #account = i
      account = auth(token)
      print(account)
      list = []
      for i in os.listdir('./messages/dms/'):
        io = json.load(open(f"./messages/dms/{i}"))
        if account['user']['id'] in io['users']:
          target = None
          for u in io['users']:
            if u != account['user']['id']:
              target = u
          print(target)
          load2 = json.load(open(f'./users.json'))["auto"]
          targetDict = None
          for u in load2:
            if u['id'] == target:
             targetDict = u
          print(targetDict)
          list.append({"id": io['id'], "user": targetDict})
      return list
    @app.route("/api/dms/get/<id>", methods=["GET"])
    @cross_origin()
    def getDm(id):
      load = json.load(open('./users.json'))["auto"]
      data = auth(request.headers.get("token"))
      if not data["valid"]:
        return abort(403)
      user = data["user"]
      for i in os.listdir('./messages/dms/'):
        io = json.load(open(f"./messages/dms/{i}"))
        if int(io["id"]) == int(id):
          if user['id'] in io['users']:
            return io
          else:
            return abort(404)
      return abort(404)
    @app.route('/api/dms/add', methods=["POST"])
    @cross_origin()
    def addUser():
      #return "Dude, we are working on something way cooler. Check back later."
      params = request.get_json(force=True)
      uname = params.get("username")
      username = uname.split("#")[0]
      discriminator = uname.split("#")[1]
      user = None
      for i in json.load(open('./users.json'))['auto']:
        if i['name'] == username and i['discriminator'] == discriminator:
          user = i
          break
      load = json.load(open('./users.json'))["auto"]
      data = auth(request.headers.get("token"))
      print(data)
      if not data["valid"]:
        return abort(401)
      creator = data["user"]
      for i in os.listdir('./messages/dms/'):
        io = json.load(open(f"./messages/dms/{i}"))
        if user["id"] in io["users"] and creator["id"] in io["users"]:
          return str(io["id"])
      dmId = random.randint(0, 199293472364)
      with open('./messages/dms/' + str(dmId) + ".json", 'w') as fp:
        json.dump(
          {
            "id": dmId,
            "users": [user["id"], creator["id"]],
            "messages": []
          }, fp)
      return str(dmId)
      
    @app.route('/api/v1/servers/create', methods=["POST"])
    def createServer():
      params = request.get_json(force=True)
      serverName = params.get("name")
      data = auth(request.headers.get("token"))
      if not data["valid"]:
        return abort(403)
      user = data["user"]
      print(user["name"] + " is the owner of " + serverName)
      serverid = random.randint(0, 199293472364)
      load = json.load(open(f'./servers.json'))
      #load = json.load(open(f'./messages/servers/{channel}.json'))
      with open('./servers.json',
                    'w') as jsonFile:
        load['auto'].append({
          "name": serverName,
          "serverid": serverid,
          "channelid": "None",
          "abbr": serverName[0].upper(),
          "imgurl": "/assets/images/Revolution.png",
          "color": "#ff0000",
          "channels": ["chat"],
          "vc": [{
            "id": random.randint(0,199293472364),
            "name": "Voice Chat",
            "participates": []
          }],
          "readonly": [],
          "roles": [],
          "emojis": [],
          "emotes": [],
          "users_chatted": [{"name": user["name"], "id": user["id"]}],
          "owner": user["id"]
        })
        json.dump(load, jsonFile)
      with open(f'./messages/servers/{serverid}~{"chat"}.json', 'w') as fp:
        json.dump({"messages": []}, fp)
        pass
      return "200"
    @app.route('/api/v1/servers/invite', methods=["POST"])
    def inviteServer():
      print("=-=-=-=-=-=-=-=-=-=-=-=-")
      # WIP
      params = json.loads(request.get_data())
      print(str(params))
      serverId = params.get("server")
      data = auth(request.headers.get("token"))
      if not data["valid"]:
        return abort(403)
      user = data["user"]
      print(f"{user['name']} invited for {serverId}")
    @app.route('/api/v1/servers/join', methods=["POST"])
    def joinServer():
      print("=-=-=-=-=-=-=-=-=-=-=-=-")
      # WIP
      params = json.loads(request.get_data())
      print(str(params))
      authorization = request.headers.get("Authorization")
      if not authorization.startswith("Bearer "):
        return abort(401)
      data = auth(authorization[7:])
      if not data["valid"]:
        return abort(401)
      user = data["user"]
      inviteCode = params.get("code")
      invite = None
      for i in json.load(open('./invites.json'))['auto']:
        if i['code'] == inviteCode:
          invite = i
        break
      if not invite:
        abort(404)
      serverId = invite["server"]
      load = json.load(open('./servers.json'))
      with open('./servers.json',
      'w') as jsonFile:
        for i in load['auto']:
          if str(i["serverid"]) == serverId:
            i["users_chatted"].append({"name": user["name"], "id": user["id"]})
        json.dump(load, jsonFile)
      return serverId

    @app.route('/api/v8/panel-message/change')
    def panelmessagechangev8():
      r = request.headers.get('message')
      r2 = request.headers.get('auth')
      if r2 and r:
        #if auth(r2)['user']['id'] == 116596854251:
        if auth(r2).get('user').get('staff') == True:
          print("Changing panel message...")
          load = json.load(open('./site-data.json'))
          with open('./site-data.json', 'w') as f:
            load['global']['panel-message'] = r
            json.dump(load, f)
          return "200"
        else:
          return "403"
      else:
        return "403"
  
    @app.route('/api/v8/panel-message/reset')
    def panelmessageresetv8():
      r = request.headers.get('auth')
      if r:
        #if auth(r)['user']['id'] == 116596854251:
        if auth(r).get('user').get('staff') == True:
          print("Changing panel message...")
          load = json.load(open('./site-data.json'))
          with open('./site-data.json', 'w') as f:
            load['global']['panel-message'] = None
            json.dump(load, f)
          return "200"
        else:
          return "403"
      else:
        return "403"

    @app.route('/api/v8/get_all_users')
    def apiget_all_usersv8():
      r = request.headers.get('auth')
      if r:
        if auth(r).get('user').get('staff') == True:
          # Continue
          list = {'users': []}
          for i in json.load(open('./users.json'))['auto']:
            list.get('users').append(i)
          return jsonify(list)
        else: return "403"
      else: return "403"