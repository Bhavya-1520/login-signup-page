"use client";

import AppContent from "@/components/AppContent";

// Catch-all route: any path like /home, /home/shop, /home/cart etc.
// serves the same single-page app. The app reads the URL to decide which
// page to show.
export default function CatchAll() {
  return <AppContent />;
}
