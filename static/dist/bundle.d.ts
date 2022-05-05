declare module "modules/assets" {
    const enemySelectionLibrary: string[];
    const enemySelectionTeamsLibrary: string[];
    const tanks: string[];
    const roundBg: string[];
    const enemyDivisionNames: string[];
    const defeatBackgrounds: string[];
    const sound: {
        rifle1: HTMLAudioElement;
        battleSound: HTMLAudioElement;
        garand: HTMLAudioElement;
        enfield: HTMLAudioElement;
        whack: HTMLAudioElement;
        thud: HTMLAudioElement;
        reloadSound: HTMLAudioElement;
        empty: HTMLAudioElement;
        deathmoan: HTMLAudioElement;
        defeatedSound: HTMLAudioElement;
        victorySound: HTMLAudioElement;
        introMusic: HTMLAudioElement;
    };
    export { roundBg, defeatBackgrounds, enemyDivisionNames, enemySelectionLibrary, enemySelectionTeamsLibrary, sound, tanks, };
}
declare module "types" {
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
}
declare module "modules/helpers" {
    import { DifficultyBounds } from "types";
    class Helpers {
        uuid(): string;
        randomInt(n: number): number;
        woundTable(key: string): any;
        difficultyBounds(): DifficultyBounds;
        logTest(): void;
        /**
         *
         * @param {node} object - The node being appended to the base
         * @param {string} identifier - string identifier
         * @returns base - the composed html element.
         */
        generateItem(object: any, identifier: any): HTMLElement;
        generateSpawnLocation(): {
            top: string;
            left: string;
        };
        getValidTargets(): string[];
        isValidTarget(target: any): boolean;
    }
    export default Helpers;
}
declare module "modules/icons" {
    class Icon {
        make(classes: string): HTMLElement;
        getAll(): {
            plus: string;
            eraser: string;
            folder: string;
            stop_watch: string;
            redo: string;
            coins: string;
            skull: string;
            stack: string;
            play: string;
            medal: string;
        };
    }
    export default Icon;
}
declare module "modules/upgrade" {
    import Helpers from "modules/helpers";
    import Icon from "modules/icons";
    class Upgrade {
        _helper: Helpers;
        _icon: Icon;
        getUpgradeCard(upgradeConfig: any): any;
        getWrapperHtml(): any;
    }
    export default Upgrade;
}
declare module "modules/memory" {
    class Memory {
        id: string;
        read(): any;
        save(state: any): void;
    }
    export default Memory;
}
declare module "script" { }
