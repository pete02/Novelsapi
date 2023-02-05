from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from fake_useragent import UserAgent
import time
import sys


options= webdriver.ChromeOptions()
options.binary_location=r"/usr/bin/brave-browser"
#options.binary_locations=r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
options.add_argument("download.default_directory=./books")
options.add_argument("--no-sandbox")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)
options.add_argument("--incognito")
driver = webdriver.Chrome(executable_path="chromedriver.exe",chrome_options=options)

def run(link):
    
    driver.get(link)
    time.sleep(3)
    b=driver.find_element(By.ID,"btn-main")
    if b.get_attribute("innerHTML")=="I'm a human":
        b.click()
    time.sleep(10)
    driver.find_element(By.CLASS_NAME,"btn-main").click()
    time.sleep(10)
    print(driver.find_element(By.XPATH,'//*[@id="app"]/div/div[2]/div[1]/div[1]/div[2]/div[2]/button[2]').click())

if(sys.argv[1] and "http" in sys.argv[1]):
    print("done")
    try:
        run(sys.argv[1])
    except Exception as e:
        print("problem")
        print(e)
        sys.stdout.flush()
        #driver.quit()
        
    
    
