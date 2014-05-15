from django.shortcuts import render, get_object_or_404, get_list_or_404
from shows.models import Country
from shows.models import City
from shows.models import Theatre
from shows.models import Movie
from django.http import HttpResponse
import json



def index(request):
    country_list = Country.objects.order_by('name')
    context = {'country_list': country_list}
    return render(request, 'shows/index.html', context)

def theatre_detail(request, theatre_id):
    theatre = get_object_or_404(Theatre, pk=theatre_id)
    return render(request, 'shows/theatre_details.html', {'theatre': theatre})

def movie_details(request, movie_id):
    movie = get_object_or_404(Movie, pk=movie_id)
    return render(request, 'shows/movie_details.html', {'movie' : movie})

def list_cities(request, country_id):
    cities = get_list_or_404(City, country_id=country_id)
    response = {}
    response['cities'] = {}
    for c in cities:
        response['cities'][c.id] = c.name
    return HttpResponse(json.dumps(response), content_type="application/json")

