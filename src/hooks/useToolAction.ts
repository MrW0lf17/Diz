import { useNavigate } from 'react-router-dom';
import { useCoins } from '../contexts/CoinContext';
import toast from 'react-hot-toast';
import { ToolPath } from '../contexts/CoinContext';

export const useToolAction = (toolPath: ToolPath) => {
  const { useCoinsForTool } = useCoins();
  const navigate = useNavigate();

  const handleToolAction = async () => {
    const hasAccess = await useCoinsForTool(toolPath);
    if (!hasAccess) {
      toast.error('Not enough coins for this tool');
      navigate('/dashboard?tab=market');
      return false;
    }
    return true;
  };

  return handleToolAction;
}; 