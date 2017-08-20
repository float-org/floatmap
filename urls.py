from django.conf.urls import patterns, include, url
from django.contrib.staticfiles import views
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'floatmap.views.map', name='map'),
    url(r'^get_queries/$', 'floatmap.views.get_queries', name='get_queries'),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += [
    url(r'^static/(?P<path>.*)$', views.serve)
]
