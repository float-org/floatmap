import os
from django.shortcuts import render_to_response
from django.template import RequestContext

def map(request):
    context = {}
    return render_to_response("map.html",context,context_instance=RequestContext(request))


