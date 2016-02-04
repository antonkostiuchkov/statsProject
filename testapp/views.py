from django.http import HttpResponse
from django.shortcuts import render
import json


from views_functions.stats_list import stats_list_func
from views_functions.stats_config import stats_config_func
from views_functions.query_names import query_names_func
from views_functions.report_data import report_data_func
from views_functions.data_query import data_query_func
from views_functions.filters import filter_func


# Rendering stuff
def index(request):
    template = 'index.html'

    return render(request, template)


# Querying data to show on graphs
def data_query(request):

    response = data_query_func(request)
    response_json = json.dumps(response)

    return HttpResponse(response_json)


# Getting data for report
def report_data(request):

    response = report_data_func()
    response_json = json.dumps(response)

    return HttpResponse(response_json)


# Preloading data for filtering
def query_names(request):

    response = query_names_func()
    response_json = json.dumps(response)

    return HttpResponse(response_json)


# Generating list of stats on the load
def stats_list(request):

    response = stats_list_func()
    response_json = json.dumps(response)

    return HttpResponse(response_json)

# Generating configuration json for stats
def stats_config(request, id):

    response = stats_config_func(id)
    response_json = json.dumps(response)

    return HttpResponse(response_json)

# Generating configuration json for stats
def filter(request, table, keycode):

    response = filter_func(table, keycode)
    response_json = json.dumps(response)

    return HttpResponse(response_json)
