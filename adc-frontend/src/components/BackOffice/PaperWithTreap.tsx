import { useEffect, useState } from 'react';
import { httpGet } from '../../utils/http';
import { Treap } from '../../types/TreapType';
import { useSelector } from 'react-redux';
import { sessionSelector } from '../../store/session';
import { PointType } from '../../types/PointType';
import DisplayTreaps from './DisplayTreaps';
import HomepageWithoutLogin from '../../pages/HomepageWithoutLogin';
import LoadingPage from '../../pages/LoadingPage';

export default function PaperWithTreap() {
    const [treaps, setTreaps] = useState<Treap[]>([]);
    const session = useSelector(sessionSelector);
    const [lPoints, setPoints] = useState<PointType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        httpGet("treaps/feed?nickname=" + session.nickname).then((response: any) => {
            const treaps = response.data as Treap[];
            setTreaps(treaps);

            // Accumulate points from all treaps
            const allPoints: PointType[] = treaps.flatMap(treap => treap.pointList);
            setPoints(allPoints);
        }).finally(() => {
            setTimeout(() => setLoading(false), 2000); // Set a timeout to stop loading after 2 seconds
        });
    }, [session.isLogged]);


    if (loading) {
        return <LoadingPage />;
    }

    return (
        <>
            {
                treaps.length > 0 ? (
                    <DisplayTreaps
                        marginTop="4rem"
                        width="50%"
                        treaps={treaps}
                        lPoints={lPoints}
                    />
                ) : (
                    <HomepageWithoutLogin />
                )
            }
        </>
    );
}
