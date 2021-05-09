# Import the functions we need from flask
from flask import Flask
from flask import render_template 
from flask import jsonify
from config import (user, password, host, port, database)

# Import the functions we need from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

connection_string = f'postgresql://{user}:{password}@{host}:{port}/{database}'

# Connect to the database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

# Choose the table we wish to use
table = base.classes.food_inspections

# Instantiate the Flask application. (Chocolate cake recipe.)
# This statement is required for Flask to do its job. 
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Here's where we define the various application routes ...
@app.route("/")
def IndexRoute():
    ''' This function runs when the browser loads the index route. 
        Note that the html file must be located in a folder called templates. '''

    webpage = render_template("index.html")
    return webpage

@app.route("/restaurants")
def QueryFoodInspections():

    ''' Query the database for food inspections and return the results as a JSON. '''

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(table.id, table.business_name, table.address, table.inspection_type, table.inspection_date, table.inspection_score, table.neighborhood, table.latitude, table.longitude).all()  
    session.close()  

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    all_restaurants = []
    for id, business_name, address, inspection_type, inspection_date, inspection_score, neighborhood, latitude, longitude in results:    
        dict = {}
        dict["id"] = id
        dict["business_name"] = business_name
        dict["address"] = address
        dict["inspection_type"] = inspection_type
        dict["inspection_date"] = inspection_date
        dict["inspection_score"] = inspection_score
        dict["neighborhood"] = neighborhood
        dict["latitude"] = latitude
        dict["longitude"] = longitude
        all_restaurants.append(dict)

    # Return the jsonified result. 
    return jsonify(all_restaurants)

# This statement is required for Flask to do its job. 
# Think of it as chocolate cake recipe. 
if __name__ == '__main__':
    app.run(debug=True, port=55000)