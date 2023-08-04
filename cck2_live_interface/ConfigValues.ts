export interface ConfigValues {
    setup: {
        output_name: Array<string>;
        type: Array<string>;
        lanes: Array<boolean>;
        adv: Array<boolean>;
    };
    team: {
        name: Array<string>;
        time_values: Array<Array<number>>;
        logo_home: Array<string>;
        logo_guest: Array<string>;
        num_players: Array<string>;
        num_lanes: Array<string>;
        set_points: Array<boolean>;
        cck2_file: Array<string>;
    };
    adv: {
        name: Array<string>;
        time_values: Array<Array<number>>;
        logo: Array<string>;
    };
};
  