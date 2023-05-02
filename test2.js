const { Builder, Capabilities, By ,until} = require('selenium-webdriver');
const unzipper = require('unzipper');
const { exec } = require("child_process");
const chrome= require("selenium-webdriver/chrome")
const download_folder="/zip"
const fs=require('fs');
const path = require("path");
const { Console } = require('console');
const { PassThrough } = require('stream');

let outlink
let current=0
let running=false

async function ouo(driver){
  console.log(driver.getCurrentUrl())
  await driver.wait(until.elementLocated(By.tagName("div")),10000)
  console.log("!gotten div")
    await driver.wait(until.elementLocated(By.id('btn-main')), 10000);
    const b = await driver.findElement(By.id("btn-main"));
    if (await b.getAttribute("innerHTML") === "I'm a human") {
      await driver.sleep(5000);
        await b.click()
    }
    console.log("next part")
    let timer=parseInt(await driver.findElement(By.className("timer")).getText())
    console.log(timer)
    if(timer && timer!==0){
      await driver.sleep((timer+1)*2000);
    }else{
      await driver.sleep(10000)
    }
    
    let button=await driver.findElement(By.id("btn-main"));
    console.log(await driver.getCurrentUrl())
    await driver.sleep(1000)
    while(await (await driver.getCurrentUrl()).includes("ouo")&&await (await driver.getCurrentUrl()).includes("go")){
      button.click();
      await driver.sleep(500)
    }
}

async function dw(path,i,name){
  let options=await new chrome.Options()
  options.setChromeBinaryPath("/usr/bin/brave-browser")
  options.setUserPreferences({
    'download.default_directory':download_folder,
    'download.prompt_for_download':false,
    'download.directory_upgrade': true,
    'safebrowsing.enabled': true
  })

  console.log(outlink)
  options.addArguments("--no-sandbox")
  options.addArguments("--disable-dev-shm-usag")
  options.addArguments("-headless")
  let driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser('chrome')
    .build();
  console.log(`retry:${i}`)
  if(i<10){
    try{
      await driver.get(outlink)
      await driver.wait(until.elementLocated(By.xpath('//*[@id="app"]/div/div[2]/div[1]/div[1]/div[2]/div[2]/button[2]')), 10000);
      await driver.sleep(1000)
      outlink=driver.getCurrentUrl()
      await driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div[1]/div[1]/div[2]/div[2]/button[2]')).click();
      console.log("download started")
      name=await driver.findElement(By.className("file-name")).getText()
      console.log(name)
      const fileExists = async () => {
          return fs.existsSync(`/${name}`);
        };
      await driver.wait(fileExists, 30000);
      await fs.promises.rename(name,`/zip/${name}`)
      console.log("redownloaded")
      return 1
    }catch(e){
      console.log(e)
      if(e.toString().includes("session deleted because of page crash")){
        return await dw(path,i+1)
      }
    }
  }else{
    return(0)
  }
}

async function run(link) {
  let name
  console.log("started")
  
  let ret =""
  let options=await new chrome.Options()
  options.setChromeBinaryPath("/usr/bin/brave-browser")
  options.setUserPreferences({
    'download.default_directory':download_folder,
    'download.prompt_for_download':false,
    'download.directory_upgrade': true,
    'safebrowsing.enabled': true
  })
  link=link.replaceAll('"',"")
  console.log(link)
  options.addArguments("--no-sandbox")
  options.addArguments("--disable-dev-shm-usag")
  options.addArguments("-headless")
  let driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser('chrome')
    .build();
  console.log("driver")
  try {
    await driver.get(link);
    console.log("gotten link")
    if(link.includes("ouo")){
      console.log("ouo")
      let r=true
      let i=0
      while(r){
        if(i<10){
          try{
            await ouo(driver)
          }
          catch(e){
            console.log(e)
            i++
          }
        }
      }
      
    }
    
    await driver.sleep(4000)
    console.log("off to download")
    await driver.wait(until.elementLocated(By.tagName("div")),10000)
    console.log("page loaded")
    console.log(await driver.getCurrentUrl())

    await driver.wait(until.elementLocated(By.xpath('//*[@id="app"]/div/div[2]/div[1]/div[1]/div[2]/div[2]/button[2]')), 10000);
    await driver.sleep(1000)
    outlink=driver.getCurrentUrl()
    console.log(outlink)
    await driver.findElement(By.xpath('//*[@id="app"]/div/div[2]/div[1]/div[1]/div[2]/div[2]/button[2]')).click();
    console.log("download started")
    name=await driver.findElement(By.className("file-name")).getText()
    console.log(name)
    const fileExists = async () => {
        return fs.existsSync(`/${name}`);
      };
    await driver.wait(fileExists, 30000);
    await fs.promises.rename(name,`/zip/${name}`)
  }catch(e){
    if(e.toString().includes("session deleted because of page crash")){
      if(await dw("/usr/bin/brave-browser",0,name)==1){
        ret="done"
      }else{
        ret="error"
      }
    }else{
      console.log(e)
      console.log("error")
      ret= "error"
    }
  }finally {

    driver.quit()
    await exec(`unzip -P thatnovelcorner.com /zip/* -d /books`, console.log("unzipped"))
    await  new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  for(file of await fs.readdirSync("/zip")){
    console.log(file)
    await fs.unlinkSync(`/zip/${file}`)
  }

  if(!ret.includes("error")){
    ret="done"
  }

  }
  current--
  running=false
  return ret
}

async function rinlist(l){
  console.log(running)
  if(running){
    current++
    let c=current
    while(c>0){
      while(running){
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      c--
    }
    
  }
  running=true
  console.log("start")
  
  return run(l)
}

module.exports=rinlist
