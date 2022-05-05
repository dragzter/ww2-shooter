export interface UpgradeConfig {
  reloadUpgrade: UpgradeDetail;
  speedUpgrade: UpgradeDetail;
  capacityUpgrade: UpgradeDetail;
}

export interface UpgradeDetail {
  level: number;
  type: string;
  cost: number;
  value: number;
  max_level: number;
}

export interface SpawnConfig {
  teasy: SpawnDetails;
  easy: SpawnDetails;
  medium: SpawnDetails;
  hard: SpawnDetails;
  epic: SpawnDetails;
}

export interface SpawnDetails {
  enemySpeed: number;
  waveCount: number;
  enemySpawnFrequency: number;
  playerDamageTaken: number;
  pointsEarned: number;
  troopers: number;
  teams: number;
}

export interface CustomHTML extends HTMLElement {
  value: any;
  style: any;
}

export interface DifficultyBoundsDetail {
  speed: number;
  spawnRate: number;
  count: number;
  teams: number;
}

export interface DifficultyBounds {
  teasy: DifficultyBoundsDetail;
  easy: DifficultyBoundsDetail;
  medium: DifficultyBoundsDetail;
  hard: DifficultyBoundsDetail;
  epic: DifficultyBoundsDetail;
}
