"""
WSGI config for excel_etl project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
# settings_module='excel_etl.deployment' if 'WEBSITE_HOSTNAME' in os.environ  else 'excel_etl.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'excel_etl.settings')


application = get_wsgi_application()
