import os
import requests
import json
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

def map(request):
    epFile = open(os.path.abspath('floatmap/static/ep/noaa_ex_precip.geojson'))
    apFile = open(os.path.abspath('floatmap/static/ap/noaa_avg_precip.geojson'))
    context = {
        'epData': json.dumps(epFile.read()),
        'apData': json.dumps(apFile.read())
    }
    return render_to_response("map.html",context,context_instance=RequestContext(request))

@csrf_exempt
def get_noaa_average_precip(request):

    print request.POST
    lng = float(request.POST['lat'])
    lat = float(request.POST['lng'])
    print lng
    print lat

    url = os.path.join(settings.ES_URL, "noaa_avg_precip", "region", "_search")
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
        return HttpResponse(dn)
    except Exception as e:
        print "Bad response: ", r.json()
        return HttpResponse(0)

