from django.urls import path
from .views import PredictWeatherView, CurrentWeatherView, MetricsView, PredictLSTMView, PredictConditionView, PredictEnsembleView, CitySearchView, ReverseGeocodeView, BackendStatusView

urlpatterns = [
    path('predict/', PredictWeatherView.as_view(), name='predict'),
    path('predict_lstm/', PredictLSTMView.as_view(), name='predict_lstm'),
    path('predict_ensemble/', PredictEnsembleView.as_view(), name='predict_ensemble'),
    path('predict_condition/', PredictConditionView.as_view(), name='predict_condition'),
    path('current/', CurrentWeatherView.as_view(), name='current'),
    path('metrics/', MetricsView.as_view(), name='metrics'),
    path('search-city/', CitySearchView.as_view(), name='search_city'),
    path('reverse-geocode/', ReverseGeocodeView.as_view(), name='reverse_geocode'),
    path('status/', BackendStatusView.as_view(), name='status'),
]
