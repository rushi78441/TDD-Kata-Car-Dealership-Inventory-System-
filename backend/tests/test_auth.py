import pytest

@pytest.mark.asyncio
async def test_should_register_user_successfully(client):
    """
    Test successful user registration.
    """
    payload = {
        "email": "user@example.com",
        "password": "password123",
        "role": "customer"
    }
    # ACT: Register User
    response = await client.post("/api/auth/register", json=payload)
    
    ## Assert
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "user@example.com"
    assert data["role"] == "customer"
    assert "id" in data
    assert "password" not in data
    
    
@pytest.mark.asyncio
async def test_register_duplicate_email_fails(client):
    """
    Test that registering an existing email returns 400.
    """
    
    payload = {
        "email": "duplicate@example.com",
        "password": "password123",
        "role": "customer"
    }
    # Register first user 
    first_response = await client.post("/api/auth/register", json=payload)
    
    assert first_response.status_code == 201
    
    # ACT : registering again with the same email(Duplicate user)
    response = await client.post("/api/auth/register", json=payload)
    
    # Assert
    assert response.status_code == 400
    
    