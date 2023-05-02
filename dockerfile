FROM node:latest
COPY . /
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt install curl
RUN apt install -y zip

RUN curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] https://brave-browser-apt-release.s3.brave.com/ stable main"|tee /etc/apt/sources.list.d/brave-browser-release.list
RUN apt update --fix-missing
#RUN apt install brave-browser -y
RUN npm i

#RUN wget https://chromedriver.storage.googleapis.com/110.0.5481.77/chromedriver_linux64.zip
#RUN unzip chromedriver_linux64.zip
#RUN chown root:root /chromedriver
#RUN chmod +x /chromedriver



EXPOSE 3001
CMD ["node", "/index.js"]