import { useEffect, useState, useMemo } from 'react';
import ProfileImage from '../NavBar/ProfileImage';
import {
    formatDate,
    formatDuration,
    formatDistance,
    formatCarbon,
    formatTransport,
} from '../BackOffice/HelperFunction';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import TerrainIcon from '@mui/icons-material/Terrain';
import EcoIcon from '@mui/icons-material/ElectricCarOutlined';
import TransportIcon from '@mui/icons-material/DirectionsBus';
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
} from '@vis.gl/react-google-maps';
import { Paper, Grid, Typography } from '@mui/material';
import { Treap } from '../../types/TreapType';
import { PointType } from '../../types/PointType';
import { useNavigate } from 'react-router-dom';

const API_KEY = "AIzaSyB89u6PHtghA9juQAJazzuk7Y1wZMugkc4"; // TODO: Api key not exposed

function Directions({ origin, middle, destination }: { origin: string; middle: PointType[]; destination: string }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, _] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    const originT = useMemo(() => ({
        lat: parseFloat(origin.split(",")[0]),
        lng: parseFloat(origin.split(",")[1]),
    }), [origin]);

    const destinationT = useMemo(() => ({
        lat: parseFloat(destination.split(",")[0]),
        lng: parseFloat(destination.split(",")[1]),
    }), [destination]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        const service = new routesLibrary.DirectionsService();
        const renderer = new routesLibrary.DirectionsRenderer({ map });
        setDirectionsService(service);
        setDirectionsRenderer(renderer);
        return () => renderer.setMap(null);
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService
            .route({
                origin: originT,
                waypoints: middle.length > 0 ? middle.map(point => ({ location: new google.maps.LatLng(point.latitude, point.longitude) })) : [],
                destination: destinationT,
                travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            })
            .catch((error) => {
                console.error('Directions request failed due to ', error);
            });
    }, [directionsService, directionsRenderer, originT, middle, destinationT]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;
    return null;
}


export default function DisplayTreaps({ marginTop, width, treaps, lPoints }: { marginTop: string; width: string; treaps: Treap[]; lPoints: PointType[]; }) {
    const navigate = useNavigate();

    const calculateBorders = (points: PointType[]) => {
        if (points.length === 0) {
            return {
                minLat: 0,
                maxLat: 0,
                minLng: 0,
                maxLng: 0,
            };
        }


        const latitudes = points.map((point) => point.latitude);
        const longitudes = points.map((point) => point.longitude);
        return {
            minLat: Math.min(...latitudes),
            maxLat: Math.max(...latitudes),
            minLng: Math.min(...longitudes),
            maxLng: Math.max(...longitudes),
        };
    };

    const borders = calculateBorders(lPoints);

    let center = {
        lat: (borders.minLat + borders.maxLat) / 2,
        lng: (borders.minLng + borders.maxLng) / 2,
    };

    const Spacer = () => <div style={{ marginTop: '1rem' }}></div>;

    return (
        <div style={{ marginTop: marginTop }}>
            {treaps.map((treap, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper
                        style={{
                            backgroundColor: '#fff',
                            marginTop: '3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '1.5rem',
                            height: 'auto',
                            width: width,
                            borderRadius: '10px',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                        }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ProfileImage icon={treap.profilePic} onProfileClick={() => { navigate(`/profile/${treap.nickname}`) }} />
                                <Typography variant="h6" style={{ marginLeft: '0.5rem' }}>
                                    {treap.nickname}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="textSecondary">
                                {formatDate(treap.lastModifiedDate)}
                            </Typography>
                        </div>
                        <Spacer />
                        <Grid container spacing={2} style={{ marginBottom: '1rem' }}>
                            <Grid item xs={6} sm={12 / 5} style={{ textAlign: 'center' }}>
                                <AccessTimeIcon color="primary" />
                                <Typography variant="subtitle1">
                                    {formatDuration(treap.duration)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    duração
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={12 / 5} style={{ textAlign: 'center' }}>
                                <DirectionsWalkIcon color="primary" />
                                <Typography variant="subtitle1">
                                    {formatDistance(treap.distance)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    distância
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={12 / 5} style={{ textAlign: 'center' }}>
                                <TransportIcon color="primary" />
                                <Typography variant="subtitle1">
                                    {formatTransport(treap.pointList)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    transporte
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={12 / 5} style={{ textAlign: 'center' }}>
                                <TerrainIcon color="primary" />
                                <Typography variant="subtitle1">{treap.leafPoints}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    leaf points
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={12 / 5} style={{ textAlign: 'center' }}>
                                <EcoIcon color="primary" />
                                <Typography variant="subtitle1">
                                    {formatCarbon(treap.carbonFootprint)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    CO<sub>2</sub>
                                </Typography>
                            </Grid>
                        </Grid>
                        <APIProvider apiKey={API_KEY}>
                            <div style={{ alignItems: 'center', height: '20vh', width: '100%' }}>
                                <Map
                                    style={{ height: '100%', width: '100%' }}
                                    defaultZoom={10}
                                    defaultCenter={center}
                                    minZoom={5}
                                    maxZoom={18}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}>
                                    <Directions
                                        origin={`${treap.pointList[0].latitude},${treap.pointList[0].longitude}`}
                                        middle={treap.pointList.slice(1, -1)}
                                        destination={`${treap.pointList[treap.pointList.length - 1].latitude},${treap.pointList[treap.pointList.length - 1].longitude}`}
                                    />
                                </Map>
                            </div>
                        </APIProvider>
                    </Paper>
                </div>
            ))}
        </div>
    );
}
