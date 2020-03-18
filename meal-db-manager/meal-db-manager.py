import json
import flask
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def sendEmail(senderEmail, senderPassword,recipient,subject,message):
    
    msg = MIMEMultipart()
    msg['From'] = senderEmail
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.attach(MIMEText(message))
    
    mailServer = smtplib.SMTP('smtp.gmail.com', 587)
    mailServer.ehlo()
    mailServer.starttls()
    mailServer.ehlo()
    mailServer.login(senderEmail, senderPassword)
    mailServer.sendmail(senderEmail, recipient.split(','), msg.as_string())
    mailServer.close()  

app = flask.Flask(__name__)

user_db_file = './db/users.json'
poll_db_file = './db/polls.json'
blue_apron_recipe_file = '../blue-apron-puller/recipe-data.json' 

tempFile = open(user_db_file,'r+')
user_data = json.loads(tempFile.read())
tempFile.close()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/recipes/')
def getRecipes():
   
    tempFile = open(blue_apron_recipe_file,'r+')
    blue_apron_recipes = json.loads(tempFile.read())
    tempFile.close()

    response = flask.jsonify(blue_apron_recipes)
    response.headers.add('Access-Control-Allow-Origin', '*')    
    
    return response

@app.route('/notify/', methods=['POST'])
def notify():

    if (flask.request.form['who'] == 'admin'):

        recipient = user_data['admin']['email']
        subject = flask.request.form['subject']
        message = flask.request.form['message']

        sendEmail(user_data['notify']['email'], user_data['notify']['password'],recipient,subject,message)

        response = flask.jsonify( { "status" : "Success", "message" : "Admin Notified"} )
        response.headers.add('Access-Control-Allow-Origin', '*') 

        return response

    elif (flask.request.form['who'] == 'all'):

        subject = flask.request.form['subject']
        message = flask.request.form['message']
        recipient = ""

        for user in user_data['users']:

            recipient += user['email']
            recipient += ","

        recipient = recipient[:-1]
        sendEmail(user_data['notify']['email'], user_data['notify']['password'],recipient,subject,message)

        response = flask.jsonify( { "status" : "Success", "message" : "All Users Notified"} )
        response.headers.add('Access-Control-Allow-Origin', '*') 

        return response

    else:
        response = flask.jsonify( { "status" : "Fail", "message" : "Unrecognized Recipient"} )
        response.headers.add('Access-Control-Allow-Origin', '*') 

        return response

@app.route('/users/', methods=['GET'])
def getUsers():

    tempFile = open(user_db_file,'r+')
    user_data = json.loads(tempFile.read())
    tempFile.close()

    user_list = []

    for user in user_data['users']:
        user_list.append(user['name'])

    response = flask.jsonify( { "users" : user_list } )
    response.headers.add('Access-Control-Allow-Origin', '*') 

    return response

@app.route('/tally/', methods=['GET'])
def tallyPolls():

    tempFile = open(user_db_file,'r+')
    user_data = json.loads(tempFile.read())
    tempFile.close()

    tempFile = open(poll_db_file,'r+')
    poll_data = json.loads(tempFile.read())
    tempFile.close()

    num_users = len(user_data['users'])
    num_votes = len(poll_data['results'])

    if (num_votes < num_users):
        response = flask.jsonify( 
            { 
                "isComplete" : "No",
                "userCount" : num_users, 
                "votes" : num_votes
            } 
        )
    else:
        response = flask.jsonify( 
            { 
                "isComplete" : "Yes",
                "results" : poll_data['results']
            } 
        )

    response.headers.add('Access-Control-Allow-Origin', '*') 

    return response

@app.route('/reset/', methods=['POST'])
def resetPolls():

    recipient = user_data['admin']['email']
    subject = "[Democratic Meals] Polls Have Been Reset"
    message = "The Polls Have Been Reset"    

    sendEmail(user_data['notify']['email'], user_data['notify']['password'],recipient,subject,message)
       
    tempFile = open(poll_db_file,'w+')
    tempFile.write(json.dumps( { "results" : [] } ))
    tempFile.close()

    response = flask.jsonify( { "status" : "Success", "message" : "Polls Reset"} )
    response.headers.add('Access-Control-Allow-Origin', '*') 

    return response

@app.route('/vote/', methods=['POST'])
def vote():
    
    for user in user_data['users']:
        
        if (flask.request.form['passphrase'] == user['passphrase']):
            
            tempFile = open(poll_db_file,'r+')
            poll_data = json.loads(tempFile.read())
            tempFile.close()            
            
            for voter in poll_data['results']:
                if (voter['name'] == user['name']):
                    
                    response = flask.jsonify( { "status" : "Fail", "message" : "Already Voted"} )
                    response.headers.add('Access-Control-Allow-Origin', '*') 

                    return response
            
            tempVoter = {
                "name" : user["name"],
                "votes" : [flask.request.form['v1'], flask.request.form['v2'], flask.request.form['v3']]
            }

            recipient = user_data['admin']['email']
            subject = "[Democratic Meals] User Voted"
            message = "A User Has Voted"    

            sendEmail(user_data['notify']['email'], user_data['notify']['password'],recipient,subject,message)
            
            poll_data['results'].append(tempVoter)
            
            tempFile = open(poll_db_file,'w+')
            tempFile.write(json.dumps(poll_data))
            tempFile.close() 

            response = flask.jsonify( { "status" : "Success", "message" : "Voted Successfully"} )
            response.headers.add('Access-Control-Allow-Origin', '*') 

            return response


    response = flask.jsonify( { "status" : "Fail", "message" : "Incorrect Passphrase"} )
    response.headers.add('Access-Control-Allow-Origin', '*') 

    return response


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')