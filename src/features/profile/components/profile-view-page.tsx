import { UserProfile } from '@clerk/nextjs';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center p-4'>
      <UserProfile />
    </div>
  );
}
