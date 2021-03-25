from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.crud import user
from app.core import settings
from app.schemas import UserCreate
from app.models import User
import pytest
# from app.tests.utils.utils import random_email, random_lower_string

test_user = User()


@pytest.mark.skip(reason='older test')
def test_create_user(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    pass


@pytest.mark.skip(reason='older test')
def test_get_users_superuser_me(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = client.get("/users/me", headers=superuser_token_headers)
    current_user = r.json()

    assert current_user["id"] == 1
    assert current_user["is_verified"] is True
    assert current_user["is_superuser"] is True
    assert current_user["organization_id"] == 1
    assert current_user["full_name"] == settings.FIRST_SUPERUSER_FULLNAME
    assert current_user["email"] == settings.FIRST_SUPERUSER


@pytest.mark.skip(reason='older test')
def test_get_users_normal_user_me(
    client: TestClient, normal_user_token_headers: Dict[str, str]
) -> None:
    r = client.get("/users/me", headers=normal_user_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["is_verified"] is True
    assert current_user["is_superuser"] is False
    assert current_user["email"] == settings.EMAIL_TEST_USER


@pytest.mark.skip(reason='older test')
def test_create_user_new_email(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    password = random_lower_string()
    data = {"email": username, "password": password}
    r = client.post(
        "/users/", headers=superuser_token_headers, json=data,
    )
    assert 200 <= r.status_code < 300
    created_user = r.json()
    user_in_db = user.get_by_email(db, email=username)
    assert user_in_db
    assert user_in_db.email == created_user["email"]


@pytest.mark.skip(reason='older test')
def test_get_existing_user(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=username, password=password)
    user_in_db = user.create(db, obj_in=user_in)
    user_id = user_in_db.id
    r = client.get(
        f"/users/{user_id}", headers=superuser_token_headers,
    )
    assert 200 <= r.status_code < 300
    api_user = r.json()
    existing_user = user.get_by_email(db, email=username)
    assert existing_user
    assert existing_user.email == api_user["email"]


@pytest.mark.skip(reason='older test')
def test_create_user_existing_username(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    # username = email
    password = random_lower_string()
    user_in = UserCreate(email=username, password=password)
    user.create(db, obj_in=user_in)
    data = {"email": username, "password": password}
    r = client.post(
        "/users/", headers=superuser_token_headers, json=data,
    )
    created_user = r.json()
    assert r.status_code == 400
    assert "_id" not in created_user


@pytest.mark.skip(reason='older test')
def test_create_user_by_normal_user(
    client: TestClient, normal_user_token_headers: Dict[str, str]
) -> None:
    username = random_email()
    password = random_lower_string()
    data = {"email": username, "password": password}
    r = client.post(
        "/users/", headers=normal_user_token_headers, json=data,
    )
    assert r.status_code == 400


@pytest.mark.skip(reason='older test')
def test_retrieve_users(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=username, password=password)
    user.create(db, obj_in=user_in)

    username2 = random_email()
    password2 = random_lower_string()
    user_in2 = UserCreate(email=username2, password=password2)
    user.create(db, obj_in=user_in2)

    r = client.get("/users/", headers=superuser_token_headers)
    all_users = r.json()

    assert len(all_users) > 1
    for item in all_users:
        assert "email" in item
