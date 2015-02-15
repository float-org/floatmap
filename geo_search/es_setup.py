"""Set up Elasticsearch with indicies and mappings for each data set.

Usage:
  python es_setup.py --elasticsearch [url]

Example:
  python es_setup.py --elasticsearch http://localhost:9200
"""
import argparse
import os
import requests


def make_fema_floods_index(es_url):
    url = os.path.join(es_url, "fema_floods")
    body = """{
    "mappings" : {
        "region" : {
            "properties": {
                "FLOOD_NUM": {"type": "float"},
                "location": {"type": "geo_shape"}
            }
        }
    }
    }
    """
    print "creating fema_floods"
    resp = requests.put(url, data=body)
    print resp.json()


def make_noaa_avg_precip_index(es_url):
    url = os.path.join(es_url, "noaa_avg_precip")
    body = """{
    "mappings" : {
        "region" : {
            "properties": {
                "DN": {"type": "integer"},
                "location": {"type": "geo_shape"}
            }
        }
    }
    }
    """
    print "creating noaa_avg_precip"
    resp = requests.put(url, data=body)
    print resp.json()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--elasticsearch', dest='es_url', required=True,
                        help="elasticsearch url")
    args = parser.parse_args()
    make_fema_floods_index(args.es_url)
    make_noaa_avg_precip_index(args.es_url)



if __name__ == '__main__':
    main()
