
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Stores', href: '/admin/stores', icon: Settings },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Orders', href: '/admin/orders', icon: List },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Admin Portal</h2>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                active
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
