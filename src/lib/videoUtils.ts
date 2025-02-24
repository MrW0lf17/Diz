import { supabase } from './supabase';

export interface GeneratedVideo {
  id: string;
  prompt: string;
  video_url: string;
  type: 'text-to-video' | 'image-to-video' | 'lipsync';
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  user_id: string;
  metadata?: Record<string, any>;
}

export const saveGeneratedVideo = async (
  prompt: string,
  videoUrl: string,
  type: GeneratedVideo['type'],
  metadata?: Record<string, any>
): Promise<GeneratedVideo> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('generated_videos')
    .insert([{
      prompt,
      video_url: videoUrl,
      type,
      status: 'completed',
      user_id: user.id,
      metadata,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving video:', error);
    throw error;
  }

  return data;
};

export const getUserVideos = async (
  type?: GeneratedVideo['type']
): Promise<GeneratedVideo[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  let query = supabase
    .from('generated_videos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user videos:', error);
    throw error;
  }

  return data || [];
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get video details first
  const { data: video, error: fetchError } = await supabase
    .from('generated_videos')
    .select('video_url')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    console.error('Error fetching video:', fetchError);
    throw fetchError;
  }

  if (!video) throw new Error('Video not found');

  // Delete from storage
  const videoPath = video.video_url.split('/').pop();
  if (videoPath) {
    const { error: storageError } = await supabase.storage
      .from('generated_videos')
      .remove([videoPath]);

    if (storageError) {
      console.error('Error deleting video from storage:', storageError);
      throw storageError;
    }
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('generated_videos')
    .delete()
    .eq('id', videoId)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Error deleting video record:', deleteError);
    throw deleteError;
  }
};

export const updateVideoStatus = async (
  videoId: string,
  status: GeneratedVideo['status'],
  error?: string
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error: updateError } = await supabase
    .from('generated_videos')
    .update({
      status,
      ...(error && { metadata: { error } })
    })
    .eq('id', videoId)
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Error updating video status:', updateError);
    throw updateError;
  }
}; 