"use client"
import { useEffect, useState } from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Popup } from "./_components/popup";
import { useParams } from 'next/navigation'
import { ChatWidget } from "../(course)/courses/[courseId]/_components/chatbot-popup";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
const DashboardLayout = ({ children }: { children: React.ReactNode}) => {
  const [popup, setPopup] = useState(false)
  const params = useParams()
  const welcomeMsg = localStorage.getItem("welcome")
  useEffect(() => {
    if(welcomeMsg){
      return
    }
    setPopup(true)
  },[])
  
  return (
    <div className="h-full relative w-full">
      
      {
          popup && <Popup setPopup={setPopup}/>
        }
      <div className="h-[80px] md:pr-56 fixed inset-y-0 w-full z-40">
        <Navbar />
      </div>

      <main className="md:pr-56 pt-[80px] h-full">
        
        {children}</main>
      <div className="hidden md:flex h-full w-56 flex-col fixed right-0 inset-y-0 z-40">
        <Sidebar />
      </div>
      <div className="fixed left-5 bottom-5 z-50">
        <ChatWidget>
          <Button
            variant="outline"
            className="bg-emerald-600 rounded-full p-4 h-14 w-14 shadow-md hover:bg-emerald-600"
          >
            <MessageCircle size={30} color="white" />
          </Button>
        </ChatWidget>
      </div>
    </div>
  );
};

export default DashboardLayout;
