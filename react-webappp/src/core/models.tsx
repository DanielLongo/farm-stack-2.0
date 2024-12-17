export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizations?: string[];
  auth0_user_id: string;
}

export interface Project {
  id: string;
  project_unique_name: string;
  created_at: string; // ISO date string
  project_creator: string;
  project_members: string[];
  //   project_sources: ProjectSource[];
}
