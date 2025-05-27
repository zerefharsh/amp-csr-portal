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
import { 
  ArrowLeftRight, 
  RotateCcw, 
  UserPlus,
  User, 
  Car,
  DollarSign,
  Mail,
  AlertTriangle,
  X
} from "lucide-react";

// Mock data for dropdowns
const mockUsers = [
  { id: "1", name: "John Smith", email: "john.smith@email.com" },
  { id: "2", name: "Emily Davis", email: "emily.davis@email.com" },
  { id: "3", name: "Michael Johnson", email: "michael.j@email.com" },
  { id: "4", name: "Sarah Wilson", email: "sarah.wilson@email.com" }
];

const mockVehicles = [
  { id: "veh1", name: "2022 BMW X5 (ABC-123)", userId: "1" },
  { id: "veh2", name: "2021 Honda Civic (XYZ-789)", userId: "1" },
  { id: "veh3", name: "2023 Tesla Model 3 (TES-001)", userId: "2" },
  { id: "veh4", name: "2020 Ford F-150 (FRD-456)", userId: "3" },
  { id: "veh5", name: "2021 Audi A4 (AUD-789)", userId: "4" }
];

// Transfer Subscription Modal
interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [vehicleFrom, setVehicleFrom] = useState("");
  const [vehicleTo, setVehicleTo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedUser) newErrors.user = "Please select a user";
    if (!vehicleFrom) newErrors.vehicleFrom = "Please select source vehicle";
    if (!vehicleTo) newErrors.vehicleTo = "Please select destination vehicle";
    if (vehicleFrom === vehicleTo) newErrors.vehicleTo = "Must select different vehicles";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Transfer completed:", { selectedUser, vehicleFrom, vehicleTo });
      handleClose();
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUser("");
    setVehicleFrom("");
    setVehicleTo("");
    setErrors({});
    onClose();
  };

  const userVehicles = mockVehicles.filter(v => v.userId === selectedUser);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <span>Transfer Subscription</span>
          </DialogTitle>
          <DialogDescription>
            Transfer a subscription from one vehicle to another for the same customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select Customer *</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className={errors.user ? "border-destructive" : ""}>
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.user}</span>
              </p>
            )}
          </div>

          {selectedUser && (
            <>
              <div className="space-y-2">
                <Label htmlFor="vehicle-from">Transfer From *</Label>
                <Select value={vehicleFrom} onValueChange={setVehicleFrom}>
                  <SelectTrigger className={errors.vehicleFrom ? "border-destructive" : ""}>
                    <SelectValue placeholder="Source vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {userVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4" />
                          <span>{vehicle.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleFrom && (
                  <p className="text-sm text-destructive flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{errors.vehicleFrom}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle-to">Transfer To *</Label>
                <Select value={vehicleTo} onValueChange={setVehicleTo}>
                  <SelectTrigger className={errors.vehicleTo ? "border-destructive" : ""}>
                    <SelectValue placeholder="Destination vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {userVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4" />
                          <span>{vehicle.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleTo && (
                  <p className="text-sm text-destructive flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{errors.vehicleTo}</span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedUser || !vehicleFrom || !vehicleTo}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {loading ? "Transferring..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Refund Modal
interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RefundModal({ isOpen, onClose }: RefundModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedUser) newErrors.user = "Please select a user";
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Please enter a valid amount";
    if (!reason.trim()) newErrors.reason = "Please provide a reason";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Refund processed:", { selectedUser, amount: parseFloat(amount), reason });
      handleClose();
    } catch (error) {
      console.error("Refund failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUser("");
    setAmount("");
    setReason("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RotateCcw className="h-5 w-5 text-warning" />
            <span>Process Refund</span>
          </DialogTitle>
          <DialogDescription>
            Issue a refund to a customer for their subscription or service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select Customer *</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className={errors.user ? "border-destructive" : ""}>
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.user}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund-amount">Refund Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-10 ${errors.amount ? "border-destructive" : ""}`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.amount}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund-reason">Reason/Note *</Label>
            <Textarea
              id="refund-reason"
              placeholder="Why is this refund being processed?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className={errors.reason ? "border-destructive" : ""}
            />
            {errors.reason && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.reason}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedUser || !amount || !reason.trim()}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Process Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Create User Modal
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("User created:", { email, sendEmail });
      handleClose();
    } catch (error) {
      console.error("User creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSendEmail(true);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span>Create User</span>
          </DialogTitle>
          <DialogDescription>
            Add a new customer account and send them registration details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="user-email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="send-email"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="send-email" className="text-sm cursor-pointer">
              Send registration email with setup instructions
            </Label>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              The customer will receive an email with instructions to complete their account setup, 
              including creating a password and adding their first vehicle.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !email.trim()}>
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}