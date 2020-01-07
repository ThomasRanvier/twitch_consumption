import json, csv, math
from datetime import datetime as dt
from pathlib import Path
import os 

dir_path = os.path.dirname(os.path.realpath(__file__))

path = Path(dir_path)
path = path.parent

files = [x for x in Path(path.as_uri()[8:len(path.as_uri())] + "/data/collected_data").glob('**/*') if x.is_file()]

raw_json = json.load(open('../data/old_data.json'))
start_list = []
end_list = []

for streamer in raw_json:
    for stream in raw_json[streamer]['streams']:
        split_start = stream['start'].split('_')
        split_end = stream['end'].split('_')
        # print(tmp_start)
        stamp_start = dt.timestamp(dt(int(split_start[0]),int(split_start[1]),int(split_start[2]),int(split_start[3]),int(split_start[4]),int(split_start[5])))
        stamp_end = dt.timestamp(dt(int(split_end[0]),int(split_end[1]),int(split_end[2]),int(split_end[3]),int(split_end[4]),int(split_end[5])))
        # print(streamer)
        # print(stamp_start, stamp_end)
        start_list.append(stamp_start)
        end_list.append(stamp_end)

min_stamp = min(start_list)
max_stamp = max(end_list)

dates = []
for filename in files:
    sep = str(filename).split('_')
    year = sep[-5][-4:]
    month = sep[-4]
    day = sep[-3][:2]
    hour = sep[-3][3:]
    minute = sep[-2]
    second = sep[-1][:2]
    dates.append(dt.timestamp(dt(int(year),int(month),int(day),int(hour),int(minute),int(second))) - min_stamp)

viewers_count = [0] * len(dates)
for streamer in raw_json:
    i=0
    streaming = False
    viewer_stream = []
    o_data = []
    while raw_json[streamer]['streams'][i]['stamp_end'] < dates[0]:
        i+=1
    streaming = raw_json[streamer]['streams'][i]['stamp_start'] < dates[0]
    j=0
    for h in range(len(dates)):
        if streaming:
            if raw_json[streamer]['streams'][i]['stamp_end'] < dates[h]:
                streaming = False
                o_data.append(raw_json[streamer]['streams'][i])
                i+=1
                j=0
        else:
            if raw_json[streamer]['streams'][i]['stamp_start'] < dates[h]:
                streaming = True
        if streaming and j < len(raw_json[streamer]['streams'][i]['viewers']):
            viewer_stream.append(raw_json[streamer]['streams'][i]['viewers'][j])
            viewers_count[h] += raw_json[streamer]['streams'][i]['viewers'][j]
            j+=1
        else:
            viewer_stream.append(0)
    if (raw_json[streamer]['streams'][i]['stamp_start'] < dates[h] and raw_json[streamer]['streams'][i]['stamp_end'] > dates[h]):
        o_data.append(raw_json[streamer]['streams'][i])
    raw_json[streamer]['streams'] = {}
    raw_json[streamer]['streams']['viewers'] = viewer_stream
    
    for d in o_data:
        del d['viewers']
    raw_json[streamer]['streams']['data_stamp'] = o_data
        # split_start = stream['start'].split('_')
        # split_end = stream['end'].split('_')
  
        # stream['stamp_start'] = dt.timestamp(dt(int(split_start[0]),int(split_start[1]),int(split_start[2]),int(split_start[3]),int(split_start[4]),int(split_start[5]))) - min_stamp
        # stream['stamp_end'] = dt.timestamp(dt(int(split_end[0]),int(split_end[1]),int(split_end[2]),int(split_end[3]),int(split_end[4]),int(split_end[5]))) - min_stamp

        # stream['angle_start'] = (stream['stamp_start']/stamp_scale)*math.pi*2
        # stream['angle_end'] = (stream['stamp_end']/stamp_scale)*math.pi*2
        
        #print(stream['angle_end'])
total_views = {}
for h in range(len(dates)):
    total_views[dates[h]] = viewers_count[h]
json_s = json.dumps(raw_json, indent=4)
f = open('../data/data.json','w+')
f.write(json_s)
f.close()



json_v = json.dumps(total_views, indent=4)
f = open('../data/total_views.json','w+')
f.write(json_v)
f.close()
        
# print(raw_json['Squeezielive'])