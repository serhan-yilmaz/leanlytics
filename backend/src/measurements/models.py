from django.conf import settings
from django.db import models


class Measurement(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="measurements",
    )

    date = models.DateField()

    weight = models.FloatField()

    waist = models.FloatField()

    neck = models.FloatField()

    height = models.FloatField()

    chest = models.FloatField(
        null=True,
        blank=True,
    )

    hip = models.FloatField(
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"],
                name="unique_measurement_per_day",
            )
        ]

        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.date}"