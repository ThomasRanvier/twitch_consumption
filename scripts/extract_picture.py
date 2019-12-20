from __future__ import print_function
from io import BytesIO
import requests
import csv
from PIL import Image
import binascii
import struct
import numpy as np
import scipy
import scipy.misc
import scipy.cluster

f = open('../data/most_popular_fr.txt')
content = f.readlines()
f.close()
csv_res = []

for raw_name in content:
    name = raw_name.strip('\n')
    res = requests.get('https://api.twitch.tv/helix/users?login=' + name, headers={'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': '9b5jewtemicj2fcbm818syf1bb3oqb'})
    img_path = res.json()['data'][0]['profile_image_url']
    # DL image
    response = requests.get(img_path)
    im = Image.open(BytesIO(response.content))
    # Resize to save some time
    im = im.resize((150, 150))
    ar = np.asarray(im)
    shape = ar.shape
    ar = ar.reshape(scipy.product(shape[:2]), shape[2]).astype(float)
    # Extract 5 clusters
    codes, dist = scipy.cluster.vq.kmeans(ar, 5)
    vecs, dist = scipy.cluster.vq.vq(ar, codes)
    counts, bins = scipy.histogram(vecs, len(codes))
    index_max = scipy.argmax(counts)
    peak = codes[index_max]
    # Get dominant color
    colour = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
    csv_res.append([name, img_path, '#%s'%(colour)])
    print(name, 'done')
f = open('../data/pic_and_color.csv', 'w')
writer = csv.writer(f)
writer.writerows(csv_res)
f.close()
