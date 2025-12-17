#!/usr/bin/env python
"""
WeatherAI Server Startup Script
Configures environment and starts Django server with optimized settings.
"""

import os
import sys
import warnings
import logging

def configure_environment():
    """Configure environment variables and suppress warnings."""
    
    # TensorFlow Configuration
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress INFO and WARNING
    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN warnings
    os.environ['PYTHONWARNINGS'] = 'ignore'    # Suppress Python warnings
    
    # Suppress specific warnings
    warnings.filterwarnings('ignore', category=FutureWarning)
    warnings.filterwarnings('ignore', category=DeprecationWarning)
    warnings.filterwarnings('ignore', category=UserWarning)
    
    # Configure logging
    logging.getLogger('tensorflow').setLevel(logging.ERROR)
    
    print("🔧 Environment configured successfully")
    print("🚀 Starting WeatherAI server...")

def main():
    """Main function to start the Django server."""
    
    # Configure environment first
    configure_environment()
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weather_system.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Change to backend directory for Django
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Start server with custom arguments
    sys.argv = ['manage.py', 'runserver', '127.0.0.1:8000']
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()