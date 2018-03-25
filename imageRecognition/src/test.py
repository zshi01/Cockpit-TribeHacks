import time
def dummy() :
    out = '';
    for i in range(0,25) :
        out = i
        print out
        time.sleep(0.1)
if __name__ =='__main__' :
    dummy = dummy()