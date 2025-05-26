"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  User, 
  Clock,
  Send,
  AlertTriangle, 
  CheckCircle,
  X,
  CreditCard,
  Settings,
  HelpCircle,
  Paperclip,
  Eye,
  EyeOff
} from "lucide-react";
import { SupportTicket } from "@/types";

interface SupportTicketResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
}

// Mock conversation history
const mockConversationHistory = [
  {
    id: "1",
    author: "John Smith",
    role: "customer",
    message: "I'm having trouble with my monthly payment. My credit card was charged twice this month and I need help resolving this issue.",
    timestamp: "2024-01-25T10:30:00Z",
    isInternal: false
  },
  {
    id: "2", 
    author: "Sarah Johnson",
    role: "agent",
    message: "Hi John, I understand your concern about the double charge. Let me investigate this for you right away. I can see your account and will check the payment history.",
    timestamp: "2024-01-25T11:15:00Z",
    isInternal: false
  },
  {
    id: "3",
    author: "Sarah Johnson", 
    role: "agent",
    message: "Internal note: Checked payment gateway logs. Found duplicate charge due to timeout retry. Processing refund for $29.99.",
    timestamp: "2024-01-25T11:20:00Z",
    isInternal: true
  }
];

const responseTemplates = [
  { 
    id: "greeting",
    name: "Greeting", 
    content: "Thank you for contacting AMP support. I understand your concern and I'm here to help resolve this issue for you." 
  },
  { 
    id: "investigating",
    name: "Investigating", 
    content: "I'm currently investigating this issue for you. Please allow me a few moments to review your account details and transaction history." 
  },
  { 
    id: "billing_resolved",
    name: "Billing Issue Resolved", 
    content: "I've successfully resolved the billing issue. You should see the correction reflected in your account within 3-5 business days. Is there anything else I can help you with today?" 
  },
  { 
    id: "escalation",
    name: "Escalation", 
    content: "I want to ensure you receive the best possible assistance. I'm escalating your case to our specialist team who will be in touch within 24 hours." 
  },
  { 
    id: "closing",
    name: "Closing", 
    content: "Thank you for your patience. I'm marking this ticket as resolved. Please don't hesitate to reach out if you have any other questions or concerns." 
  }
];

const statusOptions = [
  { value: "open", label: "Open", description: "Ticket is open and awaiting response", color: "status-overdue" },
  { value: "in_progress", label: "In Progress", description: "Currently being worked on", color: "status-suspended" },
  { value: "resolved", label: "Resolved", description: "Issue has been resolved", color: "status-active" },
  { value: "closed", label: "Closed", description: "Ticket is closed", color: "text-muted-foreground" }
];

