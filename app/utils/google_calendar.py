import json
import datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from flask import current_app

def get_google_service(user):
    """Get Google Calendar service for a user."""
    if not user.google_credentials:
        return None
    
    creds_data = json.loads(user.google_credentials)
    creds = Credentials.from_authorized_user_info(creds_data)
    
    if creds.expired and creds.refresh_token:
        from google.auth.transport.requests import Request
        creds.refresh(Request())
        # Update user credentials in db
        user.google_credentials = creds.to_json()
        from app.models import db
        db.session.commit()
        
    return build('calendar', 'v3', credentials=creds)

def create_calendar_event(user, task):
    """Create an event in Google Calendar."""
    service = get_google_service(user)
    if not service:
        return None
        
    if not task.due_date:
        return None
        
    event = {
        'summary': task.title,
        'description': task.description,
        'start': {
            'dateTime': task.due_date.isoformat(),
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': (task.due_date + datetime.timedelta(hours=1)).isoformat(),
            'timeZone': 'UTC',
        },
    }
    
    try:
        event = service.events().insert(calendarId='primary', body=event).execute()
        return event.get('id')
    except Exception as e:
        current_app.logger.error(f"Error creating calendar event: {str(e)}")
        return None

def update_calendar_event(user, task):
    """Update an event in Google Calendar."""
    if not task.google_event_id:
        return create_calendar_event(user, task)
        
    service = get_google_service(user)
    if not service:
        return None
        
    event = {
        'summary': task.title,
        'description': task.description,
        'start': {
            'dateTime': task.due_date.isoformat(),
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': (task.due_date + datetime.timedelta(hours=1)).isoformat(),
            'timeZone': 'UTC',
        },
    }
    
    try:
        service.events().update(
            calendarId='primary',
            eventId=task.google_event_id,
            body=event
        ).execute()
        return task.google_event_id
    except Exception as e:
        current_app.logger.error(f"Error updating calendar event: {str(e)}")
        return None

def delete_calendar_event(user, task):
    """Delete an event from Google Calendar."""
    if not task.google_event_id:
        return
        
    service = get_google_service(user)
    if not service:
        return
        
    try:
        service.events().delete(
            calendarId='primary',
            eventId=task.google_event_id
        ).execute()
    except Exception as e:
        current_app.logger.error(f"Error deleting calendar event: {str(e)}")
