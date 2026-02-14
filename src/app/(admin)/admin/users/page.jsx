'use client'

import { useState } from 'react'

export default function UsersPage() {
  const [activeView, setActiveView] = useState('roles')

  return (
    <div className="flex h-[calc(100vh-40px)] -mx-[32px] -mt-[20px]">
      {/* Left sub-navigation */}
      <div className="w-[200px] shrink-0 border-r border-[#e8eaef] py-[20px]">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[14px] text-[#1f2937] px-[16px] mb-[4px]">
          จัดการผู้ใช้งาน
        </h2>
        <div className="w-[40px] h-[3px] bg-orange ml-[16px] mb-[16px]" />

        {/* Menu items */}
        <nav className="flex flex-col" role="tablist" aria-label="User management navigation">
          <button
            role="tab"
            aria-selected={activeView === 'roles'}
            onClick={() => setActiveView('roles')}
            className={`w-full text-left px-[16px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] transition-colors cursor-pointer border-none ${
              activeView === 'roles'
                ? 'text-orange bg-orange/5 font-semibold border-r-[3px] border-r-orange'
                : 'text-[#1f2937] bg-transparent font-normal hover:bg-[#f9fafb]'
            }`}
            style={
              activeView === 'roles'
                ? { borderRight: '3px solid #ff7e1b' }
                : undefined
            }
          >
            บทบาท
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'users'}
            onClick={() => setActiveView('users')}
            className={`w-full text-left px-[16px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] transition-colors cursor-pointer border-none ${
              activeView === 'users'
                ? 'text-orange bg-orange/5 font-semibold border-r-[3px] border-r-orange'
                : 'text-[#1f2937] bg-transparent font-normal hover:bg-[#f9fafb]'
            }`}
            style={
              activeView === 'users'
                ? { borderRight: '3px solid #ff7e1b' }
                : undefined
            }
          >
            ผู้ใช้
          </button>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-[24px]">
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] mb-[20px] m-0">
          {activeView === 'roles' ? 'บทบาท' : 'ผู้ใช้'}
        </h1>

        {/* Content area - white card */}
        <div className="bg-white rounded-[8px] border border-[#e8eaef] min-h-[500px] p-[24px]">
          {activeView === 'roles' ? (
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">
              Roles content will be added here
            </p>
          ) : (
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">
              Users content will be added here
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
