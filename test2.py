from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import ssl					 
import time
                    
driver = webdriver.Remote(
command_executor='http://localhost:4444/wd/hub',
desired_capabilities={'browserName': "chrome", 'javascriptEnabled': True})
driver.get("https://google.com")
time.sleep(1000)
driver.get("http://zshort.net/UaSHbRml")