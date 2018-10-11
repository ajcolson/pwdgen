function mkpwd(overrideConfig = {}){

  let useUppers, useLowers, useNums, useSpecial = false
  let possibleChars = ""
  if (overrideConfig.PasswordDefaultUseUppers || Config.PasswordDefaultUseUppers){
    useUppers = true
    possibleChars += alphabetUpper
  }
  if (overrideConfig.PasswordDefaultUseLowers || Config.PasswordDefaultUseLowers){
    useLowers = true
    possibleChars += alphabetLower
  }
  if (overrideConfig.PasswordDefaultUseNumerics || Config.PasswordDefaultUseNumerics){
    useNums = true
    possibleChars += numerics
  }
  if (overrideConfig.PasswordDefaultUseSpecials || Config.PasswordDefaultUseSpecials){
    useSpecial = true
    possibleChars += specialChars
  }

  //If there are no possible chars, return false as an error
  if ( !( useUppers || useLowers || useNums || useSpecial ) ) return false

  //Get the target (minimum) length of the Password
  let targetLen = overrideConfig.PasswordDefaultLength || Config.PasswordDefaultLength
  //Passwords must be at least 8 chars
  if (targetLen < 8) targetLen = 8
  //Windows really doesn't like supporting passwords greater than 127, so we'll use that as a cap
  if (targetLen > 127 ) targetLen = 127
  
  //Allocate a random string of characters. We'll check later it matches out rules for password type
  let iter = 0
  let output = ""
  while (output.length < targetLen){    
    var charInd = mt_rand.int()
    while (charInd > possibleChars.length) charInd %= possibleChars.length
    output += possibleChars[charInd]
    iter++
  }
  //if we somehow exceeded the length requested for the password, truncate to the requested length
  if (output.length > targetLen)
    output = output.slice(0,targetLen)
   
  
  //Check if each type of requested character exists in the string, loop until we get there
  while ( 1 ) {
    
    if ( useUppers ){
      if ( !(output.search(/[A-Z]/g) > -1) ) {
        output = _replaceRandomCharFromStrWithRandomChrOfStr(output, alphabetUpper)
        continue
      }
    }

    if ( useLowers ){
      if ( !(output.search(/[a-z]/g) > -1) ) {
        output = _replaceRandomCharFromStrWithRandomChrOfStr(output, alphabetLower)
        continue
      }
    }

    if ( useNums ){
      if ( !(output.search(/[0-9]/g) > -1) ) {
        output = _replaceRandomCharFromStrWithRandomChrOfStr(output, numerics)
        continue
      }
    }

    if ( useSpecial ){
      if ( !(output.search(/[\.\,\!\$\?\#\%\^\&\*\-\=\+\_\~\:\;\|\@]/g) > -1) ) {
        output = _replaceRandomCharFromStrWithRandomChrOfStr(output, specialChars)
        continue
      }
    }
    // If we got this far, the word should meet all the rules, break out of the loop
    break
  } 

  
  return output
}

/*

*/
function _replaceRandomCharFromStrWithRandomChrOfStr(str1, str2){
  var output = str1
  var outind = mt_rand.int() % output.length
  var str2ind = mt_rand.int() % str2.length
  output = output.substring(0, outind) + str2.charAt(str2ind) + output.substring(outind + 1)
  return output
}