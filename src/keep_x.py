import json, csv, math
from datetime import datetime as dt

raw_json = json.load(open('../data/data.json'))
start_list = []
end_list = []

suppress_list = []
i=len(raw_json)

for streamer in raw_json:
    print(len(raw_json[streamer]["streams"]))
    if i > 30:
        txt = input("Suppress : " + streamer + " ?")
        if txt == "y":
            suppress_list.append(streamer)
            i-=1


for s in suppress_list:
    del raw_json[s]

for streamer in raw_json:
    print(streamer)

json = json.dumps(raw_json, indent=4)
f = open('../data/data.json','w+')
f.write(json)
f.close()
