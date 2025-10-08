"use client";
import { useState } from "react";

const ProjectList = () => {
  const [ProjectListItem, setProjectListItem] = useState<any[]>([]);
  return (
    <div>
      {ProjectListItem.length === 0 && (
        <h2 className="text-sm px-2 text-gray-400">No Project Found</h2>
      )}
    </div>
  );
};

export default ProjectList;
