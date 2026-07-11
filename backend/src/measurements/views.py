from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from drf_spectacular.utils import extend_schema
from .models import Measurement
from .serializers import MeasurementSerializer

@extend_schema(
    tags=["Measurements"],
)
class MeasurementViewSet(viewsets.ModelViewSet):
    serializer_class = MeasurementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Measurement.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        date = serializer.validated_data["date"]

        instance = Measurement.objects.filter(user=user, date=date).first()

        if instance:
            serializer.update(instance, serializer.validated_data)
        else:
            serializer.save(user=user)

    @extend_schema(
        request=MeasurementSerializer(many=True),
        responses=MeasurementSerializer(many=True),
    )
    @action(detail=False, methods=["post"])
    def bulk_upsert(self, request):
        user = request.user
        items = request.data

        if not isinstance(items, list):
            return Response({"detail": "Expected list"}, status=400)

        serializer = MeasurementSerializer(data=items, many=True)
        serializer.is_valid(raise_exception=True)
        validated_items = serializer.validated_data

        objs = [
            Measurement(
                user=user,
                **item
            )
            for item in validated_items
        ]

        updatable_fields = [
            field.name
            for field in Measurement._meta.fields
            if field.name not in ["id", "user", "date"]
        ]

        with transaction.atomic():
            Measurement.objects.bulk_create(
                objs,
                update_conflicts=True,
                unique_fields=["user", "date"],
                update_fields=updatable_fields,
            )

        return Response(validated_items)

        # dates = [item.get("date") for item in items if item.get("date")]

        # existing = Measurement.objects.filter(
        #     user=user,
        #     date__in=dates,
        # )

        # existing_map = {
        #     m.date: m for m in existing
        # }

        # results = []

        # with transaction.atomic():
        #     for item in items:
        #         date = item.get("date")
        #         if not date:
        #             continue

        #         obj = existing_map.get(date)

        #         if obj:
        #             serializer = self.get_serializer(
        #                 obj,
        #                 data=item,
        #                 partial=True,
        #             )
        #         else:
        #             serializer = self.get_serializer(data=item)
        #         serializer.is_valid(raise_exception=True)
        #         serializer.save(user=user)

        #         results.append(serializer.data)

        # return Response(results)