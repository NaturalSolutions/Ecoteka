import os
import uuid
import json
from typing import Any, List, Optional
from pydantic import Json
from jose import jwt

import sqlite3

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    BackgroundTasks
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.core import security

router = APIRouter()


@router.get("/style")
def generate_style(
    *,
    db: Session = Depends(deps.get_db),
    current_user: Optional[models.User] = Depends(
        deps.get_optional_current_active_user
    ),
    token: Optional[str] = ''
) -> Json:
    """
    Generate style
    """
    with open("/app/app/assets/style.json") as style_json:
        style = json.load(style_json)
        style["sources"]["osm"] = {
            "type": "vector",
            "tiles": [
                f"{settings.TILES_SERVER}/osm/{{z}}/{{x}}/{{y}}.pbf?scope=public"
            ],
            "minzoom": 0,
            "maxzoom": 13
        }

        style["layers"].insert(len(style["layers"]), {
            "id": "ecoteka-data",
            "type": "circle",
            "source": "osm",
            "source-layer": "ecoteka-data"
        })

        user_in_db = None

        if token:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[security.ALGORITHM]
            )
            token_data = schemas.TokenPayload(**payload)
            user_in_db = crud.user.get(db, id=token_data.sub)

        if user_in_db:
            try:
                organization = crud.organization.get(db, user_in_db.organization_id)

                if not organization:
                    pass

                target = f"/app/tiles/private/{organization.slug}.mbtiles"

                conn = sqlite3.connect(target)
                sql = '''
                    SELECT * FROM metadata 
                    WHERE name IN ('minzoom', 'maxzoom') 
                    ORDER BY name DESC
                '''
                cur = conn.cursor()
                cur.execute(sql)
                minzoom, maxzoom = cur.fetchall()

                style["sources"][f"{organization.slug}"] = {
                    "type": "vector",
                    "tiles": [
                        f"{settings.TILES_SERVER}/{organization.slug}/{{z}}/{{x}}/{{y}}.pbf?scope=private&token={token}"
                    ],
                    "minzoom": int(minzoom[1]),
                    "maxzoom": int(maxzoom[1])
                }

                style["layers"].insert(len(style["layers"]), {
                    "id": f"ecoteka-{organization.slug}",
                    "type": "circle",
                    "source": organization.slug,
                    "source-layer": organization.slug
                })
            except:
                pass
            finally:
                conn.close()

        return style
