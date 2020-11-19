import os
import io
import uuid
import json
from typing import Any, List, Optional
from pydantic import Json
import geopandas as gpd
from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)
from app.core import (
    get_current_user,
    get_current_active_user
)
from app.api import get_db
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.sql import text

from app import crud, models, schemas
from app.core.security import (
    enforcer,
    authorization,
    get_current_user
)

router = APIRouter()


@router.post('/', response_model=schemas.Organization)
def create_organization(
    *,
    db: Session = Depends(get_db),
    organization: schemas.OrganizationCreate,
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.organization.create(db, obj_in=organization).to_schema()

@router.patch("/{organization_id}", response_model=schemas.Organization)
def update_organization(
    organization_id: int,
    *,
    auth = Depends(authorization('organizations:update')),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    organization: schemas.OrganizationUpdate
):
    org = crud.organization.get(db, id=organization_id)

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return crud.organization.update(
        db,
        db_obj=org,
        obj_in=jsonable_encoder(organization, exclude_unset=True)
    )

@router.get("/{organization_id}")
def get_one(
    *,
    auth = Depends(authorization('organizations:get_one')),
    organization_id: int,
    db: Session = Depends(get_db),
) -> Optional[schemas.Organization]:
    """
    get one organization by id
    """
    organization_in_db = crud.organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    total_trees = crud.organization.get_total_tree_by_id(
        db, id=organization_id)

    if not total_trees:
        total_trees = 0

    organization_response = schemas.Organization(
        **jsonable_encoder(organization_in_db.to_schema(), exclude=['total_trees']),
        total_trees = total_trees
    )

    return organization_response

@router.get("/{organization_id}/teams", response_model=List[schemas.Organization])
def get_teams(
    organization_id: int,
    *,
    auth = Depends(authorization('organizations:get_teams')),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return [
        org.to_schema() for org in crud.organization.get_teams(db, parent_id=organization_id)
    ]

@router.get("/{organization_id}/members")
def get_members(
    organization_id: int,
    *,
    auth = Depends(authorization('organizations:get_members')),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    t = text("SELECT v0 AS user_id, v1 as role FROM casbin_rule WHERE v2 = :org_id")
    user_ids = db.execute(t, {'org_id':str(organization_id)})

    result = []
    for (userid, role) in user_ids:
        user_in_db = crud.user.get(db, id=int(userid))

        if user_in_db:
            result.append(dict(user_in_db.as_dict(), role=role))

    return result

@router.patch("/{organization_id}/members/{user_id}/role")
def update_member_role(
    organization_id: int,
    user_id: int,
    *,
    role: str = Body(...),
    auth = Depends(authorization('organizations:edit_member')),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = crud.user.get(db, id = user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    current_roles = enforcer.get_roles_for_user_in_domain(str(user_id), str(organization_id))

    for current_role in current_roles:
        enforcer.delete_roles_for_user_in_domain(str(user_id), current_role, str(organization_id))
    
    enforcer.add_role_for_user_in_domain(str(user_id), role, str(organization_id))

    return dict(
        user.as_dict(),
        role = role
    )
    

@router.get("{organization_id}/geojson")
def get_geojson(
    *,
    organization_id: int,
    auth = Depends(authorization('organizations:get_geojson')),
    db: Session = Depends(get_db)
) -> Any:
    """
    generate geojson from organization
    """
    organization_in_db = crud.organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    sql = f'SELECT * FROM public.tree WHERE organization_id = {organization_in_db.id}'
    df = gpd.read_postgis(sql, db.bind)
    data = df.to_json()
    geojson = json.loads(data)

    return geojson

@router.get("/{id}/path", response_model=List[schemas.Organization])
def get_parent_organizations(
    id: int,
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return [
        org.to_schema() for org in crud.organization.get_path(db, id=id)
    ]