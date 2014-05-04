from django.shortcuts import render, get_object_or_404

from shows.models import City
from shows.models import Theatre
from shows.models import Movie


def index(request):
    city_list = City.objects.order_by('name')
    theatre_list = Theatre.objects.order_by('name')
    movie_list = Movie.objects.order_by('name')

    context = {'city_list': city_list, 'theatre_list': theatre_list, 
                'movie_list': movie_list}
    return render(request, 'shows/index.html', context)

def theatre_detail(request, theatre_id):
    theatre = get_object_or_404(Theatre, pk=cinema_id)
    return render(request, 'shows/theatre_details.html', {'theatre': theatre})

def movie_details(request, movie_id):
    movie = get_object_or_404(Movie, pk=movie_id)
    return render(request, 'shows/movie_details.html', {'movie' : movie})