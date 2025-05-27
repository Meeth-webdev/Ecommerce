import React from 'react' 
import { useRouter } from 'next/navigation'
import { FilterIcon } from 'lucide-react'
import { Button } from './ui/button'

function Filter() {
    const router=useRouter()
    const handleClick=async ()=>{
        router.push("/filter-lowest-highest")
    }
  return (
    <div>
        <Button onClick={handleClick}><FilterIcon/></Button>
    </div>
  )
}

export default Filter