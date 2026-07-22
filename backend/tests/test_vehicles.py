import pytest
import pytest_asyncio


@pytest_asyncio.fixture
async def admin_auth_headers(client):
    """
    Helper fixture to register, login as an admin, and return bearer headers.
    """
    registration_payload = {
        "email": "admin@example.com",
        "password": "adminpassword123",
        "role": "admin"
    }
    await client.post("/api/auth/register", json = registration_payload)
    
    login_payload = {
        "email": "admin@example.com",
        "password": "adminpassword123"
    }
    response = await client.post("/api/auth/login", json = login_payload)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest_asyncio.fixture
async def customer_auth_headers(client):
    """
    Helper fixture to register, login as an customers, and return bearer headers.
    """
    registration_payload = {
        "email": "customer@example.com",
        "password": "customerpassword123",
        "role": "customer"
    }
    await client.post("/api/auth/register", json = registration_payload)
    
    login_payload = {
        "email": "customer@example.com",
        "password": "customerpassword123"
    }
    response = await client.post("/api/auth/login", json = login_payload)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

    
    

@pytest.mark.asyncio
async def test_should_create_vehicle_success(client, admin_auth_headers):
    """
    Test that an admin can successfully add a vehicle.
    """
    payload = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.0,
        "quantity": 10
    }
    response = await client.post(
        "/api/vehicles",
        json=payload,
        headers=admin_auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["quantity"] == 10
    assert "id" in data
    
    
@pytest.mark.asyncio
async def test_should_get_all_vehicles_list(client, admin_auth_headers):
    """
    Test that retrieves all available vehicles in inventory
    """
    # Pre populate two vehicles in inventory
    v1 = {
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 22000.0,
        "quantity": 5
    }
    v2 = {
        "make": "Ford",
        "model": "F-150",
        "category": "Truck",
        "price": 38000.0,
        "quantity": 3
    }
    
    await client.post("/api/vehicles", json = v1, headers= admin_auth_headers)
    await client.post("/api/vehicles", json = v2, headers = admin_auth_headers)
    
    # ACT : Fetch all vehicles from inventory
    response = await client.get("/api/vehicles")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2 
    assert data[0]["make"] == "Honda"
    assert data[1]["make"] == "Ford"
    assert "id" in data[0]
    assert "id" in data[1]
    
    
@pytest.mark.asyncio
async def test_should_able_to_search_vehicles_by_query_params(client, admin_auth_headers):
    """
    Test searching vehicles by make, category, and price range.
    """
    # pre populate 3 different vehicles
    v1 = {"make": "Toyota", "model": "Corolla", "category": "Sedan", "price": 20000.0, "quantity": 5}
    v2 = {"make": "Toyota", "model": "RAV4", "category": "SUV", "price": 32000.0, "quantity": 4}
    v3 = {"make": "BMW", "model": "X5", "category": "SUV", "price": 65000.0, "quantity": 2}

    await client.post("/api/vehicles", json=v1, headers=admin_auth_headers)
    await client.post("/api/vehicles", json=v2, headers=admin_auth_headers)
    await client.post("/api/vehicles", json=v3, headers=admin_auth_headers)

    # Search method 1: Filter by make=Toyota (should return Corolla & RAV4)
    response1 = await client.get("/api/vehicles/search?make=Toyota")
    assert response1.status_code == 200
    data1 = response1.json()
    assert len(data1) == 2

    # Search method 2: Filter by category=SUV and price max_price=40000 (should return RAV4 only)
    response2 = await client.get("/api/vehicles/search?category=SUV&max_price=40000")
    assert response2.status_code == 200
    data2 = response2.json()
    assert len(data2) == 1
    assert data2[0]["model"] == "RAV4"
    
    
@pytest.mark.asyncio
async def test_should_update_vehicle_successfully(client, admin_auth_headers):
    """
    Test updating details of an existing vehicle.
    """
    
    # populate a vehicle
    v_payload = {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000.0, "quantity": 5}
    create_response = await client.post("/api/vehicles", json=v_payload, headers=admin_auth_headers)
    vehicle_id = create_response.json()["id"]

    # Update price and quantity
    update_payload = {"price": 23500.0, "quantity": 8}
    response = await client.put(f"/api/vehicles/{vehicle_id}", json=update_payload, headers=admin_auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 23500.0
    assert data["quantity"] == 8
    assert data["make"] == "Honda"  # Unchanged field remains intact


@pytest.mark.asyncio
async def test_should_delete_vehicle_successfully(client, admin_auth_headers):
    """
    Test deleting a vehicle from inventory (Admin only).
    """
    
    # populate a vehicle
    v_payload = {"make": "Ford", "model": "Focus", "category": "Hatchback", "price": 18000.0, "quantity": 2}
    create_response = await client.post("/api/vehicles", json=v_payload, headers=admin_auth_headers)
    vehicle_id = create_response.json()["id"]

    # Delete vehicle
    delete_response = await client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_auth_headers)
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Vehicle deleted successfully"

    # Confirm it no longer exists
    list_response = await client.get("/api/vehicles")
    assert not any(v["id"] == vehicle_id for v in list_response.json())
    
    
@pytest.mark.asyncio
async def test_purchase_vehicle_decreases_quantity(client, customer_auth_headers, admin_auth_headers):
    """
    Test purchasing a vehicle reduces quantity by 1.
    """
    
    # Seed a vehicle with quantity = 2
    v_payload = {"make": "Mazda", "model": "CX-5", "category": "SUV", "price": 28000.0, "quantity": 2}
    create_response = await client.post("/api/vehicles", json=v_payload, headers=admin_auth_headers)
    vehicle_id = create_response.json()["id"]

    # Customer purchases 1 vehicle
    purchase_response = await client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=customer_auth_headers)
    assert purchase_response.status_code == 200
    assert purchase_response.json()["quantity"] == 1
    assert purchase_response.json()["message"] == "Purchase successful"


@pytest.mark.asyncio
async def test_purchase_out_of_stock_fails(client, customer_auth_headers, admin_auth_headers):
    """
    Test purchasing an out-of-stock vehicle returns a 400 error.
    """
    
    # Seed a vehicle with quantity = 0
    v_payload = {"make": "Tesla", "model": "Model 3", "category": "Sedan", "price": 40000.0, "quantity": 0}
    create_response = await client.post("/api/vehicles", json=v_payload, headers=admin_auth_headers)
    vehicle_id = create_response.json()["id"]

    # Purchase should fail
    purchase_response = await client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=customer_auth_headers)
    assert purchase_response.status_code == 400
    assert purchase_response.json()["detail"] == "Vehicle is out of stock"