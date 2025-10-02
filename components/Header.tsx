"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="ml-12 md:ml-0"> 
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <UserCircleIcon className="mr-2 h-5 w-5" />
                {user.firstName} {user.lastName}
                <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <button
                        className={`${active ? "bg-purple-600 text-white" : "text-gray-300"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <button
                        onClick={logout}
                        className={`${active ? "bg-purple-600 text-white" : "text-gray-300"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </header>
  )
}
