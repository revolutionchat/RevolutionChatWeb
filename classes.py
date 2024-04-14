import os
import json
import smtplib
#import spotipy
#import tkinter
#from spotipy.oauth2 import SpotifyClientCredentials
#from onesignal import OneSignalClient
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr

#make onesignal sdk
#onesignal_client2 = OneSignalClient(
 #   "ce7d349e-907c-461b-b575-7f498e15f81a",
  #  os.environ.get("ONESIGNAL_CLIENT_SECRET"),
#)

#Authentication - without user
cid = "" #os.environ['cidSpotify']
csec = "" #os.environ['csecSpotify']
#client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=csec)
#sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)

supportEmail = 'noreply@goobler.co.uk'
sender_title = "Goobler"

class newJoinedServer:
  def __init__(self, name, id, channels, roles, emotes, color):
    self.name = name
    self.id = id
    self.channels = channels
    self.roles = roles
    self.emotes = emotes
    self.color = color

class new_D_Message:
  def __init__(self, user, content, directChannel):
    self.user = user
    self.content = content
    self.directChannel = directChannel
    
    @staticmethod
    def create(self, user, content, directChannel):
      # Method: will create new message in specified channel
      return 0

class APIGame:
  def youtube(self, host, video, channel):
    return 0

class UserStatus:
  idle = "idle"
  online = "online"
  dnd = "donotdis"
  offline = "offline"

class EMail:
  def send(message, subject, recipient, server):
    # Construct message
    msg = MIMEText(message, 'html', 'utf-8')
    msg['Subject'] =  Header(subject, 'utf-8')
    msg['From'] = formataddr((str(Header(sender_title, 'utf-8')), supportEmail))
    msg['To'] = recipient
    
    server.sendmail(supportEmail, [recipient], msg.as_string())
    
  def connect():
    server = smtplib.SMTP_SSL('smtp.zoho.com.au', 465)
    server.login(supportEmail, os.environ["gmailSupportPass"])
    return server

class OneSignal:
  def __init__(self, message, title):
    payload = {
      "included_segments": ["All"],
      "contents": {"en": message},
      "large_icon": "https://img.onesignal.com/n/bf627043.png",
      "android_visibility": 1,
      "priority": 5,
      "android_sound":"notification",
      "headings": {"en": title}
    }
    self.notification = ""#Notification(post_body=payload)
    #onesignal_client.send_notification(self.notification)
    self.notification = None

class UserRoles:
  def determine(email):
    listOfRoles = list()
    load = json.load(open('./roles.json'))
    for obj in load["moderators"]:
      if obj == email:
        listOfRoles.append("isModerator")
    for obj in load["admins"]:
      if obj == email:
        listOfRoles.append("isAdmin")
    for obj in load["owners"]:
      if obj == email:
        listOfRoles.append("isOwner")

    if email == None:
      listOfRoles.append("Error: have you supplied an email?")

    return listOfRoles
