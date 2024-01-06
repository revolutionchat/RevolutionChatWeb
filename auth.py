import hashlib, os, json
def auth(token):
  valid_token = False
  userid = None
  user = None
  if token == None:
    return {"valid": False}
  if token == "guest":
    valid_token = True
    userid = 173193019279
  h = hashlib.new('sha256')
  h.update(token.encode())
  hashed = h.hexdigest()
  for i in os.listdir('./assets/application_tokens/'):
    io = json.load(open(f"./assets/application_tokens/{i}"))
    if io['token'] == token:
      valid_token = True
      userid = io['id']
  accountload = json.load(open("./accounts.json"))["auto"]
  for i in accountload:
    if i.get('token') == hashed:
      valid_token = True
      userid = i['user']
  if valid_token:
    userload = json.load(open("./users.json"))["auto"]
    for i in userload:
      if i['id'] == userid:
          user = i
  print(userid)
  print(user)
  return {"user": user, "valid": valid_token}