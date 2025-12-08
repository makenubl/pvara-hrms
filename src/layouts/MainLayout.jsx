import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../store/appStore';

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => useAppStore.setState({ sidebarOpen: false })}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
