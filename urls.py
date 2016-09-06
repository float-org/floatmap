from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'floatmap.views.map', name='map'),
)
