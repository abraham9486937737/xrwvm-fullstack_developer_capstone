from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import logging
import json
import requests

from .models import CarMake, CarModel
from .populate import initiate

logger = logging.getLogger(__name__)

# ---------------------------
# USER AUTHENTICATION VIEWS
# ---------------------------

@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']

    user = authenticate(username=username, password=password)
    response = {"userName": username}

    if user is not None:
        login(request, user)
        response["status"] = "Authenticated"

    return JsonResponse(response)


@csrf_exempt
def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("userName")
        password = data.get("password")
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Already Registered"})

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        login(request, user)
        return JsonResponse({"userName": username, "status": "Registered"})

    return JsonResponse({"error": "Invalid request method"})


# ---------------------------
# CAR MODELS VIEW
# ---------------------------

def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')
    cars = [
        {"CarModel": cm.name, "CarMake": cm.car_make.name}
        for cm in car_models
    ]

    return JsonResponse({"CarModels": cars})


# ---------------------------
# DEALERSHIP VIEWS (MongoDB)
# ---------------------------

EXPRESS_BACKEND = "http://localhost:3030"

@csrf_exempt
def get_dealerships(request):
    url = f"{EXPRESS_BACKEND}/fetchDealers"
    response = requests.get(url)

    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)

    return JsonResponse({"error": "Unable to fetch dealers"}, status=500)


@csrf_exempt
def get_dealer(request, dealer_id):
    url = f"{EXPRESS_BACKEND}/fetchDealer/{dealer_id}"
    response = requests.get(url)

    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)

    return JsonResponse({"error": "Unable to fetch dealer"}, status=500)


@csrf_exempt
def get_dealer_reviews(request, dealer_id):
    url = f"{EXPRESS_BACKEND}/fetchReviews/dealer/{dealer_id}"
    response = requests.get(url)

    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)

    return JsonResponse({"error": "Unable to fetch reviews"}, status=500)


@csrf_exempt
def get_dealers_by_state(request, state):
    url = f"{EXPRESS_BACKEND}/fetchDealers"
    response = requests.get(url)

    if response.status_code == 200:
        dealers = response.json()
        filtered = [d for d in dealers if d["state"] == state]
        return JsonResponse(filtered, safe=False)

    return JsonResponse({"error": "Unable to fetch dealers"}, status=500)


@csrf_exempt
def add_review(request):
    if request.method == "POST":
        review_data = json.loads(request.body)
        url = f"{EXPRESS_BACKEND}/insert_review"

        response = requests.post(url, json=review_data)

        if response.status_code == 200:
            return JsonResponse({"status": "Review added"})

        return JsonResponse({"error": "Unable to add review"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
