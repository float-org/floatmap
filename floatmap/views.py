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
    context = {
        'epData': json.dumps(epFile.read()),
        'apData': json.dumps(apFile.read())
    }
    logger.debug("%s" % context)
    return render_to_response("map.html",context,context_instance=RequestContext(request))


# Question: Is there a better term for "data_type" w/ regard to Elasticsearch lingo?
# Query Elasticsearch for particular dataset - currently assumes datasets are structured the same.

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
        print dn
        return dn
    except Exception as e:
        print "Bad response: ", r.json()
        return 0


# TODO: Add Extreme Precipitation and Flood queries
@csrf_exempt
def get_queries(request):
    lng = float(request.POST['lng'])
    lat = float(request.POST['lat'])

    ap_query = get_query('noaa_avg_precip', lng, lat)
    
    # TODO: Probably going to need to distinguish from errors and places with 0% change in precipitation at some point?
    if ap_query == 0:
        ap_query = "No Data Yet"
    #ep_query
    #flood_query
    
    queries = {
        "ap": ap_query
    }

    

    return HttpResponse(json.dumps(queries))

