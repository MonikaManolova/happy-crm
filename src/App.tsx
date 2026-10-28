import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EditOrderPage } from './pages/EditOrderPage';
import { NewOrderPage } from './pages/NewOrderPage';
import { ROUTES } from './routes';

/* Hash routing keeps the app working wherever it is hosted (dev server, a
   sub-path, the Figma code layer, the preview page) without server rewrites. */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.newOrder} element={<NewOrderPage />} />
        <Route path={ROUTES.editOrder} element={<EditOrderPage />} />
        <Route path="*" element={<Navigate to={ROUTES.newOrder} replace />} />
      </Routes>
    </HashRouter>
  );
}
