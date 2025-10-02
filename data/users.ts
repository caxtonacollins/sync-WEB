import { User, UserRole, AccountStatus, VerificationStatus } from './types';

export const users: User[] = [
  {
    id: 'fe24fc56-d124-43f2-bfc2-6d7981c797cd',
    email: 'alex.johnson@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: UserRole.USER,
    status: AccountStatus.ACTIVE,
    verificationStatus: VerificationStatus.VERIFIED,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-09-25T11:00:00Z',
  },
  {
    id: 'a8b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
    email: 'sarah.w@example.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: UserRole.ADMIN,
    status: AccountStatus.ACTIVE,
    verificationStatus: VerificationStatus.VERIFIED,
    createdAt: '2023-02-20T14:15:00Z',
    updatedAt: '2023-09-24T18:30:00Z',
  },
  {
    id: 'f1e2d3c4-b5a6-f7e8-d9c0-b1a2f3e4d5c6',
    email: 'michael.c@example.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: UserRole.USER,
    status: AccountStatus.SUSPENDED,
    verificationStatus: VerificationStatus.PENDING,
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-09-20T12:00:00Z',
  }
];

export const currentUserId = 'fe24fc56-d124-43f2-bfc2-6d7981c797cd'; // Alex Johnson

export const getCurrentUser = () => users.find(u => u.id === currentUserId);

