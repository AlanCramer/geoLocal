CREATE TABLE IF NOT EXISTS roads (
    id INTEGER PRIMARY KEY,  -- OSM Way ID
    name TEXT,
    tags TEXT
);

CREATE TABLE IF NOT EXISTS nodes (
    id INTEGER PRIMARY KEY,  -- OSM Node ID
    lat REAL,
    lon REAL
);

CREATE TABLE IF NOT EXISTS way_nodes (
    way_id INTEGER,           -- Foreign key to roads table
    node_id INTEGER,          -- Foreign key to nodes table
    sequence INTEGER,         -- Order of the node in the way
    PRIMARY KEY (way_id, sequence),
    FOREIGN KEY (way_id) REFERENCES roads(id),
    FOREIGN KEY (node_id) REFERENCES nodes(id)
);

