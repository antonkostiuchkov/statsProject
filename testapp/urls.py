from django.conf.urls import patterns, url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    # url(r'^status/', views.status),
    url(r'^query/', views.query),
    # url(r'^query2/', views.query2),
    # url(r'^query3/', views.query3),
    # url(r'^query4/', views.query4),
    # url(r'^query5/', views.query5),
    # url(r'^query6/', views.query6),

]