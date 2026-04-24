import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiClient from '@/common/configuration/http'

export interface Permission {
  id?: string;
  module: string;
  level: string; // 'read', 'write', 'admin'
  profile_id?: string;
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface ProfileCreate {
  name: string;
  description?: string;
  permissions: Omit<Permission, 'id' | 'profile_id'>[];
}

export interface ProfileUpdate {
  name?: string;
  description?: string;
  permissions?: Omit<Permission, 'id' | 'profile_id'>[];
}

export interface Module {
  key: string;
  label: string;
}

export interface PermissionLevel {
  key: string;
  label: string;
}

const useProfilesApi = () => {
  const queryClient = useQueryClient();

  const useListModules = () => {
    return useQuery({
      queryKey: ['modules'],
      queryFn: async () => {
        const response = await ApiClient.get('/profiles/modules');
        return response.data as { modules: Module[] };
      },
      staleTime: Infinity, // Modules don't change often
    });
  };

  const useListPermissionLevels = () => {
    return useQuery({
      queryKey: ['permission-levels'],
      queryFn: async () => {
        const response = await ApiClient.get('/profiles/permission-levels');
        return response.data as { levels: PermissionLevel[] };
      },
      staleTime: Infinity, // Permission levels don't change often
    });
  };

  const useListProfiles = (skip: number = 0, limit: number = 100) => {
    return useQuery({
      queryKey: ['profiles', skip, limit],
      queryFn: async () => {
        const response = await ApiClient.get(`/profiles/?skip=${skip}&limit=${limit}`);
        return response.data as { profiles: Profile[]; total: number };
      },
    });
  };

  const useGetProfile = (profileId: string) => {
    return useQuery({
      queryKey: ['profiles', profileId],
      queryFn: async () => {
        const response = await ApiClient.get(`/profiles/${profileId}`);
        return response.data as Profile;
      },
      enabled: !!profileId,
    });
  };

  const useCreateProfile = () => {
    return useMutation<Profile, Error, ProfileCreate>({
      mutationFn: async (data: ProfileCreate) => {
        const response = await ApiClient.post('/profiles/', data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  const useUpdateProfile = () => {
    return useMutation<Profile, Error, { id: string; data: ProfileUpdate }>({
      mutationFn: async ({ id, data }) => {
        const response = await ApiClient.put(`/profiles/${id}`, data);
        return response.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
        queryClient.invalidateQueries({ queryKey: ['profiles', variables.id] });
      },
    });
  };

  const useDeleteProfile = () => {
    return useMutation<void, Error, string>({
      mutationFn: async (profileId: string) => {
        await ApiClient.delete(`/profiles/${profileId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  return {
    useListModules,
    useListPermissionLevels,
    useListProfiles,
    useGetProfile,
    useCreateProfile,
    useUpdateProfile,
    useDeleteProfile,
  };
};

export default useProfilesApi;
