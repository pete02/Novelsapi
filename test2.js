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
    await driver.sleep(3000);
    const b = await driver.findElement(By.id("btn-main"));
    if (await b.getAttribute("innerHTML") === "I'm a human") {
        await b.click();
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
        return fs.existsSync(`${download_folder}\\${name}`);
      };
      await driver.wait(fileExists, 300000);
  } finally {
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
  });
    exec(`rm -rf ${download_folder}/${name}`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
  }
}
module.exports=run
