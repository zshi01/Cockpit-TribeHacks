# Cockpit-TribeHacks #

Cockpit lets users to control drones(Parrot AR 2.0) using their hands (right wrist in particular). The drone will try to track down and follow user's hand position in real-time.

## Development ##
We utilized tf-pose-estimation(https://github.com/ildoonet/tf-pose-estimation), a deep pose estimation application implemented using Tensorflow that supports real-time human pose estimation through the webcam(or in our case, drone camera), to extract and recognize human motion and pose. 
To feed the raw video stream to tf-pose-estimation, we also used ar-drone(https://github.com/felixge/node-ar-drone), which is a node.js client for controlling Parrot AR Drone 2.0 quad-copters, to record and stream the video and send it to backend to analyze.
After analyzing the pose, detecting the pose changes, and making the decisions, the decisions are sent back to ar-drone also in real-time to allow the drone to execute the motion commands, therefore, realizing the feature that users can control the drones using their bodies.


## Demo

## Dependency
* python3, node.js
* tensorflow 1.4.1+
* opencv
* argparse
* numpy, scipy, matploylib
* git+https://github.com/ppwwyyxx/tensorpack.git
* npm install ar-drone

## Upcoming new features
What we can add next is to allow users to control the drones in vertical axis as well. Also, to improve the user experience, the speed of the drone can also be adjusted according to user's body motion. New feature also includes letting the drone to rotate, or do other fancy motions according to human pose.




