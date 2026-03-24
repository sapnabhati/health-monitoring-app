from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os
import joblib
from train_models import get_model
from otp_service import generate_otp, send_email_otp, send_sms_otp, verify_otp, clear_expired_otps

app = FastAPI(title="AuraHealth AI Backend")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class VitalsInput(BaseModel):
    heart_rate: int
    sleep_quality: int
    activity_level: int
    work_hours: int

class ChatInput(BaseModel):
    message: str

class OTPRequest(BaseModel):
    contact: str  # Can be email or phone
    type: str  # "email" or "sms"

class OTPVerify(BaseModel):
    contact: str
    otp: str

class SignupRequest(BaseModel):
    email: str
    phone: str
    otp: str

@app.on_event("startup")
async def startup_event():
    # Ensure model is ready on startup
    get_model()

@app.get("/")
def read_root():
    return {"status": "AuraHealth ML Backend Running"}

@app.post("/api/auth/send-otp")
def send_otp(request: OTPRequest):
    """
    Send OTP to either email or phone number.
    """
    contact = request.contact.strip()
    otp_type = request.type.lower()
    
    if not contact:
        raise HTTPException(status_code=400, detail="Contact information is required")
    
    if otp_type not in ["email", "sms"]:
        raise HTTPException(status_code=400, detail="Type must be 'email' or 'sms'")
    
    try:
        otp = generate_otp(6)
        
        if otp_type == "email":
            success, message = send_email_otp(contact, otp)
        else:  # sms
            success, message = send_sms_otp(contact, otp)
        
        if success:
            return {
                "success": True,
                "message": message,
                "contact": contact,
                "type": otp_type
            }
        else:
            raise HTTPException(status_code=500, detail=message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")

@app.post("/api/auth/verify-otp")
def verify_otp_endpoint(request: OTPVerify):
    """
    Verify the OTP provided by the user.
    """
    contact = request.contact.strip()
    provided_otp = request.otp.strip()
    
    if not contact or not provided_otp:
        raise HTTPException(status_code=400, detail="Contact and OTP are required")
    
    success, message = verify_otp(contact, provided_otp)
    
    if success:
        return {
            "success": True,
            "message": message,
            "contact": contact,
            "token": "aurahealth_session_token_" + contact.replace("@", "_").replace("+", "")
        }
    else:
        raise HTTPException(status_code=401, detail=message)

@app.post("/api/auth/signup")
def signup(request: SignupRequest):
    """
    Complete signup with verified OTP.
    """
    email = request.email.strip()
    phone = request.phone.strip()
    otp = request.otp.strip()
    
    if not email or not phone:
        raise HTTPException(status_code=400, detail="Email and phone are required")
    
    # Verify OTP using either email or phone
    success, message = verify_otp(email, otp)
    
    if not success:
        success, message = verify_otp(phone, otp)
    
    if success:
        return {
            "success": True,
            "message": "Account created successfully!",
            "email": email,
            "phone": phone,
            "token": "aurahealth_session_token_" + email.replace("@", "_").replace("+", "")
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid OTP for signup")

@app.post("/api/predict/stress")
def predict_stress(vitals: VitalsInput):
    """
    Predicts the stress risk level based on basic vital metrics.
    Uses the synthetic Random Forest model trained in train_models.py.
    """
    model = get_model()
    # Scikit-learn expects a 2D array
    features = [[
        vitals.heart_rate, 
        vitals.sleep_quality, 
        vitals.activity_level, 
        vitals.work_hours
    ]]
    
    try:
        prediction = model.predict(features)[0]
        # Adding a bit of logic for probability if available
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features)[0]
            confidence = max(probs)
        else:
            confidence = 1.0

        return {
            "risk_level": prediction, 
            "confidence": round(float(confidence), 2),
            "feature_summary": "High heart rate + low sleep quality correlate to 'High' stress."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat_with_ai(chat: ChatInput):
    """
    Simulates a sophisticated AI chatbot for mental health guidance.
    In the future, this can be wired directly to an LLM like OpenAI or an open-source model.
    """
    msg = chat.message.lower()
    
    # Simple rule-based logic for the mock
    response = "I'm here to support your mental wellness. Could you tell me more about how you're feeling today?"
    
    if "stress" in msg or "anxi" in msg:
        response = "I understand times can be stressful. Your latest vitals show elevated heart rate. Taking 5 minutes to follow a deep breathing exercise could lower your stress levels by 15%."
    elif "sleep" in msg or "tired" in msg:
        response = "It looks like you only got 4 hours of restful sleep last night. I suggest turning off screens 1 hour before bed and listening to one of the Deep Sleep Release meditations from your Wellness tab."
    elif "hello" in msg or "hi" in msg:
        response = "Hello Sankarlal! Aura AI is ready. What health insights would you like to explore?"
        
    return {
        "reply": response,
        "source": "Aura AI"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
