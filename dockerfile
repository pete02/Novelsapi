FROM python:3.10.9
COPY . /
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt install curl
RUN apt install xvfb -y
RUN apt-get install ffmpeg -y
RUN apt-get install libsndfile1 -y
RUN curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] https://brave-browser-apt-release.s3.brave.com/ stable main"|tee /etc/apt/sources.list.d/brave-browser-release.list
RUN apt update
RUN apt install brave-browser -y

RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

ENV DISPLAY=:99
RUN wget https://chromedriver.storage.googleapis.com/108.0.5359.71/chromedriver_linux64.zip
RUN unzip chromedriver_linux64.zip
RUN chown root:root /chromedriver
RUN chmod +x /chromedriver
RUN pip install -r requirements.txt



EXPOSE 3001
#CMD ["node", "/index.js"]