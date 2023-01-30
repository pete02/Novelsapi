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
