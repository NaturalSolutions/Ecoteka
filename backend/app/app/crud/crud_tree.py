from typing import Any, Dict, Optional, Union
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.session import engine
from app.crud.base import CRUDBase
from app.models.tree import Tree
from app.schemas.tree import TreeCreate, TreeUpdate


class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    pass


tree = CRUDTree(Tree)
