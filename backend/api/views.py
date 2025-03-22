from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import random
import threading
import time
from .models import Company
from .serializers import CompanySerializer
from django.db import models

stop_generation = False

@api_view(['GET'])
def get_companies(request):
    companies = Company.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def upload_excel(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
    
    df = pd.read_excel(file)
    for _, row in df.iterrows():
        Company.objects.create(
            name=row['name'],
            revenue=row['revenue'],
            profit=row['profit'],
            employees=row['employees'],
            country=row['country']
        )
    return Response({"message": "Data uploaded successfully"}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_company(request, pk):
    try:
        company = Company.objects.get(pk=pk)
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Company.DoesNotExist:
        return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_company(request, pk):
    try:
        company = Company.objects.get(pk=pk)
        company.delete()
        return Response({"message": "Company deleted"}, status=status.HTTP_204_NO_CONTENT)
    except Company.DoesNotExist:
        return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_company(request):
    serializer = CompanySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def generate_data(request):
    global stop_generation
    stop_generation = False

    def generate():
        countries = ['USA', 'UK', 'India', 'China', 'Japan']
        companies = ['A', 'B', 'C', 'D', 'E']
        while not stop_generation:
            Company.objects.create(
                name=random.choice(companies),
                revenue=random.uniform(1000, 10000),
                profit=random.uniform(100, 5000),
                employees=random.randint(10, 1000),
                country=random.choice(countries)
            )
            time.sleep(1)

    threading.Thread(target=generate, daemon=True).start()
    return Response({"message": "Data generation started"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def stop_generation_view(request):
    global stop_generation
    stop_generation = True
    return Response({"message": "Data generation stopped"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_stats(request):
    companies = Company.objects.all()
    revenue_gt_10k = companies.filter(revenue__gt=10000).count()
    country_counts = companies.values('country').annotate(count=models.Count('country'))
    revenue_data = [float(c.revenue) for c in companies]

    return Response({
        'revenue_gt_10k': revenue_gt_10k,
        'country_counts': list(country_counts),
        'revenue_box_data': revenue_data
    })