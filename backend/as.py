import streamlit as st
import speech_recognition as sr
import pyttsx3
import pywhatkit
import datetime
import webbrowser
import requests
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty("rate", 150)  # Speaking rate
engine.setProperty("volume", 0.9)  # Volume

# Initialize recognizer
recognizer = sr.Recognizer()

# API key for Google search
api_key = "db123e5b39a6ae97fc277fc153875a8e1913f215862c154138f0240390fcfebd"

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
result_url =""
scraped_text=""
def scrape_website(url):
    """Extracts text from a website using Selenium."""
    global scraped_text
    driver = webdriver.Chrome()
    driver.get(url)

    try:
        # Wait for the <body> tag or a known page element to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
    except Exception as e:
        driver.quit()
        return f"Error: {str(e)}"

    # Optional: Add a small delay to wait for dynamic content to load (if necessary)
    time.sleep(3)

    # Debugging: Checking the HTML source to confirm page load
    html_content = driver.page_source
    if "<p>" in html_content:
        st.write("Page contains <p> tags!")  # Log to Streamlit
    else:
        st.write("No <p> tags found in the page source.")  # Log to Streamlit
    
    # Scrape the text content from all <p> tags on the page
    paragraphs = driver.find_elements(By.TAG_NAME, "p")
    
    # Debugging: Check if paragraphs are found
    if len(paragraphs) > 0:
        scraped_text = " ".join([p.text for p in paragraphs])
        st.write(f"Scraped content (first 500 characters): {scraped_text[:500]}")  # Log the scraped content
    else:
        scraped_text = "No readable paragraphs found."
        st.write("No readable paragraphs found.")  # Log to Streamlit

    driver.quit()

    return "Content scraped successfully. Say 'read the content' to hear it."





def process_command(command):
    """Process user command and return a response."""
    global scraped_text, result_url  
   
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
    elif "open" in command:
        if "google" in command:
            webbrowser.open("https://www.google.com")
            return "Opening Google."
        elif "youtube" in command:
            webbrowser.open("https://www.youtube.com")
            return "Opening YouTube."
    elif "extract" in command:
        # url = command.replace("scrape", "").strip()
        # if not url.startswith("http"):
        #     url = "https://" + url
        return scrape_website(result_url)
    elif "read the content" in command:
        if scraped_text:
            speak(scraped_text[:500])  # Limit to 500 characters for speech output
            return "Reading the scraped content aloud."
        else:
            return "No content has been scraped yet. Please scrape a website first."
    elif "exit" in command:
        return "Goodbye!"
    else:
        return "I'm sorry, I didn't understand that command."

def main():
    st.title("Audio-Based Virtual Assistant with Web Scraping")
    st.subheader("The assistant is actively listening for your voice commands.")
    
    if "conversation" not in st.session_state:
        st.session_state.conversation = []
        st.session_state.introduced = False
    
    if not st.session_state.introduced:
        intro_message = "Hello! I am your virtual assistant. How may I help you today?"
        st.session_state.conversation.append(f"Assistant: {intro_message}")
        st.write(f"🤖 Assistant: {intro_message}")
        speak(intro_message)
        st.session_state.introduced = True

    while True:
        command = listen(timeout=10)
        if command:
            st.write(f"🎤 You said: {command}")
            st.session_state.conversation.append(f"User: {command}")
            response = process_command(command)
            st.write(f"🤖 Assistant: {response}")
            speak(response)
            st.session_state.conversation.append(f"Assistant: {response}")
            if "goodbye" in response.lower() or "exit" in command.lower():
                break
        else:
            no_input_message = "Sorry, I couldn't hear anything. Could you repeat that?"
            st.write(f"🤖 Assistant: {no_input_message}")
            speak(no_input_message)
            st.session_state.conversation.append(f"Assistant: {no_input_message}")

    st.subheader("Conversation History")
    for line in st.session_state.conversation:
        st.write(line)

if __name__ == "__main__":
    main()
