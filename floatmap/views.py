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
    canadaFile = open(os.path.join(settings.BASE_DIR, 'geo_search/data/canada_compressed.geojson'))
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

