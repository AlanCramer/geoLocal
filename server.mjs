import express from 'express';
import fetch from 'node-fetch';
import { getRoadsFromDB, storeRoadsInDB } from './db_api.mjs';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/roads', async (req, res) => {
    console.log('Fetching roads from DB');
    const { south, west, north, east } = req.query;

    try {
        const roadsFromDB = await getRoadsFromDB(south, west, north, east);

        if (roadsFromDB.length > 0) {
            console.log('Roads from DB:', roadsFromDB.length);
            res.json(roadsFromDB);
        } else {
            console.log('No roads from DB, fetching from Overpass API');
            const bbox = `${south},${west},${north},${east}`;
            const query = `
            [out:json];
            (
                way["highway"](${bbox});
            );
            out geom;
            `;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();

            console.log('Fetched from Overpass:', data.elements.length);

            const transformedData = data.elements.map(way => ({
                id: way.id,
                name: way.tags.name || "Unnamed Road",
                tags: way.tags,
                nodes: way.geometry.map(point => ({
                    id: point.id,
                    lat: point.lat,
                    lon: point.lon
                }))
            }));

            storeRoadsInDB(transformedData);

            res.json(transformedData);
        }
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
