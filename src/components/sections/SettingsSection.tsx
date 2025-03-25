
import React from "react";

// Settings section component
export const SettingsSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" className="w-full p-2 border border-input rounded-lg" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" className="w-full p-2 border border-input rounded-lg" defaultValue="john.doe@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input type="text" className="w-full p-2 border border-input rounded-lg" defaultValue="Acme Inc." />
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input type="password" className="w-full p-2 border border-input rounded-lg" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" className="w-full p-2 border border-input rounded-lg" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" className="w-full p-2 border border-input rounded-lg" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Update Password
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email notifications</span>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Push notifications</span>
              <div className="w-10 h-5 bg-muted rounded-full relative">
                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Contract update alerts</span>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
