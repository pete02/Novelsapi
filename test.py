import speech_recognition as sr
from scipy.io import wavfile
import noisereduce as nr
from pydub import AudioSegment
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from fake_useragent import UserAgent

import os
import requests
import time
import sys
import csv
import random





def listen(url):
    doc = requests.get(url)
    with open('payload.mp3', 'wb') as f:
            f.write(doc.content)

    os.system("ffmpeg -i payload.mp3 -acodec pcm_s16le -ac 1 -ar 16000 test.wav -y")   
    text=""


    sound = AudioSegment.from_wav("test.wav")
    sound = sound.set_channels(1)
    sound.export("a.wav", format="wav")
    rate, data = wavfile.read("a.wav")
    reduced_noise = nr.reduce_noise(y=data, sr=rate,prop_decrease =0.9)
    wavfile.write("a.wav", rate, reduced_noise)

    r = sr.Recognizer()
    with sr.AudioFile("a.wav") as source:
        # listen for the data (load audio to memory)
        audio_data = r.record(source)
        # recognize (convert from speech to text)
        text = r.recognize_google(audio_data)
    os.remove("payload.mp3")
    os.remove("test.wav")
    os.remove("a.wav")
    return text


def distract(driver,url,again):
    list=[]
    with open('websites.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        for row in spamreader:
            list.append("https://"+row[0].split(",")[1].replace('"',""))
    for i in range(10):
        driver.get(random.choice(list))
        time.sleep(2)
    if(again):
        run(driver,url)

def check_exists_by_xpath(xpath):
    try:
        webdriver.find_element_by_xpath(xpath)
    except:
        return False
    return True


def run(driver,url):
    aurl=url
    text=""
    try:
        driver.get(url)
        time.sleep(3)
        driver.switch_to.frame(driver.find_element_by_xpath("//iframe[@title='reCAPTCHA']"))
        time.sleep(2)
        driver.find_element_by_class_name("recaptcha-checkbox-border").click()
        time.sleep(2)
        driver.switch_to.default_content()
        driver.switch_to.frame(driver.find_element_by_xpath("//iframe[@title='reCAPTCHA-haaste vanhenee kahden minuutin kuluttua']"))
        driver.find_element_by_id("recaptcha-audio-button").click()
        driver.switch_to.default_content()
        driver.switch_to.frame(driver.find_element_by_xpath("//iframe[@title='reCAPTCHA-haaste vanhenee kahden minuutin kuluttua']"))
        time.sleep(1)
        url=driver.find_element_by_class_name("rc-audiochallenge-tdownload-link").get_attribute("href")
        
        try:
            text=listen(url)
        except:
            run(driver,aurl)
            text=""
        driver.find_element_by_id("audio-response").send_keys(text)
        time.sleep(0.5)
        if(check_exists_by_xpath("//div[@class='rc-audiochallenge-error-message']")):
            distract(driver,url,True)
        driver.find_element_by_id("recaptcha-verify-button").click()
        driver.switch_to.default_content()
        time.sleep(3)
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(1)
        while(driver.find_element_by_xpath("//div[@class='numb']").get_attribute("innerHTML")!="100%"):
            time.sleep(1)
        l=driver.find_elements_by_xpath("//button['text=Continue']")
        for i in l:
            try:
                i.click()
            except:
                None
        if(driver.find_element_by_class_name("navbar-brand") and driver.find_element_by_class_name("navbar-brand").get_attribute("innerHTML")=="ZSHORT"):
            while driver.find_element_by_xpath("//span[@id='timer']").get_attribute("innerHTML")!="0":
                time.sleep(int(driver.find_element_by_xpath("//span[@id='timer']").get_attribute("innerHTML")))
            print(driver.find_element_by_xpath("//a[@class='btn btn-success btn-lg get-link']").get_attribute("href"))
            sys.stdout.flush()
            distract(driver,url,False)
            #driver.quit()
    except:
        distract(driver,url,True)


options= webdriver.ChromeOptions()
#options.binary_location=r"/usr/bin/brave-browser"
options.binary_locations=r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
options.add_argument(r"--user-data-dir=C:\Users\petri\Documents\koodaus\Jnovelsapi\User Data")
#options.add_argument("--no-sandbox")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)
if(sys.argv[1] and "http" in sys.argv[1]):
    driver = webdriver.Chrome(executable_path="chromedriver.exe",chrome_options=options)
    print("done")
    try:
        run(driver,sys.argv[1])
    except Exception as e:
        print("problem")
        print(e)
        sys.stdout.flush()
        #driver.quit()
        
    
    
