function appMain(){
  console.log("Starting main process.") 
  if (!Config.LicenseAccepted){
    $.show("#license-agreement")
  } else { 
    $.show("#passGen") 
  }
  if (Config.ShowOptions){
    $.show("#settingsPanel")
    $("label[for=settingsToggle").MaterialIconToggle.check()
  }
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
  $("#pwdLengthSlider").MaterialSlider.change(Config.PasswordDefaultLength)
  $("#pwdLengthDisp").innerText = Config.PasswordDefaultLength
  if (Config.PasswordDefaultUseUppers)
    $("label[for=useUppersSwitch]").MaterialSwitch.on()
  if (Config.PasswordDefaultUseLowers)
    $("label[for=useLowersSwitch]").MaterialSwitch.on()
  if (Config.PasswordDefaultUseNumerics)
    $("label[for=useNumericsSwitch]").MaterialSwitch.on()
  if (Config.PasswordDefaultUseSpecials)
    $("label[for=useSpecialsSwitch]").MaterialSwitch.on()
  
  $("#createPwdBtn").onclick = e => {
    makeNewPassword()
  }

  $("#settingsToggle").onchange = e => {
    var checkbox_checked = $("#settingsToggle").checked
    Config.ShowOptions = checkbox_checked
    if (checkbox_checked)
      $.show("#settingsPanel")
    else $.hide("#settingsPanel")
  }

  $("#pwdLengthSlider").oninput = e => {
    $("#pwdLengthDisp").innerText = $("#pwdLengthSlider").value
    Config.PasswordDefaultLength = $("#pwdLengthSlider").value
  }

  $("#useUppersSwitch").onchange = e => {
    Config.PasswordDefaultUseUppers = $("#useUppersSwitch").checked
  }
  $("#useLowersSwitch").onchange = e => {
    Config.PasswordDefaultUseLowers = $("#useLowersSwitch").checked
  }
  $("#useNumericsSwitch").onchange = e => {
    Config.PasswordDefaultUseNumerics = $("#useNumericsSwitch").checked
  }
  $("#useSpecialsSwitch").onchange = e => {
    Config.PasswordDefaultUseSpecials = $("#useSpecialsSwitch").checked
  }
  $("#getSrcBtn").onclick = e => { 
    alert("The source code currently is not hosted anywhere, but you can message Alex Colson <alex.colson@hill-rom.com> and he'll be able to get the source to you. Just be sure to include what version of the app you are using. 🙂")
  }
  $("#sendBugBtn").onclick = e => { 
    alert("Did something break? 🙁 Please message Alex Colson <alex.colson@hill-rom.com> about this and let him know what version you are one and include some screenshots if you can.")
  }
  $("#getHelpBtn").onclick = e => { 
    alert("We're working on building up some documentation on this app, but in the meantime please contact Alex Colson <alex.colson@hill-rom.com> and he'll be able to provide help. 😁")
  }
  makeNewPassword()
}

function makeNewPassword(){
  $("#createPwdBtn").disabled = true
  $.toggleClass("#pwdCreateLoadingSpinner", "is-active")
  $.toggle("#pwdCreateLoadingSpinner", true)
  $("#pwdGenOutputBoxTxt").innerHTML = `<pre></pre>`
  var newPwd = mkpwd()
  setTimeout(()=>{
    $.toggle("#pwdCreateLoadingSpinner", true)
    $.toggleClass("#pwdCreateLoadingSpinner", "is-active")
    $("#createPwdBtn").disabled = false
    $("#pwdGenOutputBoxTxt").innerHTML = `<pre style="user-select: all !important;">${newPwd}</pre>`
  }, 500)
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
    __v_config = DEFAULTCONFIG
    console.warn("No config file found. This may be because this is the first time the app is running or because the file was renamed. A new config file will be created.")
  } 
  
  Config = new Proxy(__v_config, {
    set: function(target, key, value){
      target[key] = value
      fs.writeFileSync("config.json", JSON.stringify(__v_config))
      return true
    }
  });
}