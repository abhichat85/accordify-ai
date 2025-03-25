
import React, { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  FileText,
  MailCheck,
  MessageSquare,
  UserPlus,
  X
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "contract" | "team" | "message" | "system";
  actionUrl?: string;
  priority?: "high" | "normal" | "low";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Contract shared with you",
    message: "John Doe shared 'Service Agreement' with you",
    time: "10 minutes ago",
    read: false,
    type: "contract",
    actionUrl: "/contracts/123",
    priority: "high"
  },
  {
    id: "2",
    title: "New team member",
    message: "Mary Smith accepted your invitation to join the team",
    time: "1 hour ago",
    read: false,
    type: "team",
    actionUrl: "/team"
  },
  {
    id: "3",
    title: "Document requires signature",
    message: "You have a pending signature request for 'NDA - XYZ Company'",
    time: "3 hours ago",
    read: false,
    type: "contract",
    actionUrl: "/signatures",
    priority: "high"
  },
  {
    id: "4",
    title: "AI analysis complete",
    message: "Contract risk analysis is ready for 'Partnership Agreement'",
    time: "Yesterday",
    read: true,
    type: "system",
    actionUrl: "/contracts/456"
  },
  {
    id: "5",
    title: "New message",
    message: "Robert Lewis commented on 'Vendor Agreement'",
    time: "2 days ago",
    read: true,
    type: "message",
    actionUrl: "/contracts/789"
  }
];

export const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string, priority?: string) => {
    switch (type) {
      case "contract":
        return <FileText size={18} className="text-blue-500" />;
      case "team":
        return <UserPlus size={18} className="text-green-500" />;
      case "message":
        return <MessageSquare size={18} className="text-purple-500" />;
      case "system":
        return <Bell size={18} className={`${priority === 'high' ? 'text-red-500' : 'text-gray-500'}`} />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          <h2 className="font-medium">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-2 pt-2 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 text-xs">
              Unread
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex-1 text-xs">
              Contracts
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-1 text-xs">
              Team
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-0">
          <TabsContent value={activeTab} className="m-0 p-0 data-[state=active]:flex flex-col">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "unread" 
                    ? "You're all caught up!" 
                    : "You don't have any notifications yet."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.read && "text-primary"
                          )}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1">
                            {notification.priority === "high" && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-500 border-red-200">
                                Important
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock size={12} className="mr-1" />
                              {notification.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.actionUrl && (
                          <div className="mt-2 flex items-center">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary hover:text-primary">
                              View details
                              <ChevronRight size={14} className="ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="p-3 border-t flex justify-between bg-muted/10">
        <Button variant="outline" size="sm" className="text-xs">
          <MailCheck size={14} className="mr-1" />
          Notification settings
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Clear all
        </Button>
      </div>
    </div>
  );
};
