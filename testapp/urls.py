from django.conf.urls import patterns, url
from . import views


urlpatterns = patterns(
    (r'^$', views.index),
    (r'^stats/$', views .index),
    # (r'^data_query/(?P<interval>[\w-]+)/(?P<start>[\w-]+)/(?P<end>[\w-]+)/(?P<grouping>[\w-]+)/(?P<AVG>[\w-]+)/(?P<MAX>[\w-]+)/(?P<user_name>[\w-]+)/(?P<result_code>[\w-]+)/(?P<device_id>[\w-]+)/(?P<action_code>[\w-]+)/$', views.data_query),
    (r'^Stats/data_query/$', views.data_query),
    (r'^Stats/report_data/$', views.report_data),
    (r'^Stats/query_names/$', views.query_names),
    (r'^Stats/stats_list/$', views.stats_list),
    (r'^Stats/stats_config/graph/(?P<id>[\w-]+)/$', views.stats_config),
    (r'^Stats/filter/(?P<table>[\w-]+)/(?P<keycode>[\w-]+)/$', views.filter),
)