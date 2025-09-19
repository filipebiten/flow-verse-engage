import {supabase} from "@/integrations/supabase/client.ts";

export const uploadProfilePhoto = async (userId: string, profilePhoto: File) => {
    if (!profilePhoto) return null;

    const fileExt = profilePhoto.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;

    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profilePhoto);

    if (uploadError) {
        return null;
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const deleteProfilePhoto = async (photoName: string) => {

    const { error: deleteError } = await supabase.storage
        .from('avatars').remove([photoName]);

    if (deleteError) {
        throw deleteError;
    }
}