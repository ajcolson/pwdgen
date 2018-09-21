function appMain(){
  console.log("Starting main process.")  
  if (!Config.LicenseAccepted){
    $.show("#license-agreement")
    $("#license-agreement-agreecheck").onchange = e => {
      var checkbox_checked = $("#license-agreement-agreecheck").checked
      Config.LicenseAccepted = checkbox_checked
      $("#license-agreement-acceptbtn").disabled = !checkbox_checked
    }
    $("#license-agreement-acceptbtn").onclick = e => {
      //showLoadWindow()
      $.show("#appLoaderBar")
      $.hide("#license-agreement")
      window.setTimeout(()=>{
       // hideLoadWindow()
       $.show("#passGen")
       $.hide("#appLoaderBar")
      }, 1500)
    }
  } else { 
    $.show("#passGen")
  }  
}

function init(){
  //showLoadWindow()
  $.show("#appLoaderBar")
  console.log("Starting to init app.")
  
  loadConfig()  
  if (fs.existsSync("masterWordList.txt"))
    allWords = fs.readFileSync("masterWordList.txt").toString().split('\n')
  else {
    initErrors.noMasterWordListFileFound = true
    console.warn("No master words list found. While the app will still work, it won't be able to create passphrases correctly. Ensure the file is named masterWordList.txt and is in the same directory as the executable.")
  }

  if (fs.existsSync("bannedWordList.txt"))
    allWords = fs.readFileSync("bannedWordList.txt").toString().split('\n')
  else {
    initErrors.noBannedWordListFileFound = true
    console.warn("No banned words list found. Ensure the file is named bannedWordList.txt and is in the same directory as the executable.")
  }
  
  appInitCompleteEvent = new Event('appInitComplete')
  document.addEventListener('appInitComplete', e => { appMain() }, false)
  
  mt_rand = new MersenneTwister()
  alphabetLower = 'abcdefghijklmnopqrstuvwxyz'
  alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  numerics = '1234567890'
  specialChars = '.,!$?#%^&*-=+_~:;|@'
  
  console.log("Init completed.")

  window.setTimeout(()=>{
    //hideLoadWindow()
    $.hide("#appLoaderBar")
    document.dispatchEvent(appInitCompleteEvent)
  }, 2500)
}

function showLoadWindow(message = "Loading"){
  $("#loadWindow h3").innerHTML = message
  $("#loadWindow").style.display = "inline-flex"
  $("body").style.overflow = "hidden"
}

function hideLoadWindow(){
  $("#loadWindow").style.display = "none"
  $("body").style.overflow = "auto"
}

function loadConfig(){
  if (fs.existsSync("config.json")) {
    __v_config = JSON.parse(fs.readFileSync("config.json"))
  } else {
    initErrors.noConfigFileFound = true
    __v_config = {
      "ConfigVersion": 1,
      "LicenseAccepted": false,
      "PasswordDefaultLength": 8,
      "PasswordDefaultUseUppers": true,
      "PasswordDefaultUseLowers": true,
      "PasswordDefaultUseNumerics": true,
      "PasswordDefaultUseSpecials": true,
      "PasswordDefaultUseWords": false,
      "PasswordDefaultAllowBannedWords" : false
    }
    console.info("No config file found. This may be because this is the first time the app is running or because the file was renamed. A new config file will be created.")
  } 
  
  Config = new Proxy(__v_config, {
    set: function(target, key, value){
      target[key] = value
      fs.writeFileSync("config.json", JSON.stringify(__v_config))
      return true
    }
  });
}