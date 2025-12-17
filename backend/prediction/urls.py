from django.urls import path
from .views import PredictWeatherView, CurrentWeatherView, MetricsView, PredictLSTMView, PredictConditionView, PredictEnsembleView

urlpatterns = [
    path('predict/', PredictWeatherView.as_view(), name='predict'),
    path('predict_lstm/', PredictLSTMView.as_view(), name='predict_lstm'),
    path('predict_ensemble/', PredictEnsembleView.as_view(), name='predict_ensemble'),
    path('predict_condition/', PredictConditionView.as_view(), name='predict_condition'),
    path('current/', CurrentWeatherView.as_view(), name='current'),
    path('metrics/', MetricsView.as_view(), name='metrics'),
]
