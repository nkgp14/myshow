from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^shows/', include('shows.urls', namespace="shows")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^select2/', include('django_select2.urls'))
)
