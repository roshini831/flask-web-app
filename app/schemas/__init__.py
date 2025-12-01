"""Validation schemas for request/response data."""
from marshmallow import Schema, fields, validate, ValidationError


class UserRegisterSchema(Schema):
    """Schema for user registration."""
    email = fields.Email(required=True)
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=80)
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=8),
        load_only=True
    )
    first_name = fields.Str(allow_none=True)
    last_name = fields.Str(allow_none=True)


class UserLoginSchema(Schema):
    """Schema for user login."""
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


class UserResponseSchema(Schema):
    """Schema for user response."""
    id = fields.Int()
    email = fields.Email()
    username = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class ProjectCreateSchema(Schema):
    """Schema for project creation."""
    name = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=200)
    )
    description = fields.Str(allow_none=True)


class ProjectUpdateSchema(Schema):
    """Schema for project update."""
    name = fields.Str(validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    status = fields.Str(
        validate=validate.OneOf(['active', 'completed', 'archived'])
    )


class ProjectResponseSchema(Schema):
    """Schema for project response."""
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    owner_id = fields.Int()
    status = fields.Str()
    task_count = fields.Int()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class TaskCreateSchema(Schema):
    """Schema for task creation."""
    title = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=200)
    )
    description = fields.Str(allow_none=True)
    assignee_id = fields.Int(allow_none=True)
    priority = fields.Str(
        validate=validate.OneOf(['low', 'medium', 'high']),
        load_default='medium'
    )


class TaskUpdateSchema(Schema):
    """Schema for task update."""
    title = fields.Str(validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    status = fields.Str(
        validate=validate.OneOf(['todo', 'in_progress', 'completed'])
    )
    assignee_id = fields.Int(allow_none=True)
    priority = fields.Str(
        validate=validate.OneOf(['low', 'medium', 'high'])
    )


class TaskResponseSchema(Schema):
    """Schema for task response."""
    id = fields.Int()
    title = fields.Str()
    description = fields.Str()
    project_id = fields.Int()
    assignee_id = fields.Int()
    status = fields.Str()
    priority = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class RefreshTokenSchema(Schema):
    """Schema for token refresh."""
    refresh_token = fields.Str(required=True)
