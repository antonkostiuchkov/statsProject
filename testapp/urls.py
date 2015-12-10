from django.conf.urls import patterns, url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^query/(?P<interval>[\w-]+)/(?P<limit>[\w-]+)/$', views.query),
    # url(r'^test/(?P<some_data>[\w-]+)/$', views.test),
]