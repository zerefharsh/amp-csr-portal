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
  Plus, 
  User, 
  Mail,
  Phone,
  AlertTriangle, 
  CheckCircle,
  Search,
  X,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle
} from "lucide-react";

interface NewSupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock customer data for ticket assignment
const mockCustomers = [
  { 
    id: "1", 
    name: "John Smith", 
    email: "john.smith@email.com", 
    phone: "(555) 123-4567",
    status: "active",
    subscriptions: 2
  },
  { 
    id: "2", 
    name: "Emily Davis", 
    email: "emily.davis@email.com", 
    phone: "(555) 987-6543",
    status: "active", 
    subscriptions: 1
  },
  { 
    id: "3", 
    name: "Michael Johnson", 
    email: "michael.j@email.com", 
    phone: "(555) 456-7890",
    status: "active",
    subscriptions: 1
  },
  { 
    id: "4", 
    name: "Sarah Wilson", 
    email: "sarah.wilson@email.com", 
    phone: "(555) 321-0987",
    status: "suspended",
    subscriptions: 0
  }
];

const ticketCategories = [
  { value: "billing", label: "Billing & Payments", icon: CreditCard, description: "Payment issues, billing questions, refunds" },
  { value: "technical", label: "Technical Support", icon: Settings, description: "App issues, car wash problems, technical errors" },
  { value: "account", label: "Account Management", icon: User, description: "Profile updates, subscription changes, transfers" },
  { value: "general", label: "General Inquiry", icon: HelpCircle, description: "Questions, feedback, general support" }
];

