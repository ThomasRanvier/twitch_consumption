import pandas as pd
import numpy as np
import re
from pathlib import Path
import os 

dir_path = os.path.dirname(os.path.realpath(__file__))

path = Path(dir_path)
path = path.parent

files = [x for x in Path(path.as_uri()[8:len(path.as_uri())] + "/data/collected_data").glob('**/*') if x.is_file()]

for filename in files:
    cols = ["name", "id", "user_id", "user_name", "game_id", "type", "title", "viewer_count", "started_at", "language", "thumbnail_url" , "tag_ids"]
    df = pd.read_csv(filename, header = None, names = cols)
    narray = np.array(df)
    for line in narray:
        if (line[1] != '[]'):
            l = line[1].split(",")
            for a in l:
                a = a.split(":")
                a[0] = a[0].replace("\'", "")
                a[0] = a[0].replace(" ", "")
                a[0] = a[0].replace("[", "")
                a[0] = a[0].replace("]", "")
                a[0] = a[0].replace("{", "")
                a[0] = a[0].replace("}", "")
                if a[0] in cols:
                    indexToTake = cols.index(a[0])
                    a[1] = " ".join(a[1:len(a)])
                    a[1] = a[1].replace("\'", "")
                    a[1] = a[1].replace("[", "")
                    a[1] = a[1].replace("]", "")
                    a[1] = a[1].replace("{", "")
                    a[1] = a[1].replace("}", "")
                    line[indexToTake] = a[1]
                else:
                    line[indexToTake] += " " + a[0]
        else:
            line[1] = np.nan
    p = filename.as_uri().replace("collected_data", "transformed_data")
    df = pd.DataFrame(data = narray, columns = cols)
    df.to_csv(p[8:len(p)])