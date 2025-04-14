from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Force WebDriver to use Google Chrome
chrome_options = webdriver.ChromeOptions()

# Set up WebDriver with webdriver-manager
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open Google to test
driver.get("https://www.google.com")

print("WebDriver is correctly using Google Chrome!")
driver.quit()
