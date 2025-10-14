import xml.etree.ElementTree as ET

def generate_game_matrix(game_teams, num_teams, num_sets_per_player, num_heats, block_size, add_settings_heat):
    player_in_team_count = [0] * num_teams
    num_lanes = len(game_teams[0])
    game_matrix = []
    num_sets_total = num_sets_per_player * num_heats
    num_heats_extra = 0
    if add_settings_heat:
        num_heats_extra = (num_teams - 1) // num_lanes + 1
 
    # create empty game_matrix
    for i in range(num_sets_total + num_heats_extra):
        game_matrix.append([None] * len(game_teams[0]))
    
    row = 0

    # extra singel set heat for settings (DM Senioren)
    if add_settings_heat:
        for extra_heat in range(num_heats_extra):
            for i, team in enumerate(game_teams[extra_heat]):
                game_matrix[row][i] = (team, player_in_team_count[team])
                player_in_team_count[team] += 1
            row += 1

    for heat in range(num_heats):
        # first row
        for i, team in enumerate(game_teams[heat]):
            game_matrix[row][i] = (team, player_in_team_count[team])
            player_in_team_count[team] += 1
        row += 1
        for i in range(num_lanes // 2):  # swap partner
            game_matrix[row][i * 2] = game_matrix[row - 1][i * 2 + 1]
            game_matrix[row][i * 2 + 1] = game_matrix[row - 1][i * 2]
        row += 1
        if num_sets_per_player > 2:
            for i in range(num_lanes // block_size):
                for j in range(block_size):
                    game_matrix[row][i * block_size + j] = game_matrix[row - 1][i * block_size + (j + block_size - 2) % block_size]
            row += 1            
            for i in range(num_lanes // 2):  # swap partner
                game_matrix[row][i * 2] = game_matrix[row - 1][i * 2 + 1]
                game_matrix[row][i * 2 + 1] = game_matrix[row - 1][i * 2]
            row += 1

    return game_matrix

def load_game_setup(path):
    game_setup = []
    team_mapping = dict()
    team_counter = 0
    with open(path) as f:
        l = f.readline()
        row = []
        for t in l.split(";"):
            team = 0
            if t in team_mapping.keys:
                team = team_mapping[t]
            else:
                team_mapping[t] = team_counter
                team_counter += 1
            row.append(team)
        game_setup.append[row]

def heat(no, team, player, all, clear, time):
    h = ET.Element('Durchgang{}'.format(no))
    ET.SubElement(h, 'MS').text = '{}'.format(team)
    ET.SubElement(h, 'SP').text = '{}'.format(player)
    ET.SubElement(h, 'Volle').text = '{}'.format(all)
    ET.SubElement(h, 'Abräumer').text = '{}'.format(clear)
    ET.SubElement(h, 'Zeit').text = '{}'.format(time)
    return h

# all settings

num_teams = 20
num_players = 4
num_sets_per_player = 4
num_all = 15
num_clear = 15
num_time = 12
num_lanes = 8
block_size = 4
add_settings_heat = False

# game_teams = [[0, 1, 2, 3, 0, 1, 2, 3], [3, 2, 1, 0, 3, 2, 1, 0], [0, 1, 2, 3, 0, 1, 2, 3]]
# game_teams = [[0, 1, 2, 3, 4, 5]]
# game_teams = [[0, 1, 0, 1, 0, 1]]
# game_teams = [[0, 1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]]

game_teams = load_game_setup("C:\\Users\\thomas\\OneDrive\\SKV Lorsch Shared\\02 Veranstaltungen\\2025-09 Ländervergleich U19\\Startplan.csv")

wks = ET.Element('WKS')
ET.SubElement(wks, 'Name').text = 'U19 Ländervergleich'
ET.SubElement(wks, 'Verfuegbar').text = '1'
ET.SubElement(wks, 'AnzahlMannschaften').text = '{}'.format(num_teams)
ET.SubElement(wks, 'AnzahlSpieler').text = '{}'.format(num_players)
ET.SubElement(wks, 'VolleAlsAbräumer').text = '0'
lanes = ET.SubElement(wks, 'Bahnen')

num_heats = (num_players * num_teams) // num_lanes

game_matrix = generate_game_matrix(game_teams, num_teams, num_sets_per_player, num_heats, block_size, add_settings_heat)

for l in range(num_lanes):
    lane = ET.Element('Bahn{}'.format(l))
    for h, row in enumerate(game_matrix):
        if add_settings_heat and h <= (num_teams - 1) // num_lanes:
            lane.append(heat(h, row[l][0], row[l][1], 1, 1, 1))
        else:
            lane.append(heat(h, row[l][0], row[l][1], num_all, num_clear, num_time))
    lanes.append(lane)

ET.indent(wks, '  ')
tree = ET.ElementTree(element=wks)
tree.write("C:\\Users\\thomas\\OneDrive\\SKV Lorsch Shared\\02 Veranstaltungen\\2025-09 Ländervergleich U19\\Startplan.wks", encoding='utf-8', xml_declaration=True)
