import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoins } from '../contexts/CoinContext';
import toast from 'react-hot-toast';

type ToolPath = 
  | '/ai-image-generation'
  | '/bg-remove'
  | '/gen-fill'
  | '/expand'
  | '/resize'
  | '/text-to-video'
  | '/image-to-video'
  | '/motion-brush'
  | '/lipsync'
  | '/market-analyst'
  | '/trend-catcher'
  | '/indicator-creator'
  | '/trading-signal'
  | '/ai-chat';

export const useToolCost = (toolPath: ToolPath) => {
  const navigate = useNavigate();
  const { useCoinsForTool } = useCoins();

  useEffect(() => {
    const checkToolAccess = async () => {
      const hasAccess = await useCoinsForTool(toolPath);
      if (!hasAccess) {
        toast.error('Not enough coins for this tool');
        navigate('/dashboard?tab=market');
      }
    };
    
    checkToolAccess();
  }, [toolPath, useCoinsForTool, navigate]);
}; 