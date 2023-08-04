
export interface TeamConfig {
    bild_heim: string;
    bild_gast: string;
    anzahl_spieler: number;
    anzahl_saetze: number;
    satzpunkte_anzeigen: string;
    token_datei: string;
    token_bahn: string;
    anzeigedauer_s: number;
    anzahl_bahnen: number;
};

export interface AdvConfig {
    bild: string;
    anzeigedauer_s: number;
};

export interface LiveConfig {
    teams: Array<TeamConfig>;
    werbung: Array<AdvConfig>;
};