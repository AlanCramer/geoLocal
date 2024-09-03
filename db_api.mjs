import sqlite3 from 'sqlite3';
sqlite3.verbose();

// Initialize SQLite Database
const db = new sqlite3.Database('roads.db');

// Function to get roads from the database
function getRoadsFromDB(south, west, north, east) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT roads.id, roads.name, roads.tags, nodes.lat, nodes.lon
            FROM roads
            JOIN way_nodes ON roads.id = way_nodes.way_id
            JOIN nodes ON way_nodes.node_id = nodes.id
            WHERE nodes.lat BETWEEN ? AND ?
            AND nodes.lon BETWEEN ? AND ?
            ORDER BY way_nodes.sequence;
        `;
        db.all(sql, [south, north, west, east], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function storeRoadsInDB(roads) {
    console.log('Storing roads in DB:', roads);
    db.serialize(() => {
        const insertRoad = db.prepare(`INSERT INTO roads (id, name, tags) VALUES (?, ?, ?)`);
        const insertNode = db.prepare(`INSERT INTO nodes (id, lat, lon) VALUES (?, ?, ?)`);
        const insertWayNode = db.prepare(`INSERT INTO way_nodes (way_id, node_id, sequence) VALUES (?, ?, ?)`);

        roads.forEach(road => {
            insertRoad.run(road.id, road.name, JSON.stringify(road.tags), function(err) {
                if (err) {
                    console.error('Error inserting road:', err.message);
                }
            });

            road.nodes.forEach((node, index) => {
                insertNode.run(node.id, node.lat, node.lon, function(err) {
                    if (err) {
                        console.error('Error inserting node:', err.message);
                    }
                });
                insertWayNode.run(road.id, node.id, index, function(err) {
                    if (err) {
                        console.error('Error inserting way_node:', err.message);
                    }
                });
            });
        });

        insertRoad.finalize();
        insertNode.finalize();
        insertWayNode.finalize();
    });
}


export {
    getRoadsFromDB,
    storeRoadsInDB
};
