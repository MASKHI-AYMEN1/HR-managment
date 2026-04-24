import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { MdSecurity } from 'react-icons/md';
import { PlusIcon } from '@/assets/icons/PlusIcon';
import AdminLayout from '@/layouts/AdminLayout';
import PageTitle from '@/components/PageTitle';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import DeleteModal from '@/components/DeleteModal';
import Typography from '@/components/Typographie';
import GenericTable from '@/components/Table';
import AppDrawer from '@/components/Drawer';
import TextInput from '@/components/TextInput';
import Textarea from '@/components/Textarea';
import CustomSelect from '@/components/CustomSelect';
import useProfilesApi, { Profile } from '@/services/profiles/useProfilesApi';
import useToast from '@/common/hooks/useToast';

const ProfilesPage = () => {
  const intl = useIntl();
  const [drawerState, setDrawerState] = useState<null | { mode: 'create' | 'edit'; profileId?: string }>(null);

  const { useListProfiles, useDeleteProfile } = useProfilesApi();
  const { data: profilesData, isLoading, refetch } = useListProfiles();
  const deleteMutation = useDeleteProfile();

  const closeDrawer = () => setDrawerState(null);

  const profiles: Profile[] = profilesData?.profiles || [];

  const paginated = {
    items: profiles,
    totalPages: 1,
    pageNumber: 1,
    pageSize: profiles.length || 10,
    totalCount: profiles.length || 0,
  };

  const columns = [
    { uid: 'name', name: intl.formatMessage({ id: 'profiles.name', defaultMessage: 'Nom' }) },
    { uid: 'description', name: intl.formatMessage({ id: 'profiles.description', defaultMessage: 'Description' }) },
    { uid: 'permissions', name: intl.formatMessage({ id: 'profiles.permissions', defaultMessage: 'Permissions' }) },
    { uid: 'actions', name: intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' }) },
  ];

  const renderCell = (item: Profile, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return <Typography className="font-medium">{item.name}</Typography>;
      case 'description':
        return <Typography>{item.description || '-'}</Typography>;
      case 'permissions':
        return (
          <div className="flex flex-wrap gap-1">
            {item.permissions.length > 0 ? (
              item.permissions.map((perm, idx) => (
                <span key={idx} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {perm.module}: {perm.level}
                </span>
              ))
            ) : (
              <Typography>-</Typography>
            )}
          </div>
        );
      case 'actions':
        return (
          <div className="flex gap-2">
            <IconButton
              aria-label={`edit-${item.id}`}
              onClick={() => handleEdit(item)}
              color="warning"
            >
              <FiEdit />
            </IconButton>
            <DeleteModal
              id={item.id}
              mutate={deleteMutation.mutate}
              isPending={deleteMutation.isPending}
              toggle={() => {
                refetch();
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  function handleEdit(item: Profile) {
    setDrawerState({ mode: 'edit', profileId: item.id });
  }

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MdSecurity size={28} className="text-purple-600" />
            <PageTitle title={intl.formatMessage({ id: 'profiles.title', defaultMessage: 'Gestion des profils' })} />
          </div>
          <Button 
            color="warning" 
            onClick={() => setDrawerState({ mode: 'create' })} 
            endContent={<PlusIcon />}
          >
            {intl.formatMessage({ id: 'profiles.createNew', defaultMessage: 'Nouveau profil' })}
          </Button>
        </div>
        <GenericTable
          data={paginated}
          columns={columns}
          renderCell={renderCell}
          isLoading={isLoading}
        />
      </div>

      <AppDrawer
        isOpen={drawerState !== null}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
        title={
          drawerState?.mode === 'create'
            ? intl.formatMessage({ id: 'profiles.create', defaultMessage: 'Créer un profil' })
            : drawerState?.mode === 'edit'
            ? intl.formatMessage({ id: 'profiles.edit', defaultMessage: 'Modifier le profil' })
            : ''
        }
        footer={
          drawerState && (
            <div className="flex gap-2">
              <Button type="button" color="secondary" onClick={closeDrawer}>
                {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
              </Button>
              <Button
                type="submit"
                color="warning"
                form={drawerState.mode === 'create' ? 'profile-create-form' : 'profile-edit-form'}
              >
                {intl.formatMessage({ id: 'common.save', defaultMessage: 'Enregistrer' })}
              </Button>
            </div>
          )
        }
      >
        {drawerState && (
          <ProfileDrawerForm
            mode={drawerState.mode}
            profileId={drawerState.profileId}
            formId={drawerState.mode === 'create' ? 'profile-create-form' : 'profile-edit-form'}
            onSuccess={() => {
              closeDrawer();
              refetch();
            }}
          />
        )}
      </AppDrawer>
    </>
  );
};

ProfilesPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProfilesPage;

// Profile Form Component
interface ProfileDrawerFormProps {
  mode: 'create' | 'edit';
  profileId?: string;
  formId: string;
  onSuccess: () => void;
}

interface ProfileFormData {
  name: string;
  description: string;
  [key: string]: string; // For dynamic permission fields like 'permission_offers', 'permission_users', etc.
}

function ProfileDrawerForm({ mode, profileId, formId, onSuccess }: ProfileDrawerFormProps) {
  const intl = useIntl();
  const { showToast } = useToast();
  const { 
    useGetProfile, 
    useCreateProfile, 
    useUpdateProfile,
    useListModules,
    useListPermissionLevels 
  } = useProfilesApi();
  
  const { data: profileData, isLoading: profileLoading } = useGetProfile(profileId || '');
  const { data: modulesData, isLoading: modulesLoading } = useListModules();
  const { data: levelsData, isLoading: levelsLoading } = useListPermissionLevels();
  
  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();

  const modules = modulesData?.modules || [];
  const permissionLevels = levelsData?.levels || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && profileData) {
      const formValues: ProfileFormData = {
        name: profileData.name,
        description: profileData.description || '',
      };
      
      // Set permission values for each module
      profileData.permissions.forEach((perm) => {
        formValues[`permission_${perm.module}`] = perm.level;
      });
      
      reset(formValues);
    } else if (mode === 'create') {
      // Reset to empty values for create mode
      const formValues: ProfileFormData = {
        name: '',
        description: '',
      };
      
      // Initialize all permissions to empty string
      modules.forEach((module) => {
        formValues[`permission_${module.key}`] = '';
      });
      
      reset(formValues);
    }
  }, [mode, profileData, reset, modules]);

  const onSubmit = (formData: ProfileFormData) => {
    // Extract permissions from form data
    const permissions = modules
      .map((module) => ({
        module: module.key,
        level: formData[`permission_${module.key}`] || '',
      }))
      .filter((p) => p.level !== ''); // Only include permissions with a level set

    const data = {
      name: formData.name,
      description: formData.description,
      permissions,
    };

    if (mode === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          showToast({
            type: 'success',
            message: intl.formatMessage({ id: 'profiles.created', defaultMessage: 'Profil créé avec succès' }),
          });
          onSuccess();
        },
        onError: () => {
          showToast({
            type: 'error',
            message: intl.formatMessage({ id: 'profiles.createError', defaultMessage: 'Erreur lors de la création du profil' }),
          });
        },
      });
    } else if (profileId) {
      updateMutation.mutate(
        { id: profileId, data },
        {
          onSuccess: () => {
            showToast({
              type: 'success',
              message: intl.formatMessage({ id: 'profiles.updated', defaultMessage: 'Profil mis à jour avec succès' }),
            });
            onSuccess();
          },
          onError: () => {
            showToast({
              type: 'error',
              message: intl.formatMessage({ id: 'profiles.updateError', defaultMessage: 'Erreur lors de la mise à jour du profil' }),
            });
          },
        }
      );
    }
  };

  if (mode === 'edit' && profileLoading) {
    return <div className="p-6">{intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}</div>;
  }

  if (mode === 'edit' && profileLoading) {
    return <div className="p-6">{intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}</div>;
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        name="name"
        control={control}
        label={intl.formatMessage({ id: 'profiles.name', defaultMessage: 'Nom' })}
        placeholder={intl.formatMessage({ id: 'profiles.namePlaceholder', defaultMessage: 'Entrez le nom du profil' })}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
      />

      <Textarea
        name="description"
        control={control}
        label={intl.formatMessage({ id: 'profiles.description', defaultMessage: 'Description' })}
        placeholder={intl.formatMessage({ id: 'profiles.descriptionPlaceholder', defaultMessage: 'Entrez une description' })}
        rows={3}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
      />

      <div>
        <h3 className="font-semibold mb-3 text-black dark:text-white">
          {intl.formatMessage({ id: 'profiles.permissions', defaultMessage: 'Permissions' })}
        </h3>
        {modulesLoading || levelsLoading ? (
          <p className="text-gray-500">
            {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
          </p>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <div key={module.key} className="flex items-center justify-between gap-4">
                <span className="font-medium text-black dark:text-white flex-shrink-0 w-32">
                  {module.label}
                </span>
                <div className="flex-grow">
                  <CustomSelect
                    name={`permission_${module.key}`}
                    control={control}
                    label=""
                    placeholder={intl.formatMessage({ id: 'profiles.selectAccess', defaultMessage: 'Sélectionner un accès' })}
                    items={permissionLevels}
                    getKey={(level) => level.key}
                    getLabel={(level) => level.label}
                    variant="bordered"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
