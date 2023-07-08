from django.urls import path
from offers.API.views import JobOfferView, CourseView

urlpatterns = [
    path('offers/', JobOfferView.as_view()),
    path('courses/', CourseView.as_view())
]