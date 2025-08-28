import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Settings, Save, Plus, X, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface VendorAvailabilityManagerProps {
  vendorId: string;
  vendorName: string;
}

interface WorkingHours {
  start: string;
  end: string;
  isWorking: boolean;
}

interface CalendarSettings {
  defaultWorkingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
  slotDuration: number;
  bufferTime: number;
  maxEventsPerDay: number;
  advanceBookingLimit: number;
  minNoticePeriod: number;
  autoAcceptBookings: boolean;
  requireConfirmation: boolean;
}

interface EventType {
  type: string;
  duration: number;
  price: number;
  description: string;
}

interface Holiday {
  date: string;
  reason: string;
}

export default function VendorAvailabilityManager({
  vendorId,
  vendorName
}: VendorAvailabilityManagerProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'settings' | 'holidays'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calendar settings state
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>({
    defaultWorkingHours: {
      monday: { start: "09:00", end: "18:00", isWorking: true },
      tuesday: { start: "09:00", end: "18:00", isWorking: true },
      wednesday: { start: "09:00", end: "18:00", isWorking: true },
      thursday: { start: "09:00", end: "18:00", isWorking: true },
      friday: { start: "09:00", end: "18:00", isWorking: true },
      saturday: { start: "10:00", end: "16:00", isWorking: true },
      sunday: { start: "10:00", end: "14:00", isWorking: false }
    },
    slotDuration: 60,
    bufferTime: 30,
    maxEventsPerDay: 3,
    advanceBookingLimit: 30,
    minNoticePeriod: 24,
    autoAcceptBookings: false,
    requireConfirmation: true
  });

  const [eventTypes, setEventTypes] = useState<EventType[]>([
    {
      type: "wedding",
      duration: 480,
      price: 50000,
      description: "Complete wedding planning and coordination"
    },
    {
      type: "corporate",
      duration: 240,
      price: 75000,
      description: "Professional corporate event planning"
    },
    {
      type: "birthday",
      duration: 180,
      price: 25000,
      description: "Birthday party planning and coordination"
    }
  ]);

  const [holidays, setHolidays] = useState<Holiday[]>([
    { date: "2024-12-25", reason: "Christmas" },
    { date: "2025-01-01", reason: "New Year" }
  ]);

  // Fetch existing calendar settings
  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ["vendorCalendarSettings", vendorId],
    queryFn: async () => {
      const settingsRef = collection(db, "vendorCalendarSettings");
      const q = query(settingsRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      }
      return null;
    },
    enabled: !!vendorId,
  });

  // Load existing settings
  useEffect(() => {
    if (existingSettings) {
      setCalendarSettings(existingSettings.calendarSettings || calendarSettings);
      setEventTypes(existingSettings.eventTypes || eventTypes);
      setHolidays(existingSettings.holidays || holidays);
    }
  }, [existingSettings]);

  // Save calendar settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      if (existingSettings) {
        // Update existing document
        const docRef = doc(db, "vendorCalendarSettings", existingSettings.id);
        await updateDoc(docRef, {
          calendarSettings: data.calendarSettings,
          eventTypes: data.eventTypes,
          holidays: data.holidays,
          updatedAt: new Date()
        });
      } else {
        // Create new document
        await addDoc(collection(db, "vendorCalendarSettings"), {
          vendorId,
          vendorName,
          calendarSettings: data.calendarSettings,
          eventTypes: data.eventTypes,
          holidays: data.holidays,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorCalendarSettings", vendorId] });
      toast({
        title: "Settings saved successfully",
        description: "Your calendar settings have been updated.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error saving settings",
        description: "Failed to save calendar settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle working hours change
  const handleWorkingHoursChange = (day: string, field: keyof WorkingHours, value: string | boolean) => {
    setCalendarSettings(prev => ({
      ...prev,
      defaultWorkingHours: {
        ...prev.defaultWorkingHours,
        [day]: {
          ...prev.defaultWorkingHours[day as keyof typeof prev.defaultWorkingHours],
          [field]: value
        }
      }
    }));
  };

  // Add new event type
  const addEventType = () => {
    setEventTypes(prev => [...prev, {
      type: "",
      duration: 60,
      price: 0,
      description: ""
    }]);
  };

  // Update event type
  const updateEventType = (index: number, field: keyof EventType, value: string | number) => {
    setEventTypes(prev => prev.map((event, i) => 
      i === index ? { ...event, [field]: value } : event
    ));
  };

  // Remove event type
  const removeEventType = (index: number) => {
    setEventTypes(prev => prev.filter((_, i) => i !== index));
  };

  // Add holiday
  const addHoliday = () => {
    setHolidays(prev => [...prev, { date: "", reason: "" }]);
  };

  // Update holiday
  const updateHoliday = (index: number, field: keyof Holiday, value: string) => {
    setHolidays(prev => prev.map((holiday, i) => 
      i === index ? { ...holiday, [field]: value } : holiday
    ));
  };

  // Remove holiday
  const removeHoliday = (index: number) => {
    setHolidays(prev => prev.filter((_, i) => i !== index));
  };

  // Save settings
  const handleSaveSettings = () => {
    saveSettingsMutation.mutate({
      calendarSettings,
      eventTypes: eventTypes.filter(event => event.type && event.description),
      holidays: holidays.filter(holiday => holiday.date && holiday.reason)
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading calendar settings...</CardTitle>
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
            <Calendar className="h-5 w-5" />
            Calendar Management
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={saveSettingsMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveSettings}
                  disabled={saveSettingsMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
            {!isEditing && (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Settings
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'calendar', label: 'Working Hours', icon: Clock },
            { id: 'settings', label: 'Booking Settings', icon: Settings },
            { id: 'holidays', label: 'Holidays', icon: Calendar }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Working Hours Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Default Working Hours</h3>
              <div className="grid gap-4">
                {Object.entries(calendarSettings.defaultWorkingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-24">
                      <Label className="capitalize font-medium">{day}</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={hours.isWorking}
                        onCheckedChange={(checked) => 
                          handleWorkingHoursChange(day, 'isWorking', checked)
                        }
                        disabled={!isEditing}
                      />
                      <span className="text-sm text-gray-600">
                        {hours.isWorking ? 'Working' : 'Closed'}
                      </span>
                    </div>

                    {hours.isWorking && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Start:</Label>
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                            disabled={!isEditing}
                            className="w-24"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">End:</Label>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                            disabled={!isEditing}
                            className="w-24"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Booking Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Slot Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={calendarSettings.slotDuration}
                      onChange={(e) => setCalendarSettings(prev => ({
                        ...prev,
                        slotDuration: parseInt(e.target.value)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Buffer Time (minutes)</Label>
                    <Input
                      type="number"
                      value={calendarSettings.bufferTime}
                      onChange={(e) => setCalendarSettings(prev => ({
                        ...prev,
                        bufferTime: parseInt(e.target.value)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Max Events Per Day</Label>
                    <Input
                      type="number"
                      value={calendarSettings.maxEventsPerDay}
                      onChange={(e) => setCalendarSettings(prev => ({
                        ...prev,
                        maxEventsPerDay: parseInt(e.target.value)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Advance Booking Limit (days)</Label>
                    <Input
                      type="number"
                      value={calendarSettings.advanceBookingLimit}
                      onChange={(e) => setCalendarSettings(prev => ({
                        ...prev,
                        advanceBookingLimit: parseInt(e.target.value)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Minimum Notice Period (hours)</Label>
                    <Input
                      type="number"
                      value={calendarSettings.minNoticePeriod}
                      onChange={(e) => setCalendarSettings(prev => ({
                        ...prev,
                        minNoticePeriod: parseInt(e.target.value)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={calendarSettings.autoAcceptBookings}
                        onCheckedChange={(checked) => setCalendarSettings(prev => ({
                          ...prev,
                          autoAcceptBookings: checked
                        }))}
                        disabled={!isEditing}
                      />
                      <Label>Auto-accept bookings</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={calendarSettings.requireConfirmation}
                        onCheckedChange={(checked) => setCalendarSettings(prev => ({
                          ...prev,
                          requireConfirmation: checked
                        }))}
                        disabled={!isEditing}
                      />
                      <Label>Require confirmation</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Types */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Event Types & Pricing</h3>
                {isEditing && (
                  <Button size="sm" onClick={addEventType}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event Type
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {eventTypes.map((eventType, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Event Type {index + 1}</h4>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEventType(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event Type</Label>
                        <Input
                          value={eventType.type}
                          onChange={(e) => updateEventType(index, 'type', e.target.value)}
                          placeholder="e.g., wedding, corporate"
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={eventType.duration}
                          onChange={(e) => updateEventType(index, 'duration', parseInt(e.target.value))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Price (₹)</Label>
                        <Input
                          type="number"
                          value={eventType.price}
                          onChange={(e) => updateEventType(index, 'price', parseInt(e.target.value))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={eventType.description}
                          onChange={(e) => updateEventType(index, 'description', e.target.value)}
                          placeholder="Brief description of the service"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Holidays Tab */}
        {activeTab === 'holidays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Holidays & Unavailable Dates</h3>
              {isEditing && (
                <Button size="sm" onClick={addHoliday}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holiday
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {holidays.map((holiday, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={holiday.date}
                      onChange={(e) => updateHoliday(index, 'date', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Reason</Label>
                    <Input
                      value={holiday.reason}
                      onChange={(e) => updateHoliday(index, 'reason', e.target.value)}
                      placeholder="e.g., Christmas, Personal Holiday"
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHoliday(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

