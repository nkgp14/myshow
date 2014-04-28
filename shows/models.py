from django.db import models
from django.utils import timezone

# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = "Countries"

    def __unicode__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=200)
    country = models.ForeignKey(Country)

    class Meta:
        verbose_name_plural = "Cities"

    def __unicode__(self):
        return self.name

class Movie(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Theatre(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=400)
    city = models.ForeignKey(City)

    def __unicode__(self):
        return self.name + ', ' + str(self.city)

# TODO timezone should be based on country name, or should be asked by user.
class Showtime(models.Model):
    theatre = models.ForeignKey(Theatre)
    movie = models.ForeignKey(Movie)
    show_time = models.DateTimeField(default=timezone.now())

    def __unicode__(self):
        print self.show_time
        return str(self.theatre) + " " + str(self.movie) + \
               " " + self.show_time.strftime("%A, %d %b %I:%M %p")


