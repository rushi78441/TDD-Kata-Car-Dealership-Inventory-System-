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
    res = await client.post("/api/auth/login", json = login_payload)
    token = res.json()["access_token"]
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
    res1 = await client.get("/api/vehicles/search?make=Toyota")
    assert res1.status_code == 200
    data1 = res1.json()
    assert len(data1) == 2

    # Search method 2: Filter by category=SUV and price max_price=40000 (should return RAV4 only)
    res2 = await client.get("/api/vehicles/search?category=SUV&max_price=40000")
    assert res2.status_code == 200
    data2 = res2.json()
    assert len(data2) == 1
    assert data2[0]["model"] == "RAV4"
    
    
@pytest.mark.asyncio
async def test_should_update_vehicle_successfully(client, admin_auth_headers):
    """
    Test updating details of an existing vehicle.
    """
    
    # populate a vehicle
    v_payload = {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000.0, "quantity": 5}
    create_res = await client.post("/api/vehicles", json=v_payload, headers=admin_auth_headers)
    vehicle_id = create_res.json()["id"]

    # Update price and quantity
    update_payload = {"price": 23500.0, "quantity": 8}
    res = await client.put(f"/api/vehicles/{vehicle_id}", json=update_payload, headers=admin_auth_headers)

    assert res.status_code == 200
    data = res.json()
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
    create_res = await client.post("/api/vehicles", json=v_payload, headers=admin_auth_headers)
    vehicle_id = create_res.json()["id"]

    # Delete vehicle
    delete_res = await client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_auth_headers)
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Vehicle deleted successfully"

    # Confirm it no longer exists
    list_res = await client.get("/api/vehicles")
    assert not any(v["id"] == vehicle_id for v in list_res.json())