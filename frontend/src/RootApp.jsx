import './style/app.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';  // Import ConfigProvider
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const IdurarOs = lazy(() => import('./apps/IdurarOs'));

export default function RootApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider>
          <Suspense fallback={<PageLoader />}>
            <IdurarOs />
          </Suspense>
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  );
}
