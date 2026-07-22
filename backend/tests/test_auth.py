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
    response = await client.post("/api/auth/register", json = payload)
    
    ## Assert
    assert response.status_code  ==  201
    data = response.json()
    assert data["email"]  ==  "user@example.com"
    assert data["role"]  ==  "customer"
    assert "id" in data
    assert "password" not in data
    
    
@pytest.mark.asyncio
async def test_should_not_register_duplicate_email(client):
    """
    Test that registering an existing email returns 400.
    """
    
    payload = {
        "email": "duplicate@example.com",
        "password": "password123",
        "role": "customer"
    }
    # Register first user 
    first_response = await client.post("/api/auth/register", json = payload)
    
    assert first_response.status_code  ==  201
    
    # ACT : registering again with the same email(Duplicate user)
    response = await client.post("/api/auth/register", json = payload)
    
    # Assert
    assert response.status_code  ==  400
    
    
@pytest.mark.asyncio
async def test_should_successfully_login_user(client):
    """
    Test successful user login and JWT token retrieval.
    """
    # First, register the user
    reg_payload = {
        "email": "user@example.com",
        "password": "mypassword123",
        "role": "customer"
    }
    await client.post("/api/auth/register", json = reg_payload)

    # Attempt login
    login_payload = {
        "email": "user@example.com",
        "password": "mypassword123"
    }
    response = await client.post("/api/auth/login", json = login_payload)
    
    assert response.status_code  ==  200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"]  ==  "Bearer"


@pytest.mark.asyncio
async def test_should_fail_login_with_wrong_password(client):
    """
    Test login failure with incorrect password.
    """
    
    # First, register
    registration_payload = {
        "email": "user@example.com",
        "password": "correctpassword123",
        "role": "customer"
    }
    await client.post("/api/auth/register", json = registration_payload)

    # Login with wrong password
    login_payload = {
        "email": "user@example.com",
        "password": "wrongpassword123"
    }
    response = await client.post("/api/auth/login", json = login_payload)
    assert response.status_code  ==  401
    
    