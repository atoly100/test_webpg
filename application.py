"""
Demo Flask application to test the operation of Flask with socket.io

Aim is to create a webpage that is constantly updated with random numbers from a background python process.

30th May 2014

===================

Updated 13th April 2018

+ Upgraded code to Python 3
+ Used Python3 SocketIO implementation
+ Updated CDN Javascript and CSS sources

"""

# Start with a basic flask app webpage.
import eventlet
eventlet.monkey_patch()
from flask_socketio import SocketIO, emit
from flask import Flask, render_template, url_for, copy_current_request_context
from random import random
from time import sleep
from threading import Thread, Event
from Adafruit_IO import Client
from datetime import datetime
import os

aio = Client('tsukprasert', 'aio_pYrY17KjdsRub3e4xDZ2PZasU2JX')
aio2 = Client('atoly', 'aio_ubMl44xF6TvY5NLs6oO3GHko3y25')
aio3 = Client('skaza', 'aio_evRB4196XGgJo6XQThm2vu2mGg5W')

#aio2 = Client('tsukprasert', 'aio_pYrY17KjdsRub3e4xDZ2PZasU2JX')
#data1 = aio.data('temperature')
#data1 = aio.receive('hall-effect').value
#data2 = aio.receive('temperature').value

#print("Data 1: "+str(data1))
#print("Data 2: "+str(data2))

__author__ = 'slynn'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True

#turn the flask app into a socketio app
async_mode= "eventlet"
socketio = SocketIO(app, async_mode=async_mode, logger=True, engineio_logger=True)

#random number Generator Thread
thread = Thread()
thread_stop_event = Event()

def randomNumberGenerator():
    """
    Generate a random number every 1 second and emit to a socketio instance (broadcast)
    Ideally to be run in a separate thread?
    """
    #infinite loop of magical random numbers
    print("Making random numbers")
    while not thread_stop_event.isSet():
        print("HEY")

        now = datetime.now()

        current_time = now.strftime("%H:%M:%S")
        print("Current Time =", current_time)
        number = round(random()*10, 3)
        #print(number)
        #socketio.emit('newnumber', {'number': number}, namespace='/test')

        #data1 = aio.receive('temperature').value
        data1 = current_time
        data2 = 2
        data3 = 3





        #data2 = aio2.receive('sensor2').value
        print("I am printing data 2 '" + str(data2) + "'")
        #data3 = aio3.receive('sensor3').value
        print("I am printing data3   '" + str(data3) + "'")
        socketio.emit('newnumber', {'number': data1}, namespace='/test', callback=ack)
        socketio.emit('newnumber2', {'number': data2}, namespace='/test', callback=ack)

        socketio.emit('newnumber3', {'number': data3}, namespace='/test', callback=ack)

        socketio.sleep(5)

def ack():
    print("newnumber3 received")

@app.route('/')
def index():
    #only by sending this page first will the client be connected to the socketio instance
    return render_template('index.html')

@socketio.on('connect', namespace='/test')
def test_connect():
    # need visibility of the global thread object
    global thread
    print('Client connected')

    #Start the random number generator thread only if the thread has not been started before.
    if not thread.isAlive():
        print("Starting Thread")
        thread = socketio.start_background_task(randomNumberGenerator)

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

@socketio.on('error', namespace='/test')
def error():
    print('Client error')

if __name__ == '__main__':
    socketio.run(app, port=int(os.environ.get('PORT', '5000')))
