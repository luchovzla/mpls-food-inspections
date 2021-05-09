# mpls-food-inspections
University of Minnesota Data Analytics Bootcamp - Project 2

Terra Vaughn, Luis Gomez, Roberto Pupo, Joseph Raasch

This demonstration shows how to integrate Flask with your HTML and JavaScript code for Project 2 in Data Analytics & Visualization.

Please clone this repository to your desktop and then do the following:

1. Run the sql schemas before running a jupyter notebook 
1. Navigate to the folder that contains ``app.py`` and launch a GitBash (Windows) or Terminal (Mac).
1. Type ``source activate PythonData`` and then hit ENTER.
1. Type ``python app.py`` and then hit ENTER.Type ``python app.py`` and then hit ENTER.
1. Observe that the Flask server starts and tells you which port it's running on. Don't close this window.
1.  With the Flask server running, enter this address in your Chrome browser: http://127.0.0.1:5000/. You'll see that it loads the index page. 
1.  If you navigate to the following address, you'll see that it returns another JSON, this time from a database query: http://127.0.0.1:5000/resturants. This is an example of an API endpoint. Please read the code in ``app.py`` to see how this all works

Additional Notes:

* Please peruse my files and my directory structure to see how this all comes together.
* Note the use of the ``templates`` and ``static`` folders. 
* *IMPORTANT:* You'll have to update the PostgreSQL username and password (``config.py``) so that they match your own values. You likely have the same username, but your password will (probably) be different.