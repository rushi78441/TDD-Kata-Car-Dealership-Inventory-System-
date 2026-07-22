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
async def test_create_vehicle_success(client, admin_auth_headers):
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