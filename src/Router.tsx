import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import NotMatch from './pages/NotMatch'
import DealAgent from './pages/DealAgent'
import Sample from './pages/Sample'
import ComingSoon from './pages/ComingSoon'

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}> 
                <Route path="" element={<DealAgent />} />
                <Route path="pages">
                    <Route path="sample" element={<Sample />} />
                    <Route path="feature" element={<ComingSoon />} />
                </Route>
                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}
