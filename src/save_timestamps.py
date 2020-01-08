import json, csv, math
from datetime import datetime as dt
from pathlib import Path
import os 

dir_path = os.path.dirname(os.path.realpath(__file__))

path = Path(dir_path)
path = path.parent

files = [x for x in Path(path.as_uri()[8:len(path.as_uri())] + "/data/collected_data").glob('**/*') if x.is_file()]

dates = {}
for filename in files:
    sep = str(filename).split('_')
    year = sep[-5][-4:]
    month = sep[-4]
    day = sep[-3][:2]
    hour = sep[-3][3:]
    minute = sep[-2]
    second = sep[-1][:2]
    dates[day + '/' + month + '/' + year + " " + hour + ':' + minute + ':' + second] = dt.timestamp(dt(int(year),int(month),int(day),int(hour),int(minute),int(second)))

min_date = dates[list(dates.keys())[0]]
for d in dates:
    dates[d] -= min_date

json = json.dumps(dates, indent=4)
f = open('../data/time.json','w+')
f.write(json)
f.close()
        
# print(raw_json['Squeezielive'])