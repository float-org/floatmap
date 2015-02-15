"""Test the elastic search index

Usage:
  python es_test.py --elasticsearch [url]

Example:
  python es_test.py --elasticsearch http://localhost:9200
"""
import argparse
import os
import json
import requests

def test_noaa_avg_precip(es_url):
    url = os.path.join(es_url, "noaa_avg_precip", "region", "_search")
    params = {
        "fields": "DN"
    }
    data = {
        "query":{
            "match_all": {}
        },
        "filter": {
            "geo_shape": {
                "location": {
                    "shape": {
                        "type": "point",
                        "coordinates" : [-92.1, 46.8]
                    }
                }
            }
        }
    }
    r = requests.get(url, params=params, data=json.dumps(data))
    print r
    if r.status_code == requests.codes.ok:
        try:
            return r.json()["hits"]["hits"][0]["fields"]["DN"][0] == 9
        except Exception as e:
            print "Bad response: ", r.json()
            return False
    else:
        return False


def run_tests(es_url):
    noaa_avg_precip = test_noaa_avg_precip(es_url)
    if noaa_avg_precip:
        print "noaa_avg_precip passed!"
    else:
        print "noaa_avg_precip failed!"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--elasticsearch', dest='es_url', required=True,
                        help="elasticsearch url")
    args = parser.parse_args()
    run_tests(args.es_url)


if __name__ == '__main__':
    main()
