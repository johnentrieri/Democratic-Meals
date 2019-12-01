import json
import flask

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

@app.route('/polls/')
def getPollData():
       
    tempFile = open(poll_db_file,'r+')
    poll_data = json.loads(tempFile.read())
    tempFile.close()

    response = flask.jsonify(poll_data)
    response.headers.add('Access-Control-Allow-Origin', '*')  

    return response

@app.route('/reset/', methods=['POST'])
def resetPolls():
       
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