export function SupportTicketResponseModal({ 
  isOpen, 
  onClose, 
  ticket 
}: SupportTicketResponseModalProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState(ticket?.status || "open");
  const [showHistory, setShowHistory] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!response.trim()) {
      newErrors.response = "Please enter a response message";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Response sent:", {
        ticketId: ticket?.id,
        response: response.trim(),
        isInternal,
        newStatus,
        timestamp: new Date().toISOString()
      });
      
      handleClose();
    } catch (error) {
      console.error("Failed to send response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResponse("");
    setIsInternal(false);
    setNewStatus(ticket?.status || "open");
    setShowHistory(true);
    setErrors({});
    onClose();
  };

  const insertTemplate = (templateContent: string) => {
    setResponse(templateContent);
    setErrors(prev => ({ ...prev, response: "" }));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "billing": return CreditCard;
      case "technical": return Settings;
      case "account": return User;
      default: return HelpCircle;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge className={`status-badge ${statusConfig?.color || "text-muted-foreground"}`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "status-overdue",
      medium: "status-suspended", 
      low: "status-active"
    };
    return (
      <Badge className={`status-badge ${colors[priority as keyof typeof colors] || "text-muted-foreground"}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  if (!ticket) return null;

  const CategoryIcon = getCategoryIcon(ticket.category);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-labelledby="response-dialog-title"
        aria-describedby="response-dialog-description"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle 
            className="flex items-center space-x-2"
            id="response-dialog-title"
          >
            <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Respond to Ticket {ticket.id}</span>
          </DialogTitle>
          <DialogDescription id="response-dialog-description">
            Add a response to this support ticket and update its status.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Ticket Summary */}
          <div 
            className="bg-muted/30 border rounded-lg p-4 flex-shrink-0"
            role="group"
            aria-labelledby="ticket-summary-title"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CategoryIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <h4 className="font-medium text-foreground" id="ticket-summary-title">
                  {ticket.subject}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityBadge(ticket.priority)}
                {getStatusBadge(ticket.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="font-medium">{ticket.customer.name}</p>
                <p className="text-xs text-muted-foreground">{ticket.customer.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assigned To</p>
                <p className="font-medium">{ticket.assignedTo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">
                  <time dateTime={ticket.createdAt}>
                    {formatTimestamp(ticket.createdAt)}
                  </time>
                </p>
              </div>
            </div>
          </div>

          {/* Conversation History Toggle */}
          <div className="flex items-center justify-between flex-shrink-0">
            <h3 className="text-sm font-medium text-foreground">Conversation History</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              aria-label={showHistory ? "Hide conversation history" : "Show conversation history"}
            >
              {showHistory ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" aria-hidden="true" />
                  Hide History
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                  Show History
                </>
              )}
            </Button>
          </div>

          {/* Conversation History */}
          {showHistory && (
            <div 
              className="border rounded-lg bg-card flex-1 overflow-y-auto"
              role="log"
              aria-label="Conversation history"
              aria-describedby="conversation-count"
            >
              <div id="conversation-count" className="sr-only">
                {mockConversationHistory.length} messages in conversation history
              </div>
              
              <div className="p-4 space-y-4">
                {mockConversationHistory.map((message, index) => (
                  <div 
                    key={message.id}
                    className={`flex space-x-3 ${message.isInternal ? 'opacity-75' : ''}`}
                    role="article"
                    aria-labelledby={`message-${message.id}-author`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'customer' ? 'bg-primary/10' : 'bg-muted'
                      }`}
                      role="img"
                      aria-label={`Avatar for ${message.author}`}
                    >
                      <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm" id={`message-${message.id}-author`}>
                          {message.author}
                        </p>
                        <Badge 
                          variant={message.role === 'customer' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {message.role === 'customer' ? 'Customer' : 'Agent'}
                        </Badge>
                        {message.isInternal && (
                          <Badge variant="outline" className="text-xs text-warning border-warning/20 bg-warning/10">
                            Internal
                          </Badge>
                        )}
                        <time 
                          className="text-xs text-muted-foreground"
                          dateTime={message.timestamp}
                        >
                          {formatTimestamp(message.timestamp)}
                        </time>
                      </div>
                      <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Form */}
          <div className="space-y-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Add Response</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="internal-note"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded border-border"
                  aria-describedby="internal-note-help"
                />
                <Label htmlFor="internal-note" className="text-sm cursor-pointer">
                  Internal note
                </Label>
                <div id="internal-note-help" className="sr-only">
                  Check this box if the response is an internal note not visible to the customer
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Quick Templates
              </Label>
              <div className="flex flex-wrap gap-2">
                {responseTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => insertTemplate(template.content)}
                    className="text-xs"
                    aria-label={`Insert ${template.name} template`}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Response Textarea */}
            <div className="space-y-2">
              <Label htmlFor="response-text" className="text-sm font-medium">
                Response Message *
              </Label>
              <Textarea
                id="response-text"
                placeholder={isInternal ? "Add an internal note..." : "Type your response to the customer..."}
                value={response}
                onChange={(e) => {
                  setResponse(e.target.value);
                  setErrors(prev => ({ ...prev, response: "" }));
                }}
                rows={4}
                className={errors.response ? "border-destructive" : ""}
                aria-describedby={errors.response ? "response-error" : "response-help"}
                aria-invalid={!!errors.response}
                required
              />
              <div id="response-help" className="sr-only">
                {isInternal 
                  ? "Enter an internal note that will only be visible to support agents"
                  : "Enter your response message that will be sent to the customer"
                }
              </div>
              {errors.response && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="response-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.response}</span>
                </p>
              )}
            </div>

            {/* Status Update */}
            <div className="space-y-2">
              <Label htmlFor="ticket-status" className="text-sm font-medium">
                Update Status
              </Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as typeof newStatus)}>
                <SelectTrigger id="ticket-status" aria-describedby="status-help">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div>
                        <p className="font-medium">{status.label}</p>
                        <p className="text-xs text-muted-foreground">{status.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id="status-help" className="sr-only">
                Select the new status for this ticket after sending your response
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              type="button"
              aria-label="Cancel response and close dialog"
            >
              <X className="h-4 w-4 mr-2" aria-hidden="true" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !response.trim()}
              className="bg-primary text-primary-foreground"
              aria-label={
                loading 
                  ? "Sending response..." 
                  : isInternal
                    ? "Add internal note"
                    : "Send response to customer"
              }
            >
              <Send className="h-4 w-4 mr-2" aria-hidden="true" />
              {loading ? "Sending..." : isInternal ? "Add Note" : "Send Response"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}