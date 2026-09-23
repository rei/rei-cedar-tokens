export type CedarTokenTier = 'primitive' | 'semantic' | 'component';
export type CedarTokenStatus = 'stable' | 'experimental' | 'deprecated';

export interface CedarTokenBadge {
  label: string;
  tone?: CedarTokenStatus | 'info';
}

export interface CedarTokenMeta {
  source?: string;
  lastChanged?: string;
  badges?: CedarTokenBadge[];
  figmaCollection?: string;
  figmaVariable?: string;
  consumerNotes?: string;
  usageSummary?: string;
}

export interface CedarToken {
  name: string;
  value: string;
  alias?: string;
  description?: string;
  tier: CedarTokenTier;
  status: CedarTokenStatus;
  platforms: {
    web: string;
    ios: string;
    android: string;
  };
  usedBy?: string[];
  meta?: CedarTokenMeta;
}

export const tokenTypeVersion = '1';
