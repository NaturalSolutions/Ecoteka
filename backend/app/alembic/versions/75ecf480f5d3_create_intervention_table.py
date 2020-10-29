"""create intervention table

Revision ID: 75ecf480f5d3
Revises: 03b1736791f4
Create Date: 2020-10-26 12:02:04.509654

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '75ecf480f5d3'
down_revision = '03b1736791f4'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "intervention",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("intervention_type", sa.String()),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("intervention_period", sa.dialects.postgresql.JSONB()),
        sa.Column("x", sa.Integer()),
        sa.Column("y", sa.Integer()),
        sa.Column("intervenant", sa.String()),
        sa.Column("done", sa.Boolean, nullable=True),
        sa.Column("estimated_cost", sa.Float()),
        sa.Column("required_documents", sa.dialects.postgresql.JSONB()),
        sa.Column("required_material", sa.dialects.postgresql.JSONB()),
        sa.Column("properties", sa.dialects.postgresql.JSONB(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_intervention_id"), "intervention", ["id"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_intervention_id"), table_name="intervention")
    op.drop_table("intervention")
