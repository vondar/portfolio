from django.urls import path

from . import views


urlpatterns = [
    path("health/", views.health, name="health"),
    path("projects/", views.projects, name="projects"),
    path("projects/<slug:slug>/", views.project_detail, name="project-detail"),
]

