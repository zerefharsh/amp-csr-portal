"use client";

import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Clock,
  DollarSign,
  Users,
  MessageSquare,
  CreditCard,
  X,
  MoreHorizontal,
  Settings
} from "lucide-react";

interface NotificationsDropdownProps {
  unreadCount?: number;
}

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "alert" as const,
    title: "Payment Failed",
    message: "John Smith's subscription payment failed. Card ending in 1234 was declined.",
    timestamp: "2024-01-25T14:30:00Z",
    isRead: false,
    priority: "high" as const,
    actionable: true,
    relatedEntity: { type: "member", id: "1", name: "John Smith" }
  },
  {
    id: "2", 
    type: "success" as const,
    title: "Refund Processed",
    message: "Successfully processed $29.99 refund for Emily Davis. Customer has been notified.",
    timestamp: "2024-01-25T13:45:00Z",
    isRead: false,
    priority: "medium" as const,
    actionable: false,
    relatedEntity: { type: "member", id: "2", name: "Emily Davis" }
  },
  {
    id: "3",
    type: "info" as const, 
    title: "New Support Ticket",
    message: "Michael Johnson submitted a new ticket about car wash access issues.",
    timestamp: "2024-01-25T12:20:00Z",
    isRead: false,
    priority: "medium" as const,
    actionable: true,
    relatedEntity: { type: "ticket", id: "T-003", name: "Cannot access car wash services" }
  },
  {
    id: "4",
    type: "warning" as const,
    title: "Subscription Overdue", 
    message: "Sarah Wilson's Premium Wash subscription is 3 days overdue. Payment retry scheduled.",
    timestamp: "2024-01-25T11:15:00Z",
    isRead: true,
    priority: "high" as const,
    actionable: true,
    relatedEntity: { type: "subscription", id: "sub5", name: "Premium Wash - Sarah Wilson" }
  },
  {
    id: "5",
    type: "info" as const,
    title: "System Update",
    message: "CSR portal maintenance scheduled for tonight 11 PM - 1 AM EST. Plan accordingly.",
    timestamp: "2024-01-25T10:00:00Z", 
    isRead: true,
    priority: "low" as const,
    actionable: false,
    relatedEntity: null
  },
  {
    id: "6",
    type: "success" as const,
    title: "Transfer Completed",
    message: "Subscription transfer from David Brown to Emily Davis completed successfully.",
    timestamp: "2024-01-25T09:30:00Z",
    isRead: true,
    priority: "low" as const,
    actionable: false,
    relatedEntity: { type: "subscription", id: "sub2", name: "Transfer - David Brown to Emily Davis" }
  }
];

export function NotificationsDropdown({ unreadCount = 3 }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />;
      case "warning":
        return <Clock className="h-4 w-4 text-warning" aria-hidden="true" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-primary" aria-hidden="true" />;
    }
  };

  const getEntityIcon = (entityType: string | null) => {
    switch (entityType) {
      case "member":
        return <Users className="h-3 w-3" aria-hidden="true" />;
      case "subscription":
        return <CreditCard className="h-3 w-3" aria-hidden="true" />;
      case "ticket":
        return <MessageSquare className="h-3 w-3" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const currentUnreadCount = unreadNotifications.length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-accent"
          aria-label={`View notifications (${currentUnreadCount} unread)`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {currentUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              aria-hidden="true"
            >
              {currentUnreadCount}
            </Badge>
          )}
          <span className="sr-only">
            {currentUnreadCount} unread notification{currentUnreadCount !== 1 ? 's' : ''}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-96 max-h-[600px] overflow-hidden"
        align="end"
        side="bottom"
        sideOffset={8}
        role="menu"
        aria-label="Notifications menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <DropdownMenuLabel className="text-base font-semibold p-0">
              Notifications
            </DropdownMenuLabel>
            <p className="text-sm text-muted-foreground">
              {currentUnreadCount} unread
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {currentUnreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
                aria-label="Mark all notifications as read"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Notification settings"
            >
              <Settings className="h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div 
          className="max-h-[400px] overflow-y-auto"
          role="list"
          aria-label="Notification list"
        >
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" aria-hidden="true" />
              <p className="text-muted-foreground text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`relative p-4 border-b border-border hover:bg-accent/50 transition-colors ${
                  !notification.isRead ? 'bg-primary/5' : ''
                }`}
                role="listitem"
                aria-labelledby={`notification-${notification.id}-title`}
                aria-describedby={`notification-${notification.id}-content`}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
                    aria-hidden="true"
                  />
                )}

                <div className={`${!notification.isRead ? 'ml-4' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getNotificationIcon(notification.type)}
                      <h4 
                        className="font-medium text-sm text-foreground truncate"
                        id={`notification-${notification.id}-title`}
                      >
                        {notification.title}
                      </h4>
                      {notification.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <time 
                        className="text-xs text-muted-foreground"
                        dateTime={notification.timestamp}
                      >
                        {formatTimeAgo(notification.timestamp)}
                      </time>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        aria-label={`Dismiss notification: ${notification.title}`}
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <p 
                    className="text-sm text-muted-foreground mb-3 leading-relaxed"
                    id={`notification-${notification.id}-content`}
                  >
                    {notification.message}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {/* Related Entity */}
                    {notification.relatedEntity && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        {getEntityIcon(notification.relatedEntity.type)}
                        <span>{notification.relatedEntity.name}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs h-6"
                          aria-label={`Mark as read: ${notification.title}`}
                        >
                          Mark read
                        </Button>
                      )}
                      
                      {notification.actionable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 text-primary"
                          aria-label={`Take action on: ${notification.title}`}
                        >
                          {notification.relatedEntity?.type === "ticket" ? "View Ticket" :
                           notification.relatedEntity?.type === "member" ? "View Customer" :
                           notification.relatedEntity?.type === "subscription" ? "View Subscription" :
                           "Take Action"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3">
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                aria-label="View all notifications"
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}