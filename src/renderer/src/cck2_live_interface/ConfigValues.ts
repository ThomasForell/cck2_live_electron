import { TeamsConfig } from './LiveConfig'
import { SprintConfig } from './LiveConfig'
import { SingleConfig } from './LiveConfig'
import { SetupConfig } from './LiveConfig'
import { AdvConfig } from './LiveConfig'
import { TeamConfig } from './LiveConfig'

export interface ConfigValues {
    setup: SetupConfig
    team: TeamConfig
    adv: AdvConfig
    single: SingleConfig
    sprint: SprintConfig
    teams: TeamsConfig
}
