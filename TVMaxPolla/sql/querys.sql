SELECT G.name, T.id_team,T.name  
FROM tvmax_polla_admin.group AS G 
INNER JOIN tvmax_polla_admin.group_has_team AS GT ON G.id_group = GT.id_group
INNER JOIN tvmax_polla_admin.team AS T ON T.id_team = GT.id_team
WHERE G.name LIKE '%g%';

SELECT G.name as _group, TA.name as home, Tb.name as visit, P.name, M.* 
FROM tvmax_polla_admin.match AS M
INNER JOIN tvmax_polla_admin.group AS G ON M.id_group = G.id_group
INNER JOIN tvmax_polla_admin.team AS TA ON TA.id_team = M.id_team_a
INNER JOIN tvmax_polla_admin.team AS TB ON TB.id_team = M.id_team_b
INNER JOIN tvmax_polla_admin.phase AS P ON P.id_phase = M.id_phase
WHERE G.name LIKE '%h%';