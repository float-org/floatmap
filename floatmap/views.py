import os
import requests
import json
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


def map(request):
    context = {}
    return render_to_response("map.html",context,context_instance=RequestContext(request))

@csrf_exempt
def get_noaa_average_precip(request):

    lng = float(request.POST['lng'])
    lat = float(request.POST['lat'])
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

    r = requests.get(url, params=params, data=json.dumps(data))

    if r.status_code == requests.codes.ok:
        try:
            dn = r.json()["hits"]["hits"][0]["fields"]["DN"][0]
            print dn
            return HttpResponse(dn)
        except Exception as e:
            print "Bad response: ", r.json()
            return HttpResponse(0)
    else:
        return False