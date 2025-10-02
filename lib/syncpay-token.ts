// SYNCPAY Native Token System
// Implements tokenomics with staking rewards, fee discounts, and governance

export interface SyncPayToken {
  id: string;
  symbol: 'SyncPay';
  name: 'Sync Payment Token';
  totalSupply: number;
  circulatingSupply: number;
  price: number;
  marketCap: number;
  network: 'starknet';
  contractAddress: string;
}

export interface UserTokenBalance {
  userId: string;
  balance: number;
  stakedAmount: number;
  stakingRewards: number;
  totalEarned: number;
  lastUpdated: string;
}

export interface StakingPool {
  id: string;
  name: string;
  apy: number; // Annual Percentage Yield
  minimumStake: number;
  lockPeriod: number; // in days
  totalStaked: number;
  isActive: boolean;
  createdAt: string;
}

export interface StakingPosition {
  id: string;
  userId: string;
  poolId: string;
  amount: number;
  apy: number;
  lockPeriod: number;
  startDate: string;
  endDate: string;
  rewards: number;
  isActive: boolean;
  createdAt: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votingPower: number;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface FeeDiscount {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  syncpayRequired: number;
  discountPercentage: number;
  benefits: string[];
}

export class SyncPayTokenSystem {
  private token: SyncPayToken;
  private userBalances: UserTokenBalance[] = [];
  private stakingPools: StakingPool[] = [];
  private stakingPositions: StakingPosition[] = [];
  private governanceProposals: GovernanceProposal[] = [];
  private feeDiscounts: FeeDiscount[] = [];

  constructor() {
    this.token = {
      id: 'syncpay',
      symbol: 'SyncPay',
      name: 'Sync Payment Token',
      totalSupply: 1000000000, // 1 billion tokens
      circulatingSupply: 500000000, // 500 million in circulation
      price: 0.25, // $0.25 per token
      marketCap: 125000000, // $125M market cap
      network: 'starknet',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
    };

    this.initializeStakingPools();
    this.initializeFeeDiscounts();
  }

  /**
   * Get user's XPAY token balance
   */
  getUserBalance(userId: string): UserTokenBalance | null {
    return this.userBalances.find(balance => balance.userId === userId) || null;
  }

  /**
   * Initialize user's XPAY balance
   */
  initializeUserBalance(userId: string, initialBalance: number = 0): UserTokenBalance {
    const existingBalance = this.getUserBalance(userId);
    if (existingBalance) {
      return existingBalance;
    }

    const balance: UserTokenBalance = {
      userId,
      balance: initialBalance,
      stakedAmount: 0,
      stakingRewards: 0,
      totalEarned: 0,
      lastUpdated: new Date().toISOString()
    };

    this.userBalances.push(balance);
    return balance;
  }

  /**
   * Transfer XPAY tokens between users
   */
  async transferTokens(fromUserId: string, toUserId: string, amount: number): Promise<boolean> {
    const fromBalance = this.getUserBalance(fromUserId);
    const toBalance = this.getUserBalance(toUserId);

    if (!fromBalance || fromBalance.balance < amount) {
      throw new Error('Insufficient XPAY balance');
    }

    // Update sender balance
    fromBalance.balance -= amount;
    fromBalance.lastUpdated = new Date().toISOString();

    // Update or create receiver balance
    if (toBalance) {
      toBalance.balance += amount;
      toBalance.lastUpdated = new Date().toISOString();
    } else {
      this.initializeUserBalance(toUserId, amount);
    }

    return true;
  }

  /**
   * Stake XPAY tokens
   */
  async stakeTokens(
    userId: string,
    poolId: string,
    amount: number
  ): Promise<StakingPosition> {
    const userBalance = this.getUserBalance(userId);
    const pool = this.stakingPools.find(p => p.id === poolId);

    if (!userBalance || userBalance.balance < amount) {
      throw new Error('Insufficient XPAY balance');
    }

    if (!pool || !pool.isActive) {
      throw new Error('Invalid or inactive staking pool');
    }

    if (amount < pool.minimumStake) {
      throw new Error(`Minimum stake amount is ${pool.minimumStake} XPAY`);
    }

    // Create staking position
    const position: StakingPosition = {
      id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      poolId,
      amount,
      apy: pool.apy,
      lockPeriod: pool.lockPeriod,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + pool.lockPeriod * 24 * 60 * 60 * 1000).toISOString(),
      rewards: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Update user balance
    userBalance.balance -= amount;
    userBalance.stakedAmount += amount;
    userBalance.lastUpdated = new Date().toISOString();

    // Update pool
    pool.totalStaked += amount;

    this.stakingPositions.push(position);
    return position;
  }

  /**
   * Calculate staking rewards
   */
  calculateStakingRewards(positionId: string): number {
    const position = this.stakingPositions.find(p => p.id === positionId);
    if (!position || !position.isActive) return 0;

    const now = new Date();
    const startDate = new Date(position.startDate);
    const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const dailyRate = position.apy / 365 / 100;
    const rewards = position.amount * dailyRate * daysStaked;
    
    return Math.max(0, rewards);
  }

