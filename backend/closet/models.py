from distutils.command.upload import upload
from email.mime import image
from re import M
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.

class ClothingType(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class ClothingItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)
    worn = models.DateField(default=timezone.now, null=False)
    ctype = models.ForeignKey(ClothingType, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, null=True, blank=True)
    cover = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Outfit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    about = models.TextField(null=True, blank=True)
    worn = models.DateField(default=timezone.now, null=False)
    items = models.ManyToManyField(ClothingItem)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


