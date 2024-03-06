export interface LiveTeamConfig {
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

export interface LiveAdvConfig {
    werbung_anzeigen: boolean
    bild: string
    anzeigedauer_s: number
}

export interface LiveConfig {
    teams: LiveTeamConfig[]
    werbung: LiveAdvConfig[]
}

export interface TeamConfig {
    name: string[]
    time_values: number[][]
    logo_home: string[]
    logo_guest: string[]
    num_players: string[]
    num_lanes: string[]
    set_points: boolean[]
    cck2_file: string[]
}

export const DefaultTeamConfig = {
    name: ['1. Mannschaft'],
    time_values: [[0, 0]],
    logo_home: ['Default Heim.png'],
    logo_guest: ['Default Gast.png'],
    num_players: ['6'],
    num_lanes: ['6'],
    set_points: [true],
    cck2_file: ['team1.json']
}

export interface AdvConfig {
    name: string[]
    time_values: number[][]
    logo: string[]
}

export const DefaultAdvConfig: AdvConfig = {
    name: ['KC Lorsch Display', 'KC Lorsch Stream'],
    time_values: [
        [20, 0],
        [0, 20]
    ],
    logo: ['kc-lorsch.png', 'stream-kc-lorsch.png']
}

export interface SetupConfig {
    output_name: string[]
    output_file: string[]
    type: string[]
    lanes: boolean[]
    adv: boolean[]
    cck2_output_path: string
    active_output: string
}

export const DefaultSetupConfig: SetupConfig = {
    output_name: ['Livestream', 'TVLinks'],
    output_file: ['livestream.json', 'tvlinks.json'],
    type: ['stream', 'display'],
    lanes: [true, false],
    adv: [true, true],
    cck2_output_path: '',
    active_output: 'league'
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

export const DefaultSingleConfig: SingleConfig = {
    match_day: 1,
    num_match_days: 1,
    cck2_output_files: 'result.json',
    data_path: '',
    player_data: 'spieler.csv',
    result_single_groups: true,
    result_single_combined: false
}

export interface SprintConfig {
    num_players: number
    num_groups: number
    qualification: boolean
    place_3: boolean
    finale_4: boolean
    cck2_output_files: string
    data_path: string
    player_data: string
}

export const DefaultSprintConfig: SprintConfig = {
    num_players: 16,
    num_groups: 2,
    qualification: true,
    place_3: false,
    finale_4: false,
    cck2_output_files: 'result.json',
    data_path: '',
    player_data: 'spieler.csv'
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

export const DefaultTeamsConfig: TeamsConfig = {
    cck2_output_files: 'result.json',
    data_path: '',
    player_data: 'spieler.csv',
    additional_data: '',
    result_team_groups: true,
    result_team_combined: false,
    result_single_groups: false,
    result_single_combined: false
}
