from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .serializers import HealthResponseSerializer

@extend_schema(
    summary="Health check",
    description="Returns backend health status.",
    tags=["System"],
    responses=HealthResponseSerializer
)
@api_view(["GET"])
def health(request):
    return Response({
        "status": "ok"
    })