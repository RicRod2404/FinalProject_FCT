import { useSelector } from 'react-redux';
import { sessionSelector } from '../store/session.ts';
import HomepageWithLogin from './HomepageWithLogin.tsx';
import HomepageWithoutLogin from './HomepageWithoutLogin.tsx';

export default function Homepage() {
    const session = useSelector(sessionSelector);

    return (
        session.isLogged ? <HomepageWithLogin /> : <HomepageWithoutLogin />
    );
}
