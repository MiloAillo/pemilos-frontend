import { z } from "zod";

/**
 * Schema for voter statistics data from /api/v1/admin/count
 * Represents the voting participation breakdown
 */
export const VoterStatsSchema = z.object({
  total: z.number(),
  voted: z.number(),
  notVoted: z.number(),
});

/**
 * Schema for vote status from /api/v1/admin/vote/status
 * Indicates whether voting is currently open or closed
 */
export const VoteStatusSchema = z.object({
  vote_status: z.boolean(),
});

// Export TypeScript types
export type VoterStatsType = z.infer<typeof VoterStatsSchema>;
export type VoteStatusType = z.infer<typeof VoteStatusSchema>;
