import React from 'react'


function InputField({ value, onChange, placeholder}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Enter text......"}
       className="w-full h-[300px] p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-transparent text-gray-200"
       rows={4}
    >

      
    </textarea>
  )
}



export default InputField
