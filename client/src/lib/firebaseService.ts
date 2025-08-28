import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  startAfter,
  arrayUnion
} from "firebase/firestore";
import { auth } from "./firebase";

// Types for Firestore collections
export interface VendorService {
  id: string;
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
  packages?: ServicePackage[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Vendor {
  id?: string;
  name: string;
  businessname: string;
  business_name?: string; // Alternative field name
  companyName?: string; // Alternative field name
  company_name?: string; // Alternative field name
  description: string;
  eventname: string; // category/event type
  exprience: string;
  experience?: string; // Alternative field name
  from: string;
  hours: string;
  image: string;
  location: string;
  menu: string[]; // Legacy field - keep for backward compatibility
  mobilenumber: string;
  vendorid: string;
  
  // Enhanced services array with full details
  services?: VendorService[];
  
  // Optional fields for compatibility
  email?: string;
  phone?: string;
  category?: string;
  city?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
  coverImage?: string;
  isVerified?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Postorder {
  id?: string;
  vendorid: string;
  businessname: string;
  name: string;
  mobilenumber: string;
  email: string;
  eventname: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  priceUnit: string;
  location: string;
  from: string;
  exprience: string;
  hours: string;
  features?: string[];
  menu?: string[];
  image?: string;
  coverImage?: string;
  collections?: string[];
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Order {
  id?: string;
  userId: string;
  orderId: string;
  eventType: string;
  customerName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  budget: number;
  eventDescription: string;
  additionalRequirements?: string;
  status: "pending" | "vendor_accepted" | "payment_pending" | "in_progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  vendorQuotes: any[];
  selectedVendor: any;
  timeline: {
    status: string;
    timestamp: string;
    description: string;
  }[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Service {
  id?: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  priceUnit: 'fixed' | 'per_hour' | 'per_day' | 'per_person';
  city: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  features: string[];
  packages?: ServicePackage[];
  createdAt?: any;
  updatedAt?: any;
  vendorName?: string;
  vendorCompany?: string;
  vendorImage?: string;
  vendorLocation?: string;
  vendorRating?: number;
  vendorExperience?: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface Review {
  id?: string;
  serviceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

// Firebase service functions
export const firebaseService = {
  // Vendor functions
  async getVendors(): Promise<Vendor[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "postorder"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  async getVendorsCount(): Promise<number> {
    try {
      const querySnapshot = await getDocs(collection(db, "postorder"));
      return querySnapshot.size;
    } catch (error) {
      console.error("Error fetching vendors count:", error);
      throw error;
    }
  },

  async getVendor(id: string): Promise<Vendor | null> {
    try {
      // First try to find vendor in the "vendors" collection
      let docRef = doc(db, "vendors", id);
      let docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Vendor;
      }
      
      // If not found in "vendors", try "postorder" collection
      docRef = doc(db, "postorder", id);
      docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Vendor;
      }
      
      // If not found in either collection, return null
      return null;
    } catch (error) {
      console.error("Error fetching vendor:", error);
      throw error;
    }
  },

  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    try {
      const q = query(
        collection(db, "postorder"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];
    } catch (error) {
      console.error("Error fetching vendors by category:", error);
      throw error;
    }
  },

  async getVendorsByLocation(location: string): Promise<Vendor[]> {
    try {
      const q = query(
        collection(db, "postorder"),
        where("location", "==", location)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];
    } catch (error) {
      console.error("Error fetching vendors by location:", error);
      throw error;
    }
  },

  async searchVendors(query: string): Promise<Vendor[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "postorder"));
      const vendors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];
      
      const lowerQuery = query.toLowerCase();
      return vendors.filter(vendor => 
        vendor.businessname?.toLowerCase().includes(lowerQuery) ||
        vendor.description?.toLowerCase().includes(lowerQuery) ||
        vendor.category?.toLowerCase().includes(lowerQuery) ||
        vendor.eventname?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching vendors:", error);
      throw error;
    }
  },

  async createVendor(vendorData: Omit<Vendor, 'id'>): Promise<Vendor> {
    try {
      const docRef = await addDoc(collection(db, "postorder"), {
        ...vendorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...vendorData
      } as Vendor;
    } catch (error) {
      console.error("Error creating vendor:", error);
      throw error;
    }
  },

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<void> {
    try {
      const docRef = doc(db, "postorder", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating vendor:", error);
      throw error;
    }
  },

  // Postorder functions (for the new API)
  async getPostorders(): Promise<Postorder[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "postorder"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Postorder[];
    } catch (error) {
      console.error("Error fetching postorders:", error);
      throw error;
    }
  },

  async getPostorder(id: string): Promise<Postorder | null> {
    try {
      const docRef = doc(db, "postorder", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Postorder;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching postorder:", error);
      throw error;
    }
  },

  async getPostordersByVendor(vendorId: string): Promise<Postorder[]> {
    try {
      const q = query(
        collection(db, "postorder"),
        where("vendorid", "==", vendorId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Postorder[];
    } catch (error) {
      console.error("Error fetching postorders by vendor:", error);
      throw error;
    }
  },

  async getPostordersByCategory(category: string): Promise<Postorder[]> {
    try {
      const q = query(
        collection(db, "postorder"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Postorder[];
    } catch (error) {
      console.error("Error fetching postorders by category:", error);
      throw error;
    }
  },

  async getPostordersByLocation(location: string): Promise<Postorder[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "postorder"));
      const postorders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Postorder[];
      
      const lowerLocation = location.toLowerCase();
      return postorders.filter(postorder => 
        postorder.location?.toLowerCase().includes(lowerLocation) ||
        postorder.from?.toLowerCase().includes(lowerLocation)
      );
    } catch (error) {
      console.error("Error fetching postorders by location:", error);
      throw error;
    }
  },

  async searchPostorders(query: string): Promise<Postorder[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "postorder"));
      const postorders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Postorder[];
      
      const lowerQuery = query.toLowerCase();
      return postorders.filter(postorder => 
        postorder.businessname?.toLowerCase().includes(lowerQuery) ||
        postorder.description?.toLowerCase().includes(lowerQuery) ||
        postorder.category?.toLowerCase().includes(lowerQuery) ||
        postorder.eventname?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching postorders:", error);
      throw error;
    }
  },

  async createPostorder(postorderData: Omit<Postorder, 'id'>): Promise<Postorder> {
    try {
      const docRef = await addDoc(collection(db, "postorder"), {
        ...postorderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...postorderData
      } as Postorder;
    } catch (error) {
      console.error("Error creating postorder:", error);
      throw error;
    }
  },

  async updatePostorder(id: string, updates: Partial<Postorder>): Promise<void> {
    try {
      const docRef = doc(db, "postorder", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating postorder:", error);
      throw error;
    }
  },

  // Service functions
  async getServices(): Promise<Service[]> {
    try {
      // Fetch all services from vendorServices collection
      const querySnapshot = await getDocs(collection(db, "vendorServices"));
      const services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];

      // Fetch vendor information for each service
      const servicesWithVendors = await Promise.all(
        services.map(async (service) => {
          try {
            if (service.vendorId) {
              const vendorDoc = await getDoc(doc(db, "vendors", service.vendorId));
              if (vendorDoc.exists()) {
                const vendorData = vendorDoc.data();
                return {
                  ...service,
                  vendorName: vendorData.name || vendorData.companyName || "Unknown Vendor",
                  vendorCompany: vendorData.companyName || vendorData.name || "Unknown Company",
                  vendorImage: vendorData.profileImage || vendorData.image || "",
                  vendorLocation: vendorData.city || vendorData.location || "",
                  vendorRating: vendorData.rating || 0,
                  vendorExperience: vendorData.experience || 0
                };
              }
            }
            return {
              ...service,
              vendorName: "Unknown Vendor",
              vendorCompany: "Unknown Company",
              vendorImage: "",
              vendorLocation: "",
              vendorRating: 0,
              vendorExperience: 0
            };
          } catch (error) {
            console.error(`Error fetching vendor for service ${service.id}:`, error);
            return {
              ...service,
              vendorName: "Unknown Vendor",
              vendorCompany: "Unknown Company",
              vendorImage: "",
              vendorLocation: "",
              vendorRating: 0,
              vendorExperience: 0
            };
          }
        })
      );

      return servicesWithVendors;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  async getService(id: string): Promise<Service | null> {
    try {
      const docRef = doc(db, "services", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Service;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      throw error;
    }
  },

  async getServicesByVendor(vendorId: string): Promise<Service[]> {
    try {
      const q = query(
        collection(db, "vendorServices"),
        where("vendorId", "==", vendorId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error) {
      console.error("Error fetching services by vendor:", error);
      throw error;
    }
  },

  async createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
    try {
      const docRef = await addDoc(collection(db, "vendorServices"), {
        ...serviceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...serviceData
      } as Service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // Order functions
  async createOrder(orderData: Order): Promise<Order> {
    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      return {
        id: docRef.id,
        ...orderData
      } as Order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const q = query(collection(db, "orders"), where("orderId", "==", orderId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Order;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string, timelineEntry: any, paymentStatus?: string): Promise<void> {
    try {
      // First try to find in individualEventsRequests collection
      let q = query(collection(db, "individualEventsRequests"), where("requestId", "==", orderId));
      let querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If not found, try the orders collection as fallback
        q = query(collection(db, "orders"), where("orderId", "==", orderId));
        querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error("Order not found");
        
        // Update in orders collection
        const docRef = doc(db, "orders", querySnapshot.docs[0].id);
        const updateData: any = {
          status,
          timeline: arrayUnion(timelineEntry),
          updatedAt: new Date().toISOString()
        };
        
        if (paymentStatus) {
          updateData.paymentStatus = paymentStatus;
        }
        
        await updateDoc(docRef, updateData);
      } else {
        // Update in individualEventsRequests collection
        const docRef = doc(db, "individualEventsRequests", querySnapshot.docs[0].id);
        const updateData: any = {
          status,
          timeline: arrayUnion(timelineEntry),
          updatedAt: new Date().toISOString()
        };
        
        if (paymentStatus) {
          updateData.paymentStatus = paymentStatus;
        }
        
        await updateDoc(docRef, updateData);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  async getVendorOrders(vendorId: string): Promise<Order[]> {
    try {
      const q = query(collection(db, "orders"), where("acceptedVendor", "==", vendorId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error("Error getting vendor orders:", error);
      throw error;
    }
  },

  async getPendingOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, "orders"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error("Error getting pending orders:", error);
      throw error;
    }
  },

  async getIndividualEventRequests(): Promise<any[]> {
    try {
      const q = query(collection(db, "individualEventsRequests"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting individual event requests:", error);
      throw error;
    }
  },

  async acceptOrder(orderId: string, vendorId: string): Promise<void> {
    try {
      // First try to find in individualEventsRequests collection
      let q = query(collection(db, "individualEventsRequests"), where("requestId", "==", orderId));
      let querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If not found, try the orders collection as fallback
        q = query(collection(db, "orders"), where("orderId", "==", orderId));
        querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error("Order not found");
        
        // Update in orders collection
        const docRef = doc(db, "orders", querySnapshot.docs[0].id);
        const timelineEntry = {
          status: "vendor_accepted",
          timestamp: new Date().toISOString(),
          description: `Order accepted by vendor ${vendorId}`
        };
        
        await updateDoc(docRef, {
          status: "vendor_accepted",
          acceptedVendor: vendorId,
          timeline: arrayUnion(timelineEntry),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Update in individualEventsRequests collection
        const docRef = doc(db, "individualEventsRequests", querySnapshot.docs[0].id);
        const timelineEntry = {
          status: "vendor_accepted",
          timestamp: new Date().toISOString(),
          description: `Order accepted by vendor ${vendorId}`
        };
        
        await updateDoc(docRef, {
          status: "vendor_accepted",
          acceptedVendor: vendorId,
          timeline: arrayUnion(timelineEntry),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      throw error;
    }
  },

  // Message interfaces
  async createMessage(messageData: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    try {
      const messagesRef = collection(db, "messages");
      const newMessage = {
        ...messageData,
        timestamp: serverTimestamp(), // Use serverTimestamp for consistent timing
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(messagesRef, newMessage);
      return {
        id: docRef.id,
        ...newMessage
      } as Message;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  },

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    try {
      // First try with ordering
      const q = query(
        collection(db, "messages"), 
        where("conversationId", "==", conversationId),
        orderBy("timestamp", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
    } catch (error: any) {
      // If index error, try without ordering and sort in memory
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.log("Index not found, fetching without ordering and sorting in memory...");
        const q = query(
          collection(db, "messages"), 
          where("conversationId", "==", conversationId)
        );
        const querySnapshot = await getDocs(q);
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        
        // Sort by timestamp in memory
        return messages.sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return timeA - timeB;
        });
      }
      console.error("Error getting messages:", error);
      throw error;
    }
  },

  async updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<void> {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        status: status,
        isRead: status === 'read',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      throw error;
    }
  },

  async getConversation(participant1Id: string, participant2Id: string): Promise<Conversation | null> {
    try {
      const q = query(
        collection(db, "conversations"),
        where("participant1Id", "in", [participant1Id, participant2Id]),
        where("participant2Id", "in", [participant1Id, participant2Id])
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Conversation;
    } catch (error) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  },

  async createConversation(conversationData: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    try {
      const conversationsRef = collection(db, "conversations");
      const newConversation = {
        ...conversationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(conversationsRef, newConversation);
      return {
        id: docRef.id,
        ...newConversation
      } as Conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

  // Vendor Service functions
  async createVendorService(serviceData: any): Promise<any> {
    try {
      const docRef = await addDoc(collection(db, "vendorServices"), {
        ...serviceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return {
        id: docRef.id,
        ...serviceData
      };
    } catch (error) {
      console.error("Error creating vendor service:", error);
      throw error;
    }
  },



  async updateCustomerOrder(orderId: string, updateData: any): Promise<void> {
    try {
      const docRef = doc(db, "vendorBookings", orderId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating customer order:", error);
      throw error;
    }
  },

  async getCustomerOrders(): Promise<any[]> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Try the optimized query with index first
      const q = query(
        collection(db, "vendorBookings"),
        where("customerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error: any) {
      console.error("Error fetching customer orders:", error);
      
      // If it's an index error, try a fallback query without ordering
      if (error.message && error.message.includes('index')) {
        console.log("Index not available, trying fallback query...");
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error("User not authenticated");
          }

          const fallbackQuery = query(
            collection(db, "vendorBookings"),
            where("customerId", "==", user.uid)
          );
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const orders = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort manually on the client side
          return orders.sort((a: any, b: any) => {
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
            return bTime.getTime() - aTime.getTime();
          });
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  },

  async getCustomerAnalytics(): Promise<any> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const analyticsRef = collection(db, "customerAnalytics");
      const q = query(analyticsRef, where("customerId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return querySnapshot.docs[0].data();
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      throw error;
    }
  }
};

// Message interfaces
export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  timestamp: any; // Firebase timestamp
  isRead: boolean;
  createdAt: any; // Firebase timestamp
}

export interface Conversation {
  id?: string;
  participant1Id: string;
  participant2Id: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  orderId?: string;
  createdAt: any; // Firebase timestamp
  updatedAt: any; // Firebase timestamp
}

export interface MessageStatus {
  id?: string;
  messageId: string;
  conversationId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
  updatedBy: string;
}

// Review Services
export const reviewService = {
  // Get reviews for a service
  async getServiceReviews(serviceId: string): Promise<Review[]> {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(
        reviewsRef, 
        where("serviceId", "==", serviceId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Create new review
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    try {
      const reviewsRef = collection(db, "reviews");
      const newReview = {
        ...reviewData,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(reviewsRef, newReview);
      return {
        id: docRef.id,
        ...newReview
      } as Review;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
};
