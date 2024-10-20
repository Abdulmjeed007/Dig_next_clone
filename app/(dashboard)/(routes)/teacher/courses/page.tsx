"use client";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useEffect } from "react";
import useCoursesStore from "@/store/coursesStore";

const CoursesPage = () => {
  const { courses, fetchItems, loading } = useCoursesStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} isLoading={loading} />
    </div>
  );
};

export default CoursesPage;
