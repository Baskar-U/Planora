import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface VendorServiceManagerProps {
  vendorId: string;
  vendorName: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  priceUnit: 'fixed' | 'per_person' | 'per_hour' | 'per_day' | 'per_event';
  category: string;
  subcategory?: string;
  features: string[];
  images: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
}

export default function VendorServiceManager({
  vendorId,
  vendorName
}: VendorServiceManagerProps) {
  console.log('🔍 VendorServiceManager rendered with:', { vendorId, vendorName });
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: 0,
    priceUnit: 'fixed',
    category: '',
    subcategory: '',
    features: [],
    images: [],
    isAvailable: true,
    rating: 0,
    reviewCount: 0
  });
  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vendor services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["vendorServices", vendorId],
    queryFn: async () => {
      console.log('🔍 Fetching services for vendorId:', vendorId);
      const servicesRef = collection(db, "vendorServices");
      const q = query(servicesRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('📊 Found services:', services);
      return services;
    },
    enabled: !!vendorId,
  });

  // Add service mutation
  const addServiceMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      const servicesRef = collection(db, "vendorServices");
      const docRef = await addDoc(servicesRef, {
        ...serviceData,
        vendorId,
        vendorName,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorServices", vendorId] });
      toast({
        title: "Service added successfully",
        description: "Your service has been added to your portfolio.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error adding service",
        description: "Failed to add service. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ serviceId, serviceData }: { serviceId: string; serviceData: any }) => {
      const serviceRef = doc(db, "vendorServices", serviceId);
      await updateDoc(serviceRef, {
        ...serviceData,
        updatedAt: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorServices", vendorId] });
      toast({
        title: "Service updated successfully",
        description: "Your service has been updated.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error updating service",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const serviceRef = doc(db, "vendorServices", serviceId);
      await deleteDoc(serviceRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorServices", vendorId] });
      toast({
        title: "Service deleted successfully",
        description: "Your service has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting service",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle form field changes
  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      updateServiceMutation.mutate({
        serviceId: editingService.id,
        serviceData: formData
      });
    } else {
      addServiceMutation.mutate(formData);
    }
  };

  // Edit service
  const handleEditService = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || 0,
      priceUnit: service.priceUnit || 'fixed',
      category: service.category || '',
      subcategory: service.subcategory || '',
      features: service.features || [],
      images: service.images || [],
      isAvailable: service.isAvailable !== false,
      rating: service.rating || 0,
      reviewCount: service.reviewCount || 0
    });
    setIsAddingService(true);
  };

  // Delete service
  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      priceUnit: 'fixed',
      category: '',
      subcategory: '',
      features: [],
      images: [],
      isAvailable: true,
      rating: 0,
      reviewCount: 0
    });
    setEditingService(null);
    setIsAddingService(false);
    setNewFeature('');
  };

  const categories = [
    'Venue', 'Catering', 'Decoration', 'DJ', 'Cakes', 'Return Gift',
    'Photography', 'Transport', 'Wedding', 'Birthday', 'Corporate'
  ];

  const priceUnits = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'per_person', label: 'Per Person' },
    { value: 'per_hour', label: 'Per Hour' },
    { value: 'per_day', label: 'Per Day' },
    { value: 'per_event', label: 'Per Event' }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading services...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manage Services
          </CardTitle>
          <Button onClick={() => setIsAddingService(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Services List */}
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first service to showcase your offerings.</p>
              <Button onClick={() => setIsAddingService(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{service.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">
                      ₹{service.price?.toLocaleString()}
                      {service.priceUnit && service.priceUnit !== 'fixed' && (
                        <span className="text-xs text-gray-500 ml-1">
                          / {service.priceUnit.replace('_', ' ')}
                        </span>
                      )}
                    </span>
                    <Badge variant={service.isAvailable ? "default" : "secondary"}>
                      {service.isAvailable ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Service Dialog */}
        <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Wedding Photography Package"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="priceUnit">Price Unit</Label>
                  <Select
                    value={formData.priceUnit}
                    onValueChange={(value) => handleInputChange('priceUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your service in detail..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isAvailable">Service is available</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={addServiceMutation.isPending || updateServiceMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {addServiceMutation.isPending || updateServiceMutation.isPending ? 'Saving...' : 'Save Service'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

