import { useNavigate } from 'react-router-dom';
import { useCoins, ToolPath } from '../contexts/CoinContext';
import toast from 'react-hot-toast';

export const useToolAction = (toolPath: string) => {
  const { useCoinsForTool } = useCoins();
  const navigate = useNavigate();

  const handleToolAction = async () => {
    console.log('useToolAction called with path:', toolPath);
    // Remove leading slash if present
    const normalizedPath = toolPath.replace(/^\//, '') as ToolPath;
    console.log('Normalized path:', normalizedPath);
    const hasAccess = await useCoinsForTool(normalizedPath);
    console.log('Has access:', hasAccess);
    if (!hasAccess) {
      toast.error('Not enough coins for this tool');
      navigate('/dashboard?tab=market');
      return false;
    }
    return true;
  };

  return handleToolAction;
}; 