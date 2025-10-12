"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProjectList = () => {
  const [ProjectListItem, setProjectListItem] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetProjectDetail();
  }, []);

  const GetProjectDetail = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/get-all-Projects");
      setProjectListItem(result.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="my-3 p-2 rounded-lg animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {ProjectListItem.length === 0 && (
        <h2 className="text-sm px-2 text-gray-400">No Project Found</h2>
      )}
      <div>
        {ProjectListItem.map((project: any, index) => (
          <Link
            href={`/playground/${project.projectId}?frameId=${project.frameId}`}
            key={index}
            className="my-3 hover:bg-secondary p-2 rounded-lg cursor-pointer block"
          >
            <h2 className="line-clamp-1 text-sm">
              {project?.chats[0]?.chatMessage[0]?.content}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;