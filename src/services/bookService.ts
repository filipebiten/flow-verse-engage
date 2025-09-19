import {supabase} from "@/integrations/supabase/client.ts";

export const uploadBookPhoto = async (bookId: string, bookFile: File) => {
    if (!bookFile)
        return null;

    const fileExt = bookFile.name.split('.').pop();
    const fileName = `${bookId}.${fileExt}`;

    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('booksPhotos')
        .upload(filePath, bookFile);

    if (uploadError) {
        return null;
    }

    const { data } = supabase.storage
        .from('booksPhotos')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const deleteBookPhoto = async (photoName: string) => {

    const { error: deleteError } = await supabase.storage
        .from('booksPhotos').remove([photoName]);

    if (deleteError) {
        throw deleteError;
    }
}