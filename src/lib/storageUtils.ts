import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface StorageItem {
  path: string;
  bucket: string;
  created_at: string;
  expires_at?: string;
}

export const validateMediaUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating media URL:', error);
    return false;
  }
};

export const getMediaFallbackUrl = (type: 'image' | 'video'): string => {
  const fallbacks = {
    image: '/assets/placeholders/image-placeholder.png',
    video: '/assets/placeholders/video-placeholder.mp4'
  };
  return fallbacks[type];
};

export const cleanupExpiredMedia = async (bucket: string): Promise<void> => {
  try {
    const { data: items, error: listError } = await supabase.storage
      .from(bucket)
      .list();

    if (listError) throw listError;

    const now = new Date();
    const expiredItems = items.filter(item => {
      if (!item.metadata?.expires_at) return false;
      const expiryDate = new Date(item.metadata.expires_at);
      return expiryDate < now;
    });

    if (expiredItems.length === 0) return;

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove(expiredItems.map(item => item.name));

    if (deleteError) throw deleteError;

    // Update database records if needed
    if (bucket === 'generated_videos') {
      await supabase
        .from('generated_videos')
        .update({ status: 'expired' })
        .in('video_url', expiredItems.map(item => item.name));
    }
  } catch (error) {
    console.error('Error cleaning up expired media:', error);
    throw error;
  }
};

export const setMediaExpiry = async (
  bucket: string,
  path: string,
  expiryDate: Date
): Promise<void> => {
  try {
    const { data: existingFile } = await supabase.storage
      .from(bucket)
      .download(path);

    if (!existingFile) throw new Error('File not found');

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, existingFile, {
        upsert: true,
        metadata: {
          expires_at: expiryDate.toISOString()
        }
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error setting media expiry:', error);
    throw error;
  }
};

export const useMediaUrl = (url: string, type: 'image' | 'video') => {
  const [validUrl, setValidUrl] = useState(url);

  useEffect(() => {
    const checkValidity = async () => {
      const isValid = await validateMediaUrl(url);
      setValidUrl(isValid ? url : getMediaFallbackUrl(type));
    };

    checkValidity();
  }, [url, type]);

  return validUrl;
};

export const uploadMedia = async (
  file: File,
  bucket: string,
  path?: string,
  expiryDays?: number
): Promise<string> => {
  try {
    const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filePath = `${fileName}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    if (expiryDays) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      await setMediaExpiry(bucket, filePath, expiryDate);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}; 