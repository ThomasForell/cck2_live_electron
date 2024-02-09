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
    result_team_groups: boolean
    result_team_combined: boolean
    result_single_groups: boolean
    result_single_combined: boolean
}

export interface SingleConfig {
    match_day: number
    num_match_days: number
    cck2_output_files: string
    data_path: string
    player_data: string
    result_single_groups: boolean
    result_single_combined: boolean
}