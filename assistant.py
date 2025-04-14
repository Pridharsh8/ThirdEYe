import streamlit as st
import speech_recognition as sr
import pyttsx3
import pywhatkit
import datetime
import webbrowser
import requests

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty("rate", 150)  # Speaking rate
engine.setProperty("volume", 0.9)  # Volume

# Initialize recognizer
recognizer = sr.Recognizer()

# Helper functions
def speak(text):
    """Converts text to speech."""
    engine.say(text)
    engine.runAndWait()

def listen(timeout=10):
    """Listens to user audio for a set timeout and returns a command."""
    try:
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            st.write("🤖 Assistant: Listening for your commands...")
            audio = recognizer.listen(source, timeout=timeout)
            command = recognizer.recognize_google(audio)
            return command.lower()
    except sr.WaitTimeoutError:
        return None
    except sr.UnknownValueError:
        speak("Sorry, I couldn't understand that. Could you please repeat?")
        return None
    except sr.RequestError:
        speak("Sorry, my speech service is unavailable.")
        return None

def search_google(query):
    """Search Google and return the top result URL."""
    api_key = "db123e5b39a6ae97fc277fc153875a8e1913f215862c154138f0240390fcfebd"  # Replace with your SerpAPI key
    search_url = f"https://serpapi.com/search.json?api_key={api_key}&q={query}&hl=en"
    try:
        response = requests.get(search_url)
        response.raise_for_status()
        data = response.json()
        if "organic_results" in data and len(data["organic_results"]) > 0:
            return data["organic_results"][0]["link"]  # First result URL
    except Exception as e:
        st.error(f"Error during search: {e}")
    return None

def process_command(command):
    """Process user command and return a response."""
    if "time" in command:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return f"The current time is {current_time}."
    elif "play" in command:
        song = command.replace("play", "").strip()
        pywhatkit.playonyt(song)
        return f"Playing {song} on YouTube."
    elif "search for" in command:
        query = command.replace("search for", "").strip()
        result_url = search_google(query)
        if result_url:
            webbrowser.open(result_url)
            return f"Searching for {query}. Opening the top result: {result_url}"
        else:
            return "I couldn't retrieve the search results. Please try again."
    elif "open google" in command:
        webbrowser.open("https://www.google.com")
        return "Opening Google."
    elif "open youtube" in command:
        webbrowser.open("https://www.youtube.com")
        return "Opening YouTube."
    elif "exit" in command:
        return "Goodbye!"
    else:
        return "I'm sorry, I didn't understand that command."

# Streamlit app
def main():
    st.title("Audio-Based Virtual Assistant")
    st.subheader("The assistant is actively listening for your voice commands.")

    # Session state to store conversation history
    if "conversation" not in st.session_state:
        st.session_state.conversation = []
        st.session_state.introduced = False

    # Introduction
    if not st.session_state.introduced:
        welcome_message = (
            "Hello! I am your virtual assistant. How may I help you today? "
            "Listening for your commands."
        )
        st.session_state.conversation.append(f"Assistant: {welcome_message}")
        st.write(f"🤖 Assistant: {welcome_message}")
        speak(welcome_message)
        st.session_state.introduced = True

    # Main loop
    while True:
        command = listen(timeout=10)  # Listen for 10 seconds
        if command:
            st.write(f"🎤 You said: {command}")
            st.session_state.conversation.append(f"User: {command}")
            response = process_command(command)
            st.write(f"🤖 Assistant: {response}")
            speak(response)
            st.session_state.conversation.append(f"Assistant: {response}")

            # Stop if user says "exit"
            if "goodbye" in response.lower() or "exit" in command.lower():
                break
        else:
            no_input_message = "Sorry, I couldn't hear anything. Could you repeat that?"
            st.write(f"🤖 Assistant: {no_input_message}")
            speak(no_input_message)
            st.session_state.conversation.append(f"Assistant: {no_input_message}")

    # Display conversation history
    st.subheader("Conversation History")
    for line in st.session_state.conversation:
        st.write(line)

if __name__ == "__main__":
    main()
