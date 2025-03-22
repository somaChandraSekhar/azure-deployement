from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=100)
    revenue = models.FloatField()
    profit = models.FloatField()
    employees = models.IntegerField()
    country = models.CharField(max_length=100)

    def __str__(self):
        return self.name