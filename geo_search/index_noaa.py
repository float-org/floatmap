"""Load NOAA average precipitation data from a geojson file into Elasticsearch

To convert a shp file to GeoJson:
  ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp

Usage:
  python index_noaa.py --elasticsearch [url] --noaa_file [geojson_file]

Example:
  python index_noaa.py --elasticsearch http://localhost:9200 \
      --noaa_file ~/noaa_avg_precip.geojson
"""
import argparse
import json
import os
import requests
import uuid

def index_noaa_avg_precip(noaa_geojson_file_path, es_url):
    # Note: ogr2ogr seems to put all the data on one line.
    # This method of loading only works for small files like noaa
    with open(noaa_geojson_file_path, "r") as f:
        geo = json.load(f)
        for feat in geo["features"]:
            doc = dict()
            doc["DN"] = feat["properties"]["DN"]
            doc["location"] = feat["geometry"]
            doc["location"]["type"] = doc["location"]["type"].lower()
            # Generate a random uuid for the doc
            url = os.path.join(
                es_url, "noaa_avg_precip", "region", str(uuid.uuid4()))
            r = requests.put(url, data=json.dumps(doc))
            print r.json()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--elasticsearch', dest='es_url', required=True,
                        help="elasticsearch url")
    parser.add_argument('--noaa_file', dest='noaa_file', required=True,
                        help="the NOAA average precipitation file")
    args = parser.parse_args()
    index_noaa_avg_precip(args.noaa_file, args.es_url)


if __name__ == '__main__':
    main()
