"""Load FEMA average precipitation data from a geojson file into Elasticsearch

To convert a shp file to GeoJson:
  ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp

Usage:
  python index_fema.py --elasticsearch [url] --fema_file [geojson_file]

Example:
  python index_fema.py --elasticsearch http://localhost:9200 \
      --fema_file ~/midwest_flood_1_2.geojson
"""
import argparse
import decimal
import ijson
import json
import os
import requests
import uuid


# Custom encoder subclass to encode Decimals parsed by ijson
class DecimalEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        else:
            return json.JSONEncoder.default(self, obj)


def index_fema_floods(fema_geojson_file_path, es_url):
    with open(fema_geojson_file_path, "r") as f:
        features = ijson.items(f, "features.item")
        count = 0
        for feat in features:
            try:
                doc = dict()
                # parsed as Decimal, but we only need the integral value for FLOOD_NUM
                doc["FLOOD_NUM"] = int(feat["properties"]["FLOOD_NUM"])
                doc["location"] = feat["geometry"]
                doc["location"]["type"] = doc["location"]["type"].lower()
                # Generate a random uuid for the doc
                url = os.path.join(
                    es_url, "fema_floods", "region", str(uuid.uuid4()))
                r = requests.put(url, data=json.dumps(doc, cls=DecimalEncoder))
                count += 1
                if count % 100 == 0:
                    print "Count: ", count
            except Exception as e:
                print "Exception: ", e

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--elasticsearch', dest='es_url', required=True,
                        help="elasticsearch url")
    parser.add_argument('--fema_file', dest='fema_file', required=True,
                        help="the FEMA average precipitation file")
    args = parser.parse_args()
    index_fema_floods(args.fema_file, args.es_url)


if __name__ == '__main__':
    main()

