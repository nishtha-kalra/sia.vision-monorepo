import * as admin from "firebase-admin";

// Interface for analytics queries
interface AnalyticsQuery {
  startDate?: Date;
  endDate?: Date;
  inquiryType?: string;
  limit?: number;
}

// Interface for analytics results
interface AnalyticsResult {
  totalEnquiries: number;
  enquiriesByType: Record<string, number>;
  topCountries: Record<string, number>;
  topReferrers: Record<string, number>;
  browserStats: Record<string, number>;
}

/**
 * Get enquiry analytics for a given time period
 * Note: This would need proper authentication/authorization in production
 */
export async function getEnquiryAnalytics(query: AnalyticsQuery = {}): Promise<AnalyticsResult> {
  const db = admin.firestore();
  const enquiriesRef = db.collection("enquiries");
  
  let firestoreQuery = enquiriesRef.orderBy("timestamp", "desc");
  
  // Add filters
  if (query.startDate) {
    firestoreQuery = firestoreQuery.where("timestamp", ">=", admin.firestore.Timestamp.fromDate(query.startDate));
  }
  
  if (query.endDate) {
    firestoreQuery = firestoreQuery.where("timestamp", "<=", admin.firestore.Timestamp.fromDate(query.endDate));
  }
  
  if (query.inquiryType) {
    firestoreQuery = firestoreQuery.where("inquiryType", "==", query.inquiryType);
  }
  
  if (query.limit) {
    firestoreQuery = firestoreQuery.limit(query.limit);
  }
  
  const snapshot = await firestoreQuery.get();
  const enquiries = snapshot.docs.map(doc => doc.data());
  
  // Process analytics
  const result: AnalyticsResult = {
    totalEnquiries: enquiries.length,
    enquiriesByType: {},
    topCountries: {},
    topReferrers: {},
    browserStats: {},
  };
  
  enquiries.forEach((enquiry: any) => {
    // Count by inquiry type
    const type = enquiry.inquiryType || "unknown";
    result.enquiriesByType[type] = (result.enquiriesByType[type] || 0) + 1;
    
    // Count by country (if available)
    const country = enquiry.metadata?.country || "unknown";
    result.topCountries[country] = (result.topCountries[country] || 0) + 1;
    
    // Count by referrer
    const referrer = enquiry.metadata?.referrer || "direct";
    const referrerDomain = extractDomain(referrer);
    result.topReferrers[referrerDomain] = (result.topReferrers[referrerDomain] || 0) + 1;
    
    // Count by browser (simplified)
    const userAgent = enquiry.metadata?.userAgent || "unknown";
    const browser = extractBrowser(userAgent);
    result.browserStats[browser] = (result.browserStats[browser] || 0) + 1;
  });
  
  return result;
}

/**
 * Extract domain from referrer URL
 */
function extractDomain(url: string): string {
  if (url === "direct" || url === "unknown") return url;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "unknown";
  }
}

/**
 * Extract browser name from user agent (simplified)
 */
function extractBrowser(userAgent: string): string {
  if (userAgent === "unknown") return "unknown";
  
  userAgent = userAgent.toLowerCase();
  
  if (userAgent.includes("chrome")) return "Chrome";
  if (userAgent.includes("firefox")) return "Firefox";
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "Safari";
  if (userAgent.includes("edge")) return "Edge";
  if (userAgent.includes("opera")) return "Opera";
  
  return "Other";
}

/**
 * Get recent enquiries with metadata
 */
export async function getRecentEnquiries(limit: number = 50) {
  const db = admin.firestore();
  const snapshot = await db
    .collection("enquiries")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Get enquiries by IP address (for security monitoring)
 */
export async function getEnquiriesByIP(ipAddress: string, limit: number = 10) {
  const db = admin.firestore();
  const snapshot = await db
    .collection("enquiries")
    .where("metadata.ipAddress", "==", ipAddress)
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
} 