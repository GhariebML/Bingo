"""initial production schema

Revision ID: 20260521_0001
Revises:
Create Date: 2026-05-21
"""
from alembic import op
import sqlalchemy as sa

revision = '20260521_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(length=320), nullable=False),
        sa.Column('display_name', sa.String(length=120), nullable=True),
        sa.Column('password_hash', sa.String(length=256), nullable=False),
        sa.Column('email_verified', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('mfa_enabled', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('mfa_code_hash', sa.String(length=128), nullable=True),
        sa.Column('mfa_code_expires_at', sa.DateTime(), nullable=True),
        sa.Column('email_verification_hash', sa.String(length=128), nullable=True),
        sa.Column('email_verification_expires_at', sa.DateTime(), nullable=True),
        sa.Column('password_reset_hash', sa.String(length=128), nullable=True),
        sa.Column('password_reset_expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    op.create_table(
        'user_settings',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('preferred_language', sa.String(length=40), nullable=False),
        sa.Column('response_style', sa.String(length=40), nullable=False),
        sa.Column('crisis_region', sa.String(length=80), nullable=False),
        sa.Column('save_journal_history', sa.Boolean(), nullable=False),
        sa.Column('save_mood_history', sa.Boolean(), nullable=False),
    )
    op.create_index('ix_user_settings_user_id', 'user_settings', ['user_id'], unique=True)

    op.create_table(
        'journal_entries',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('mood', sa.String(length=80), nullable=True),
        sa.Column('emotion_tags', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_journal_entries_user_id', 'journal_entries', ['user_id'])

    op.create_table(
        'mood_entries',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('label', sa.String(length=80), nullable=False),
        sa.Column('intensity', sa.Integer(), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_mood_entries_user_id', 'mood_entries', ['user_id'])

    op.create_table(
        'chat_messages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=80), nullable=True),
        sa.Column('risk_level', sa.String(length=40), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_chat_messages_user_id', 'chat_messages', ['user_id'])

    op.create_table(
        'audit_events',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('event_type', sa.String(length=80), nullable=False),
        sa.Column('detail', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_audit_events_user_id', 'audit_events', ['user_id'])
    op.create_index('ix_audit_events_event_type', 'audit_events', ['event_type'])


def downgrade() -> None:
    op.drop_table('audit_events')
    op.drop_table('chat_messages')
    op.drop_table('mood_entries')
    op.drop_table('journal_entries')
    op.drop_table('user_settings')
    op.drop_table('users')