  /**
   * Claim staking rewards
   */
  async claimRewards(positionId: string): Promise<number> {
    const position = this.stakingPositions.find(p => p.id === positionId);
    if (!position || !position.isActive) {
      throw new Error('Invalid or inactive staking position');
    }

    const rewards = this.calculateStakingRewards(positionId);
    if (rewards <= 0) {
      throw new Error('No rewards to claim');
    }

    // Update position
    position.rewards += rewards;
    position.startDate = new Date().toISOString(); // Reset for next calculation

    // Update user balance
    const userBalance = this.getUserBalance(position.userId);
    if (userBalance) {
      userBalance.balance += rewards;
      userBalance.stakingRewards += rewards;
      userBalance.totalEarned += rewards;
      userBalance.lastUpdated = new Date().toISOString();
    }

    return rewards;
  }

  /**
   * Get fee discount based on XPAY holdings
   */
  getFeeDiscount(userId: string): FeeDiscount | null {
    const userBalance = this.getUserBalance(userId);
    if (!userBalance) return null;

    const totalHoldings = userBalance.balance + userBalance.stakedAmount;
    
    // Find the highest tier the user qualifies for
    const availableTiers = this.feeDiscounts
      .filter(tier => totalHoldings >= tier.syncpayRequired)
      .sort((a, b) => b.discountPercentage - a.discountPercentage);

    return availableTiers[0] || null;
  }

  /**
   * Apply fee discount to a transaction
   */
  applyFeeDiscount(originalFee: number, userId: string): number {
    const discount = this.getFeeDiscount(userId);
    if (!discount) return originalFee;

    const discountAmount = originalFee * (discount.discountPercentage / 100);
    return Math.max(0, originalFee - discountAmount);
  }

  /**
   * Create a governance proposal
   */
  async createProposal(
    proposer: string,
    title: string,
    description: string,
    votingPower: number
  ): Promise<GovernanceProposal> {
    const proposal: GovernanceProposal = {
      id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      proposer,
      votingPower,
      votesFor: 0,
      votesAgainst: 0,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdAt: new Date().toISOString()
    };

    this.governanceProposals.push(proposal);
    return proposal;
  }

  /**
   * Vote on a governance proposal
   */
  async voteOnProposal(
    proposalId: string,
    userId: string,
    vote: 'for' | 'against',
    votingPower: number
  ): Promise<boolean> {
    const proposal = this.governanceProposals.find(p => p.id === proposalId);
    if (!proposal || proposal.status !== 'active') {
      throw new Error('Proposal not found or not active');
    }

    if (new Date(proposal.endDate) < new Date()) {
      throw new Error('Voting period has ended');
    }

    if (vote === 'for') {
      proposal.votesFor += votingPower;
    } else {
      proposal.votesAgainst += votingPower;
    }

    return true;
  }

  /**
   * Initialize staking pools
   */
  private initializeStakingPools(): void {
    this.stakingPools = [
      {
        id: 'pool_30d',
        name: '30-Day Staking Pool',
        apy: 12, // 12% APY
        minimumStake: 1000,
        lockPeriod: 30,
        totalStaked: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pool_90d',
        name: '90-Day Staking Pool',
        apy: 18, // 18% APY
        minimumStake: 5000,
        lockPeriod: 90,
        totalStaked: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pool_365d',
        name: '365-Day Staking Pool',
        apy: 25, // 25% APY
        minimumStake: 10000,
        lockPeriod: 365,
        totalStaked: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Initialize fee discount tiers
   */
  private initializeFeeDiscounts(): void {
    this.feeDiscounts = [
      {
        tier: 'bronze',
        syncpayRequired: 1000,
        discountPercentage: 5,
        benefits: ['5% fee discount', 'Basic support']
      },
      {
        tier: 'silver',
        syncpayRequired: 5000,
        discountPercentage: 10,
        benefits: ['10% fee discount', 'Priority support', 'Early access to features']
      },
      {
        tier: 'gold',
        syncpayRequired: 25000,
        discountPercentage: 20,
        benefits: ['20% fee discount', 'VIP support', 'Exclusive features', 'Governance voting']
      },
      {
        tier: 'platinum',
        syncpayRequired: 100000,
        discountPercentage: 30,
        benefits: ['30% fee discount', 'Dedicated support', 'All features', 'Enhanced governance voting']
      }
    ];
  }

  /**
   * Get all staking pools
   */
  getStakingPools(): StakingPool[] {
    return this.stakingPools.filter(pool => pool.isActive);
  }

  /**
   * Get user's staking positions
   */
  getUserStakingPositions(userId: string): StakingPosition[] {
    return this.stakingPositions.filter(position => position.userId === userId);
  }

  /**
   * Get active governance proposals
   */
  getActiveProposals(): GovernanceProposal[] {
    return this.governanceProposals.filter(proposal => proposal.status === 'active');
  }

  /**
   * Get token information
   */
  getTokenInfo(): SyncPayToken {
    return this.token;
  }
}

// Export singleton instance
export const syncpayTokenSystem = new SyncPayTokenSystem();
