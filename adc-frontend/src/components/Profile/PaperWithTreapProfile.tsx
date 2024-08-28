import { useEffect, useState } from 'react';
import { httpGet } from '../../utils/http';
import { Treap } from '../../types/TreapType';
import { PointType } from '../../types/PointType';
import { ProfileTreapType } from '../../types/ProfileTreapType';
import DisplayTreaps from '../BackOffice/DisplayTreaps';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Pagination, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';

const theme = createTheme({
    components: {
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'var(--teal)',
                        color: '#fff',
                    },
                },
            },
        },
    },
});

export default function PaperWithTreapProfile({ nickname }: { nickname: string }) {
    const [info, setInfo] = useState<ProfileTreapType>({ content: [], elements: 0, page: 0, pageSize: 0, total: 0, totalPages: 0 });
    const [treaps, setTreaps] = useState<Treap[]>([]);
    const [lPoints, setPoints] = useState<PointType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(5);

    useEffect(() => {
        httpGet(`treaps?nickname=${nickname}&page=${currentPage - 1}&size=${size}`).then((response: any) => {
            const info = response.data as ProfileTreapType;
            setInfo(info);

            const allTreaps: Treap[] = info.content;
            setTreaps(allTreaps);

            // Accumulate points from all treaps
            const allPoints: PointType[] = allTreaps.flatMap(treap => treap.pointList);
            setPoints(allPoints);
        });
    }, [nickname, currentPage, size]);

    return (
        <div style={{ marginTop: "2rem" }}>
            {treaps.length > 0 && (
                <Select
                    required
                    value={size}
                    sx={{ width: "100px", height: "38px", marginLeft: '25.5rem' }}
                    onChange={(e) => {
                        setSize(Number(e.target.value))
                        setCurrentPage(1)
                    }}
                >
                    <MenuItem value="5">Qt.: 5</MenuItem>
                    <MenuItem value="10">Qt.: 10</MenuItem>
                    <MenuItem value="25">Qt.: 25</MenuItem>
                    <MenuItem value="50">Qt.: 50</MenuItem>
                </Select>
            )}
            <DisplayTreaps
                marginTop="-2rem"
                width="100%"
                treaps={treaps}
                lPoints={lPoints}
            />
            {treaps.length > 0 ? (
                <ThemeProvider theme={theme}>
                    <Pagination
                        count={info.totalPages}
                        page={currentPage}
                        onChange={(event, value) => { setCurrentPage(value); console.log(event) }}
                        shape='rounded'
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
                    />
                </ThemeProvider>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '6rem', color: 'lightgray', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faMap} size="5x" />
                    Ainda não tem treaps.
                </div>
            )}
        </div >
    );
}
