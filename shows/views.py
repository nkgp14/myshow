from django.shortcuts import render, get_object_or_404, get_list_or_404
from shows.models import Country
from shows.models import City
from shows.models import Theatre
from shows.models import Movie
from shows.models import Showtime
from django.http import HttpResponse
from django.utils import timezone
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

def list_cinemas(request, city_id):
    cinemas = get_list_or_404(Theatre, city_id=city_id)
    response = {}
    response['cinemas'] = {}
    for c in cinemas:
        response['cinemas'][c.id] = c.name
    return HttpResponse(json.dumps(response), content_type="application/json")

def list_movies(request, city_id):
    movies = Showtime.objects.select_related('movies').filter(theatre__city_id=city_id)
    response = {}
    response['movies'] = {}
    for m in movies:
        response['movies'][m.movie.id] = m.movie.name
    return HttpResponse(json.dumps(response), content_type="application/json")

def list_date(showtime):
    shows = [s['show_time'] for s in showtime if s['show_time'] > timezone.now()]
    shows.sort()
    response = {}
    response['dates'] = []
    today = timezone.now().day
    tomorrow = timezone.now().day + 1

    for s in shows:
        if len(response['dates']) >= 5:
            break

        str = ''
        if s.day == today:
            str += 'Today '
        elif s.day == tomorrow:
            str += 'Tomorrow '
        str += s.strftime("%d %B")
        if not response['dates'] or response['dates'][-1] != str:
            response['dates'].append(str)

    return HttpResponse(json.dumps(response), content_type="application/json")

def list_date_cinema(request, theatre_id):
    showtime = Showtime.objects.filter(theatre_id=theatre_id).values('show_time')
    return list_date(showtime)

def list_date_movie(request, movie_id):
    showtime =Showtime.objects.filter(movie_id=movie_id).values('show_time')
    return list_date(showtime)
