function mkpwd(overrideConfig = {}){

  let possibleChars = ""
  if (overrideConfig.PasswordDefaultUseUppers || Config.PasswordDefaultUseUppers)
    possibleChars += alphabetUpper
  if (overrideConfig.PasswordDefaultUseLowers || Config.PasswordDefaultUseLowers)
    possibleChars += alphabetLower
  if (overrideConfig.PasswordDefaultUseNumerics || Config.PasswordDefaultUseNumerics)
    possibleChars += numerics
  if (overrideConfig.PasswordDefaultUseSpecials || Config.PasswordDefaultUseSpecials)
    possibleChars += specialChars

  //If there are no possible chars, return false as an error
  if (possibleChars.length < 1) return false

  //Get the target (minimum) length of the Password
  let targetLen = overrideConfig.PasswordDefaultLength || Config.PasswordDefaultLength
  //Passwords must be at least 8 chars
  if (targetLen < 8) targetLen = 8
  //Windows really doesn't like supporting passwords greater than 127, so we'll use that as a cap
  if (targetLen > 127 ) targetLen = 127
  
  let iter = 0
  let output = ""
  while (output.length < targetLen){
    var charInd = mt_rand.int()
    while (charInd > possibleChars.length) charInd %= possibleChars.length
    output += possibleChars[charInd]
    iter++
  }
  if (output.length > targetLen)
    output = output.slice(0,targetLen)
  
  return output
}