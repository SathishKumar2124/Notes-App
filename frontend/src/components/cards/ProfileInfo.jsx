import React from 'react'
import { getInitials } from '../../utils/Helper'

const ProfileInfo = ({userInfo,onLogout}) => {
  const userName = userInfo?.fullName || "";
  return (
    <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex  items-center justify-center rounded-full font-bold text-slate-950 bg-slate-100'>{getInitials(userName)}</div>
        <div>
            <p className='text-sm font-bold'>{userName}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfo