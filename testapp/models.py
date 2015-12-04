from __future__ import unicode_literals

from django.db import models



class People(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'people'

