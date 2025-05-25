import { useParams } from 'react-router-dom';
import UserStats from '@/components/dashboard/UserStats';

export default function ProfilePublic() {
  const { id } = useParams();
  return (
    <UserStats userId={id} />
  );
} 