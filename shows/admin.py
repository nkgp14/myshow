from django.contrib import admin
from shows.models import *
# Register your models here.

# class ShowAdmin(admin.ModelAdmin):
    # fields = ['']

admin.site.register(Country)
admin.site.register(City)
admin.site.register(Movie)
admin.site.register(Theatre)
admin.site.register(Showtime)