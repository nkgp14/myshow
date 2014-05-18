from django.conf.urls import url

from shows import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<country_id>\d+)/listCities/$', views.list_cities, name='list_cities'),
    url(r'^(?P<city_id>\d+)/listCinemas/$', views.list_cinemas, name='list_cinemas'),
    url(r'^(?P<city_id>\d+)/listMovies/$', views.list_movies, name='list_movies'),
    url(r'^(?P<theatre_id>\d+)/listDatesByCinema/$', views.list_date_cinema, name='list_dates_cinema'),
    url(r'^(?P<movie_id>\d+)/listDatesByMovie/$', views.list_date_movie, name='list_dates_movie'),
]