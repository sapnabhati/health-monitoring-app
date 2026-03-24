import random
import string
import smtplib
import os
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Tuple

# In-memory OTP storage (in production, use a database like Redis)
otp_storage: Dict[str, Dict] = {}

def generate_otp(length: int = 6) -> str:
    """Generate a random OTP of specified length."""
    return ''.join(random.choices(string.digits, k=length))

def send_email_otp(email: str, otp: str) -> Tuple[bool, str]:
    """
    Send OTP to email using SMTP.
    Configure with your email credentials or use environment variables.
    """
    try:
        # For demonstration, we'll use Gmail or a mock implementation
        # In production, set these as environment variables
        sender_email = os.getenv("GMAIL_EMAIL", "your-email@gmail.com")
        sender_password = os.getenv("GMAIL_PASSWORD", "your-app-password")
        
        # If credentials are not set, return mock success
        if sender_email == "your-email@gmail.com":
            # Mock implementation for testing
            otp_storage[email] = {
                "otp": otp,
                "expires_at": datetime.now() + timedelta(minutes=5),
                "type": "email"
            }
            print(f"[MOCK EMAIL] OTP {otp} sent to {email}")
            return True, f"OTP sent to {email} (Mock Mode)"
        
        # Real SMTP implementation
        message = MIMEMultipart("alternative")
        message["Subject"] = "AuraHealth - Your Login OTP"
        message["From"] = sender_email
        message["To"] = email
        
        text = f"Your AuraHealth OTP is: {otp}\n\nThis OTP expires in 5 minutes.\nDo not share this with anyone."
        html = f"""\
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #1a1a2e;">
            <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white; max-width: 400px;">
              <h2 style="margin-top: 0;">🔐 AuraHealth Security</h2>
              <p>Your login OTP is:</p>
              <div style="background-color: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                {otp}
              </div>
              <p style="color: #ddd; font-size: 12px;">This OTP expires in 5 minutes.<br>Do not share this with anyone.</p>
            </div>
          </body>
        </html>
        """
        
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)
        
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())
        server.quit()
        
        # Store OTP with expiration
        otp_storage[email] = {
            "otp": otp,
            "expires_at": datetime.now() + timedelta(minutes=5),
            "type": "email"
        }
        
        return True, f"OTP sent to {email}"
        
    except Exception as e:
        return False, f"Failed to send email: {str(e)}"

def send_sms_otp(phone: str, otp: str) -> Tuple[bool, str]:
    """
    Send OTP to phone via SMS using Twilio.
    Configure Twilio credentials in environment variables.
    """
    try:
        twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
        # If credentials are not set, use mock implementation
        if not twilio_account_sid:
            # Mock implementation for testing
            otp_storage[phone] = {
                "otp": otp,
                "expires_at": datetime.now() + timedelta(minutes=5),
                "type": "sms"
            }
            print(f"[MOCK SMS] OTP {otp} sent to {phone}")
            return True, f"OTP sent to {phone} (Mock Mode)"
        
        # Real Twilio implementation
        from twilio.rest import Client
        
        client = Client(twilio_account_sid, twilio_auth_token)
        message = client.messages.create(
            body=f"Your AuraHealth OTP is: {otp}\n\nThis OTP expires in 5 minutes.\nDo not share this with anyone.",
            from_=twilio_phone,
            to=phone
        )
        
        # Store OTP with expiration
        otp_storage[phone] = {
            "otp": otp,
            "expires_at": datetime.now() + timedelta(minutes=5),
            "type": "sms"
        }
        
        return True, f"OTP sent to {phone}"
        
    except Exception as e:
        return False, f"Failed to send SMS: {str(e)}"

def verify_otp(contact: str, provided_otp: str) -> Tuple[bool, str]:
    """
    Verify the provided OTP against the stored one.
    Returns (success, message)
    """
    if contact not in otp_storage:
        return False, "No OTP found for this contact"
    
    stored_data = otp_storage[contact]
    
    # Check expiration
    if datetime.now() > stored_data["expires_at"]:
        del otp_storage[contact]
        return False, "OTP has expired. Please request a new one."
    
    # Check OTP value
    if stored_data["otp"] != provided_otp:
        return False, "Invalid OTP"
    
    # OTP is valid, remove it from storage
    del otp_storage[contact]
    return True, "OTP verified successfully"

def clear_expired_otps():
    """Remove expired OTPs from storage."""
    expired_contacts = [
        contact for contact, data in otp_storage.items()
        if datetime.now() > data["expires_at"]
    ]
    for contact in expired_contacts:
        del otp_storage[contact]
