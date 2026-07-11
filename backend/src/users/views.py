from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .serializers import LoginSerializer, UserSerializer, RegisterSerializer

@extend_schema(tags=["Auth"], request=LoginSerializer, responses=UserSerializer)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response({"detail": "Invalid credentials"}, status=400)

    login(request, user)

    return Response(UserSerializer(user).data)

@extend_schema(tags=["Auth"])
@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out"})

@extend_schema(tags=["Auth"])
@api_view(["GET"])
def me_view(request):
    return Response(UserSerializer(request.user).data)

@extend_schema(tags=["Auth"], request=RegisterSerializer, responses=UserSerializer)
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()

    login(request, user)

    return Response(UserSerializer(user).data, status=201)