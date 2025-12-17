import os
import warnings
import logging

# Suppress warnings before importing Django
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
warnings.filterwarnings('ignore')

from django.core.management.commands.runserver import Command as RunserverCommand

class Command(RunserverCommand):
    help = 'Run development server with suppressed TensorFlow warnings'
    
    def add_arguments(self, parser):
        super().add_arguments(parser)
        
    def handle(self, *args, **options):
        # Suppress TensorFlow logging
        logging.getLogger('tensorflow').setLevel(logging.ERROR)
        
        # Suppress Django development server warnings
        logging.getLogger('django.server').setLevel(logging.ERROR)
        
        print("🚀 Starting WeatherAI server with optimized settings...")
        print("📊 TensorFlow warnings suppressed")
        print("🔇 Verbose logging disabled")
        
        super().handle(*args, **options)