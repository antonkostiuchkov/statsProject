from django.db import connection
from django.http import HttpResponse
import json
import collections
from django.shortcuts import render

# # # Using Model
# # from django.http import JsonResponse
# from .models import People

def index(request):
    template = 'index.html'
    context = { }
    return render(request, template, context)



# def status(request):
#     query_set = People.objects.values('id','name')
#     people = list(query_set)

#     print type(query_set)
#     print type(people)

#     response = JsonResponse({ 'people' : people })
#     return response




# Bypassing Model


def query(request):
    cursor = connection.cursor()
    cursor.execute("""
        SELECT name, occupation, age
        FROM people
        ORDER BY name
    """)
    rows = cursor.fetchall()


    obj_list = []

    for name, occupation, age in rows:
        d = collections.OrderedDict()
        d['name'] = name
        d['occupation'] = occupation
        d['age'] = age
        obj_list.append(d)

    response = HttpResponse(json.dumps(obj_list))
    return response