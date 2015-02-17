from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'floatmap.views.map', name='map'),
    url(r'^get_score/ap/$', 'floatmap.views.get_noaa_average_precip', name='get_noaa_average_precip'),
    url(r'^admin/', include(admin.site.urls)),
)
