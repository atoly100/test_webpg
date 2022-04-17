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
from google.cloud import pubsub_v1
from google.cloud import bigquery
# from dotenv import load_dotenv
#
# load_dotenv()

project_id = "durable-cursor-347119" # magnetic-set-341419"
# topic_id = "my-topic"
# subscription_id = "my-web-app-sub-id"
# publisher = pubsub_v1.PublisherClient()
# topic_path = publisher.topic_path(project_id, topic_id)
# subscriber = pubsub_v1.SubscriberClient()
# subscription_path = subscriber.subscription_path(project_id, subscription_id)
#subscriber.create_subscription(name=subscription_path, topic=topic_path)

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


def query_latest_number(node_id="node1"):
    client = bigquery.Client()
    query = """
        SELECT time, number
        FROM `esp32.{}`
        WHERE time =
            (select max(a.time) from `esp32.{}` a)
    """.format(node_id, node_id)
    query_job = client.query(query)
    for row in query_job:
        print("Timestamp: {} Number: {}".format(row["time"], row["number"]))
        return row["number"]


# def pull_data():
#     response = subscriber.pull(request={
#         "subscription": subscription_path,
#         "max_messages": 1
#     })
#
#     ack_ids = [msg.ack_id for msg in response.received_messages]
#     subscriber.acknowledge(request={
#         "subscription": subscription_path,
#         "ack_ids": ack_ids
#     })
#
#     return response


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
        #data1 = current_time
        #data1 = 1
        # response = pull_data()
        # for msg in response.received_messages:
        #     data1 = msg.message.data.decode("utf_8")
        data = [0, 0, 0, 0, 0, 0]
        for i in range(6):
            data[i] = query_latest_number("node{}".format(i))
            socketio.emit("newnumber{}".format(i), {'number': data[i]}, namespace='/test', callback=ack)
        # data2 = query_latest_number("node2")
        # data3 = query_latest_number("node3")
        # data4 = query_latest_number("node4")
        # data5 = query_latest_number("node5")
        # data6 = query_latest_number("node6")

        #data2 = aio2.receive('sensor2').value
        # print("I am printing data 2 '" + str(data2) + "'")
        # #data3 = aio3.receive('sensor3').value
        # print("I am printing data3   '" + str(data3) + "'")

        # socketio.emit('newnumber1', {'number': data1}, namespace='/test', callback=ack)
        # socketio.emit('newnumber2', {'number': data2}, namespace='/test', callback=ack)
        # socketio.emit('newnumber3', {'number': data3}, namespace='/test', callback=ack)
        # socketio.emit('newnumber4', {'number': data4}, namespace='/test', callback=ack)
        # socketio.emit('newnumber5', {'number': data5}, namespace='/test', callback=ack)
        # socketio.emit('newnumber6', {'number': data6}, namespace='/test', callback=ack)

        socketio.sleep(1)

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
    if not thread.is_alive():
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
