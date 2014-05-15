from django.conf.urls import url

from shows import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<country_id>\d+)/listCities/$', views.list_cities, name='list_cities'),
    url(r'^(?P<theatre_id>[0-9]+)/cinema/$', views.theatre_detail, name='theatre_detail'),
    # ex: /polls/5/results/
    url(r'^(?P<movie_id>[0-9]+)/movie/$', views.movie_details, name='movie_details'),
]