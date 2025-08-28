import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface VendorAvailabilityCalendarProps {
  vendorId: string;
  vendorName: string;
  onSlotSelect?: (date: string, time: string, eventType: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

interface AvailabilitySlot {
  time: string;
  isBooked: boolean;
  eventType: string;
  bookedBy?: string;
}

interface DayAvailability {
  date: string;
  isAvailable: boolean;
  reason?: string;
  slots: AvailabilitySlot[];
  maxEvents: number;
  bookedEvents: number;
}

interface VendorAvailability {
  vendorId: string;
  vendorName: string;
  year: number;
  month: number;
  availability: DayAvailability[];
  workingHours: {
    start: string;
    end: string;
    daysOfWeek: string[];
  };
  advanceBookingDays: number;
  minNoticeHours: number;
}

export default function VendorAvailabilityCalendar({
  vendorId,
  vendorName,
  onSlotSelect,
  selectedDate,
  selectedTime
}: VendorAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; eventType: string } | null>(null);

  // Fetch vendor availability data
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["vendorAvailability", vendorId, currentMonth.getFullYear(), currentMonth.getMonth() + 1],
    queryFn: async () => {
      const availabilityRef = collection(db, "vendorAvailability");
      const q = query(
        availabilityRef,
        where("vendorId", "==", vendorId),
        where("year", "==", currentMonth.getFullYear()),
        where("month", "==", currentMonth.getMonth() + 1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as VendorAvailability;
      }
      return null;
    },
    enabled: !!vendorId,
  });

  // Fetch vendor calendar settings
  const { data: calendarSettings } = useQuery({
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

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get availability for a specific date
  const getDayAvailability = (date: Date): DayAvailability | null => {
    if (!availabilityData?.availability || !date || isNaN(date.getTime())) return null;
    
    const dateString = date.toISOString().split('T')[0];
    return availabilityData.availability.find(day => day.date === dateString) || null;
  };

  // Check if date is in the past
  const isPastDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if date is within advance booking limit
  const isWithinBookingLimit = (date: Date) => {
    if (!date || isNaN(date.getTime()) || !availabilityData?.advanceBookingDays) return true;
    
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + availabilityData.advanceBookingDays);
    
    return date <= maxDate;
  };

  // Handle slot selection
  const handleSlotSelect = (date: string, time: string, eventType: string) => {
    setSelectedSlot({ date, time, eventType });
    onSlotSelect?.(date, time, eventType);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading availability...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Availability Calendar
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select a date and time to book {vendorName}
        </p>
      </CardHeader>
      <CardContent>
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const dayAvailability = getDayAvailability(date);
            const isPast = isPastDate(date);
            const isWithinLimit = isWithinBookingLimit(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            
            return (
              <div
                key={index}
                className={`
                  p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                  ${!isWithinLimit ? 'bg-yellow-50 text-yellow-600' : ''}
                  ${dayAvailability?.isAvailable && !isPast && isWithinLimit ? 'hover:bg-blue-50' : ''}
                  ${selectedDate === (date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '') ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                `}
                onClick={() => {
                  if (!isPast && isWithinLimit && dayAvailability?.isAvailable && date && !isNaN(date.getTime())) {
                    setSelectedSlot({ 
                      date: date.toISOString().split('T')[0], 
                      time: '', 
                      eventType: '' 
                    });
                  }
                }}
              >
                <div className="text-sm font-medium mb-1">
                  {date.getDate()}
                </div>
                
                {dayAvailability && (
                  <div className="space-y-1">
                    {dayAvailability.isAvailable ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          {dayAvailability.bookedEvents}/{dayAvailability.maxEvents}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-600">
                          {dayAvailability.reason}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {!isWithinLimit && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    <span className="text-xs text-yellow-600">Advance limit</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Slots */}
        {selectedSlot?.date && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">
              Available Slots for {new Date(selectedSlot.date).toLocaleDateString()}
            </h4>
            
            {(() => {
              const dayAvailability = getDayAvailability(new Date(selectedSlot.date));
              
              if (!dayAvailability?.isAvailable) {
                return (
                  <div className="text-center py-4 text-gray-500">
                    <XCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                    <p>Not available on this date</p>
                    {dayAvailability?.reason && (
                      <p className="text-sm">{dayAvailability.reason}</p>
                    )}
                  </div>
                );
              }

              if (!dayAvailability.slots || dayAvailability.slots.length === 0) {
                return (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No time slots available</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dayAvailability.slots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.isBooked ? "secondary" : "outline"}
                      disabled={slot.isBooked}
                      className={`
                        h-auto p-3 flex flex-col items-center gap-1
                        ${slot.isBooked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}
                        ${selectedSlot.time === slot.time ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                      `}
                      onClick={() => {
                        if (!slot.isBooked) {
                          handleSlotSelect(selectedSlot.date, slot.time, slot.eventType);
                        }
                      }}
                    >
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{formatTime(slot.time)}</span>
                      <Badge variant={slot.isBooked ? "secondary" : "default"} className="text-xs">
                        {slot.eventType}
                      </Badge>
                      {slot.isBooked && (
                        <span className="text-xs text-gray-500">Booked</span>
                      )}
                    </Button>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Booking Information */}
        {availabilityData && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold mb-2">Booking Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Working Hours:</strong> {availabilityData.workingHours?.start || 'Not set'} - {availabilityData.workingHours?.end || 'Not set'}</p>
                <p><strong>Working Days:</strong> {availabilityData.workingHours?.daysOfWeek?.join(', ') || 'Not set'}</p>
              </div>
              <div>
                <p><strong>Advance Booking:</strong> Up to {availabilityData.advanceBookingDays || 'Not set'} days</p>
                <p><strong>Notice Period:</strong> Minimum {availabilityData.minNoticeHours || 'Not set'} hours</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

