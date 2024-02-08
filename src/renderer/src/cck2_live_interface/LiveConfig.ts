export interface TeamConfig {
    bild_heim: string
    bild_gast: string
    anzahl_spieler: number
    anzahl_saetze: number
    satzpunkte_anzeigen: string
    token_datei: string
    bahn_anzeigen: boolean
    anzeigedauer_s: number
    anzahl_bahnen: number
}

export interface AdvConfig {
    werbung_anzeigen: boolean
    bild: string
    anzeigedauer_s: number
}

export interface LiveConfig {
    teams: Array<TeamConfig>
    werbung: Array<AdvConfig>
}

export interface TeamsConfig {
    cck2_output_files: string
    data_path: string
    player_data: string
    additional_data: string   
}