const priorityLevels = [
  { value: "low", label: "Low", description: "General questions, non-urgent requests", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", description: "Account issues, moderate urgency", color: "text-warning" },
  { value: "high", label: "High", description: "Payment problems, service interruptions", color: "text-destructive" }
];

const assigneeOptions = [
  { value: "sarah.johnson", label: "Sarah Johnson", role: "CSR Manager" },
  { value: "mike.wilson", label: "Mike Wilson", role: "Senior CSR" },
  { value: "jennifer.brown", label: "Jennifer Brown", role: "CSR Specialist" },
  { value: "auto", label: "Auto-assign", role: "System will assign based on category" }
];

export function NewSupportTicketModal({ 
  isOpen, 
  onClose 
}: NewSupportTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium",
    assignee: "auto"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!selectedCustomer) {
      newErrors.customer = "Please select a customer";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ticketId = `T-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
      
      console.log("Support ticket created:", {
        id: ticketId,
        customerId: selectedCustomer.id,
        ...formData,
        status: "open",
        createdAt: new Date().toISOString()
      });
      
      handleClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedCustomer(null);
    setFormData({
      subject: "",
      description: "",
      category: "",
      priority: "medium",
      assignee: "auto"
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        className={`text-xs ${
          status === "active" ? "status-active" : 
          status === "suspended" ? "status-suspended" : 
          "status-cancelled"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const selectedCategory = ticketCategories.find(cat => cat.value === formData.category);
  const selectedPriority = priorityLevels.find(pri => pri.value === formData.priority);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="new-ticket-dialog-title"
        aria-describedby="new-ticket-dialog-description"
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center space-x-2"
            id="new-ticket-dialog-title"
          >
            <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Create New Support Ticket</span>
          </DialogTitle>
          <DialogDescription id="new-ticket-dialog-description">
            Create a new support ticket to track and resolve customer inquiries and issues.
          </DialogDescription>
        </DialogHeader>

        <form 
          className="space-y-6"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          noValidate
        >
          {/* Customer Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-search" className="text-sm font-medium">
                Select Customer *
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                <Input
                  id="customer-search"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-describedby={errors.customer ? "customer-error" : "customer-search-help"}
                  aria-invalid={!!errors.customer}
                />
                <div id="customer-search-help" className="sr-only">
                  Search for customers by name, email address, or phone number
                </div>
              </div>
              {errors.customer && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="customer-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.customer}</span>
                </p>
              )}
            </div>

            {/* Customer Search Results */}
            {searchQuery && (
              <div 
                className="max-h-48 overflow-y-auto border rounded-lg bg-card"
                role="listbox"
                aria-label="Customer search results"
                aria-describedby="search-results-count"
              >
                <div id="search-results-count" className="sr-only">
                  {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
                </div>
                
                {filteredCustomers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No customers found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setSearchQuery(customer.name);
                          setErrors(prev => ({ ...prev, customer: "" }));
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                        role="option"
                        aria-selected={selectedCustomer?.id === customer.id}
                        aria-label={`Select ${customer.name}, ${customer.email}, ${customer.subscriptions} subscription${customer.subscriptions !== 1 ? 's' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
                              role="img"
                              aria-label={`Avatar for ${customer.name}`}
                            >
                              <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{customer.name}</p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" aria-hidden="true" />
                                <span>{customer.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" aria-hidden="true" />
                                <span>{customer.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(customer.status)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {customer.subscriptions} subscription{customer.subscriptions !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Customer Display */}
            {selectedCustomer && (
              <div 
                className="bg-primary/5 border border-primary/20 rounded-lg p-4"
                role="group"
                aria-labelledby="selected-customer-title"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium text-foreground" id="selected-customer-title">
                        Selected Customer
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.name} • {selectedCustomer.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setSearchQuery("");
                    }}
                    aria-label="Remove selected customer"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Ticket Details</h3>
            
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="ticket-subject" className="text-sm font-medium">
                Subject *
              </Label>
              <Input
                id="ticket-subject"
                placeholder="Brief description of the issue..."
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={errors.subject ? "border-destructive" : ""}
                aria-describedby={errors.subject ? "subject-error" : "subject-help"}
                aria-invalid={!!errors.subject}
                required
              />
              <div id="subject-help" className="sr-only">
                Enter a brief, descriptive subject line for the support ticket
              </div>
              {errors.subject && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="subject-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.subject}</span>
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="ticket-category" className="text-sm font-medium">
                Category *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger 
                  id="ticket-category"
                  className={errors.category ? "border-destructive" : ""}
                  aria-describedby={errors.category ? "category-error" : "category-help"}
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="Select ticket category" />
                </SelectTrigger>
                <SelectContent>
                  {ticketCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" aria-hidden="true" />
                          <div>
                            <p className="font-medium">{category.label}</p>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div id="category-help" className="sr-only">
                Select the category that best describes the type of support needed
              </div>
              {errors.category && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="category-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="ticket-priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger id="ticket-priority" aria-describedby="priority-help">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          priority.value === "high" ? "bg-destructive" :
                          priority.value === "medium" ? "bg-warning" :
                          "bg-muted-foreground"
                        }`} aria-hidden="true" />
                        <div>
                          <p className={`font-medium ${priority.color}`}>{priority.label}</p>
                          <p className="text-xs text-muted-foreground">{priority.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id="priority-help" className="sr-only">
                Select the priority level based on the urgency and impact of the issue
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ticket-description" className="text-sm font-medium">
                Detailed Description *
              </Label>
              <Textarea
                id="ticket-description"
                placeholder="Provide detailed information about the issue, steps to reproduce, and any relevant context..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={5}
                className={errors.description ? "border-destructive" : ""}
                aria-describedby={errors.description ? "description-error" : "description-help"}
                aria-invalid={!!errors.description}
                required
              />
              <div id="description-help" className="sr-only">
                Provide a detailed description of the issue including steps to reproduce and relevant context
              </div>
              {errors.description && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="description-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label htmlFor="ticket-assignee" className="text-sm font-medium">
                Assign To
              </Label>
              <Select 
                value={formData.assignee} 
                onValueChange={(value) => handleInputChange("assignee", value)}
              >
                <SelectTrigger id="ticket-assignee" aria-describedby="assignee-help">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assigneeOptions.map((assignee) => (
                    <SelectItem key={assignee.value} value={assignee.value}>
                      <div>
                        <p className="font-medium">{assignee.label}</p>
                        <p className="text-xs text-muted-foreground">{assignee.role}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id="assignee-help" className="sr-only">
                Select who should handle this ticket, or choose auto-assign for automatic assignment
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedCustomer && formData.category && (
            <div 
              className="bg-muted/30 border rounded-lg p-4"
              role="group"
              aria-labelledby="ticket-summary-title"
            >
              <h4 className="font-medium text-foreground mb-3" id="ticket-summary-title">
                Ticket Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedCategory?.label}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <p className={`font-medium ${selectedPriority?.color}`}>
                    {selectedPriority?.label}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium">
                    {assigneeOptions.find(a => a.value === formData.assignee)?.label}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              type="button"
              aria-label="Cancel ticket creation"
            >
              <X className="h-4 w-4 mr-2" aria-hidden="true" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !selectedCustomer || !formData.subject.trim() || !formData.description.trim() || !formData.category}
              className="bg-primary text-primary-foreground"
              aria-label={
                loading 
                  ? "Creating ticket..." 
                  : "Create new support ticket"
              }
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}