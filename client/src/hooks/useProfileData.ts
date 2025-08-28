import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

// User Profile Hooks
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    },
    enabled: !!userId,
  });
};

export const useVendorProfile = (userId: string) => {
  return useQuery({
    queryKey: ["vendorProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const vendorsRef = collection(db, "vendors");
      const q = query(vendorsRef, where("vendorid", "==", userId));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },
    enabled: !!userId,
  });
};

// Customer-specific hooks
export const useCustomerOrders = (customerId: string) => {
  return useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("customerId", "==", customerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!customerId,
  });
};

export const useCustomerBookings = (customerId: string) => {
  return useQuery({
    queryKey: ["customerBookings", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("customerId", "==", customerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!customerId,
  });
};

export const useCustomerLikedVendors = (customerId: string) => {
  return useQuery({
    queryKey: ["customerLikedVendors", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      // Get liked vendor IDs from localStorage (or could be stored in user profile)
      const likedVendorIds = JSON.parse(localStorage.getItem('likedVendors') || '[]');
      if (likedVendorIds.length === 0) return [];

      const vendorsRef = collection(db, "vendors");
      const likedVendors = [];
      
      for (const vendorId of likedVendorIds) {
        const q = query(vendorsRef, where("id", "==", vendorId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          likedVendors.push({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      }
      
      return likedVendors;
    },
    enabled: !!customerId,
  });
};

// Vendor-specific hooks
export const useVendorServices = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendorServices", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const servicesRef = collection(db, "vendorServices");
      const q = query(servicesRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!vendorId,
  });
};

export const useVendorOrders = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendorOrders", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!vendorId,
  });
};

export const useVendorBookings = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendorBookings", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!vendorId,
  });
};

export const useVendorAvailability = (vendorId: string, year: number, month: number) => {
  return useQuery({
    queryKey: ["vendorAvailability", vendorId, year, month],
    queryFn: async () => {
      if (!vendorId) return null;
      const availabilityRef = collection(db, "vendorAvailability");
      const q = query(
        availabilityRef,
        where("vendorId", "==", vendorId),
        where("year", "==", year),
        where("month", "==", month)
      );
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },
    enabled: !!vendorId,
  });
};

export const useVendorCalendarSettings = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendorCalendarSettings", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      const settingsRef = collection(db, "vendorCalendarSettings");
      const q = query(settingsRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },
    enabled: !!vendorId,
  });
};

export const useVendorReviews = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendorReviews", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!vendorId,
  });
};

// Profile update mutations
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
};

export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vendorId, updates }: { vendorId: string; updates: any }) => {
      const vendorRef = doc(db, "vendors", vendorId);
      await updateDoc(vendorRef, {
        ...updates,
        updatedAt: new Date()
      });
    },
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: ["vendorProfile", vendorId] });
    },
  });
};

// Statistics calculation helpers
export const useCustomerStats = (customerId: string) => {
  const { data: orders = [] } = useCustomerOrders(customerId);
  const { data: bookings = [] } = useCustomerBookings(customerId);
  const { data: likedVendors = [] } = useCustomerLikedVendors(customerId);

  const stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter((order: any) => order.status === 'completed').length,
    pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
    totalSpent: orders.reduce((total: number, order: any) => total + (order.amount || 0), 0),
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((booking: any) => booking.status === 'confirmed').length,
    likedVendorsCount: likedVendors.length,
    favoriteCategories: Array.from(new Set(orders.map((order: any) => order.eventType).filter(Boolean))),
    recentOrders: orders.slice(0, 5),
    recentBookings: bookings.slice(0, 5),
  };

  return { data: stats, isLoading: false };
};

export const useVendorStats = (vendorId: string) => {
  const { data: services = [] } = useVendorServices(vendorId);
  const { data: orders = [] } = useVendorOrders(vendorId);
  const { data: bookings = [] } = useVendorBookings(vendorId);
  const { data: reviews = [] } = useVendorReviews(vendorId);

  const stats = {
    totalServices: services.length,
    activeServices: services.filter((service: any) => service.isActive !== false).length,
    totalOrders: orders.length,
    completedOrders: orders.filter((order: any) => order.status === 'completed').length,
    pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
    totalRevenue: orders.reduce((total: number, order: any) => total + (order.amount || 0), 0),
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((booking: any) => booking.status === 'confirmed').length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((total: number, review: any) => total + review.rating, 0) / reviews.length 
      : 0,
    reviewCount: reviews.length,
    serviceCategories: Array.from(new Set(services.map((service: any) => service.category).filter(Boolean))),
    recentOrders: orders.slice(0, 5),
    recentBookings: bookings.slice(0, 5),
    recentReviews: reviews.slice(0, 5),
  };

  return { data: stats, isLoading: false };
};
