"use client";
import { useState, useEffect } from 'react';
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';


export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === "/search";

  const UserButtonWrapper = dynamic(() => import('@clerk/nextjs').then(module => module.UserButton), {
    ssr: false // Ensure component is not rendered on the server-side
  });


  

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
          <div id="google_translate_element "></div>

          <UserButtonWrapper afterSignOutUrl="/" />
        {isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              عودة
            </Button>
          </Link>
        )  : null}
      </div>
    </>
  );
};
