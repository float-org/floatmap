import os
import requests
import json
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

def map(request):
    import logging
    logger = logging.getLogger('floatmap')
    epFile = open(os.path.join(settings.BASE_DIR, 'geo_search/data/noaa_ex_precip.geojson'))
    apFile = open(os.path.join(settings.BASE_DIR, 'geo_search/data/noaa_avg_precip.geojson'))
    mexicoFile = open(os.path.join(settings.BASE_DIR, 'geo_search/data/mexico.geojson'))
    canadaFile = open(os.path.join(settings.BASE_DIR, 'geo_search/data/canada.geojson'))
    usNoDataFile = open(os.path.join(settings.BASE_DIR, 'geo_search/data/US_no_data.geojson'))
    context = {
        'epData': json.dumps(epFile.read()),
        'apData': json.dumps(apFile.read()),
        'mexicoData': json.dumps(mexicoFile.read()),
        'canadaData': json.dumps(canadaFile.read()),
        'usNoDataData': json.dumps(usNoDataFile.read()),
    }
    logger.debug("%s" % context)
    return render_to_response("map.html",context,context_instance=RequestContext(request))


# Question: Is there a better term for "data_type" w/ regard to Elasticsearch lingo?
# Query Elasticsearch for particular dataset - currently assumes datasets are structured the same.
import traceback
def get_query(data_type, lng, lat):
    url = os.path.join(settings.ES_URL, data_type, "region", "_search")

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
                        "coordinates" : [lng, lat]
                    }
                }
            }
        }
    }

    try:
        r = requests.get(url, params=params, data=json.dumps(data))
        dn = r.json()["hits"]["hits"][0]["fields"]["DN"][0]
        print r.json()
        print dn
        return dn
    except Exception as e:
        print traceback.print_exc()
        return 0


# TODO: Add Extreme Precipitation and Flood queries
@csrf_exempt
def get_queries(request):
    lng = float(request.POST['lng'])
    lat = float(request.POST['lat'])

    ap_query = get_query('noaa_avg_precip', lng, lat)
    ep_query = get_query('noaa_ext_precip', lng, lat)
    

    if ap_query == 0:
        ap_query = "No average precipitation data yet"
    else: 
        ap_query = "%s%% increase in average precipitation" % ap_query

    if ep_query == 0:
        ep_query = "No storm frequency data yet"
    else: 
        ep_query = "%s%% increase in storm frequency" % ep_query
    
    queries = {
        "ap": ap_query,
        "ep": ep_query
    }

    return HttpResponse(json.dumps(queries))


@csrf_exempt
def get_fema_floods(request):
    lng = float(request.POST['lat'])
    lat = float(request.POST['lng'])

    url = os.path.join(settings.ES_URL, "noaa_avg_precip", "region", "_search")
    params = {
        "fields": "FLOOD_NUM"
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
                        "coordinates" : [lng, lat]
                    }
                }
            }
        }
    }

    try:
        r = requests.get(url, params=params, data=json.dumps(data))
        fn = r.json()["hits"]["hits"][0]["fields"]["FLOOD_NUM"][0]
        return HttpResponse(int(fn))
    except Exception as e:
        print "Bad response: ", r.json()
        return HttpResponse(0)
