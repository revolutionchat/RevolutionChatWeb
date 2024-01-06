# For free Revolved AI to come to life #
# and for users to enjoy without pay #
# Do not delete this file as it is
# required by main.py and classes
# .py 

import os,sys,time,random,collections,asyncio
from flask import *
import auth as Auth
auth = Auth.auth
import openai
openai.api_key = "pk-this-is-a-real-free-pool-token-for-everyone"
openai.api_base = "https://api.chatanywhere.tech/v1" # changed due to deprecation in https://ai.fakeopen.com/v1

class RevolvedAI(Flask):
  def __init__(self, app):
    print("* AI Model is starting...")
    print("| Waiting...")
    #time.sleep(2)
    print("* Registered AI model!")

    self.app = app
    self.intents = [
      {"name": "greeting", "words": ["hello", "hi"], "responses": ["Hey there, how are you?", "Yo, how are you doing?", "What is up?", "Hello! Ask me a question your troubled about."]},
      {"name": "sayname", "words": ["who","you"], "responses": ["I am Revolution, an AI text-based chat bot that is run on Revolution technology, not OpenAI."]},
      {"name": "sayemail", "words": ["email"], "responses": [f"Ah yes, your e-mail is $(USER_EMAIL), I know a lot about you, <b>$(USER_NAME)</b>"]},
    ]

    # ROUTES #
    @app.route('/ai/revolved/get_response', methods=["POST"])
    def get_response():
      data = json.loads(request.get_data(cache=False,as_text=True))
      text = data.get('query')
      past50msgs = data.get('past50')
      token = data.get("token")
      messages = data.get("messages")
      ares = auth(token)
      if ares["valid"] == False:
        return abort(401) # Failed to load resource: the server responded with a status of 401 ()

      user = ares["user"]
      newMessages = [{"role": "system", "content": "You are RevolvedAI, a chatbot in the chat app Revolution developed by JustAnEric, whose discord tag is justxn3ric. The discord server for Revolution support and bug reporting called Eric's World is at \"https://discord.gg/UPkkSDy4wa\". Revolution is a place where people can hang out without clutter. Private servers are planned, but the development team doesn't have a specific ETA yet. You are chatting with \"" + user["name"] + "\". You are no longer developed by OpenAI."}, {"role": "user", "content": text}]
      for m in messages:
        if m["role"] != "system":
          newMessages.append(m)
      #asyncio.run(asyncio.sleep(5))
      if text:
        # result = self.deter_result(text, past50msgs).replace("$(USER_NAME)", user["name"])#.replace("$(USER_EMAIL)", str(session.get('email')))
        chat_completion = openai.ChatCompletion.create(
          model="gpt-3.5-turbo",
          messages=newMessages
        )
        result = chat_completion.choices[0].message.content
        return jsonify({ "response": result, "query": text })
      else: return jsonify({ "response": "You need to send a message!" })

  def deter_result(self,text:str,past50msgs:list):
    #return f"<pre><code>{self.self_code(text, 'python')}</code></pre>"
    text = text.lower()
    matches = []
    for i, intent in enumerate(self.intents):
        for word in text.split():
            if word in intent['words']:
                matches.append({"match": intent, "index": i})
          
    if matches:
        most_common = max(matches, key=lambda x: matches.count(x))
        return random.choice(most_common['match']['responses'])
    else:
        return random.choice([
          "I am only a text-based AI, sorry.",
          "I could not understand.",
          "My brain is too limited for this type of information.",
          "I can't answer this, sorry. Try sending a different question or query?"
        ])
    #return random.choice([
      #"Something unexpected happened on the server end, try and come back later."
    #])

  def self_code(self, objective:str, language:str):
    language = language.lower()
    objective = objective.lower()
    if language == "python":
      constructOutput = ""
      possibleSteps = [
        {"name": "pass", "terms": ["pass", "forget"], "indentAfter": 0, "enterAfter": True, "spaceAfter": False},
        {"name": "def $(name)($(parameters)):", "terms": ["function"], "indentAfter": 4, "enterAfter": True, "spaceAfter": False},
        {"name": "async", "terms": ["asyncronous", "async"], "indentAfter": 0, "enterAfter": False, "spaceAfter": True},
        #{"name": ":", "terms": ["next"], "indentAfter": 4, "enterAfter": True, "spaceAfter": False},
        {"name": "class $(name):", "terms": ["create", "class"], "indentAfter": 4, "enterAfter": True, "spaceAfter": False},
        {"name": "return $(object)", "terms": ["return", "stop", "function"], "indentAfter": 0, "enterAfter": True, "spaceAfter": False},
        {"name": "$(variable) = $(answer)", "terms": ["variable", "define"], "indentAfter": 0, "enterAfter": True, "spaceAfter": False},
        {"name": "if $(operation):", "terms": ["if","statement"], "indentAfter": 4, "enterAfter": False, "spaceAfter": False},
        {"name": "else:", "terms": ["otherwise", "or"], "indentAfter": 4, "enterAfter": True, "spaceAfter": False},
        {"name": "or", "terms": ["or"], "indentAfter": 0, "enterAfter": False, "spaceAfter": True},
        {"name": "and", "terms": ["and"], "indentAfter": 0, "enterAfter": False, "spaceAfter": True},
        {"name": "elif $(operation):", "terms": ["else", "if", "otherwise"], "indentAfter": 4, "enterAfter": True, "spaceAfter": False},
      ]
      noLines = False
      lines = objective.split('\n')
      try:
        line1 = lines[0]
      except: noLines = True
      if noLines:
        return "Please parse some lines into your explanation. Each line is one statement/term"
      else:
        for line in lines:
          matches = []
          for i, intent in enumerate(possibleSteps):
              for word in objective.split():
                  if word in intent['terms']:
                      matches.append({"match": intent, "index": i})
            
          if matches:
              #most_common = max(matches, key=lambda x: matches.count(x))
              for most_common in matches:
                match = most_common['match']
                constructOutput += match['name']
                def genout():
                  out=""
                  for i in range(0, (match.get('indentAfter') or 0)):
                    out+=" "
                  return out
                constructOutput += "\n" if match.get('enterAfter') == True else ""
                constructOutput += " " if match.get('spaceAfter') == True else ""
                constructOutput += genout()
          else: return f"Could not complete code. \nAvailable matches: {str(matches)}"
        return str(f"{constructOutput}")
    else:
      return "Unknown error."
      