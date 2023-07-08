from rest_framework.generics import ListAPIView
from offers.models import JobOffer, Course
from offers.API.serializers import JobOfferSerializer, CourseSerializer

class JobOfferView(ListAPIView):
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer


class CourseView(ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer