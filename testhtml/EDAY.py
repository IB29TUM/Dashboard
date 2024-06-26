import cv2
import asyncio
import websockets
from picamera2 import Picamera2
import numpy as np
from time import sleep

# Initialize the cameras
picam0 = Picamera2(0)
picam1 = Picamera2(1)

# Configure the cameras
picam0.start()
picam1.start()

# Allow cameras to warm up
sleep(2)

# Load pre-trained model and class labels
net = cv2.dnn.readNetFromCaffe('deploy.prototxt', 'mobilenet_iter_73000.caffemodel')
CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
           "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
           "dog", "horse", "motorbike", "person", "pottedplant", "sheep",
           "sofa", "train", "tvmonitor"]

# Create a window
cv2.namedWindow('Camera Feeds', cv2.WINDOW_NORMAL)

def detect_objects(frame):
    person_count = 0
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()
    
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.2:
            idx = int(detections[0, 0, i, 1])
            if CLASSES[idx] == "person":
                person_count += 1
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                label = "{}: {:.2f}%".format(CLASSES[idx], confidence * 100)
                cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 255, 0), 2)
                y = startY - 15 if startY - 15 > 15 else startY + 15
                cv2.putText(frame, label, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return frame, person_count

async def send_counts(websocket, path):
    while True:
        frame0 = picam0.capture_array()
        frame1 = picam1.capture_array()

        frame0 = cv2.cvtColor(frame0, cv2.COLOR_BGR2RGB)
        frame1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2RGB)

        height = min(frame0.shape[0], frame1.shape[0])
        width = min(frame0.shape[1], frame1.shape[1])
        
        frame0 = cv2.resize(frame0, (width, height))
        frame1 = cv2.resize(frame1, (width, height))

        frame0, count0 = detect_objects(frame0)
        frame1, count1 = detect_objects(frame1)

        combined_frame = np.hstack((frame0, frame1))

        cv2.imshow('Camera Feeds', combined_frame)

        # Send the counts to the WebSocket client
        await websocket.send(f"{count0},{count1}")

        # Exit on 'q' key press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# WebSocket server
async def server():
    async with websockets.serve(send_counts, "localhost", 6789):
        await asyncio.Future()  # run forever

# Run the WebSocket server
asyncio.run(server())
