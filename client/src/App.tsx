import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header"; // ✅ import here
import Footer from "@/components/footer"; // ✅ import here
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import AppointmentBooking from "./AppointmentBooking/AppointmentBooking";
import "bootstrap/dist/css/bootstrap.min.css";
// import { ToastContainer } from "react-toastify";
import { ToastContainer, toast } from "material-react-toastify";

import "material-react-toastify/dist/ReactToastify.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/AppointmentBooking" component={AppointmentBooking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Header />
        <main className="min-h-screen bg-background">
          <Router />
          <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
        </main>
        <Footer /> {/* ✅ Always visible */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
