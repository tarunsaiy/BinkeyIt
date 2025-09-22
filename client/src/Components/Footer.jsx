import React from 'react'
import { FaLinkedin } from "react-icons/fa";


function Footer() {
  return (
    <footer className='border-t'>
        <div className="container mx-auto p-4 text-center flex flex-col gap-2 lg:flex-row lg:justfy-between">
            <p>©All rights are reserved 2025</p>
            <div className='flex items-center gap-4 justify-center text-2xl'>
                <a href="" className='hover:text-yellow-500'>
                    <FaLinkedin size={30}/>
                </a>
                
            </div>
        </div>
    </footer>
  )
}

export default Footer
