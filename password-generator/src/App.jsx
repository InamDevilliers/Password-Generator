import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState("Weak")

  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    
    setPassword(pass)
    // Calculate password strength
    calculateStrength(pass)
  }, [length, numberAllowed, charAllowed, setPassword])

  const calculateStrength = (pass) => {
    let score = 0
    if (length >= 12) score += 1
    if (length >= 16) score += 1
    if (numberAllowed) score += 1
    if (charAllowed) score += 1
    
    // Check for mixed case
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1
    
    if (score <= 2) setStrength("Weak")
    else if (score <= 4) setStrength("Medium")
    else setStrength("Strong")
  }

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0, 999)
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  const getStrengthColor = () => {
    switch(strength) {
      case "Weak": return "text-red-500"
      case "Medium": return "text-yellow-500"
      case "Strong": return "text-green-500"
      default: return "text-white"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-white mb-6 animate-pulse">
            Password Generator
          </h1>
          
          <div className="flex flex-col space-y-6">
            <div className="relative group">
              <input
                type="text"
                value={password}
                className="w-full py-3 px-4 pr-16 rounded-lg bg-gray-700 text-white text-lg font-mono outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                readOnly
                ref={passwordRef}
              />
              <button
                onClick={copyPasswordToClipboard}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                  copied ? 'bg-green-600 scale-95' : ''
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-300">Length: {length}</label>
                <span className={`font-semibold ${getStrengthColor()}`}>
                  Strength: {strength}
                </span>
              </div>
              
              <input
                type="range"
                min={6}
                max={50}
                value={length}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                onChange={(e) => { setLength(e.target.value) }}
              />
              
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={numberAllowed}
                    id="numberInput"
                    onChange={() => {
                      setNumberAllowed((prev) => !prev)
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="numberInput" className="ml-2 text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Numbers
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={charAllowed}
                    id="characterInput"
                    onChange={() => {
                      setCharAllowed((prev) => !prev)
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="characterInput" className="ml-2 text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Special Characters
                  </label>
                </div>
              </div>
            </div>
            
            <button
              onClick={passwordGenerator}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              Generate New Password
            </button>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Password length: {length} characters</p>
            <div className="mt-2 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStrengthColor().replace('text', 'bg')} transition-all duration-500`}
                style={{ width: `${(length / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App