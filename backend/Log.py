import speech_recognition as sr
import pyttsx3
import requests
import re
import streamlit as st

# Initialize recognizer and text-to-speech engine
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Function to speak a message (blocking version)
def speak(message):
    engine.say(message)
    engine.runAndWait()  # Blocking wait for speech to finish
    print(f"[DEBUG] Spoken message: {message}")  # Debug message

# Function to get audio input from the user
def get_audio_input():
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    try:
        # Recognize speech using Google’s API
        text = recognizer.recognize_google(audio)
        print(f"[DEBUG] You said: {text}")
        # Replace common words with symbols for email format
        text = re.sub(r'\bat\b', '@', text)
        text = re.sub(r'\bdot\b', '.', text)
        return text.lower().replace(" ", "")  # Ensure all lowercase and no spaces
    except sr.UnknownValueError:
        speak("Sorry, I didn't catch that. Please try again.")
        return get_audio_input()  # Retry if speech is not understood
    except sr.RequestError:
        speak("Sorry, there was an error with the speech recognition service.")
        return None

# Function to initiate the login/signup process
def start_interaction():
    speak("Welcome to third eye. I am your virtual assistant.")
    
    # Ask the user if they want to login or signup
    speak("Would you like to login or register?")
    action = get_audio_input()

    if "login" in action:
        speak("You chose to login.")
        login_interaction()
    elif "register" in action:
        speak("You chose to sign up.")
        signup_interaction()
    else:
        speak("I didn't understand. Please say either login or sign up.")
        start_interaction()  # Retry the process if the answer is unclear

# Function for Signup interaction
def signup_interaction():
    # Speak and ask for email
    speak("Please enter your mail.")
    email = get_audio_input()
    speak(f"Your email is {email}.")

    # Speak and ask for password
    speak("Please say your password.")
    password = get_audio_input()
    speak("Your password has been captured.")

    # Send data to the Express server for signup
    express_url = 'http://localhost:5002/signup'
    data = {
        'mail': email,
        'password': password
    }

    try:
        response = requests.post(express_url, json=data)
        if response.status_code == 200:
            speak("Your signup was successful. Please log in now.")
            st.success("Signup was successful! Please log in now.")
            login_interaction()  # Trigger login interaction after successful signup
        elif response.status_code == 409:
            speak("This email is already registered. Please try another email.")
            st.warning("This email is already registered. Please try another email.")
        else:
            speak("There was an error with your signup. Please try again.")
            st.error(f"Error: {response.status_code}")
    except requests.exceptions.RequestException as e:
        speak("There was a problem connecting to the server. Please try again later.")
        st.error(f"Connection error: {e}")

# Function for Login interaction
def login_interaction():
    # Speak and ask for email
    speak("Please say your email.")
    email = get_audio_input()
    speak(f"Your email is {email}.")

    # Speak and ask for password
    speak("Please say your password.")
    password = get_audio_input()
    speak("Your password has been captured.")

    # Send data to the Express server for login
    express_url = 'http://localhost:5002/login'
    data = {
        'mail': email,
        'password': password
    }

    try:
        response = requests.post(express_url, json=data)
        if response.status_code == 200:
            speak("You have logged in successfully.")
            st.success("Login successful!")
            react_home_url = "http://localhost:3000/home"
            st.markdown(f"""
                <meta http-equiv="refresh" content="2;url={react_home_url}" />
                <p>If you're not redirected, <a href="{react_home_url}">click here</a>.</p>
            """, unsafe_allow_html=True)
        elif response.status_code == 401:
            speak("Invalid credentials. Please try again.")
            st.warning("Invalid credentials. Please try again.")
        else:
            speak("There was an error with your login. Please try again.")
            st.error(f"Error: {response.status_code}")
    except requests.exceptions.RequestException as e:
        speak("There was a problem connecting to the server. Please try again later.")
        st.error(f"Connection error: {e}")

# Streamlit UI setup
def setup_ui():
    st.title("Audio Interactive Login/Signup")
    st.subheader("The assistant will start speaking as soon as the app is loaded.")

    # Start the interaction automatically when the app is loaded
    start_interaction()

if __name__ == '__main__':
    setup_ui()
