import argparse
import logging
import time

import cv2
import numpy as np
import math
import sys

from estimator import TfPoseEstimator
from networks import get_graph_path, model_wh

logger = logging.getLogger('TfPoseEstimator-WebCam')
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

fps_time = 0

def calculate_and_decide(prev_x, prev_y, x, y, pos,prev_decision):
    '''
        prev_x, prev_y, x, y: list of coordinates of right arms (3 nodes)
        [[i1, x1],[i2, x2],[i3, x3]]
        decision: suspend, move left, move right
        algorithm:
    '''
    decision = "HOVER"

    if(len(prev_x) <= 1 and len(prev_y) <= 1 and len(x) <= 1 and len(y) <= 1):
        return decision

    # print(prev_x)
    # print(x)
    distance = 0
    sum_cur = 0
    sum_prev = 0

    nose_x_prev = 0
    rElbow_x_prev = 0
    rWrist_x_prev = 0

    nose_x = 0
    rElbow_x = 0
    rWrist_x = 0

    nose_y = 0
    rHip_y = 0

    for i in range(len(prev_x)-1):
        if prev_x[i][0] == 0:
            nose_x_prev = prev_x[i][1]
        if prev_x[i][0] == 3:
            rElbow_x_prev = prev_x[i][1]
        if prev_x[i][0] == 4:
            rWrist_x_prev = prev_x[i][1]

    for j in range(len(x)-1):
        if x[j][0] == 0:
            nose_x = x[j][1]
        if x[j][0] == 3:
            rElbow_x = x[j][1]
        if x[j][0] == 4:
            rWrist_x = x[j][1]

    for k in range(len(y)-1):
        if y[k][0] == 0:
            nose_y = y[k][1]
        if y[k][0] == 8:
            rHip_y = y[k][1]


    # x-axis value -> right elbow, right wrist, nose_x
    # print("nose x: {0}".format(nose_x))
    # print("right Elbow x: {0}".format(rElbow_x))
    # print("right Wrist x: {0}".format(rWrist_x))
    # print(nose_x - rElbow_x)
    # print(nose_x - rWrist_x)
    # higher value, more right
    scale_multiplier = nose_y - rHip_y
    threshold = 0.6 * scale_multiplier
    if (rWrist_x - rWrist_x_prev) * 0.8 + (rElbow_x - rElbow_x_prev) * 0.2 >= threshold:
        decision = "LEFT"
    if (rWrist_x - rWrist_x_prev) * 0.8 + (rElbow_x - rElbow_x_prev) * 0.2 >= -threshold and (rWrist_x - rWrist_x_prev) * 0.8 + (rElbow_x - rElbow_x_prev) * 0.2 <= threshold:
        decision = "HOVER"
    if (rWrist_x - rWrist_x_prev) * 0.8 + (rElbow_x - rElbow_x_prev) * 0.2 <= -threshold:
        decision = "RIGHT"

    if prev_decision == "LEFT" or prev_decision == "RIGHT":
        decision = "HOVER"


    # cur_point = (nose_x - rElbow_x) * 0.2 + (nose_x - rWrist_x) * 0.8
    # prev_point = (nose_x_prev - rElbow_x_prev) * 0.2 + (nose_x_prev - rWrist_x_prev) * 0.8
    # # 5 is the the threshold
    # if cur_point - prev_point >= 3:
    #     decision = "move RIGHT"
    # if cur_point - prev_point >= -3 and cur_point - prev_point <= 3:
    #     decision = "HOVER"
    # if cur_point - prev_point <= -3:
    #     decision = "move LEFT"

    # for i in range(len(prev_x)-1):
    #     sum_prev = sum_prev + #abs(prev_x[i][1]-prev_x[i+1][1])
    # for j in range(len(x)-1):
    #     sum_cur = sum_cur + abs(x[j][1]-x[j+1][1])
    # if sum_cur/max(1,len(prev_x)) > sum_prev/max(1,len(x)):
    #     decision = "move right"
    # elif sum_cur/max(1,len(prev_x)) == sum_prev/max(1,len(x)):
    #     decision = "hover"
    # else:
    #     decision = "move left"

    return decision


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='tf-pose-estimation realtime webcam')
    parser.add_argument('--camera', type=int, default=0)
    parser.add_argument('--zoom', type=float, default=1.0)
    parser.add_argument('--resolution', type=str, default='432x368', help='network input resolution. default=432x368')
    parser.add_argument('--model', type=str, default='mobilenet_thin', help='cmu / mobilenet_thin')
    parser.add_argument('--show-process', type=bool, default=False,
                        help='for debug purpose, if enabled, speed for inference is dropped.')
    args = parser.parse_args()

    # logger.debug('initialization %s : %s' % (args.model, get_graph_path(args.model)))
    w, h = model_wh(args.resolution)
    e = TfPoseEstimator(get_graph_path(args.model), target_size=(w, h))
    # logger.debug('cam read+')
    # cam = cv2.VideoCapture(args.camera)

    cam = cv2.VideoCapture()
    cam.open("tcp://192.168.1.1:5555")
    ret_val, image = cam.read()
    logger.info('cam image=%dx%d' % (image.shape[1], image.shape[0]))

    f = open("human_node_datalog.txt","w")
    prev_x = []
    prev_y = []
    prev_decision = "HOVER"

    pos = 0
    counter = 0

    print("YO!!!!")
    while True:
        ret_val, image = cam.read()

        if counter % 20 == 0:
            # logger.debug('image preprocess+')
            if args.zoom < 1.0:
                canvas = np.zeros_like(image)
                img_scaled = cv2.resize(image, None, fx=args.zoom, fy=args.zoom, interpolation=cv2.INTER_LINEAR)
                dx = (canvas.shape[1] - img_scaled.shape[1]) // 2
                dy = (canvas.shape[0] - img_scaled.shape[0]) // 2
                canvas[dy:dy + img_scaled.shape[0], dx:dx + img_scaled.shape[1]] = img_scaled
                image = canvas
            elif args.zoom > 1.0:
                img_scaled = cv2.resize(image, None, fx=args.zoom, fy=args.zoom, interpolation=cv2.INTER_LINEAR)
                dx = (img_scaled.shape[1] - image.shape[1]) // 2
                dy = (img_scaled.shape[0] - image.shape[0]) // 2
                image = img_scaled[dy:image.shape[0], dx:image.shape[1]]

            # logger.debug('image process+')
            humans = e.inference(image)

            # logger.debug('postprocess+')
            image = TfPoseEstimator.draw_humans(image, humans, imgcopy=False)

            # face_track modification
            x, y = TfPoseEstimator.get_human_node_coordinates(image, humans)

            decision = calculate_and_decide(prev_x, prev_y, x, y,pos,prev_decision)
            prev_decision = decision
            # if decision == "RIGHT":
            #     decision = 1
            # elif decision == "LEFT":
            #     decision = 2
            # else:
            #     decision = 3
            print(decision)
            sys.stdout.flush()
            # f.write(str(x) + "\n")
            # f.write(str(y) + "\n")
            # f.write("--------------------------------------------------------------\n")
            prev_x, prev_y = x, y


            # logger.debug('show+')
            cv2.putText(image,
                        "FPS: %f" % (1.0 / (time.time() - fps_time)),
                        (10, 10),  cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (0, 255, 0), 2)


        cv2.imshow('tf-pose-estimation result', image)
        fps_time = time.time()
        if cv2.waitKey(1) == 27:
            break
        # logger.debug('finished+')
        counter = counter + 1

    f.close()

    cv2.destroyAllWindows()
