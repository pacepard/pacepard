import { BrowserRouter as Router } from 'react-router-dom';
import { UserState, AppState } from '@pacepard/sdk';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <>
            <Router>
                <UserState>

                    <AppState>

                        <AppRoutes />

                    </AppState>
                
                </UserState>
            </Router>
        </>
    );
}

export default App;
