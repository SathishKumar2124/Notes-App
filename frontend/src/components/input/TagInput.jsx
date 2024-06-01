import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({tags,setTags}) => {

    const [inputValue,setInputValue] = useState("")

    const handleInputValue = (e) => {
        setInputValue(e.target.value);
    }

    const addNewTag = () => {
        if(inputValue.trim() !== ""){
            setTags([...tags,inputValue.trim()])
            setInputValue("")
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            addNewTag()
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

  return (
    <div>
        {tags?.length > 0 && 
        <div className='flex items-center flex-wrap gap-2 mt-2'>
            {tags.map((tag,index)=>(
                <span key={index} className='flex items-center text-sm text-slate-900 bg-slate-200 gap-2 px-3 py-1 rounded' >
                    # {tag}
                    <button onClick={() => {handleRemoveTag(tag)}}>
                        <MdClose />
                    </button>
                </span>
            ))}
        </div>
        }
        <div className='flex items-center mt-3 gap-4 '>
            <input type="text" className='text-sm bg-transparent border outline-none px-3 py-2 rounded' placeholder='ADD TAGS'  
            value={inputValue} onChange={handleInputValue} onKeyDown={handleKeyDown} />
            <button className='w-8 h-8 flex items-center justify-center border border-blue-700 rounded hover:bg-blue-700' onClick={addNewTag}>
                <MdAdd  className='text-2xl text-blue-700 hover:text-white'/>
            </button>
        </div>
    </div>
  )
}

export default TagInput