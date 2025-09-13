// lib/api.ts
export interface Meeting {
  id: number;
  user_id: number;
  task_id: string;
  title: string;
  transcript: string;
  notes: string;
  created_at: string;
}

export interface UserProfile {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    job_title?: string;
    avatar_url?: string;
}

export interface DashboardStats {
    total_meetings: number;
    hours_processed: number;
    team_members: number;
    accuracy_rate: number;
}

export interface WeeklyActivity {
  day: string;
  meetings: number;
}

export interface MeetingType {
  name: string;
  value: number;
}

export interface ProcessingSpeed {
  time: string;
  count: number;
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    // Return a promise that never resolves to prevent further execution
    return new Promise(() => {});
  }
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  // If the body is FormData, the browser sets the Content-Type header automatically with the correct boundary.
  if (options.body instanceof FormData) {
    delete (headers as any)['Content-Type'];
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  })
  
  if (res.status === 401) {
    localStorage.removeItem("token");
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return new Promise(() => {});
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "An unknown error occurred" }));
    throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
  }

  // Handle successful responses with no content (e.g., 204 No Content)
  if (res.status === 204) {
    return;
  }
  
  return res.json()
}

// === Meeting Functions ===
export const getMeetings = (): Promise<Meeting[]> => authFetch("/meetings");
export const getMeetingDetails = (meetingId: string): Promise<Meeting> => authFetch(`/meetings/${meetingId}`);
export const deleteMeeting = (meetingId: number): Promise<void> => authFetch(`/meetings/${meetingId}`, { method: "DELETE" });

// === Task Functions ===
export const getOngoingTasks = async (): Promise<any[]> => authFetch("/tasks/ongoing");
export const deleteTask = (taskId: string): Promise<void> => authFetch(`/tasks/${taskId}`, { method: "DELETE" });

export const getDashboardStats = (): Promise<DashboardStats> => authFetch("/dashboard/stats");
export const getWeeklyActivity = (): Promise<WeeklyActivity[]> => authFetch("/dashboard/weekly-activity");
export const getMeetingTypes = (): Promise<MeetingType[]> => authFetch("/dashboard/meeting-types");
export const getProcessingSpeed = (): Promise<ProcessingSpeed[]> => authFetch("/dashboard/processing-speed");

// === Profile Functions ===
export const getUserProfile = (): Promise<UserProfile> => authFetch("/profile");
export const updateUserProfile = (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    return authFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify(profileData),
    });
};

export const uploadAvatar = (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append("file", file);
    return authFetch("/profile/avatar", {
        method: "POST",
        body: formData,
    });
};

export const deleteAccount = (): Promise<void> => authFetch('/profile', { method: 'DELETE' });

// === Auth Functions ===
export const verifyEmail = async (email: string, code: string): Promise<{ message: string }> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "An unknown error occurred" }));
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
    }
    return res.json();
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "An unknown error occurred" }));
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
    }
    return res.json();
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "An unknown error occurred" }));
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
    }
    return res.json();
};
