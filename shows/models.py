from django.db import models

# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Cities(models.Model):
    name = models.CharField(max_length=200)
    country = models.ForeignKey(Country)

    def __unicode__(self):
        return self.name

class Movies(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Theatres(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=400)
    city = models.ForeignKey(Cities)

    def __unicode__(self):
        return self.name + ', ' + str(self.city)

# TODO need to decide upon TimeField format and widget.
class Showtimes(models.Model):
    theatre = models.ForeignKey(Theatres)
    movie = models.ForeignKey(Movies)
    show_time = models.TimeField()

    def __unicode__(self):
        return str(self.theatre) + str(self.movie) + self.show_time

