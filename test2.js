const { Builder, Capabilities, By ,until} = require('selenium-webdriver');
const unzipper = require('unzipper');
const { exec } = require("child_process");
const chrome= require("selenium-webdriver/chrome")
const download_folder="./zip"
const fs=require('fs');
const { Console } = require('console');
let name

async function run(link, chromeBinaryPath) {
  let options=await new chrome.Options()
  options.setChromeBinaryPath(chromeBinaryPath)
  link=link.replaceAll('"',"")
  console.log(link)
  options.setUserPreferences({
    'download.default_directory': download_folder,
    'download.prompt_for_download':false,
    'download.directory_upgrade': true,
    'safebrowsing.enabled': true
    });
  options.addArguments("--no-sandbox")
  options.addArguments("--disable-dev-shm-usag")
  options.addArguments("-headless")
  let driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser('chrome')
    .build();

  try {
    await driver.get(link);
    await driver.wait(until.elementLocated(By.id('btn-main')), 60000);
    const b = await driver.findElement(By.id("btn-main"));
    if (await b.getAttribute("innerHTML") === "I'm a human") {
      await driver.sleep(5000);
        await b.click()
    }
    let timer=parseInt(await driver.findElement(By.className("timer")).getText())
    await driver.sleep((timer+1)*1000);
    let button=await driver.findElement(By.id("btn-main"));
    await driver.sleep(1000)
    button.click();
    await driver.wait(until.elementLocated(By.className('action-buttons__button_download')), 10000);
    await driver.sleep(1000)
    await driver.findElement(By.className("action-buttons__button_download")).click();

    name=await driver.findElement(By.className("file-name")).getText()
    console.log(name)
    const fileExists = async () => {
        return fs.existsSync(`${download_folder}/${name}`);
      };
      await driver.wait(fileExists, 300000);
  }catch{
    console.log("error")
  }finally {
    console.log("done")
    driver.quit()
    exec("unzip -P thatnovelcorner.com /zip/* -d /books", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
      
      fs.readdir("/zip", (err, files) => {
        if (err) {
          console.error(err);
          return;
        }

        for (const file of files) {
          fs.unlink(`/zip/${file}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }

        console.log('All files deleted successfully');
      });
  });
  
  }
}
module.exports=run
