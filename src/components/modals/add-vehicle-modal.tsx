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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Car,
  Plus,
  AlertTriangle,
  X
} from "lucide-react";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

// ^^ I'm gonna put it here instead of constants
const carMakes = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", 
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", 
  "Kia", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mitsubishi", 
  "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

// Generate years from current year back to 1990
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

export function AddVehicleModal({ 
  isOpen, 
  onClose, 
  memberId, 
  memberName 
}: AddVehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    color: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // Simulate API call to add vehicle
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Vehicle added:", {
        memberId,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        licensePlate: formData.licensePlate,
        color: formData.color || undefined
      });
      
      handleClose();
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      color: ""
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-primary" />
            <span>Add Vehicle</span>
          </DialogTitle>
          <DialogDescription>
            Add a new vehicle for {memberName}. This vehicle will be available for future subscriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
                <SelectTrigger className={errors.make ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {carMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.make && (
                <p className="text-sm text-destructive flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{errors.make}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                <SelectTrigger className={errors.year ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && (
                <p className="text-sm text-destructive flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{errors.year}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              placeholder="e.g., Civic, X5, Model 3"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              className={errors.model ? "border-destructive" : ""}
            />
            {errors.model && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.model}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate *</Label>
            <Input
              id="licensePlate"
              placeholder="e.g., ABC-123"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange("licensePlate", e.target.value.toUpperCase())}
              className={errors.licensePlate ? "border-destructive" : ""}
            />
            {errors.licensePlate && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.licensePlate}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              placeholder="e.g., Black, White, Blue (optional)"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.make || !formData.model.trim() || !formData.year || !formData.licensePlate.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Adding..." : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}