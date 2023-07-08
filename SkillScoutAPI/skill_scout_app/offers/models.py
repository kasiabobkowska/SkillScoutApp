from django.db import models

# Create your models here.

class JobOffer(models.Model):
    job_offer = models.JSONField()


class Course(models.Model):
    course = models.JSONField()
